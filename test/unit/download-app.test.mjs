import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { downloadApp, verifyApp } from '../../scripts/lib/demo-app.ts'

const bytes = Buffer.from('verified application fixture')
const artifact = {
    url: 'https://example.invalid/demo.apk', size: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
}
async function fixture(t) {
    const root = await mkdtemp(path.join(tmpdir(), 'apk-download-test-'))
    t.after(() => rm(root, { recursive: true, force: true }))
    const target = path.join(root, 'demo.apk')
    await writeFile(target, 'existing APK')
    return { root, target }
}

test('verified download replaces the destination and removes staging files', async t => {
    const { root, target } = await fixture(t)
    await downloadApp(target, artifact, async (_url, options) => {
        assert.equal(options.redirect, 'manual')
        assert.ok(options.signal instanceof AbortSignal)
        return new Response(bytes)
    })
    assert.deepEqual(await readFile(target), bytes)
    await verifyApp(target, artifact)
    assert.deepEqual(await readdir(root), ['demo.apk'])
})

for (const [name, request, message] of [
    ['same-size corruption', async () => new Response(Buffer.alloc(bytes.length)), /checksum/],
    ['truncated payload', async () => new Response(bytes.subarray(0, 5)), /checksum/],
    ['oversized payload', async () => new Response(Buffer.alloc(bytes.length + 1)), /exceeds expected size/],
    ['HTTP failure', async () => new Response('not found', { status: 404 }), /HTTP 404/],
    ['network failure', async () => { throw Error('connection lost') }, /connection lost/],
    ['interrupted stream', async () => new Response(new ReadableStream({
        start(controller) { controller.enqueue(bytes.subarray(0, 3)); controller.error(Error('stream interrupted')) },
    })), /stream interrupted/],
    ['HTTPS downgrade', async () => new Response(null, {
        status: 302, headers: { location: 'http://example.invalid/unsafe.apk' },
    }), /must use HTTPS/],
]) {
    test(`${name} preserves the existing APK and cleans temporary files`, async t => {
        const { root, target } = await fixture(t)
        await assert.rejects(downloadApp(target, artifact, request), message)
        assert.equal(await readFile(target, 'utf8'), 'existing APK')
        assert.deepEqual(await readdir(root), ['demo.apk'])
    })
}

test('HTTPS redirects are followed with a bounded redirect count', async t => {
    const { target } = await fixture(t)
    let calls = 0
    await downloadApp(target, artifact, async url => {
        calls++
        if (calls === 1) return new Response(null, { status: 302, headers: { location: 'https://assets.example.invalid/app.apk' } })
        assert.equal(url.href, 'https://assets.example.invalid/app.apk')
        return new Response(bytes)
    })
    assert.equal(calls, 2)
    calls = 0
    await assert.rejects(downloadApp(target, artifact, async () => {
        calls++
        return new Response(null, { status: 302, headers: { location: artifact.url } })
    }), /excessive APK redirects/)
    assert.equal(calls, 6)
    assert.deepEqual(await readFile(target), bytes)
})

test('an aborted download preserves the destination', async t => {
    const { root, target } = await fixture(t)
    await assert.rejects(downloadApp(target, artifact, async () => new Response(bytes),
        AbortSignal.abort()), /abort/i)
    assert.equal(await readFile(target, 'utf8'), 'existing APK')
    assert.deepEqual(await readdir(root), ['demo.apk'])
})

test('verification rejects missing and changed files; invalid manifests cannot download', async t => {
    const { root, target } = await fixture(t)
    await assert.rejects(verifyApp(path.join(root, 'missing.apk'), artifact), /ENOENT/)
    await assert.rejects(verifyApp(target, artifact), /checksum/)
    await assert.rejects(downloadApp(target, { ...artifact, sha256: '' }, async () => {
        assert.fail('An invalid manifest must not make a request')
    }), /Invalid APK checksum manifest/)
})
