# Lab 13 — Repair an observation that keeps an old element

**Time:** 35–50 minutes. **Prerequisites:** lab 05, async functions and
[lesson 09](../../docs/lessons/09-waits-and-state.md). **Environment:** Node 24 only.

An app redraws a view. The selector still identifies the right control, but its
old element handle no longer does. The inherited helper retries the old handle
and sometimes fails even though a new lookup would work. Repair `observeText`
in [starter.ts](starter.ts). Some initial tests pass; locate the causal failure.

## Contract

- Validate `attempts` as a positive safe integer before any lookup.
- Each attempt must await a fresh `locate()`, then read that handle once.
- Return immediately when the read equals `expected`, including an empty string.
- A nonmatching read consumes an attempt. An explicit `StaleObservation` from
  lookup or read also consumes an attempt; retry only if the budget remains.
- On a final stale error, reject with that same object. For a final nonmatching
  read, reject with a message containing the expected and last actual values.
- Propagate every other rejection unchanged and immediately, including values
  that are not `Error` objects. Error-message substring matching is insufficient.
- Do not click, restart, sleep, log data or change the caller's expected value.

`StaleObservation` in [contract.ts](contract.ts) is an explicit teaching adapter
signal. It is **not** a complete detector for actual WebdriverIO/Appium errors.
The exercise supplies fake handles; it does not create a driver session.

## Work

1. Predict the calls for: immediate match; stale old handle then fresh match;
   two different nonmatching handles; disconnected session; zero attempts.
2. Run `npm run practice -- 13`. Identify which object survives between attempts.
3. Repair the lifetime of that object without broadening the retry policy.
4. Add a test combining a mismatch, a stale read and a match within three attempts.
5. Explain why looking up a row by its old index can find a different record,
   even if the new handle is valid. Continue with [lab 14](../14-bounded-scroll/README.md).

<details><summary>Hint 1 · The variable's scope is evidence</summary>

Which operation currently happens once, and which one happens on every attempt?
The element's identity in the current view must be observed again, not assumed.

</details>
<details><summary>Hint 2 · Recovery needs a narrow contract</summary>

Put both lookup and read within the attempt's error policy. An unavailable
session is not a stale-view transition. Preserve its failure so it can be fixed.

</details>

**Acceptance:** reference contract checks and your added case pass; your call
trace shows fresh lookup/read pairs and no extra attempt after a match. Explain
which error is retried, which escapes, and why.

**Controlled defect:** move a lookup back outside the loop. Predict and run the
stale-view regression, then restore your repair. Do not alter the assertions to
accommodate the old handle. [Reference solution](solution.ts) is separate.

**Mobile transfer limit:** this deterministic lab has no elapsed-time delay.
Actual waits need a time budget and interval, an inspected identity, and the
installed client's documented behavior. Check the client's existing recovery
before adding custom retries; WebdriverIO documents a limitation for raw
element references without selector information in its
[`$` reference](https://webdriver.io/docs/api/browser/%24).
A successful
fake read proves neither target uniqueness nor an Appium stale-element repair.
Never apply this observation policy to submitting an order or repeatedly tapping.

[All labs](../README.md) · [Selector lesson](../../docs/lessons/05-selectors.md)
