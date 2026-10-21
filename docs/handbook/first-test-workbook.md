# Your first test: from a rule to useful evidence

**Prerequisites:** read the orientation's app description; P1–P7 of
[programming first steps](programming-first-steps.md) for T2–T3.
**Execution:** T1 is written practice; T2–T3 are local Node/Chai programs; T4
needs the working Android setup. None requires BrowserStack.

## Testing starts with an expected behavior

A **requirement** says what should happen. A **test case** chooses a starting
state, inputs, actions and observable expected results. The **actual result**
comes from execution. An **assertion** makes a particular comparison fail when
it is wrong. A test **oracle** is the basis for choosing the expectation: an
agreed requirement, specification or independently calculated example.

If the rule is unclear, record the ambiguity before asserting one interpretation.
The current app behavior is useful evidence, but it is not automatically the
intended behavior. “It works” is less useful than a specific, repeatable claim.

### T1 · Write a manual case before coding

**Task:** use the demo Forms requirement: entered text appears in the result;
clearing the field clears that result. Fill this table with exact values.

| Part | Your decision |
|---|---|
| Starting state | Which screen, which input state? |
| Input | A nonempty fictional string |
| First action and observation | Enter it; what exact result should appear? |
| Second action and observation | Clear it; what exact result should appear? |
| Scope | What does this test demonstrate, and what remains untested? |

**Acceptance:** a second person could follow it. The check observes both the
populated and cleared states. It does not call one space “empty”. This written
exercise is a design, not an executed Android test.

<details><summary>Review guide</summary>

Use something like `Practice 7` and then `''`. Checking only the final empty
state could pass if no typing ever happened. This does not demonstrate
persistence after restart, a real login service or every possible character.
</details>

## Arrange, Act, Assert

**Arrange** establishes starting state and test data. **Act** performs the
behavior under test. **Assert** checks its result. These are reasoning steps,
not special syntax. A setup hook (`beforeEach`) arranges each mobile case;
`it(...)` names a case; `describe(...)` groups cases. Passing a callback to
Mocha lets the runner execute its body later.

In real mobile tests there is also synchronization: after acting, wait for the
relevant UI state, then assert it. Chai's equality check does not poll the app.
Lesson 03 explains that distinction after the simpler example below.

### T2 · Turn one rule into an assertion

Create a new file `test/learning-first-check.ts`, preserving any existing file
of that name. This is a **fictional local rule**, not the demo app's password rule:
an input length of at least three is accepted; whitespace counts as characters.

```ts
export {}
import { expect } from 'chai'

function acceptsLabel(input: string): boolean {
    return input.length >= 3
}

// Arrange: choose input and expectation from the written rule.
const input = 'ABC'
const expected = true
// Act: obtain the function's result.
const actual = acceptsLabel(input)
// Assert: compare independently chosen expectation with observation.
expect(actual).to.equal(expected)
console.log('The three-character boundary passed')
```

Run `npm run typecheck`, then `node test/learning-first-check.ts`.
`>=` means greater than or equal to. A boolean expectation needs no quotes.

**Task:** predict outcomes for lengths 0, 2, 3 and 4. Run one changed input at
a time, setting its expectation from the rule **before** calling the function.

**Acceptance:** include an accepted and a rejected input and the exact boundary.
A correctly rejected input is a **passing negative test**, not a broken test.

<details><summary>Hint / review</summary>

Expect false, false, true, true. A positive case uses input intended to be
accepted; a negative case checks expected rejection. Both should pass when
the implementation follows the rule. Do not use `acceptsLabel(input)` to
calculate `expected`: that asks the implementation to check itself.
</details>

### T3 · Prove the check can catch a mistake

**Task:** restore input `'ABC'` and expected `true`. Change only the function's
operator from `>= 3` to `> 3`. Run the file and find the assertion failure.
Restore the operator and rerun. Keep the expectation based on the requirement.

**Acceptance:** record a pass, the controlled failure, and the repaired pass.
Explain why changing `expected` to false would conceal the deliberate defect.
The requirement is satisfied again before you move on.

<details><summary>Hint / review</summary>

The broken version rejects exactly three characters; a four-character case
would miss this defect. This is a small boundary/mutation experiment. It does
not prove all future implementations correct or establish mobile coverage.
</details>

## Read a failure without reading the whole stack

An assertion can report a message like `expected false to equal true` plus a
location such as `test/learning-first-check.ts:12:16`. Actual was false;
expected was true. File, line and column help locate the assertion, not
necessarily the cause. Inspect the input and the calculation that produced it.
Exact line numbers and formatting vary with your saved file and Node version.

| Outcome | What it means | Next move |
|---|---|---|
| Syntax/type error | The code could not be parsed or passed static checking | Inspect the indicated location and its neighboring line |
| Expected starter error | The grader reached an unfinished implementation | Implement the written contract in the intended file |
| Assertion mismatch | Code ran; this observation differed from the expectation | Inspect both the rule and calculation/state |
| Mobile session failed before the case | Required execution environment was unavailable | Diagnose setup; the UI requirement is untested |
| Zero tests selected / skipped | No execution evidence for that selection | Check the command/filter and result counts |
| All selected checks pass | Those assertions passed in that environment | Report the actual scope; do not generalize to the whole app |

Immediately after a command, macOS/Linux `echo $?` or PowerShell
`$LASTEXITCODE` shows its exit code (PowerShell example applies to native
commands such as Node/npm). Zero normally means successful execution. A script
that only prints text can exit zero without checking any behavior.

### T4 · Connect the local lesson to a device observation

**Prerequisites:** Android setup complete, preflight passing, demo APK present.
**Task:** manually follow T1 in the emulator. Record what you actually saw.
Then read the existing clear-input case in
[app.forms.spec.ts](../../test/specs/app.forms.spec.ts) and run only that case:

```bash
npm run test:forms -- --mochaOpts.grep "should clear the result when the input is cleared"
```

`--mochaOpts.grep` selects a matching test title; this is one case, not the whole
Forms suite. Locate its setup, nonempty action, first observation, clear action,
wait and final assertion. Do not delete the existing test to reconstruct it.

**Acceptance:** record the command, selected/passed case count, device identity
and the two observed states. If a prerequisite is missing, record “not run”
and continue offline. A written plan or local string assignment is not a device pass.

<details><summary>Review guide</summary>

The test starts from a restarted demo app, opens Forms, waits for readiness,
enters nonempty text, observes it, clears input, waits for empty output and
asserts it. It checks the result field; it does not independently read the
editable control's internal value or prove persistence across relaunches.
</details>

## A first useful bug report

Suppose a future app build retains text after clearing. Do not report the
following invented example as a defect in today's app. Use it as a template:

> Title: Forms result retains previous text after input is cleared.
> Environment: app build, Android version and device recorded here.
> Steps: open Forms from the documented state, enter `Practice 7`, confirm
> the result, clear input.
> Expected: result contains zero characters.
> Actual: record the exact observed text and how often you reproduced it.
> Evidence: relevant screenshot/log location, with private data removed.
> Scope: record manual and automated results separately; cause is not yet known.

App bugs, incorrect test expectations, stale state and environment problems
need different fixes. Test failures are the start of an investigation, not
automatic proof that the app is defective. Lesson 10 expands this process.

[Next: first lab coach](first-lab-coach.md) · [Lesson 03](../lessons/03-async-and-assertions.md) · [Forms walkthrough](../lessons/06-forms.md)
