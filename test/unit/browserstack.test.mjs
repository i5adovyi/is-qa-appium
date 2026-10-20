import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { uploadApp, credential, sessionStatusCommand } from '../../config/browserstack-api.ts'
import { runBrowserStack } from '../../scripts/run-browserstack.mjs'

function setEnv(t, name, value) {
    const previous = process.env[name]
    process.env[name] = value
    t.after(() => {
        if (previous === undefined) delete process.env[name]
        else process.env[name] = previous
    })
}

async function fixture(t) {
    const root = await mkdtemp(path.join(tmpdir(), 'browserstack-api-test-'))
    t.after(() => rm(root, { recursive: true, force: true }))
    const file = path.join(root, 'demo.apk')
    const bytes = Buffer.from('test app')
    await writeFile(file, bytes)
    return { file, artifact: { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') } }
}
test('uploads verified bytes as multipart data to the documented API', async t => {
    const { file, artifact } = await fixture(t)
    const url = await uploadApp(file, 'test-user', 'test-key', async (endpoint, options) => {
        assert.equal(endpoint, 'https://api-cloud.browserstack.com/app-automate/upload')
        assert.equal(options.method, 'POST')
        assert.equal(options.redirect, 'error')
        assert.equal(options.headers.Authorization, `Basic ${Buffer.from('test-user:test-key').toString('base64')}`)
        assert.equal(await options.body.get('file').text(), 'test app')
        assert.equal(options.body.get('file').name, 'demo.apk')
        return Response.json({ app_url: 'bs://aabb1234' })
    }, artifact)
    assert.equal(url, 'bs://aabb1234')
})
test('corrupt files cannot be uploaded', async t => {
    const { file, artifact } = await fixture(t)
    await writeFile(file, 'tampered')
    await assert.rejects(uploadApp(file, 'test-user', 'test-key', async () => {
        assert.fail('Do not upload a corrupt APK')
    }, artifact), /checksum/)
})
test('failed or malformed upload responses stop the run without exposing response secrets', async t => {
    const { file, artifact } = await fixture(t)
    for (const response of [
        new Response('secret-response', { status: 401 }),
        new Response('secret-response'),
        Response.json({ app_url: 'https://unexpected.invalid/secret-response' }),
    ]) {
        await assert.rejects(uploadApp(file, 'test-user', 'secret-key', async () => response, artifact), error => {
            assert.match(error.message, /BrowserStack upload/)
            assert.doesNotMatch(error.message, /secret-key|secret-response/)
            return true
        })
    }
    await assert.rejects(uploadApp(file, 'test-user', 'secret-key', async () => {
        throw Error('secret-key: network error')
    }, artifact), /^Error: BrowserStack upload failed: network, redirect, or timeout error\.$/)
})
test('cloud launcher preserves arguments and exit status, and never starts after failed upload', async t => {
    setEnv(t, 'BROWSERSTACK_USERNAME', 'test-user')
    setEnv(t, 'BROWSERSTACK_ACCESS_KEY', 'test-key')
    t.mock.method(console, 'log', () => {})
    let launches = 0
    const launch = (_node, args, options) => {
        launches++
        assert.deepEqual(args.slice(1), ['run', 'config/wdio.browserstack.conf.ts', '--spec', 'test/specs/app.login.spec.ts'])
        assert.equal(options.env.BROWSERSTACK_APP_URL, 'bs://123abc')
        return { status: 3 }
    }
    assert.equal(await runBrowserStack(['--spec', 'test/specs/app.login.spec.ts'], async () => 'bs://123abc', launch), 3)
    await assert.rejects(runBrowserStack([], async () => { throw Error('upload failed') }, launch), /upload failed/)
    assert.equal(launches, 1)
})
test('placeholder credentials fail before upload and their values remain hidden', async t => {
    setEnv(t, 'BROWSERSTACK_USERNAME', 'YOUR_USERNAME')
    assert.throws(() => credential('BROWSERSTACK_USERNAME'), /Set a real BROWSERSTACK_USERNAME/)
    await assert.rejects(runBrowserStack([], async () => { assert.fail('Must not upload') }), error => {
        assert.doesNotMatch(error.message, /YOUR_USERNAME/)
        return true
    })
})
test('session status reflects the full session result', () => {
    for (const [result, expected] of [[0, 'passed'], [1, 'failed'], [5, 'failed']]) {
        const payload = JSON.parse(sessionStatusCommand(result).replace('browserstack_executor: ', ''))
        assert.equal(payload.action, 'setSessionStatus')
        assert.equal(payload.arguments.status, expected)
    }
})
