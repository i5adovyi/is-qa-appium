export type Order = { id: string; state: 'pending' | 'confirmed'; totalCents: number }
export type OrderResult =
    | { kind: 'order'; order: Order }
    | { kind: 'unauthenticated' | 'forbidden' | 'not-found' | 'throttled' | 'unavailable' }
export type RequestOrder = (id: string) => Promise<{ status: number; json: () => Promise<unknown> }>

export async function loadOrder(id: string, request: RequestOrder): Promise<OrderResult> {
    throw new Error('Exercise 10: implement loadOrder')
}
