# 06 · Forms: test a transition, not a screenshot

**Stage:** First device tests · **Estimated time:** 90–120 minutes · **Device needed:** Android emulator

**Prerequisites:** [Lesson 05](05-selectors.md), a passing `npm run test:forms`, and an understanding of condition waits.

**By the end you will be able to:**

- Explain every part of the supplied Forms spec.
- Test entering, replacing, clearing, and re-entering text.
- Recognize a false positive caused by checking only an already-empty state.
- Keep switch tests independent of previous runs.

## The requirement before the code

The Forms screen echoes input into a separate result element. Our test claims that the result follows the user's input, including its transition back to an empty string. It does not claim that the value is saved to a server or survives an app restart.

These are distinct state transitions:

```text
empty → "Hello Appium" → empty → "Start again"
```

A final empty result alone cannot tell you whether the first transition ever happened.

## Read the supplied spec

Open [app.forms.spec.ts](../../test/specs/app.forms.spec.ts).

| Statement | Why it exists |
|---|---|
| `import { expect } from 'chai'` | Adds the assertion function used in the tests |
| `import TabBar ...` | Supplies bottom-navigation actions |
| `import FormsScreen ...` | Supplies Forms elements and screen readiness |
| `import { restartDemoApp } ...` | Supplies this demo's process restart |
| `import { waitForText } ...` | Supplies polling for changing labels |
| `describe('Forms screen', () => {` | Groups the three reference scenarios |
| `beforeEach(async () => {` | Defines setup before each scenario |
| `await restartDemoApp()` | Restarts the demo and waits for navigation |
| `await TabBar.openForms()` | Taps the Forms tab |
| `await FormsScreen.waitForIsShown()` | Waits for `~Forms-screen` to be displayed |
| `})` | Ends the setup hook |

`beforeEach` does not inherently reset anything. Here it calls a restart helper, which resets this demo's in-memory form state. Storage and permissions remain a separate concern.

The first scenario:

```ts
it('should echo typed text in the result field', async () => {
    const text = 'Hello Appium'
    await FormsScreen.input.setValue(text)

    await waitForText(FormsScreen.inputResult, text)
    expect(await FormsScreen.inputResult.getText()).to.equal(text)
})
```

1. `it` registers a scenario and gives the report a readable name.
2. `const text` defines the input and expected echo.
3. `setValue` enters it in the input.
4. `waitForText` polls the separate result until it matches.
5. Chai reads the result again and checks exact equality.
6. `})` closes the function and the `it` call.

The second scenario checks the switch's label, taps the switch, then waits for and checks the changed label. “Click to turn the switch ON” describes the **next action**, so it indicates the current state is off. “Click to turn the switch OFF” indicates it is on.

The third scenario adds this transition after proving the entered text appeared:

```ts
await FormsScreen.input.clearValue()
await waitForText(FormsScreen.inputResult, '')
expect(await FormsScreen.inputResult.getText()).to.equal('')
```

`clearValue()` clears the editable element. The test then observes the separate result. It does not assume that clearing one control automatically updates every dependent label. [WebdriverIO `clearValue`](https://webdriver.io/docs/api/element/clearValue/).

## Guided lab: rebuild the clear scenario

Read the supplied clear test once. In your journal, write its six operations from memory:

1. Choose nonempty input.
2. Enter input.
3. Wait for and assert the populated result.
4. Clear the input.
5. Wait for the empty result.
6. Assert exact emptiness.

Now compare your sequence with the source. Run only that reference scenario:

```bash
npm run typecheck
npm run test:forms -- --mochaOpts.grep "clear the result"
```

Change its data to `My own test`, keeping the expected value linked to the variable. Run again. This is an intentional modification of an existing example, not a new claim that a test was written from scratch.

For the following exercises, add new `it` blocks inside the existing Forms `describe`. They inherit its setup and imports. Add one at a time and use a distinctive title to select it.

## Exercises

### 06-A · Replace, do not concatenate

Add a test titled `should replace the previous input`. Enter `First value`, verify the echo, then use `setValue('Second value')` and verify that the result is exactly `Second value`.

State which wrong outcomes the second assertion rejects.

```bash
npm run test:forms -- --mochaOpts.grep "replace the previous input"
```

<details><summary>Hint</summary>

Use the same wait-then-assert pattern for both transitions. `setValue` replaces input; `addValue` has different intent. [Command reference](https://webdriver.io/docs/api/element/setValue/).
</details>

**Acceptance:** Both intermediate and final text are checked; an appended or stale result would fail.

### 06-B · Clear twice, then recover

Add a test titled `should accept new input after clearing twice`. Enter and verify `Before clearing`. Clear and verify empty. Clear again and verify empty. Finally enter `After clearing` and verify that exact result.

Explain why this covers more than the supplied clear test.

<details><summary>Hint</summary>

The second clear tests an already-empty state; the final input checks continued usability. Do not omit the first populated assertion.
</details>

**Acceptance:** Four observable states are verified, the test passes alone, and no fixed sleep is added.

### 06-C · Complete a switch cycle

Add a test titled `should turn the switch on and off`. Verify the initial instruction, tap and verify the opposite instruction, tap again and verify the original instruction.

Run it alone and with the whole Forms file:

```bash
npm run test:forms -- --mochaOpts.grep "turn the switch on and off"
npm run test:forms
```

<details><summary>Hint</summary>

The setup restarts the demo before the test. Do not assume another test has already switched it on. Wait for the changed instruction after each tap.
</details>

**Acceptance:** All three label states are checked; isolated and combined runs pass. State the limitation that these assertions observe the instruction label rather than independently checking every switch attribute.

## Checkpoint

- Why assert the nonempty result before clearing?
- Why is `''` different from `' '`?
- Why can restarting a real application fail to clear its stored login session?
- What would a result of `First valueSecond value` tell you in exercise 06-A?

**Evidence to retain:** One controlled single-test run, the three added scenarios, and a full Forms run. Document failures you investigated instead of repeatedly rerunning until green.

[Model answers](../solutions/06-forms.md) · [Next: 07 · Login](07-login.md)
