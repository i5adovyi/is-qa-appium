import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { once } from 'node:events'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createProgressApi } from './progress-api.mjs'
import { MAX_PROGRESS_BYTES, openProgressStore } from './progress-store.mjs'

function rawRequest(url, options, body) {
    return new Promise((resolve, reject) => {
        const request = http.request(url, options, response => {
            const chunks = []
            response.on('data', chunk => chunks.push(chunk))
            response.on('end', () => resolve({
                status: response.statusCode, headers: response.headers,
                body: Buffer.concat(chunks).toString('utf8'),
            }))
        })
        request.on('error', reject)
        request.end(body)
    })
}

async function fixture(t) {
    const directory = mkdtempSync(path.join(tmpdir(), 'course-progress-api-'))
    const store = openProgressStore({ directory, lessonIds: ['00', '01'] })
    let handler
    const server = http.createServer(async (req, res) => {
        if (!await handler(req, res)) { res.writeHead(404); res.end() }
    })
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const origin = `http://127.0.0.1:${server.address().port}`
    handler = createProgressApi({ store, origin })
    t.after(async () => {
        server.closeAllConnections()
        await new Promise(resolve => server.close(resolve))
        store.close()
        rmSync(directory, { recursive: true, force: true })
    })
    const response = await fetch(`${origin}/api/progress`)
    const initial = await response.json()
    const headers = { Origin: origin, 'Content-Type': 'application/json', 'X-Course-Token': initial.writeToken }
    const put = (value, overrides = {}) => fetch(`${origin}/api/progress`, {
        method: 'PUT', headers: { ...headers, ...overrides }, body: JSON.stringify(value),
    })
    return { store, origin, initial, headers, put }
}

test('API reads a private no-cache snapshot and atomically persists an authorized replacement', async t => {
    const f = await fixture(t)
    assert.equal(f.initial.revision, 0)
    assert.equal(typeof f.initial.databaseId, 'string')
    assert.equal(f.initial.writeToken.length, 64)
    const progress = { completed: ['00'], notes: { '00': 'API evidence' } }
    const response = await f.put({ ...f.initial, progress })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal(response.headers.get('access-control-allow-origin'), null)
    const saved = await response.json()
    assert.equal(saved.revision, 1)
    assert.deepEqual(saved.progress, progress)
    assert.equal(saved.writeToken, undefined)
    assert.deepEqual(f.store.read(), saved)
})

test('API rejects stale revisions and another database identity without dropping saved notes', async t => {
    const f = await fixture(t)
    await f.put({ ...f.initial, progress: { completed: ['00'], notes: { '00': 'Keep' } } })
    for (const value of [f.initial, { ...f.initial, revision: 1, databaseId: 'replaced-db' }]) {
        const response = await f.put(value)
        assert.equal(response.status, 409)
        const body = await response.json()
        assert.equal(body.latest.revision, 1)
        assert.equal(body.latest.progress.notes['00'], 'Keep')
    }
    assert.equal(f.store.read().revision, 1)
})

test('API requires the exact local host, origin and unpredictable write token', async t => {
    const f = await fixture(t)
    for (const headers of [
        { Origin: 'https://other.example' },
        { Origin: 'null' },
        { Origin: '' },
        { 'X-Course-Token': '' },
        { 'X-Course-Token': 'x'.repeat(64) },
        { 'Sec-Fetch-Site': 'cross-site' },
    ]) {
        const response = await f.put(f.initial, headers)
        assert.equal(response.status, 403, JSON.stringify(headers))
        assert.equal(response.headers.get('access-control-allow-origin'), null)
    }
    const missingOriginHeaders = { ...f.headers }
    delete missingOriginHeaders.Origin
    const missing = await fetch(`${f.origin}/api/progress`, {
        method: 'PUT', headers: missingOriginHeaders, body: JSON.stringify(f.initial),
    })
    assert.equal(missing.status, 403)
    const wrongHost = await rawRequest(`${f.origin}/api/progress`, {
        method: 'PUT', headers: { ...f.headers, Host: 'rebound.example' },
    }, JSON.stringify(f.initial))
    assert.equal(wrongHost.status, 403)
    assert.equal(f.store.read().revision, 0)
})

