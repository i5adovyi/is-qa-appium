# Ten practical interview drills

Use a timer, write your answer before opening the review guide, then explain it.
These drills complement the [question bank](interview-practice.md). Code fragments
are exercises unless explicitly identified as a reference; no device execution is
claimed for a fragment.

## D1 · Review and repair a misleading test

**15 minutes. Prerequisites: lessons 03 and 06.**

Review this intentionally flawed fragment. Assume the Forms screen is open.
Identify each problem, predict how it could fail or mislead, and rewrite it.

```ts
it('clears entered text', async () => {
    FormsScreen.input.setValue('hello')
    await driver.pause(1000)
    await FormsScreen.input.clearValue()
    expect(FormsScreen.inputResult.getText()).to.equal('')
})
```

**Acceptance:** actions awaited; populated state observed before clearing;
condition-based readiness after clearing; an awaited value passed to Chai;
independent screen setup identified. Describe the deliberate defect that proves
the assertion works.

<details><summary>Reference reasoning and repaired body</summary>

The missing await creates an action-order race. A sleep does not establish that
input was echoed. Clearing without a populated precondition can pass vacuously.
The assertion compares a promise with a string.

```ts
await FormsScreen.input.setValue('hello')
await waitForText(FormsScreen.inputResult, 'hello')
expect(await FormsScreen.inputResult.getText()).to.equal('hello')

await FormsScreen.input.clearValue()
await waitForText(FormsScreen.inputResult, '')
expect(await FormsScreen.inputResult.getText()).to.equal('')
```

Use imports and `beforeEach` from the
[existing Forms spec](../../test/specs/app.forms.spec.ts). Run with
`npm run test:forms`. Temporarily omit the clear action, confirm failure, then
restore it. That experiment requires a device; a code review alone is not a pass.

**Follow-up:** does the empty Login field expose placeholder text through
`getText()` on this Android build? Explain why Forms' echo oracle is different.

</details>

## D2 · Code one helper, then test a plausible mistake

**30–45 minutes. Prerequisites: lessons 02–03.**

Choose one:

| Task | Run | Explain after coding |
|---|---|---|
| [Parallel planning](../../exercises/07-session-plan/README.md) | `npm run practice -- 07` | Why this does not reserve a free port |
| [Fixture cleanup](../../exercises/08-fixture-cleanup/README.md) | `npm run practice -- 08` | How two errors survive without losing the primary failure |
| [Run summary](../../exercises/09-run-summary/README.md) | `npm run practice -- 09` | Why zero execution has no pass rate |
| [API contract](../../exercises/10-api-contract/README.md) | `npm run practice -- 10` | Why resolved HTTP and valid business data are different |

**Acceptance:** contract met, an extra edge case, readable types, input ownership
preserved, and a short complexity explanation. Predict at least one test result
before running it. Do not edit the reference to grade your starter.

<details><summary>Review guide</summary>

A candidate should clarify ambiguity before coding, use examples to verify the
contract and name a production limitation. Start with straightforward loops or
mapping rather than clever abstractions. Reference implementations and contract
tests are beside each starter; the reference suite can be run independently with
`npm run practice:solutions`.

</details>

## D3 · SQL: find accounts without a paid order

**15–20 minutes. Mode: self-contained SQL reasoning; optional local SQLite.**

The following is a fictional **training database**, not this demo app's schema.
Create it only in a disposable local database if you want to execute the query.

```sql
CREATE TABLE accounts (id INTEGER PRIMARY KEY, email TEXT NOT NULL);
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    amount_cents INTEGER NOT NULL
);
INSERT INTO accounts VALUES
    (1, 'a@example.test'), (2, 'b@example.test'), (3, 'c@example.test');
INSERT INTO orders VALUES
    (101, 1, 'paid', 1200),
    (102, 1, 'paid', 800),
    (103, 2, 'failed', 500);
```

Write a query returning **every account**, paid-order count and paid total:

| account_id | paid_count | paid_cents |
|---|---:|---:|
| 1 | 2 | 2000 |
| 2 | 0 | 0 |
| 3 | 0 | 0 |

Then identify accounts with no paid orders. Explain why `COUNT(*)` and a
right-hand status predicate in `WHERE` can produce wrong results here.

<details><summary>Reference answer</summary>

```sql
SELECT a.id AS account_id,
       COUNT(o.id) AS paid_count,
       COALESCE(SUM(o.amount_cents), 0) AS paid_cents
FROM accounts AS a
LEFT JOIN orders AS o
  ON o.account_id = a.id AND o.status = 'paid'
GROUP BY a.id
ORDER BY a.id;
```

