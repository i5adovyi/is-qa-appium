import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { expect } from 'chai'
import type { RequestOrder } from './starter.ts'
const { loadOrder } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('awaits one request with the exact ID and returns only validated order fields', async () => {
    const input = Object.freeze({ id: 'o-7', state: 'confirmed', totalCents: 2400, internalToken: 'synthetic-only' })
    let requests = 0
    const result = await loadOrder('o-7', async (id: string) => {
        expect(id).to.equal('o-7')
        requests++
        await Promise.resolve()
        return { status: 200, json: async () => input }
    })
    expect(requests).to.equal(1)
    expect(result).to.deep.equal({ kind: 'order', order: { id: 'o-7', state: 'confirmed', totalCents: 2400 } })
    assert.ok(result.kind === 'order')
    expect(result.order).not.to.equal(input)
})
test('pending and zero amount are valid data, not confirmation of a completed purchase', async () => {
    expect(await loadOrder('o-7', async () => ({
        status: 200, json: async () => ({ id: 'o-7', state: 'pending', totalCents: 0 }),
    }))).to.deep.equal({ kind: 'order', order: { id: 'o-7', state: 'pending', totalCents: 0 } })
})
test('rejects blank and padded IDs before any request', async () => {
    let requests = 0
    for (const id of ['', ' ', ' o-7', 'o-7\n']) {
        await assert.rejects(loadOrder(id, async () => {
            requests++
            return { status: 200, json: async () => ({}) }
        }), { message: 'Invalid order ID' })
    }
    expect(requests).to.equal(0)
})
test('maps expected HTTP failures without parsing bodies or retrying', async () => {
    for (const [status, kind] of [
        [401, 'unauthenticated'], [403, 'forbidden'], [404, 'not-found'],
        [429, 'throttled'], [503, 'unavailable'],
    ] as const) {
        let requests = 0
        let parses = 0
        const result = await loadOrder('o-7', async () => {
            requests++
            return { status, json: async () => { parses++; throw new Error('body must not be read') } }
        })
        expect(result).to.deep.equal({ kind })
        expect(requests).to.equal(1)
        expect(parses).to.equal(0)
    }
})
test('unexpected statuses fail explicitly rather than becoming success or not-found', async () => {
    for (const status of [201, 204, 302, 500]) {
        await assert.rejects(loadOrder('o-7', async () => ({
            status, json: async () => { throw new Error('raw body should stay hidden') },
        })), { message: `Unexpected HTTP status: ${status}` })
    }
})
test('valid JSON with wrong identity, shape, state or amount is rejected', async () => {
    const valid = { id: 'o-7', state: 'confirmed', totalCents: 2400 }
    for (const body of [
        null, [], {}, { ...valid, id: 'o-8' }, { ...valid, state: 'unknown' },
        { ...valid, totalCents: '2400' }, { ...valid, totalCents: -1 },
        { ...valid, totalCents: 2.5 }, { ...valid, totalCents: NaN },
        { ...valid, totalCents: Number.MAX_SAFE_INTEGER + 1 },
    ]) {
        await assert.rejects(loadOrder('o-7', async () => ({
            status: 200, json: async () => body,
        })), { message: 'Invalid order response' })
    }
})
test('JSON parsing failure produces a sanitized contract error', async () => {
    await assert.rejects(loadOrder('o-7', async () => ({
        status: 200, json: async () => { throw new Error('synthetic secret in a malformed body') },
    })), { message: 'Invalid order response' })
})
test('transport rejection is preserved with no retry', async () => {
    const original = new Error('synthetic connection failure')
    let requests = 0
    await assert.rejects(loadOrder('o-7', async () => { requests++; throw original }),
        error => error === original)
    expect(requests).to.equal(1)
})
test('handles real fetch responses from a disposable loopback HTTP server', async () => {
    const server = http.createServer((req, res) => {
        const url = new URL(req.url!, 'http://127.0.0.1')
        const mode = url.searchParams.get('mode')
        res.statusCode = mode === 'forbidden' ? 403 : 200
        res.setHeader('Content-Type', 'application/json')
        res.end(mode === 'malformed' ? '{broken' : JSON.stringify({
            id: decodeURIComponent(url.pathname.split('/').at(-1)!),
            state: 'confirmed', totalCents: 2400,
        }))
    })
    try {
        await new Promise<void>((resolve, reject) => {
            server.once('error', reject)
            server.listen(0, '127.0.0.1', () => resolve())
        })
        const address = server.address()
        assert.ok(address && typeof address !== 'string')
        const request = (mode: string): RequestOrder => id =>
            fetch(`http://127.0.0.1:${address.port}/orders/${encodeURIComponent(id)}?mode=${mode}`,
                { signal: AbortSignal.timeout(2000), redirect: 'error' })
        expect(await loadOrder('o-7', request('valid'))).to.deep.equal({
            kind: 'order', order: { id: 'o-7', state: 'confirmed', totalCents: 2400 },
        })
        expect(await loadOrder('o-7', request('forbidden'))).to.deep.equal({ kind: 'forbidden' })
        await assert.rejects(loadOrder('o-7', request('malformed')), { message: 'Invalid order response' })
    } finally {
        server.closeAllConnections()
        await new Promise<void>(resolve => server.close(() => resolve()))
    }
})
