import { test } from 'node:test'
import { expect } from 'chai'
const { waitForValue } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')
const failureOf = async (operation: () => Promise<unknown>): Promise<unknown> => {
    try { await operation() } catch (error) { return error }
    throw new Error('Expected operation to fail')
}

test('returns immediately when the first observation matches', async () => {
    let calls = 0
    expect(await waitForValue(async () => { calls++; return 'ready' }, 'ready', 3)).to.equal('ready')
    expect(calls).to.equal(1)
})
test('permits success on the final allowed observation', async () => {
    const values = ['loading', 'loading', 'ready']
    expect(await waitForValue(async () => values.shift()!, 'ready', 3)).to.equal('ready')
    expect(values).to.have.length(0)
})
test('stops at the limit and includes the last actual value', async () => {
    let calls = 0
    const error = await failureOf(() => waitForValue(async () => { calls++; return 'loading' }, 'ready', 2))
    expect(calls).to.equal(2)
    expect(error).to.be.instanceOf(Error)
    expect((error as Error).message).to.include('ready').and.include('loading')
})
test('rejects invalid limits before calling read', async () => {
    for (const attempts of [0, -1, 1.5]) {
        let calls = 0
        const error = await failureOf(() => waitForValue(async () => { calls++; return '' }, '', attempts))
        expect(calls).to.equal(0)
        expect((error as Error).message).to.equal('attempts must be a positive integer')
    }
})
test('does not swallow a broken transport', async () => {
    const original = new Error('device disconnected')
    expect(await failureOf(() => waitForValue(async () => { throw original }, '', 2))).to.equal(original)
})