For the second question, insert `HAVING COUNT(o.id) = 0` after `GROUP BY a.id`.
The IDs are **2 and 3**. Keep integer cents to avoid accidental decimal rounding.
The left join preserves accounts without matching paid rows; counting the
non-null order ID gives zero. `COUNT(*)` would count the preserved joined row.
Filtering `o.status` in `WHERE` would remove unmatched accounts.

**Follow-up:** if the UI shows a paid order but this query does not, investigate
environment, account/order identity, API/cache state and replication lag before
claiming a defect. SQL evidence does not prove UI rendering or authorization.

</details>

## D4 · Review a pull request and plan a safe repair

**20 minutes. Prerequisites: lesson 13. Design exercise; no remote write needed.**

A proposed PR:

- raises `maxInstances` from 1 to 6 without changing devices or fixtures;
- adds `driver.pause(5000)` before every assertion;
- adds an actual access key to YAML;
- deletes a failing assertion;
- shows green CI, but the device job is skipped.

Write review comments explaining impact, requested change and verification for
each. Then describe how you would branch, inspect a diff, run narrow checks,
resolve a selector conflict and handle a bad change that has already been shared.

**Acceptance:** all five findings addressed; no secret copied into the review;
distinction between unshared edits and shared history; CI evidence tied to a
commit; resolution checked against the current app hierarchy.

<details><summary>Review guide</summary>

Block the exposed key and arrange revocation/replacement through the account
owner; deleting it from the latest file alone does not invalidate it. Restore
meaningful assertions, replace guessed sleeps with observed conditions, and
design resource isolation before adding concurrency. Report the skipped device
job as not run.

For your own work, inspect `git status`, `git diff --stat`, and the relevant file
diffs; avoid sweeping resets over other changes. A revert commit is often a
reviewable way to undo a shared change. Resolve a selector conflict by inspection
and tests, not automatically choosing “ours” or “theirs.”

**Follow-up:** which checks can run without cloud credentials, and why should
untrusted forked code not receive those credentials?

</details>

## D5 · Design the first useful version of a framework

**30 minutes. Prerequisites: lessons 12–15.**

Fictional team: four engineers, Android and iOS app builds, a staging API, two cloud
slots, twenty proposed scenarios and a target of feedback within fifteen minutes.
Existing data says three user journeys cause most release incidents.

Ask five clarifying questions, sketch the execution/data flow, and propose:
one vertical slice; smoke/regression tiers; configuration and platform boundaries;
fixture setup/cleanup; diagnostics; ownership; and a device matrix.

**Acceptance:** explicit assumptions, no promise of a fifteen-minute run without
measurements, an execution budget including setup/queue time, a strategy for
missing test seams, and a maintenance plan.

<details><summary>Review guide</summary>

Prioritize the incident-prone journeys and representative devices first. Measure
one real slice and use its timings to plan the matrix. Put many validation
branches at lower layers where practical. Share scenario intent while isolating
platform-specific selectors and behavior. Keep artifacts and fixture ownership
unique per run/session; preserve failures and distinguish unrun coverage.

**Follow-up:** the API team cannot provide reset/setup support this month. Revise
the plan, identify residual risks, and decide which tests must remain serial.

</details>

## D6 · Tell a truthful engineering story

**15 minutes. Prerequisites: one recorded investigation.**

Choose an actual training failure you injected or encountered. Prepare a
two-minute explanation: context, responsibility, first observation, hypotheses,
one discriminating experiment, repair, verification and remaining limit.
Then answer: “A developer says this is only an automation problem. What next?”

**Acceptance:** distinguish observations from assumptions, show your personal
contribution, include an actual result, and label training work as training.

<details><summary>Review guide</summary>

Compare the current requirement and reproducible evidence together. If the test
is wrong, repair it and retain a regression check; if the app is wrong, provide a
minimal report. If the requirement is unclear, record the decision and owner
before automating the expectation. Describe what you learned without inventing
customer impact or blaming a person.

</details>

## D7 · Investigate a failure from a supplied timeline

**20 minutes. Prerequisites: lessons 01 and 10. No device required for analysis.**

All evidence below is synthetic and belongs to the same run:

```text
09:00:00 runner: expected app versionCode 108; artifact build-A
09:00:03 installer: existing package versionCode 107; installation failed
09:00:04 setup: installation error caught and ignored
09:00:07 session: UiAutomator2 session created
09:00:08 foreground: com.android.permissioncontroller
09:00:23 test: Login selector not found
09:00:24 evidence: screenshot saved showing a permission dialog
```

Write the first useful failure, three facts versus inferences, two targeted next
checks and a fix-verification plan. Explain why the screenshot alone is
insufficient. Add read-only commands you would run on a selected test device.

