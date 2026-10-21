# CH-10 · A green retry hid an untested release

**Ticket:** “The pipeline report says 100% passed. Six planned checks produced
this packet. Can we say the release is covered?” Build a correct summary and
write the decision a reviewer actually needs.

## Prerequisites

Node only; arrays, [CI lesson](../lessons/13-ci-and-reports.md) and
[lab 09 contract](../../exercises/09-run-summary/README.md). Allow 45–75 minutes.
This packet is synthetic input, not a real GitHub or Android run.

## Assignment

Implement [lab 09 starter](../../exercises/09-run-summary/starter.ts).
Add this packet as a new test in
[its test file](../../exercises/09-run-summary/exercise.test.ts), using the lab's
Result type. Do not replace existing tests.

```typescript
const packet = [
    { id: 'login', attempts: ['passed'], disposition: 'executed' },
    { id: 'forms', attempts: ['failed', 'passed'], disposition: 'executed' },
    { id: 'permissions', attempts: ['failed', 'failed'], disposition: 'executed' },
    { id: 'upgrade', attempts: [], disposition: 'skipped' },
    { id: 'deep-link', attempts: [], disposition: 'not-run' },
    { id: 'checkout', attempts: ['passed'], disposition: 'executed' },
] satisfies Result[]
```

Predict every count and first-pass rate before running:

```bash
npm run practice -- 09
npm run typecheck:practice
```

Assert the exact summary. Then change only permissions' last attempt to passed,
rerun and update the expected summary. Explain why a final pass after retry
does not erase evidence of an initial failure.

Write a release comment with planned, executed, final outcomes, retry recoveries,
skips, not-run checks and the first-pass denominator. Name the risk behind each
unexecuted check rather than converting it into a pass.

## Acceptance criteria

Your helper passes the original contract and exact packet assertions. It counts
tests rather than attempts and does not mutate input. The comment distinguishes
a fictional report from actual CI evidence and rejects the “100% covered” claim.

## Evidence and review

Save the before/after summaries and comment.

<details><summary>Review key — calculate before opening</summary>

Initially: planned 6, executed 4, passed 3, failed 1, skipped 1, notRun 1,
recoveredOnRetry 1, firstPassRate 0.5. After changing permissions' last attempt:
passed 4, failed 0, recoveredOnRetry 2; firstPassRate remains 0.5.
All four executed tests finally passing still leaves two planned checks unexecuted.

</details>

**Change request:** a job ran a grep matching no tests and exited successfully.
What evidence would distinguish “zero selected” from a completed smoke run?
Add a separate verification step to your proposed pipeline; exit code alone
cannot supply the missing test inventory.
Next: [CH-11](11-cloud-smoke.md).
