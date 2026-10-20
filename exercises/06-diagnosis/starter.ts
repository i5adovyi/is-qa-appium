export type Category = 'device' | 'connection' | 'locator-or-state' | 'assertion' | 'unknown'

export function classifyFailure(message: string): Category {
    throw new Error('Exercise 06: implement classifyFailure')
}