<details><summary>Reference answer and acceptance criteria</summary>

The earliest actionable failure is installation, followed by setup incorrectly
continuing. The trace establishes neither the intended build nor the Login
screen. Do not rewrite the locator yet.

Useful read-only examples, replacing the sample serial/package with observed
values:

```bash
adb devices -l
adb -s emulator-5554 shell dumpsys package com.example.training
adb -s emulator-5554 shell dumpsys activity activities
adb -s emulator-5554 logcat -d -t 300
```

Inspect version/package, foreground state and bounded logs; redact unrelated
data. Repair installation/setup handling, verify the intended build and dialog
state, then rerun the narrow test. Do not clear evidence as the first action.
Full credit needs an original-error explanation, a meaningful observation and
a verification tied to the expected artifact.

</details>

## D8 · Separate HTTP, payload and business failures

**25–40 minutes. Prerequisites: TypeScript narrowing and async functions.**

Implement [lab 10](../../exercises/10-api-contract/README.md). Then classify these
synthetic outcomes for a request for order `o-7`:

| Response | What can the test claim? |
|---|---|
| 200, `{"id":"o-7","state":"confirmed","totalCents":2400}` | ? |
| 200, `{"id":"o-8","state":"confirmed","totalCents":2400}` | ? |
| 200, HTML instead of JSON | ? |
| 401 | ? |
| 403 | ? |
| 429 | ? |
| Transport rejects before any response | ? |

<details><summary>Reference answer and acceptance criteria</summary>

Under the lab contract, the first response is valid data for `o-7`; it still does
not prove the UI rendered it. The next two are contract failures. The status cases
map to unauthenticated, forbidden and throttled outcomes. A transport error
propagates as a transport failure; it is not an HTTP status.

Require exact identity, supported state and a nonnegative integer amount.
Do not automatically retry or log raw bodies. A valid `pending` order is also
different from a confirmed one: the caller decides its expected business state.
The exercise's tests use a loopback HTTP server and fake responses, not a live
company backend or BrowserStack.

</details>

## D9 · Design tests from a small checkout requirement

**25 minutes. Mode: written exercise with supplied requirements.**

Fictional contract: each item costs **1200 cents**; quantity is an integer **1–5**.
Coupon `SAVE10` gives 10% off the item subtotal when it is at least **2400 cents**.
Delivery is **300 cents** when the discounted subtotal is below **3000 cents**;
otherwise it is free. No tax. Duplicate taps must create one order.

Produce six high-value cases, a decision table, the best layer for each assertion
and two questions that would matter if requirements changed. Calculate exact
totals for quantities 1, 2, 3 with the coupon.

<details><summary>Reference answer and acceptance criteria</summary>

Totals are **1500**, **2460**, **3240** cents respectively. At quantity 1 the
coupon threshold is not met; quantity 2 discounts 2400 to 2160 plus 300;
quantity 3 discounts 3600 to 3240 and delivery is free.

A useful set includes quantity 0/1 and 5/6 boundaries, invalid fractional quantity,
coupon threshold, delivery threshold, coupon absent/invalid and duplicate taps.
Six cases may be data rows or a carefully chosen subset: explain omissions.
The current fixed price cannot reach every exact threshold value, so ask for a
lower-level pricing test seam rather than inventing a UI product.

Keep arithmetic/boundary coverage mostly below UI, with selected basket-to-order
journeys asserting the same amount and identity on client and server. Clarify
rounding for future prices, coupon error behavior and how duplicates are
identified. Do not infer payment authorization from a confirmation label.

</details>

## D10 · Hand over an incomplete but reviewable work item

**20 minutes. Mode: work simulation.**

Synthetic task status: four planned checks; two passed locally, one failed because
the wrong app artifact was installed, one cloud check is blocked by missing
account access. A reviewer asks, “Can we call it done?”

Write a PR summary, defect/update note and next-day handover. Include exact scope,
evidence placeholders that must be replaced by real run references, owner and
next action. Explain which work can proceed while cloud access is unavailable.

<details><summary>Reference answer and acceptance criteria</summary>

Do not report “50% quality” or convert the blocked check into a pass. The setup
failure requires investigation before claiming that scenario passed or failed
in the product. Independent type checks, fixture/helper checks, requirements
review and preparation of a narrow cloud run can continue.

A useful update says what changed, which checks actually ran, what failed at
which layer, what is blocked and who can unblock it. Show a reproducible command,
record the intended build and request the missing account access without putting
credentials in the issue. A handover is complete when another person can resume
without reconstructing your chat history.

</details>

[Question bank and scoring](interview-practice.md) · [Workplace cases](workplace-scenarios.md) · [Study plans](study-plans.md)
