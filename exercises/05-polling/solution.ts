export async function waitForValue(read: () => Promise<string>, expected: string, attempts: number): Promise<string> {
    if (!Number.isInteger(attempts) || attempts < 1) throw new Error('attempts must be a positive integer')
    let actual = ''
    for (let attempt = 0; attempt < attempts; attempt++) {
        actual = await read()
        if (actual === expected) return actual
    }
    throw new Error(`Expected ${JSON.stringify(expected)}, last saw ${JSON.stringify(actual)}`)
}
