# 04 · Model answers: first test

## 04-A · A second destination

Add this import to your practice file:

```ts
import LoginScreen from '../screens/LoginScreen.js'
```

Add this `it` inside the existing `describe`, alongside the Forms test:

```ts
it('should open Login from the tab bar', async () => {
    await TabBar.openLogin()
    await LoginScreen.waitForIsShown()

    await LoginScreen.email.waitForDisplayed()
    await LoginScreen.password.waitForDisplayed()
    expect(await LoginScreen.email.isDisplayed()).to.be.true
    expect(await LoginScreen.password.isDisplayed()).to.be.true
})
```

The extra field waits make the assertion's timing explicit. Waiting for the screen marker alone may be sufficient for this demo, but does not universally guarantee every child element is rendered.

The shared `beforeEach` already calls `restartDemoApp()`. Do not put one test inside another or open Login before the Forms test in order to “prepare” the suite. Each test should establish its own required starting state.

The supplied smoke spec also now imports and calls `restartDemoApp()` in its own `beforeEach`. A new test does not inherit setup from another spec file; the practice file explicitly declares its own hook.

**Common pitfalls:** Forgetting the import; naming the test so the suggested grep selects nothing; reading an element's presence as proof that submitting the form works.

## 04-B · A controlled failure

The intentional broken line is:

```ts
expect(await FormsScreen.input.isDisplayed()).to.be.false
```

With the Forms input visible, the actual boolean is `true`, so Chai should reject the expectation. A useful journal entry:

```text
Change: require the visible Forms input to be false.
Prediction: fail because the destination input is displayed.
Observation: assertion expected true to be false.
Evidence: failure at the changed assertion; screenshot shows Forms.
Repair: restore .to.be.true; same isolated test passes.
```

Use your actual report wording and file path. Failure screenshots depend on the session still being healthy enough to capture one; absence of a screenshot does not invalidate the assertion failure.

This experiment demonstrates that the check is executed and can reject a wrong observation. It is a small manual form of mutation testing.

**Common pitfalls:** Changing `.to.be.false` and skipping the test; returning early before the assertion; catching the error and continuing normally.

## 04-C · Smoke selection

Example title:

```ts
it('should open Forms from the tab bar @smoke', async () => {
    // Existing body remains here.
})
```

Put the tag on the test if you want only that test selected. Putting it on `describe('My navigation practice @smoke', ...)` makes both test titles match the filter.

One defensible rationale:

> The launch smoke checks that navigation is present. The Forms navigation smoke adds evidence that the app can open a second screen and render an input. It still does not prove typing, clearing, or every navigation route. I will retain it only if that route is important to deciding whether a larger suite can run.

Removing it as redundant is also defensible if you explain the cost and overlap. Good suite design is selective.

Check the reporter's executed names. A misspelled `grep` pattern that selects no cases is not a successful test of the feature. The explicit `--spec` command restricts this exercise to the practice file; the project-wide `test:smoke` command can select tagged tests in other specs too.

**Common pitfalls:** Assuming a tag changes device capabilities; claiming a green smoke suite proves a release is bug-free; placing every test in smoke until the fast signal is lost.

## Checkpoint answers

- The `beforeEach` body runs before every test in its enclosing suite.
- Tests may inherit changed input, switch, navigation, alert, or stored state. Explicit setup and isolated runs reveal dependencies.
- A controlled wrong expectation verifies that the assertion is reached and helps you learn the failure report before a real issue occurs.

[Back to lesson](../lessons/04-first-test.md) · [Next lesson](../lessons/05-selectors.md)
