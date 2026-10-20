import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expect } from 'chai'
import type { Fixture } from './starter.ts'
const { withFixture } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('awaits creation, use and removal once, passing the exact fixture and ID', async () => {
    const trace: string[] = []
    const fixture = { id: 'owned-42' }
    await withFixture({
        create: async () => { await Promise.resolve(); trace.push('create'); return fixture },
        use: async (value: Fixture) => { expect(value).to.equal(fixture); await Promise.resolve(); trace.push('use') },
        remove: async (id: string) => { expect(id).to.equal('owned-42'); await Promise.resolve(); trace.push('remove') },
    })
    expect(trace).to.deep.equal(['create', 'use', 'remove'])
})
test('failed creation never uses or removes an unknown resource', async () => {
    const error = new Error('create unavailable')
    const trace: string[] = []
    await assert.rejects(withFixture({
        create: async () => { throw error },
        use: async () => { trace.push('use') },
        remove: async () => { trace.push('remove') },
    }), actual => actual === error)
    expect(trace).to.deep.equal([])
})
test('cleans after a test failure and preserves the original rejection', async () => {
    const original = new Error('wrong displayed account')
    const removed: string[] = []
    await assert.rejects(withFixture({
        create: async () => ({ id: 'mine' }),
        use: async () => { throw original },
        remove: async (id: string) => { removed.push(id) },
    }), actual => actual === original)
    expect(removed).to.deep.equal(['mine'])
})
test('cleanup failure fails an otherwise passing test', async () => {
    const original = new Error('cleanup unavailable')
    await assert.rejects(withFixture({
        create: async () => ({ id: 'mine' }),
        use: async () => {},
        remove: async () => { throw original },
    }), actual => actual === original)
})
test('keeps both errors in order when use and cleanup fail', async () => {
    const primary = new Error('assertion failed')
    const secondary = new Error('cleanup failed')
    await assert.rejects(withFixture({
        create: async () => ({ id: 'mine' }),
        use: async () => { throw primary },
        remove: async () => { throw secondary },
    }), error => {
        expect(error).to.be.instanceOf(AggregateError)
        const aggregate = error as AggregateError
        expect(aggregate.message).to.equal('Test and cleanup failed')
        expect(aggregate.errors[0]).to.equal(primary)
        expect(aggregate.errors[1]).to.equal(secondary)
        expect(aggregate.errors).to.have.length(2)
        return true
    })
})
test('falsy rejection reasons still count as failures', async () => {
    let caught = false
    try {
        await withFixture({
            create: async () => ({ id: 'mine' }),
            use: async () => { throw undefined },
            remove: async () => {},
        })
    } catch (error) {
        caught = true
        expect(error).to.equal(undefined)
    }
    expect(caught).to.equal(true)
})
