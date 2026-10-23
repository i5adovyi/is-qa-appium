import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expect } from 'chai'
import { StaleObservation } from './contract.ts'
import type { Locate } from './contract.ts'
const { observeText } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('returns an immediate match with one lookup and one read', async () => {
    const events: string[] = []
    const result = await observeText(async () => {
        events.push('locate')
        return { getText: async () => { events.push('read'); return 'ready' } }
    }, 'ready', 3)
    expect(result).to.equal('ready')
    expect(events).to.deep.equal(['locate', 'read'])
})
test('reacquires after a view replaces a stale element', async () => {
    const events: string[] = []
    const result = await observeText(async () => {
        const generation = events.filter(event => event.startsWith('locate')).length + 1
        events.push(`locate:${generation}`)
        return { getText: async () => {
            events.push(`read:${generation}`)
            if (generation === 1) throw new StaleObservation('old view removed')
            return 'ready'
        } }
    }, 'ready', 2)
    expect(result).to.equal('ready')
    expect(events).to.deep.equal(['locate:1', 'read:1', 'locate:2', 'read:2'])
})
test('a valid nonmatching read also needs a fresh lookup on the next attempt', async () => {
    let lookups = 0
    const locate: Locate = async () => {
        const value = ++lookups === 1 ? 'loading' : 'ready'
        return { getText: async () => value }
    }
    expect(await observeText(locate, 'ready', 2)).to.equal('ready')
    expect(lookups).to.equal(2)
})
test('a stale lookup consumes one attempt and can recover', async () => {
    let lookups = 0
    expect(await observeText(async () => {
        if (++lookups === 1) throw new StaleObservation('lookup view changed')
        return { getText: async () => '' }
    }, '', 2)).to.equal('')
    expect(lookups).to.equal(2)
})
test('preserves the final stale error object and stops at the bound', async () => {
    const stale = new StaleObservation('still replaced')
    let reads = 0
    await assert.rejects(observeText(async () => ({ getText: async () => {
        reads++
        throw stale
    } }), 'ready', 2), error => error === stale)
    expect(reads).to.equal(2)
})
test('propagates unrelated read errors immediately even with misleading wording', async () => {
    const error = new Error('stale element reference mentioned in a disconnected session report')
    let reads = 0
    await assert.rejects(observeText(async () => ({ getText: async () => {
        reads++
        throw error
    } }), 'ready', 4), actual => actual === error)
    expect(reads).to.equal(1)
})
test('propagates an unrelated lookup failure without retrying', async () => {
    const error = new Error('session unavailable')
    let lookups = 0
    await assert.rejects(observeText(async () => { lookups++; throw error }, 'ready', 4), actual => actual === error)
    expect(lookups).to.equal(1)
})
test('preserves non-Error rejections', async () => {
    let rejected = false
    try {
        await observeText(async () => ({ getText: async () => { throw undefined } }), 'ready', 2)
    } catch (error) {
        rejected = true
        expect(error).to.equal(undefined)
    }
    expect(rejected).to.equal(true)
})
test('mismatch reports the expected and last actual values after exactly the allowed reads', async () => {
    let reads = 0
    await assert.rejects(observeText(async () => ({ getText: async () => {
        reads++
        return 'loading'
    } }), 'ready', 2), /Expected "ready"; last observed "loading"/)
    expect(reads).to.equal(2)
})
test('invalid budgets fail before any lookup', async () => {
    let lookups = 0
    for (const attempts of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        await assert.rejects(observeText(async () => {
            lookups++
            return { getText: async () => 'ready' }
        }, 'ready', attempts), /positive safe integer/)
    }
    expect(lookups).to.equal(0)
})