test('cross-origin reads and preflight never expose a token or permit CORS', async t => {
    const f = await fixture(t)
    for (const options of [
        { headers: { Origin: 'https://other.example' } },
        { headers: { 'Sec-Fetch-Site': 'cross-site' } },
        { method: 'OPTIONS', headers: { Origin: 'https://other.example', 'Access-Control-Request-Method': 'PUT' } },
    ]) {
        const response = await fetch(`${f.origin}/api/progress`, options)
        assert.equal(response.status, 403)
        assert.doesNotMatch(await response.text(), /writeToken|databaseId|progress\.sqlite/)
        assert.equal(response.headers.get('access-control-allow-origin'), null)
    }
    const wrongHost = await rawRequest(`${f.origin}/api/progress`, { headers: { Host: 'rebound.example' } })
    assert.equal(wrongHost.status, 403)
    assert.doesNotMatch(wrongHost.body, /writeToken|databaseId/)
    assert.equal((await fetch(`${f.origin}/api/progress`, { method: 'OPTIONS' })).status, 405)
    assert.equal((await fetch(`${f.origin}/other`)).status, 404)
})

test('API rejects invalid JSON, data, unsupported content types and oversize requests without writing', async t => {
    const f = await fixture(t)
    for (const value of [{ ...f.initial, progress: null }, { ...f.initial, revision: '0' }, null]) {
        const response = await f.put(value)
        assert.equal(response.status, 400)
    }
    for (const overrides of [{ 'Content-Type': 'text/plain' }, { 'Content-Encoding': 'gzip' }]) {
        assert.equal((await f.put(f.initial, overrides)).status, 415)
    }
    const malformed = await fetch(`${f.origin}/api/progress`, {
        method: 'PUT', headers: f.headers, body: '{"notes":"private-sentinel",',
    })
    assert.equal(malformed.status, 400)
    assert.doesNotMatch(await malformed.text(), /private-sentinel/)
    const oversized = await f.put({ ...f.initial, progress: { completed: [], notes: { '00': 'x'.repeat(MAX_PROGRESS_BYTES) } } })
    assert.equal(oversized.status, 413)
    assert.equal(f.store.read().revision, 0)
})

test('API bounds chunked bodies and accepts the previously supported 1.1 MB note', async t => {
    const f = await fixture(t)
    const chunked = await new Promise((resolve, reject) => {
        const req = http.request(`${f.origin}/api/progress`, { method: 'PUT', headers: f.headers }, res => {
            res.resume()
            res.on('end', () => resolve(res.statusCode))
        })
        req.on('error', reject)
        for (let n = 0; n < 5; n++) req.write('x'.repeat(1024 * 1024))
        req.end()
    })
    assert.equal(chunked, 413)
    const note = 'x'.repeat(1_100_000)
    const response = await f.put({ ...f.initial, progress: { completed: [], notes: { '00': note } } })
    assert.equal(response.status, 200)
    assert.equal(f.store.read().progress.notes['00'], note)
})

test('unexpected storage failures expose neither filesystem paths nor note contents', async t => {
    const f = await fixture(t)
    f.store.write = () => { throw new Error('/private/data/progress.sqlite private-sentinel') }
    const response = await f.put(f.initial)
    assert.equal(response.status, 500)
    assert.doesNotMatch(await response.text(), /private-sentinel|private\/data|progress\.sqlite/)
})

test('write tokens expire when the API handler is restarted', async t => {
    const f = await fixture(t)
    const replacement = createProgressApi({ store: f.store, origin: f.origin })
    const req = {
        url: '/api/progress', method: 'PUT',
        headers: { host: new URL(f.origin).host, origin: f.origin, 'x-course-token': f.initial.writeToken },
    }
    let status
    const res = { writeHead(value) { status = value }, end() {} }
    assert.equal(await replacement(req, res), true)
    assert.equal(status, 403)
})
