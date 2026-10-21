# CH-07 · Green alone, red after another test

**Ticket:** “The no-coupon case passes alone but receives SAVE10 after a coupon
case. Every test has a different account ID.” Restarting the mobile app did not
help. Find the shared memory before blaming the device.

## Prerequisites

Node only; objects/arrays, [test data](../lessons/08-test-data.md) and
[state](../lessons/09-waits-and-state.md). Allow 45–75 minutes.
Use the fictional incident in [lab 11](../../exercises/11-fixture-isolation/README.md).

## Assignment

Own [lab 11 starter](../../exercises/11-fixture-isolation/starter.ts).
It is deliberately faulty rather than unfinished. Before running, draw arrows
from two created fixtures to account, roles, cart, items and item tags.

1. Run `npm run practice -- 11` and save the initial failure.
2. Identify a nested object shared by template and returned fixtures.
3. Repair ownership for the documented plain-data shape. Preserve nulls and
   empty arrays; do not change the template.
4. Add a regression that modifies the second item's quantity in fixture A,
   then checks template and fixture B.
5. Add the reverse-direction check: modify the template after creating a
   fixture and verify the existing fixture stays unchanged.
6. Rerun the grader and `npm run typecheck:practice`.

## Acceptance criteria

The original contract and both added regressions pass. You can point to the
specific shared reference and show how the fix changes the object graph.
Changing test order, forcing serial execution or retrying is not the repair.
Existing lab tests must remain intact.

## Evidence and review

Record the initial failing case, your object diagram in text, the new tests and
the final result. State whether this evidence covers JavaScript memory,
backend account ownership, or both.

<details><summary>Hint / reviewer questions — after your attempt</summary>

A new outer object and unique IDs do not guarantee new nested arrays. A shallow
spread is insufficient for this shape. Choose explicit reconstruction or a clone
operation with a supported data model; explain why it fits this contract.

</details>

**Change request:** two workers now create server-side orders with the same
account. Would this fix isolate them? Write the separate fixture-ownership and
cleanup requirement; do not claim the in-memory grader tested a backend.
Extend with RW-30 / S2 in the existing workbooks.
Next: [CH-08](08-uncertain-write.md), after lab 10 or [CH-09](09-api-contract.md).
