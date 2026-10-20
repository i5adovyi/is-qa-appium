# 00 · Model answers: orientation

Attempt the [lesson](../lessons/00-orientation.md) before reading these. Your wording can differ; the important part is the reasoning.

## 00-A · Trace one command

In `TabBar.ts`:

```ts
get login() { return $('~Login') }

async openLogin() {
    await this.login.click()
}
```

`TabBar.openLogin()` calls the method on the exported `TabBar` instance. `this.login` invokes the getter, which describes an element lookup using the accessibility ID `Login`. The click goes through WebdriverIO and Appium to Android. `await` waits for the asynchronous click command to complete.

Completion of a click is not proof that the destination screen has finished rendering. The spec follows navigation with `LoginScreen.waitForIsShown()`, which checks the destination screen.

The submit button is a separate selector, `~button-LOGIN`, in `LoginScreen.ts`. Confusing these controls produces a test that keeps opening the tab while never submitting the form.

**Common pitfalls:** Calling `openLogin()` “the login operation”; saying `await` waits a fixed number of seconds; assuming a successful click proves the intended business outcome.

## 00-B · Diagnose the responsible layer

| Observation | First investigation | Evidence or action |
|---|---|---|
| Property does not exist | Test code and screen object interface | Read the compiler's file/line, compare the property spelling with the getter, run `npm run typecheck` again |
| No Android device | Emulator/ADB connection | Start the intended virtual device and run `adb devices`; it must show `device` |
| Email never found | Current screen and selector | Confirm Login is open, inspect its hierarchy, compare its accessibility ID with `~input-email` |
| Assertion mismatch | Actual behavior and expected contract | Read actual/expected values and inspect the failure screenshot; decide which value is correct using the intended requirement |

The third observation does not automatically mean the selector is wrong. A correct selector on the wrong screen also fails. The fourth observation does not automatically mean the application is wrong; the expectation may contain a typo.

**Common pitfalls:** Adding a 30-second sleep before understanding the failure; updating expected text merely to get green; treating every failure as Appium instability.

## 00-C · Design before automating

One complete scenario:

1. Open the demo app and navigate to Forms.
2. Confirm the Forms screen is visible.
3. Enter `Training run 1` into the text input.
4. Verify the separate result displays exactly `Training run 1`.
5. Clear the input.
6. Verify the input contains no characters.
7. Verify the separate result displays the empty string `''`.

Step 4 prevents a false positive in which the final blank state was present all along. Step 6 and step 7 address different observations: the field and the echoed result could become inconsistent.

This does not check persistence after an app restart, server storage, all Unicode inputs, or the screen-reader experience. Any two relevant limitations are acceptable. Scope is a property of the test, not a failure of the test.

**Common pitfalls:** Writing “looks correct” as the expected result; using `' '` for empty; omitting the populated-state assertion; assuming an automated test covers every manual observation.

## Checkpoint answers

- Type checking inspects code types. Mobile execution interacts with the installed app and makes runtime observations.
- Change a locator in the corresponding screen object or UI helper, then verify the behavior that depends on it.
- The demo validates a local form and displays a sample response. It does not exercise your future employer's authentication service.

[Back to lesson](../lessons/00-orientation.md) · [Next lesson](../lessons/01-toolchain.md)
