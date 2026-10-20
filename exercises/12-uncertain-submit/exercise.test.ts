import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expect } from 'chai'
import { SubmissionUncertain } from './contract.ts'
import type { Submission, Receipt } from './contract.ts'
const { submitOrder }: typeof import('./starter.ts') =
    await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')
const input = (): Submission => ({ key: 'intent-7', accountId: 'account-1', totalCents: 2400 })
const receipt = (): Receipt => ({ ...input(), orderId: 'order-1' })

test('a normal response needs exactly one create and no lookup', async () => {
    let writes = 0
    const result = await submitOrder(input(), {
        create: async submission => { writes++; expect(submission).to.deep.equal(input()); return receipt() },
        findByKey: async () => { throw new Error('unnecessary lookup') },
    })
    expect(result).to.deep.equal({ status: 'confirmed', receipt: receipt() })
    expect(writes).to.equal(1)
})
test('a committed write with a lost response must not create a second order', async () => {
    const ledger: Receipt[] = []
    let reads = 0
    const result = await submitOrder(input(), {
        create: async submission => {
            const order = { ...submission, orderId: `order-${ledger.length + 1}` }
            ledger.push(order)
            if (ledger.length === 1) throw new SubmissionUncertain('response lost after commit')
            return order
        },
        findByKey: async key => { reads++; return ledger.find(order => order.key === key) },
    })
    expect(ledger.length, 'the recovery submitted a duplicate write').to.equal(1)
    expect(reads).to.equal(1)
    expect(result).to.deep.equal({ status: 'confirmed', receipt: receipt() })
})
test('an absent lookup result stays unknown, never failed or safe to resubmit', async () => {
    let writes = 0
    let reads = 0
    const result = await submitOrder(input(), {
        create: async () => { writes++; throw new SubmissionUncertain('ambiguous timeout') },
        findByKey: async key => { reads++; expect(key).to.equal('intent-7'); return undefined },
    })
    expect(result).to.deep.equal({ status: 'unknown', key: 'intent-7' })
    expect(writes).to.equal(1)
    expect(reads).to.equal(1)
})
test('ordinary create failures propagate without retry or reconciliation', async () => {
    const failure = new Error('explicit validation rejection')
    let writes = 0
    await assert.rejects(submitOrder(input(), {
        create: async () => { writes++; throw failure },
        findByKey: async () => { throw new Error('unexpected lookup') },
    }), error => error === failure)
    expect(writes).to.equal(1)
})
test('lookup failure remains an error and cannot trigger another write', async () => {
    const failure = new Error('lookup unavailable')
    let writes = 0
    await assert.rejects(submitOrder(input(), {
        create: async () => { writes++; throw new SubmissionUncertain() },
        findByKey: async () => { throw failure },
    }), error => error === failure)
    expect(writes).to.equal(1)
})
test('reconciliation checks request identity, account and amount before confirmation', async () => {
    for (const wrong of [
        { ...receipt(), key: 'other-intent' }, { ...receipt(), accountId: 'other-account' },
        { ...receipt(), totalCents: 99 }, { ...receipt(), orderId: '' },
    ]) {
        await assert.rejects(submitOrder(input(), {
            create: async () => { throw new SubmissionUncertain() },
            findByKey: async () => wrong,
        }), { message: 'Receipt does not match submission' })
    }
})
test('uses the original submission snapshot even if caller state changes during the request', async () => {
    const mutable = input()
    const result = await submitOrder(mutable, {
        create: async submission => {
            mutable.key = 'changed'
            mutable.totalCents = 0
            expect(submission).to.deep.equal(input())
            throw new SubmissionUncertain()
        },
        findByKey: async key => { expect(key).to.equal('intent-7'); return receipt() },
    })
    expect(result).to.deep.equal({ status: 'confirmed', receipt: receipt() })
})
test('invalid submission cannot reach the gateway', async () => {
    let calls = 0
    await assert.rejects(submitOrder({ ...input(), key: ' ' }, {
        create: async () => { calls++; return receipt() },
        findByKey: async () => { calls++; return undefined },
    }), { message: 'Invalid submission' })
    expect(calls).to.equal(0)
})
