export type Category = 'device' | 'connection' | 'locator-or-state' | 'assertion' | 'unknown'

export function classifyFailure(message: string): Category {
    const text = message.toLowerCase()
    if (text.includes('device offline') || text.includes('no devices')) return 'device'
    if (text.includes('econnrefused')) return 'connection'
    if (text.includes('still not displayed') || text.includes('no such element')) return 'locator-or-state'
    if (text.includes('assertionerror')) return 'assertion'
    return 'unknown'
}
