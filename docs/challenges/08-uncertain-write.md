# CH-08 · The retry created a second order

**Ticket:** “The first submit timed out. The retry returned success, but two
orders exist.” The response may be missing even when the first write succeeded.

## Prerequisites

Node only; await/errors, lab 10 contract concepts from
[CH-09](09-api-contract.md), and [lab 12](../../exercises/12-uncertain-submit/README.md).
Allow 60–90 minutes. The gateway and ledger are in-memory simulations; there is
no payment service or real purchase.

## Assignment

Own [lab 12 starter](../../exercises/12-uncertain-submit/starter.ts).
Keep supplied validation guards and types in [contract.ts](../../exercises/12-uncertain-submit/contract.ts).
Read the fake gateway in the tests before running.

Write a timeline: create requested → order committed → response lost → recovery.
Mark what the client actually knows at each step.

```bash
npm run practice -- 12
npm run typecheck:practice
```

1. Save the inherited helper's failure and ledger observation.
2. Repair the recovery flow: one create per invocation; reconcile only the
   explicit uncertainty class with one lookup using the original key.
3. Keep missing lookup results unknown. Propagate other failures.
4. Add a regression for a subclass of SubmissionUncertain. Prove the original
   create was not called twice.
5. Explain what happens when the lookup itself fails or returns a receipt for
   the wrong account.

## Acceptance criteria

The lost-response ledger contains one order, the matching receipt is verified,
unresolved outcomes remain unknown and your extra case passes. Do not generate
a new key or resubmit during recovery. Preserve the original request snapshot
across asynchronous calls.

## Evidence and review

Save the timeline, create/lookup counts, final ledger size and unresolved-case
result. Write one sentence suitable for support: what is known and what must be
checked before another submission.

<details><summary>Hint / reviewer questions — after your attempt</summary>

A timeout describes knowledge of the response, not the transaction's outcome.
Matching a message substring is weaker than the adapter's explicit error class.
The key here correlates an intent; the fake backend does not promise deduplication.

</details>

**Change request:** the caller invokes your helper twice independently with the
same key. Does the helper guarantee exactly once globally? Explain the missing
server-side idempotency contract and the ownership of unresolved intent.
Next: [CH-09](09-api-contract.md), or [CH-10](10-ci-evidence.md) if already done.
