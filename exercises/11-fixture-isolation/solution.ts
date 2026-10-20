import type { Fixture } from './starter.ts'

export function makeFixture(template: Fixture, accountId: string): Fixture {
    if (!accountId || accountId.trim() !== accountId) throw new Error('Invalid account ID')
    return {
        account: { id: accountId, roles: [...template.account.roles] },
        cart: {
            items: template.cart.items.map(item => ({ ...item })),
            coupon: template.cart.coupon,
        },
        tags: [...template.tags],
    }
}
