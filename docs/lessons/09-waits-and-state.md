# 09 · Reliable waits and independent state

**Stage:** Build a maintainable suite\
**Estimated time:** 90–120 minutes\
**Prerequisites:** Lessons through 08; Forms and Login run locally.\
**Outcome:** Wait for meaningful conditions, establish initial state, and expose order-dependent tests.

## The two clocks in a mobile test

Your test sends a command; the app handles the input and updates its UI. Completion of the command does not always establish that every dependent label has rendered. A fixed sleep guesses at this delay. A condition wait observes the actual state.

There are also two different assertion systems in many WebdriverIO examples. This repository explicitly imports `expect` from **Chai**. A Chai equality assertion checks the value you give it once. It does not turn `getText()` into a polling operation. Do not copy a WebdriverIO matcher such as `toHaveText` into a Chai assertion.

## Worked example: wait for an echo

This expands the `waitForText` pattern used by the Forms specs:

```ts
await FormsScreen.input.setValue('Reliable input')

await driver.waitUntil(
    async () =>
        (await FormsScreen.inputResult.getText()) === 'Reliable input',
    {
        timeout: 5000,
        interval: 200,
        timeoutMsg: 'Forms result did not echo the entered text',
    },
)

expect(await FormsScreen.inputResult.getText()).to.equal('Reliable input')
```

The condition is observational. It reads state repeatedly. Putting `click()` inside it would repeatedly mutate the application; a switch might change back and forth until an accidental pass.

The wait describes readiness. The assertion describes the expectation. A helper that combines the two is reasonable, provided its name and error clearly explain the behavior.

### Choose the timeout that belongs to the failure

Read these values in the actual configs rather than changing all of them together:

| Setting in this project | What it bounds | What it does not repair |
|---|---|---|
| `waitforTimeout: 15000` | Default duration of explicit WebdriverIO waits used here | Wrong selector or impossible expected text |
| `mochaOpts.timeout: 3 * 60 * 1000` | Overall execution allowance for a Mocha test/hook | A missing state-specific wait |
| `connectionRetryTimeout: 120000` | WebdriverIO request/connection allowance | The app's business behavior |
| `appium:newCommandTimeout: 240` | Seconds Appium tolerates between client commands before expiring a session | Time an individual assertion should poll |

`connectionRetryCount` is transport-level retry behavior; `mochaOpts.retries: 0` disables whole-test retries. These are different mechanisms. A later passing retry does not invalidate the first failure.

## Reset is a contract

Opening a tab is navigation, not proof of a clean screen. A switch can remain on; a text field can retain text; a dialog can obscure the next action. Decide what a test owns:

| State | Establish it by |
|---|---|
| Correct screen | Navigate, then wait for its root |
| Empty input | Explicit clear, then verify the result |
| Switch off | Read its state, change only if necessary, verify |
| No blocking dialog | Finish the preceding scenario's dialog handling; fail clearly if unexpected |
| Fresh application data | Use a documented reset strategy only when the scenario needs one |

`noReset` is not a magic speed switch. Preserving app data changes the starting-state contract. A process restart alone may preserve data. Do not reset the entire device to repair an ordinary text-field test.

The local config sets `appium:noReset: false` for **session startup**. It does not create a new session before every `it`. Within a file, this repository calls `restartDemoApp()` in `beforeEach`, which terminates and activates the demo process. That is why session reset, test setup, and persistent data must be discussed separately.

Both local and cloud configs also set `appium:autoGrantPermissions: true`. That simplifies ordinary demo interactions but is not permission-dialog coverage. Likewise, restarting before each test does not prove that an in-progress form survives an interruption. Read [permissions and lifecycle state](../handbook/mobile-state.md) before designing those scenarios.

## Guided lab

1. Read `test/screens/FormsScreen.ts`, `test/helpers/restartApp.ts`, and the Forms `beforeEach`. Identify where navigation and initial state are established. The screen currently exposes element getters; the test setup restarts the demo.
2. Run `npm run test:forms`.
3. Read `test/helpers/waitForText.ts`, already used in the baseline. In one practice test, write the explicit wait above to understand the helper's behavior. Restore use of the helper after the experiment if it is clearer.
4. Temporarily use an impossible expected echo. Run `npm run test:forms`. Confirm a useful timeout message appears; restore it.
5. Run the clear-input case alone:

   ```bash
   npx wdio run config/wdio.android.conf.ts --spec test/specs/app.forms.spec.ts --mochaOpts.grep "clear"
   npm run test:forms
   npm run typecheck
   ```

