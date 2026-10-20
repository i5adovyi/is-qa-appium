# Lab 08 — Own test data even when the test fails

**Time:** 35–50 minutes. **After:** lessons 03, 08 and 10.

A production test creates an account through an API, drives the app, then deletes
its own account. Implement `withFixture(operations)` in [starter.ts](starter.ts).
The callbacks are fakes: this lab sends no requests and deletes no real data.

## Contract

1. Await `create()` exactly once. If it rejects, propagate that same rejection;
   call neither `use` nor `remove` because no fixture identity was returned.
2. After creation, await `use(fixture)` exactly once with the same fixture object.
3. Whether use succeeds or rejects, await `remove(fixture.id)` exactly once.
4. If both succeed, resolve with `undefined`.
5. If only use or only removal rejects, propagate the **same** rejected value.
6. If both reject, throw
   `new AggregateError([useError, cleanupError], 'Test and cleanup failed')`.
   The primary test failure goes first. Rejections can be any JavaScript value,
   including `undefined`; testing an error's truthiness is insufficient.
7. Do not log fixtures/errors or retry any callback.

## Work

Run `npm run practice -- 08`. Write down the four use/cleanup outcome combinations
before coding. Add a case for a non-`Error` rejection. Explain how callers would
apply request timeouts and sanitized reporting outside this helper.

<details><summary>Hint 1</summary>

Creation happens before you own a returned fixture. After it returns, keep a
separate boolean to track whether use failed.

</details>
<details><summary>Hint 2</summary>

A rejecting `finally` can replace the original error. Decide explicitly how to
represent two failures. Swallowing cleanup errors hides leaked data.

</details>

**Done when:** tests pass and you explain the ambiguous-creation case: a server
might create a resource and then lose its response. This helper cannot clean up an
unknown ID. A production fixture API needs a run-scoped lookup/reconciliation
contract or expiry policy. Blindly retrying account creation is not a solution.

**Reference:** [solution.ts](solution.ts).
Continue with scenario RW-16 in the [workplace workbook](../../docs/handbook/workplace-scenarios.md).

[All labs](../README.md)
