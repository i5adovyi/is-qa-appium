# Lab 12 — The retry succeeded and created a duplicate

**After lessons 03, 08–10 and lab 10. Time:** 40–60 minutes.
No device, network, payment service or credentials are involved.

Your inherited helper retries a write after a timeout. The happy path is green.
The supplied in-memory gateway can **commit an order and then lose its response**.
Run the starter and inspect the ledger, not just the helper's returned status.

## Contract

Repair only the recovery control flow in [starter.ts](starter.ts).
Types, the uncertainty error and validation guards are supplied in
[contract.ts](contract.ts).

1. Snapshot and validate the submitted key, account and integer amount before
   the first asynchronous action. The supplied guard does this.
2. Call `gateway.create(snapshot)` **once** per invocation.
3. If it succeeds, verify the receipt against the snapshot with the supplied
   `confirm` guard and return the confirmation.
4. Only `SubmissionUncertain` triggers recovery: call `findByKey` once using
   the original key. Never submit again or generate a new key.
5. A matching receipt confirms the original write. A missing receipt returns
   `{ status: 'unknown', key }`. Missing data is not proof the write failed:
   the lookup may lag behind the write.
6. Other create errors and lookup errors propagate unchanged. An invalid
   receipt fails the supplied guard. None of these paths performs another write.

This API's key is a **correlation key**. Its backend does not promise idempotent
creation, so sending the same key twice may still create two orders. A production
idempotency contract needs server-side enforcement, defined scope and lifetime.
This helper also cannot prevent a caller starting another independent invocation.
The caller must preserve an unresolved intent and obtain product/server guidance.

```bash
npm run practice -- 12
npm run typecheck:practice
```

## Investigation

Before repairing the code, explain why “retry passed” can conceal the original
problem. Afterward, add a test for a `SubmissionUncertain` subtype and explain
why checking an error message substring would be weaker than the adapter's
explicit classification.

<details><summary>Hint 1 · Observe before changing state again</summary>

The response was lost; the transaction may already exist. Use the read-only
lookup to reconcile the original intent. A lookup timeout is also uncertainty.

</details>
<details><summary>Hint 2 · Unknown is a useful result</summary>

Returning unknown preserves the unresolved state for investigation. Returning
failed can encourage duplicate submission; returning confirmed invents evidence.
Use a bounded follow-up policy in a real system, with one owner of retry budget.

</details>

**Done when:** the fake ledger has exactly one order after the lost-response
case, unresolved cases stay unknown, and your explanation distinguishes the
per-invocation guarantee from a global “exactly once” claim.
[Reference implementation](solution.ts).

Continue with RW-36 in the [workplace workbook](../../docs/handbook/workplace-scenarios.md)
and S3 in [incident shifts](../../docs/handbook/incident-shifts.md).
[Primary reference: safe retries and API contracts](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[All labs](../README.md)
