export type Order = { id: string; state: 'pending' | 'confirmed'; totalCents: number }
export type OrderResult =
    | { kind: 'order'; order: Order }
    | { kind: 'unauthenticated' | 'forbidden' | 'not-found' | 'throttled' | 'unavailable' }
export type RequestOrder = (id: string) => Promise<{ status: number; json: () => Promise<unknown> }>

export async function loadOrder(id: string, request: RequestOrder): Promise<OrderResult> {
    if (!id || id.trim() !== id) throw new Error('Invalid order ID')
    const response = await request(id)
    switch (response.status) {
        case 401: return { kind: 'unauthenticated' }
        case 403: return { kind: 'forbidden' }
        case 404: return { kind: 'not-found' }
        case 429: return { kind: 'throttled' }
        case 503: return { kind: 'unavailable' }
        case 200: break
        default: throw new Error(`Unexpected HTTP status: ${response.status}`)
    }
    let value: unknown
    try {
        value = await response.json()
    } catch {
        throw new Error('Invalid order response')
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error('Invalid order response')
    }
    const order = value as Record<string, unknown>
    if (order.id !== id || (order.state !== 'pending' && order.state !== 'confirmed')
        || typeof order.totalCents !== 'number' || !Number.isSafeInteger(order.totalCents)
        || order.totalCents < 0) {
        throw new Error('Invalid order response')
    }
    return { kind: 'order', order: { id, state: order.state, totalCents: order.totalCents } }
}
