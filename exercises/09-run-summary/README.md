# Lab 09 — Report results without hiding failed first attempts

**Time:** 30–45 minutes. **After:** lessons 02 and 13.

“Everything is green after retries” conceals useful evidence. Implement `summarize`
in [starter.ts](starter.ts) using the exported typed input and output.

## Contract

Input contains one record per **planned test**, with retries inside its `attempts`
array in chronological order. The union types describe trusted in-memory input;
parsing arbitrary JSON is a separate concern.

- Reject blank/whitespace-only or duplicate IDs with `Error('Invalid result')`.
  Compare IDs exactly; do not rewrite them.
- `executed` requires at least one attempt. Only its final attempt may be `passed`;
  a runner stops retrying once it passes.
- `skipped` and `not-run` must have no attempts. Contradictory records throw the
  same error. Here, skipped means deliberately omitted; not-run means planned but
  never executed, for example after setup failed.
- Count planned records and the four final dispositions separately.
- `executed = passed + failed`. Count tests, not attempts.
- `recoveredOnRetry` counts each final-passing test with an earlier failed attempt
  once. It flags a result pattern, not a proven root cause.
- `firstPassRate` is first-attempt passes divided by executed tests, from 0 to 1,
  without rounding. If nothing executed, return `null`, including for `[]`.
- Do not mutate input.

## Work

Run `npm run practice -- 09`. Implement the contract and add a case where every
test is skipped. Explain why neither final pass rate nor first-pass rate is a
percentage of product quality.

<details><summary>Hint</summary>

Validate before counting a record. Track first-attempt passes separately from
final passes. Check the denominator before dividing.

</details>

**Done when:** tests pass, empty execution is visible, and you can explain why a
setup failure still needs a separate failed job/session status even when no test
attempts were recorded. This lab is a reporting exercise; it does not enable
retries in this project's runner.

**Reference:** [solution.ts](solution.ts).
Use your output in scenario RW-17 in the [workplace workbook](../../docs/handbook/workplace-scenarios.md).

[All labs](../README.md)
