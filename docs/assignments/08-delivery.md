# Delivery and evidence a team can use

Workplace automation includes choosing what runs and explaining what actually
ran. These fixtures deliberately separate a green-looking result from complete,
correctly identified evidence. No CI account or paid cloud session is required.

## AS-22 · Make test selection a contract

**L1 · Guided · Offline · 35–55 min · App: synthetic CI selection.**

### Prerequisites

Node 24, arrays and [CI concepts](../lessons/13-ci-and-reports.md). Own
`.local-data/assignments/AS-22/attempt.ts` and `attempt.test.ts`; use the
[offline workflow](README.md#make-an-attempt-you-can-keep).

### Assignment

**Ticket:** “A typo in the changed-area list silently selects no tests.” Implement
`selectChecks(areas: string[])` using this fictional contract: accepted areas are
`docs`, `catalog`, `cart`, `checkout` and `runner`. Always include `structure`.
`docs` adds nothing; catalog adds `catalog-smoke`; cart adds `cart-smoke`; checkout
adds both `cart-smoke` and `checkout-smoke`; runner adds all three smoke checks.
Unknown areas throw before returning a plan. An empty list returns structure only.

Return unique checks in the fixed order `structure`, `catalog-smoke`,
`cart-smoke`, `checkout-smoke`. Test each area, checkout+catalog, duplicates,
empty input and the typo `chekout`. The input array must remain unchanged.

### Acceptance criteria

All selection rules and rejection cases have explicit assertions. Order and
deduplication are deterministic. Explain that this planner is a synthetic
exercise, not a change to the repository's real GitHub workflow.

### Changed condition

Add a regression for `['docs','chekout']`. Temporarily ignore unknown strings,
show that your test catches the silent coverage loss, then restore the contract.
Do not treat “the job exited 0” as proof that checkout was selected.

### Evidence and review

Deliver code, expected selections and mutation result. **90-second explanation:**
what evidence would you need after planning to prove that the selected specs
actually ran on the intended app build?

<details><summary>Hint and reviewer questions — after your attempt</summary>

A valid plan and a completed run are different artifacts. Treat unexpected input
as a visible contract problem. Avoid a default branch that silently converts
unknown areas into the smallest possible selection.

</details>

## AS-23 · Merge evidence without hiding a missing shard

**L2 · Independent · Offline · 55–80 min · App: synthetic CI manifests.**

### Prerequisites

AS-22, Node 24 and [run-summary concepts](../../exercises/09-run-summary/README.md).
Own `AS-23/attempt.ts` and `attempt.test.ts` in your private bank directory.

### Assignment

**Ticket:** “The report says all passed because it merged only the shard files
that arrived.” Implement `mergeManifests(expected, manifests)` where expected has
`runId`, `buildId` and a unique, nonempty list of `shardIds`. Assume these expected
values are valid. Each manifest has those identity fields, one shardId and
nonnegative safe-integer `passed`, `failed`, `skipped` counts.

Reject mismatching run/build IDs, unexpected or duplicate shard IDs, malformed
counts and any missing expected shard. Otherwise return summed counts plus
`complete: true`; reject if a summed count is not a safe integer. Completeness
means all expected evidence arrived, not that every test passed. Do not deduplicate
two retry attempts silently or fill missing counts with zero.

Use expected run `r-41`, build `app-b7`, shards `a,b`. Shard a reports 3/0/1 and
b reports 2/1/0 for passed/failed/skipped. Test the valid summary and every rejection
category independently. Do not read or merge personal logs for this task.

### Acceptance criteria

The valid sum is 5 passed, 1 failed, 1 skipped, complete true. One absent shard
fails; two copies of a do not substitute for a and b. A complete report can still
be unsuitable for release. Run the selected tests and explicit typecheck.

### Changed condition

The retry of shard b arrives with the same IDs but different counts. Keep it
ambiguous under the current contract. Propose an attempt ID and explicit retry
selection policy as a separate design; do not hide the original failure.

### Evidence and review

Deliver code, rejection matrix and retry-policy proposal.
**90-second explanation:** why are build identity, run identity and expected
shard inventory necessary before adding up green results?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Validate identity and inventory before summarizing success. “All files found on
disk passed” says nothing about files that never arrived. Keep missing, malformed,
failed and skipped evidence distinguishable in the surrounding release report.

</details>

## AS-24 · Hand over a decision under uncertainty

**L3 · Investigation · Design · 60–90 min · App: fictional mobile release.**

### Prerequisites

AS-23, one earlier assignment attempt and [test design](../lessons/14-test-design.md).
Own `AS-24/evidence.md` in your private bank directory. No real release action,
cloud account or device is required for this fictional review.

### Assignment

**Ticket:** “A cart hotfix is waiting. Give the next engineer a decision they can
challenge and continue.” Review this packet:

| Evidence | Recorded scope |
|---|---|
| Offline price tests | Current code revision; passed |
| Android cart recording | Yesterday's app build b6; one product added |
| Today's run manifest | Build b7; shard a passed; expected shard b absent |
| Large-text observation | b7; remove control clipped; manual evidence attached in the fictional report |
| Checkout statement | “Success label appeared”; no order/API correlation |
| One of your earlier attempts | Use your real status and limits; do not upgrade it to a pass |

Write a one-page recommendation with established facts, uncertainties, user
impact, selected next checks and a clear condition for changing your decision.
Prioritize at most three next actions. Include one actionable defect or
investigation ticket with expected/actual behavior and missing evidence; label
all supplied packet material fictional. Your own attempt remains separate evidence.

### Acceptance criteria

The recommendation does not borrow yesterday's build as proof for today's build,
hide missing shard b, treat a label as a paid order or claim to have inspected an
attachment that is not actually supplied here. Distinguish report assertions
from observations you made. State who must decide the real business tradeoff.

### Changed condition

New packet: b7 shard b arrives and passes; the clipped control remains, with a
documented workaround of returning to the product screen. Revise your decision
without erasing the usability risk. Explain what evidence would make a workaround
acceptable for this fictional release and what you still cannot infer.

### Evidence and review

Deliver original and revised notes. **90-second explanation:** rehearse a team
handover and then answer, “What is the strongest evidence against your own
recommendation?” Use specific training work in interviews; do not present this
fictional release as employment experience.

<details><summary>Hint and reviewer questions — after your attempt</summary>

A useful decision can be conditional. Missing evidence, a known defect and an
unsupported guarantee are different risks. A workaround lowers some impact only
if the affected user can actually use it. State your reasoning so another engineer
can change the conclusion when new evidence arrives.

</details>

[Assignment bank](README.md) · [Review checklist](../handbook/review-checklist.md)
