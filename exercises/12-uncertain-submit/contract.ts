export type Submission = { key: string; accountId: string; totalCents: number }
export type Receipt = Submission & { orderId: string }
export type Outcome =
    | { status: 'confirmed'; receipt: Receipt }
    | { status: 'unknown'; key: string }
export type Gateway = {
    create: (submission: Readonly<Submission>) => Promise<Receipt>
    findByKey: (key: string) => Promise<Receipt | undefined>
}

// The transport adapter uses this only when the write may have reached the server.
export class SubmissionUncertain extends Error {}

// Supplied guards keep this lab focused on recovery, rather than JSON parsing.
export function snapshotSubmission(input: Submission): Readonly<Submission> {
    if (!input.key || input.key.trim() !== input.key || !input.accountId
        || input.accountId.trim() !== input.accountId
        || !Number.isSafeInteger(input.totalCents) || input.totalCents < 0) {
        throw new Error('Invalid submission')
    }
    return Object.freeze({ ...input })
}
export function confirm(receipt: Receipt, input: Readonly<Submission>): Outcome {
    if (!receipt.orderId || receipt.orderId.trim() !== receipt.orderId
        || receipt.key !== input.key || receipt.accountId !== input.accountId
        || receipt.totalCents !== input.totalCents) {
        throw new Error('Receipt does not match submission')
    }
    return { status: 'confirmed', receipt: { ...receipt } }
}
