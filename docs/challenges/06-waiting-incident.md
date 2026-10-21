# CH-06 · A result arrives after the first observation

**Ticket:** “A helper reads loading once, then keeps comparing that old value.
A retry sometimes passes.” Repair the observation logic without repeating the
action that started the work.

## Prerequisites

Node only; async/await from [lesson 03](../lessons/03-async-and-assertions.md)
and [lab 03](../../exercises/03-async-order/README.md). Understand loops and
errors before [lab 05](../../exercises/05-polling/README.md). Allow 45–60 minutes.

## Assignment

Own [lab 05 starter](../../exercises/05-polling/starter.ts) and add a regression
to [its tests](../../exercises/05-polling/exercise.test.ts).
Predict every observation and total number of calls:

| Reader values | Expected | Attempt limit | Prediction |
|---|---|---|---|
| loading, loading, ready | ready | 3 | Fill in |
| loading, loading, ready | ready | 2 | Fill in |
| text, empty string | empty string | 2 | Fill in |
| first read rejects | ready | 3 | Fill in |

Implement its contract, including validation before any read, bounded fresh
reads and preservation of read errors.

```bash
npm run practice -- 05
npm run typecheck:practice
```

Add a test that returns text once then empty string. Assert both the returned
value and number of calls. Deliberately cache the first read while looping over
the comparison. Predict the failure, run, then restore the fresh-read approach.

## Acceptance criteria

All contract checks and your regression pass. The helper makes no extra read
after a match and never repeats the action being observed. Invalid limits cause
zero reads. Your error explanation includes the expected and last actual value.

## Evidence and review

Save your prediction table, observed counts and controlled failure.
Compare the lab with [the real wait helper](../../test/helpers/waitForText.ts).

<details><summary>Hint / reviewer questions — after your attempt</summary>

Put the observation inside the bounded loop. Empty string is not a false result
to ignore; it may be the exact target. A read rejection is different from a valid
“still loading” observation and follows the contract's error policy.

</details>

**Execution limit:** this lab intentionally has no wall-clock delay. It teaches
bounded observations, not a production polling scheduler. Do not copy a tight
loop into Appium. Real timed waits need an interval and elapsed-time budget.
Next: [CH-07](07-fixture-contamination.md).
