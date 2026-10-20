export type Fixture = {
    account: { id: string; roles: string[] }
    cart: { items: { sku: string; quantity: number }[]; coupon: string | null }
    tags: string[]
}

// This is a deliberately faulty implementation to investigate, not a blank stub.
export function makeFixture(template: Fixture, accountId: string): Fixture {
    if (!accountId || accountId.trim() !== accountId) throw new Error('Invalid account ID')
    return { ...template, account: { ...template.account, id: accountId } }
}
