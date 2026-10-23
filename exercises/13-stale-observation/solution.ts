import { StaleObservation, validateAttempts } from './contract.ts'
import type { Locate } from './contract.ts'

export async function observeText(locate: Locate, expected: string, attempts: number): Promise<string> {
    validateAttempts(attempts)
    let last = '<no successful read>'
    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            const handle = await locate()
            last = await handle.getText()
            if (last === expected) return last
        } catch (error) {
            if (!(error instanceof StaleObservation)) throw error
            if (attempt === attempts - 1) throw error
        }
    }
    throw new Error(`Expected ${JSON.stringify(expected)}; last observed ${JSON.stringify(last)}`)
}
