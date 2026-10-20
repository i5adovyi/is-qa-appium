# Lab 11 — Green alone, red after another test

**After lessons 02, 08 and 09. Time:** 30–45 minutes. No device or account needed.
This starter runs and passes some tests. It contains a realistic ownership bug.
Read it before running anything and predict which assertions will fail.

Synthetic incident:

```text
No-coupon checkout alone: passes.
Coupon checkout → no-coupon checkout: second test fails.
The mobile app and API fixture IDs differ between tests.
Restarting the app does not repair the failure.
Expected coupon=null; actual coupon=SAVE10.
```

## Task and contract

Repair `makeFixture(template, accountId)` in [starter.ts](starter.ts):

1. Return the template's values with only `account.id` replaced.
2. Reject empty or surrounding-whitespace IDs with `Error('Invalid account ID')`.
3. Mutating any returned account roles, cart, item object, item array or tags
   must not affect the template or another fixture.
4. Later changes to the template must not alter an existing fixture.
5. Preserve empty arrays and `null`; do not invent defaults or mutate input.

The input has the documented plain-data `Fixture` shape. It has no functions,
dates, cyclic references or external resources. You are fixing memory ownership,
not reserving server-side accounts or making backend fixtures independent.

```bash
npm run practice -- 11
npm run typecheck:practice
```

Before editing, draw arrows from both returned fixtures to the nested objects.
Explain why different IDs and a top-level spread do not prove isolation.
Repair the helper, then add a test that mutates the **second** item's quantity
in one fixture and checks the other. Do not repair this by changing test order,
serializing the entire suite, freezing a shared object, or retrying the failure.

<details><summary>Hint 1 · Which object is actually new?</summary>

Object spread copies property values one level deep. A nested reference remains
a reference. Inspect `cart`, its `items` array and the objects inside that array.

</details>
<details><summary>Hint 2 · Choose a copy strategy for the actual shape</summary>

Explicitly reconstruct this small data shape, or explain why `structuredClone`
fits its supported values. JSON serialization is not a universal clone operation.
A TypeScript `readonly` annotation alone does not make nested runtime data new.

</details>

**Acceptance:** passes alone and in the reference/learner suite as applicable,
one added regression case, and a short explanation of the shared reference that
caused the leak. Keep the deliberately faulty starter result in your evidence
before the repair. [Reference](solution.ts).

Use with RW-30 in the [workplace workbook](../../docs/handbook/workplace-scenarios.md)
and shift S2 in [incident shifts](../../docs/handbook/incident-shifts.md).
[Primary reference: shallow copies](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy).

[All labs](../README.md)
