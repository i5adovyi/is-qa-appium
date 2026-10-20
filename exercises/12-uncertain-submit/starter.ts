import { SubmissionUncertain, snapshotSubmission, confirm } from './contract.ts'
import type { Submission, Gateway, Outcome } from './contract.ts'

// Deliberate bug: the original write may already have committed.
export async function submitOrder(input: Submission, gateway: Gateway): Promise<Outcome> {
    const submission = snapshotSubmission(input)
    let receipt
    try {
        receipt = await gateway.create(submission)
    } catch (error) {
        if (!(error instanceof SubmissionUncertain)) throw error
        receipt = await gateway.create(submission)
    }
    return confirm(receipt, submission)
}
