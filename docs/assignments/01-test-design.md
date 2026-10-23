# Test design and trustworthy oracles

An oracle is the source you use to decide whether a result is correct. These
tickets make you choose it before writing an assertion. The delivery shop below
is a fictional specification, not a feature of either demo APK.

## AS-01 · Turn a delivery rule into examples

**L1 · Guided · Design · 25–40 min · App: fictional delivery shop.**

### Prerequisites

Read [testing foundations](../handbook/testing-foundations.md). No Node, device
or account is required. Own `.local-data/assignments/AS-01/evidence.md`.

### Assignment

**Ticket:** “Delivery-price tests missed a boundary. Give the developer examples
we can agree on.” Contract: totals are nonnegative integer cents; pickup costs
0; standard delivery costs 499 below 5000 and 0 from 5000; express always costs
999. Invalid totals or unknown delivery methods are rejected, not rounded.

Write a decision table with method, total, expected fee and reason. Include
0, 4999, 5000, 5001, a negative value, a fractional value and an unknown method.
Choose six examples for a first review and explain which remaining rules they
do not cover. Specify a business assertion and the cheaper layer that could
check each rule; do not send six mobile sessions to test pure arithmetic.

### Acceptance criteria

Every valid rule and rejection category has an example. The threshold is
unambiguous, expected values come from the contract, and the six-case selection
has an explicit coverage gap. State which one UI journey would connect the
displayed fee to the selected delivery method.

### Changed condition

Product changes only standard delivery to “free above 5000.” Mark precisely
which examples must change and which must remain stable. Do not rewrite the
original requirement silently; keep both versions.

### Evidence and review

Deliver both tables and a short review comment. **90-second explanation:** why
does checking 4999, 5000 and 5001 tell you something three random totals do not?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Separate method selection from the threshold. Pickup and express do not inherit
the standard-delivery rule. A valid total of 0 is different from an absent total.
Ask whether UI currency formatting belongs in this arithmetic decision table.

</details>

## AS-02 · Challenge a weak oracle

**L2 · Independent · Offline · 45–65 min · App: synthetic delivery summary.**

### Prerequisites

AS-01, [assertions](../lessons/03-async-and-assertions.md) and the
[offline attempt workflow](README.md#make-an-attempt-you-can-keep). Node 24 only.
Own `.local-data/assignments/AS-02/attempt.ts` and `attempt.test.ts`.

### Assignment

**Ticket:** “The checkout check passes when the wrong delivery fee is shown.”
Implement `matchesQuote(actual: unknown, expected: Quote): boolean`. A Quote has
`orderId: string`, `method: 'pickup' | 'standard' | 'express'`, `itemsCents: number`
and `deliveryCents: number`. The trusted expected value is a valid fixture.
Actual must be a non-array object with all four fields equal in value and type;
both amounts must be nonnegative safe integers. Extra actual fields are allowed.
Do not coerce strings or calculate the expected fee from the actual response.

For expected `{orderId:'o-17', method:'standard', itemsCents:5000,
deliveryCents:0}`, author tests for an exact match, wrong order, express method,
fee 499, string `'0'`, missing fee, null and an extra debug field. Build expected
fixtures from AS-01's rule, independently of the function under test.

### Acceptance criteria

Exact and harmless-extra-field cases pass; each independent mismatch fails.
Tests assert returned booleans, rather than merely that nothing threw. Include
an additional non-finite or unsafe amount case and run the selected test and
explicit typecheck from the bank guide.

### Changed condition

Temporarily weaken the matcher to check only `orderId`. Name at least two tests
you predict will fail, run them, then restore your implementation. Record whether
your test messages explain which business claim was lost.

### Evidence and review

Deliver the narrow test result and mutation result. **90-second explanation:**
how can an assertion be precise yet still use an untrustworthy expected value?

<details><summary>Hint and reviewer questions — after your attempt</summary>

A TypeScript cast does not validate runtime data. Avoid an oracle that repeats
the production calculation over the same response and therefore shares its bug.
Your matcher checks a model contract; it has not observed a screen or backend.

</details>

## AS-03 · Negotiate a small release scope

**L3 · Investigation · Design · 45–60 min · App: fictional delivery shop.**

### Prerequisites

AS-01, [test design](../lessons/14-test-design.md) and the difference between a
helper result and a mobile result. Own `AS-03/evidence.md` in your private bank
directory. No device or paid service is required.

### Assignment

**Ticket:** “We have 25 minutes of device time for a delivery-fee change.” The
change modifies the standard-delivery threshold and its summary label. Available
checks: pure fee table (1 min), Android standard checkout (8), Android pickup
(6), Android express (6), second Android version standard checkout (9), iOS
checkout (12, build unavailable), font-scale summary review (7). Durations are
fictional estimates, not measured project timings.

Propose a selection within the device budget; account for offline work separately.
Map each selected check to a risk, write the assertion and identify a person or
artifact that must confirm the new threshold. Identify one worthwhile omitted
check. Describe what would make you revise the selection without claiming a
universal coverage percentage.

### Acceptance criteria

Your plan fits the stated constraint, checks both calculation and presentation,
distinguishes planned from executed work and records the unavailable iOS build.
Provide a concise reviewer comment with the release question still open.

### Changed condition

New evidence says the only modified component is the shared summary renderer,
and a large-text screenshot clips the final digit. Revise the risk priorities
and budget explicitly. Explain which calculation evidence remains useful.

### Evidence and review

Deliver original and revised selections with totals. **90-second explanation:**
what would you tell a team lead who asks whether the release is “fully tested”?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Do not spend scarce device minutes re-proving every arithmetic row. Conversely,
pure functions cannot show a clipped amount or wrong UI binding. There can be
several good selections; the requirement, risk and evidence should explain yours.

</details>

[Assignment bank](README.md) · [Next topic: locators](02-locators.md)
