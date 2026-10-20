import { test } from 'node:test'
import { expect } from 'chai'
import type { Fixture } from './starter.ts'
const { makeFixture } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

const template = (): Fixture => ({
    account: { id: 'template', roles: ['customer'] },
    cart: { items: [{ sku: 'book', quantity: 1 }, { sku: 'pen', quantity: 2 }], coupon: null },
    tags: ['training'],
})
test('preserves values and replaces only the account ID', () => {
    const input = template()
    expect(makeFixture(input, 'worker-1')).to.deep.equal({
        ...input, account: { id: 'worker-1', roles: ['customer'] },
    })
    expect(input.account.id).to.equal('template')
})
test('a coupon test cannot contaminate a later no-coupon test', () => {
    const input = template()
    const first = makeFixture(input, 'worker-1')
    first.cart.coupon = 'SAVE10'
    const second = makeFixture(input, 'worker-2')
    expect(second.cart.coupon, 'the later test must start without a coupon').to.equal(null)
    expect(input.cart.coupon, 'the factory template was contaminated').to.equal(null)
})
test('concurrent fixtures own item objects, arrays, roles and tags', () => {
    const input = template()
    const first = makeFixture(input, 'worker-1')
    const second = makeFixture(input, 'worker-2')
    first.cart.items[0]!.quantity = 99
    first.cart.items.push({ sku: 'extra', quantity: 1 })
    first.account.roles.push('admin')
    first.tags.push('changed')
    expect(second).to.deep.equal({ ...template(), account: { id: 'worker-2', roles: ['customer'] } })
    expect(input).to.deep.equal(template())
})
test('later edits to the template cannot change a fixture already created', () => {
    const input = template()
    const result = makeFixture(input, 'worker-1')
    input.cart.items[1]!.quantity = 88
    input.account.roles[0] = 'other'
    input.tags.length = 0
    expect(result).to.deep.equal({ ...template(), account: { id: 'worker-1', roles: ['customer'] } })
})
test('accepts empty arrays without inventing default items or roles', () => {
    const input: Fixture = { account: { id: 'base', roles: [] }, cart: { items: [], coupon: 'KEEP' }, tags: [] }
    const result = makeFixture(input, 'new')
    result.cart.items.push({ sku: 'only-new', quantity: 1 })
    expect(input.cart.items).to.deep.equal([])
    expect(result.account.roles).to.deep.equal([])
    expect(result.cart.coupon).to.equal('KEEP')
})
test('rejects missing or padded identity rather than silently normalizing it', () => {
    for (const id of ['', ' ', ' worker-1', 'worker-1\n']) {
        expect(() => makeFixture(template(), id)).to.throw('Invalid account ID')
    }
})
