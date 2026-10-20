# 00 · Your first map of mobile automation

**Stage:** Foundation · **Estimated time:** 45–60 minutes · **Device needed:** No

**Prerequisites:** You can open this repository in an editor and open its terminal. Programming experience is not required.

**By the end you will be able to:**

- Trace a tap from a TypeScript test to the Android app.
- Distinguish a test scenario, a selector, an assertion, and a capability.
- Explain what a passing demo test proves—and what it does not prove.

## The job you are learning

Imagine a release candidate of a shopping app. A tester can install it, enter a delivery address, submit the form, and check the confirmation. An automated test performs specified actions and checks selected observations. It cannot decide whether the whole shopping experience is good unless someone translates those concerns into useful checks.

In this course, the app is the [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app). It is deliberately small enough to understand. Its login screen demonstrates input validation and an alert. It is **not a real authentication service**. A green login test does not prove account security, token refresh, or server availability.

Your first professional habit is to describe the claim before writing commands:

> Given the Forms screen is open, when I enter `Hello Appium`, the result displays exactly `Hello Appium`.

That is a falsifiable claim: a different result should fail the test.

## Who does what?

```text
You write a scenario in TypeScript
             ↓
Mocha runs its beforeEach and it functions
             ↓
WebdriverIO sends element and device commands
             ↓
Appium routes commands to the UiAutomator2 driver
             ↓
Android emulator runs the demo app
             ↓
WebdriverIO returns observed values → Chai checks them
```

Appium supplies the automation server and driver architecture; your tests still need a client and a test runner. [Appium introduction](https://appium.io/docs/en/latest/intro/).

| Name | Its job here | A concrete example |
|---|---|---|
| TypeScript | Express test logic with checked types | A password parameter is a `string` |
| Mocha | Organize and execute tests and hooks | `describe`, `it`, `beforeEach` |
| WebdriverIO | Send commands and receive observations | `setValue`, `click`, `getText` |
| Appium + UiAutomator2 | Translate those commands into Android automation | Locate a native Android element |
| Chai | Decide whether an observed value matches the claim | `.to.equal('Success')` |
| Android emulator | Run Android and the app locally | A Pixel virtual device |
| BrowserStack | Supply remotely hosted devices and session evidence | Run the Android suite in the cloud |

Android Studio manages the SDK and virtual devices. It does not execute the TypeScript suite. BrowserStack is a later execution environment; you can learn the first stages locally.

## Read a real test as a story

This sequence uses the actual objects in [app.forms.spec.ts](../../test/specs/app.forms.spec.ts):

```ts
const text = 'Hello Appium'
await FormsScreen.input.setValue(text)
await waitForText(FormsScreen.inputResult, text)
expect(await FormsScreen.inputResult.getText()).to.equal(text)
```

- `text` is **test data**.
- `FormsScreen.input` identifies the **input element**.
- `setValue(text)` performs the **action**.
- `waitForText(...)` waits for the result to reflect that action.
- `getText()` obtains the **actual result**.
- `.to.equal(text)` is the **assertion**, using `text` as the expected result.

The surrounding setup opens the Forms screen. Leaving setup out of the story can make a test appear more independent than it is.

## Guided lab: explore without changing anything

Run from the repository root:

```bash
pwd
node --version
npm run
npm run typecheck
```

The last command checks TypeScript. It does not launch an emulator and does not prove the UI behaves correctly. If dependencies are missing, stop here and complete [lesson 01](01-toolchain.md).

Open these files in order:

1. [app.smoke.spec.ts](../../test/specs/app.smoke.spec.ts): the simplest scenario.
2. [TabBar.ts](../../test/screens/TabBar.ts): how the navigation elements are found.
3. [wdio.android.conf.ts](../../config/wdio.android.conf.ts): how the local device session is configured.
4. [wdio.shared.conf.ts](../../config/wdio.shared.conf.ts): how specs, timeouts, and reporting are configured.

Create a personal learning journal anywhere convenient. For each lesson record the command, expected outcome, observed outcome, and one thing you can now explain. Never include access keys or personal credentials.

## Exercises

### 00-A · Trace one command

Without running a device, trace `await TabBar.openLogin()` through the repository. Write the method body, selector, selector strategy, and the visible element you expect it to tap. Then explain what `await` is waiting for at a high level.

<details><summary>Hint</summary>

Follow the import in a spec into `TabBar.ts`. `openLogin` uses a getter; the getter contains the selector. The bottom navigation tab and the form's submit button are different elements.
</details>

**Acceptance:** Your trace ends at `~Login`, identifies accessibility ID, and distinguishes navigation from submitting credentials.

### 00-B · Diagnose the responsible layer

For each observation, name the first layer you would inspect and explain why:

1. TypeScript says a property does not exist before any device starts.
2. The runner cannot find a connected Android device.
3. The app opens, but the selector never finds the email field.
4. The app shows a result, but the assertion reports a different expected value.

Do not write “reinstall everything.” Give one targeted next action per case.

<details><summary>Hint</summary>

Separate code structure, device availability, element identity/screen state, and the expected-versus-actual contract.
</details>

**Acceptance:** Four different diagnoses with evidence you would collect; no unexplained timeout increase.

### 00-C · Design before automating

Write a manual scenario for clearing the Forms input. Include a starting state, nonempty sample input, an observation before clearing, the clear action, and an exact final result. Also name two things this scenario does not test.

<details><summary>Hint</summary>

If you only check that the final result is empty, the test could pass without ever entering text. Empty means zero characters, not one space.
</details>

**Acceptance:** Another beginner could reproduce the steps; the scenario proves a transition from populated to empty.

## Checkpoint

Explain out loud:

- Why does “TypeScript passed” differ from “the mobile test passed”?
- Where would you change an element locator?
- Why is successful demo login insufficient evidence for real authentication?

**Stage evidence:** A traced command, four diagnoses, and one manual scenario. You do not need an impressive test count.

[Model answers](../solutions/00-orientation.md) · [Next: 01 · Toolchain](01-toolchain.md)