The filtered case and full file should agree. Neither result alone proves independence under every ordering.

## Exercises

### 09-A · A switch setter with a postcondition

Implement or extend `FormsScreen.setSwitch(enabled: boolean)`. Read the Android `checked` attribute, tap only if it differs, and wait for the expected state. Use it to establish “off” before a toggle test.

**Acceptance:** calling the method twice with `false` leaves the switch off; calling twice with `true` leaves it on; unexpected or missing state attributes cause a useful failure; no fixed sleeps.

<details><summary>Hint 1 · A setter is different from a toggle</summary>
Two toggles undo each other. Two calls to a setter should have the same result as one.
</details>
<details><summary>Hint 2 · Android state values</summary>
Inspect `getAttribute('checked')`; the normal Android UI hierarchy represents it as the string `"true"` or `"false"`. Validate that assumption.
</details>

### 09-B · Prove the clear test starts populated

Ensure the clear test verifies a nonempty echo before clearing, then waits for `''`. Temporarily remove the clear action to check that the test fails. Restore the action.

**Acceptance:** the deliberate defect fails on the empty-result condition; the restored test passes alone and in the Forms file; record both runs.

<details><summary>Hint 1 · Avoid a vacuous pass</summary>
An already empty label can satisfy an empty assertion even if the intended action never happened.
</details>
<details><summary>Hint 2 · Two state transitions</summary>
Wait for `text → populated`, then perform `clear → empty`. Keep both checkpoints.
</details>

### 09-C · Find an order dependency

Create two temporary cases: the first turns the switch on, and the second expects off. Demonstrate the failure without setup, then add state establishment and run them in both orders. Remove the temporary examples after recording the lesson.

The baseline restarts the demo before each test. Temporarily suppress that restart only for this controlled experiment, preserving the original code so you can restore it afterward; otherwise it correctly prevents the dependency you are trying to demonstrate.

**Acceptance:** a before/after evidence note, setup that reads rather than blindly toggles, no test retry used as the fix.

<details><summary>Hint 1 · Failure needs a shared session</summary>
Place both cases in the same Forms `describe`. Separate worker sessions can hide the dependency.
</details>
<details><summary>Hint 2 · Own the initial condition</summary>
The second case must arrange off itself or receive that guarantee from `beforeEach`.
</details>

## Workplace extension

Investigate keyboard, permission and lifecycle cases RW-01–RW-03 in the
[scenario workbook](../handbook/workplace-scenarios.md). Practise explaining
stale elements, implicit/explicit waits and reset boundaries with Q06–Q08 and Q15
in [interview practice](../handbook/interview-practice.md).

For an order dependency outside the app process, repair
[lab 11's nested fixture leak](../../exercises/11-fixture-isolation/README.md).
For a mutating retry that appears to succeed, try
[lab 12's lost-response recovery](../../exercises/12-uncertain-submit/README.md).
Explain why neither is repaired by restarting the Android app.

Repair a cached element lifetime in
[lab 13](../../exercises/13-stale-observation/README.md), then transfer the
observation discipline to one [small device practice task](../handbook/device-practice.md).
The offline fake does not reproduce every client/driver stale-element behavior.

## Checkpoint

- What is the difference between waiting for existence and waiting for correct text?
- Why should a polling function avoid side effects?
- Which state survives merely navigating away and back?
- Can retries make a deterministic state dependency appear to disappear?
- Why does an automatically granted permission leave the deny/recovery flow untested?

Reference: [WebdriverIO waitUntil](https://webdriver.io/docs/api/browser/waitUntil) and [Mocha hooks](https://mochajs.org/features/hooks/).

[Solutions](../solutions/09-waits-and-state.md) · [Next: debugging](10-debugging.md) · [Course index](../README.md)
