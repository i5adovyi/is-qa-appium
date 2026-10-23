export type TextHandle = { getText: () => Promise<string> }
export type Locate = () => Promise<TextHandle>

// A teaching adapter class, not a WebdriverIO error detector.
export class StaleObservation extends Error {}

export function validateAttempts(attempts: number): void {
    if (!Number.isSafeInteger(attempts) || attempts < 1) {
        throw new Error('attempts must be a positive safe integer')
    }
}
