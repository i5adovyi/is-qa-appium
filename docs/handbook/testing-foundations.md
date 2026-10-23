# Testing foundations for team conversations

**Prerequisites:** read lesson 00's app description and understand expected versus
actual results from the [first test workbook](first-test-workbook.md).
**Mode:** three written exercises, roughly 15–25 minutes each; no Node, Android,
cloud account or company system required. Take one exercise per session.

Your aim is to describe what a check covers, why it exists and what evidence is
still missing. Teams use some labels differently, so describe the actual boundary
before debating the name. These exercises have no automatic grade or new progress
IDs; save F1–F3 in lesson 00's notes or your private notebook.

## Scope and purpose answer different questions

Scope describes the parts exercised together. Purpose explains why you selected
the check. A mobile UI test can belong to both a small smoke selection and a
larger regression selection.

| Scope or interface | Useful description | Example in or beyond this project |
|---|---|---|
| Unit or component | Check a small named function/module with controlled dependencies; state what “component” includes | Validate one offline helper's return value |
| Integration | Check a boundary between collaborating parts | Reader client and local progress HTTP/storage behavior |
| API | Exercise a programmatic interface; say whether the service is real or replaced | Validate an HTTP response's status, identity and fields |
| UI | Act through the interface and observe visible behavior | Enter text in Forms and verify the result |
| End-to-end | Cover an explicitly named journey across its required parts | A work app creates an order and its real test backend records that order |

“API” names an interface, not a universal test level. A UI test with a replaced
backend has a different boundary from the same flow with a real backend.
The [Android testing fundamentals](https://developer.android.com/training/testing/fundamentals)
distinguish subject, scope and execution location. Android's native testing
examples use different tools; they are not commands for this Appium project.

| Purpose | Question it helps answer | Limit |
|---|---|---|
| Smoke | Can this build perform a small set of essential operations? | The selected checks cannot establish all behavior |
| Regression | Did an existing behavior change unexpectedly? | Coverage is limited to the selected assertions and environments |
| Retest / confirmation | Does the specific previously failing case now satisfy its requirement? | A repaired case does not by itself establish wider regression safety |
| Exploration | What risks, questions or surprising behaviors emerge as I investigate? | An observation needs an oracle before being called a defect |

Start with a risk and choose the smallest boundary that can answer it. Many input
rules can be checked below the UI when the app exposes that seam; keep selected
UI journeys for wiring and device interaction. There is no useful fixed test-count
ratio for every team. This repository supplies a packaged app, not its production
service or all app source, so some lower-level product checks remain designs.

## What a test double changes

A **test double** replaces a dependency during a test. A **stub** supplies chosen
responses; a **fake** implements a simplified behavior; a **spy** records calls;
a **mock** checks expected interactions. Libraries sometimes call all these
“mocks.” State the replacement and its behavior. See
[Martin Fowler's test-double vocabulary](https://martinfowler.com/bliki/TestDouble.html).

A fake device can help verify that your helper reacquires an element or stops
polling. It cannot establish that a real Android hierarchy, keyboard or driver
behaves the same way. A stubbed successful response cannot establish actual
authentication. In this demo, successful login is simulated inside the app.

## F1 · Name the check precisely

**Task:** for each fictional report, write the exercised boundary, its purpose,
one supported claim and one unsupported claim. Repair the quoted conclusion.

| Report | Claimed conclusion |
|---|---|
| A helper receives supplied HTTP responses; its identity checks pass | “The live order service works” |
| The Android Forms clear case passes as part of a three-case release smoke selection | “Smoke and UI are competing test levels” |
| After fixing a wrong expected message, the previously failing Login case passes | “All regression risk is gone” |
| A tester changes orientation and observes lost draft text; no retention requirement is known | “Confirmed product defect” |

**Acceptance:** all four rows distinguish what actually ran from the reason for
running it. No real-service claim comes from supplied responses; no all-device
claim comes from one Android result. Keep the fourth observation useful while
identifying the missing decision.

<details><summary>Hint</summary>

Ask “which parts were real?” separately from “why was this check selected?”
For the fourth row, what would make the observed loss correct or incorrect?

</details>

<details><summary>Review guidance</summary>

The first checks a helper against a response double; it establishes handling of
those examples, not service health. The second is UI scope used for smoke
purposes. The third confirms the repaired case; the relevant surrounding suite
still needs its own result. The fourth is an exploratory observation requiring
an agreed retention rule, repeatability and environment details before defect
classification. Calling it “needs product clarification” preserves evidence.

**Changed premise:** the first check now calls a real staging service. Name the
new environment/identity evidence you need and explain why UI rendering is still
unverified. You have changed the written scenario, not executed that service.

</details>

## F2 · Choose an oracle and a useful boundary

**Fictional work-app requirement:** a display name accepts 2–20 characters,
inclusive; count each supplied ASCII character, including spaces. Empty input is
rejected. The Save control must remain reachable while the keyboard is open.
This contract belongs to this exercise, not the demo app.

**Task:** propose four high-value checks. Include a length boundary, an accepted
value, a whitespace case and the keyboard interaction. For each, record input,
expected result, oracle, preferred test boundary and required environment.
Then choose one rule you would deliberately break to prove a check detects it.

You may propose lower-level app checks, but their source/API seam is only an
assumption here. Do not claim that writing a helper with the same rule tests the
packaged demo app's implementation.

**Acceptance:** expectations come from the supplied requirement; at least one
chosen check would catch your deliberate defect; the keyboard check requires a
real app/device observation; missing app access is recorded. Explain which
valuable boundary your four checks omit and how you would cover it later.

<details><summary>Hint</summary>

An accepted ordinary value can miss an off-by-one defect. Spaces count under
this exercise's contract; quietly trimming them changes the requirement.

</details>

<details><summary>Review guidance</summary>

One defensible set is one ASCII character rejected; two letters accepted; two
spaces accepted; and a two-letter name saved while the keyboard is open. The
first three suit a validation component if the app exposes it; a selected UI
check verifies wiring. The fourth needs an observed device flow and a known
save outcome, not just a visible button.

Changing minimum length from 2 to 3 should make the two-letter and two-space
checks fail. Changing the expected value to match that defect would hide it.
This small selection omits the upper edge: add 19/20/21 later if prioritised.
Other justified selections are valid. These are written predictions; no defect
has been injected into the existing app or learner code.

**Changed premise:** product now wants to reject names made only of spaces.
Identify the contract decision and affected expectation before changing a test.
This illustrates how a requirement change differs from weakening an assertion.

</details>

## F3 · Give the team an honest evidence update

**Synthetic packet:** helper tests using fake UI elements passed; one Forms
case passed on a named Android emulator/build; a BrowserStack session was never
created because account access is missing. A colleague writes: “All mobile tests
passed, ready for every supported device.”

**Task:** rewrite the update in four sentences: observed scope, remaining gap,
owner/next observation and what can proceed now. Leave placeholders for the
command, build/device and run evidence; this packet contains no actual run IDs.
Add the question you would ask before deciding whether the gap blocks a release.

**Acceptance:** preserve the offline and emulator results as distinct evidence,
record cloud as not run/blocked, name a concrete next action and avoid inventing
passing coverage or a release rule. The written communication can be complete
while device coverage remains pending.

<details><summary>Hint</summary>

“We need more testing” is less actionable than naming one missing environment,
the person who can supply access and the smallest test to run there.

</details>

<details><summary>Review guidance</summary>

A useful update names the helper contract and the one observed emulator case,
links their actual evidence when available, and states that cloud execution did
not occur. Assign access follow-up to the account owner, then a chosen smoke case
to the tester. Offline review and test preparation can continue. Ask which device
coverage the team's release criteria require and who owns that decision.
Do not silently turn a missing prerequisite into either a pass or a product failure.

**Changed premise:** cloud access arrives but the requested device is unavailable.
Explain the unresolved coverage and get an explicit device substitution decision;
an available device is not automatically equivalent to the required one.

</details>

## Carry the vocabulary into real work

After F1–F3, explain one of your own tests in this form: “We exercised ___ using
___, to investigate ___; the oracle was ___; it demonstrates ___ and leaves ___
unverified.” Use [lesson 14](../lessons/14-test-design.md) for a fuller risk plan
and the [interview question bank](interview-practice.md) Q33/Q37 for follow-ups.

[Choose a study session](study-session.md) · [Glossary](glossary.md) · [Evidence templates](templates.md)
