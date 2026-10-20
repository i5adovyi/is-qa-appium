# 07 · Login validation, line by line

**Stage:** First device tests · **Estimated time:** 100–140 minutes · **Device needed:** Android emulator

**Prerequisites:** [Lesson 06](06-forms.md), and familiarity with screen objects, state setup, and exact-text assertions.

**By the end you will be able to:**

- Explain the complete Login spec rather than copying it.
- Separate field preparation, submission, and observation.
- Check empty-field errors without inheriting old validation messages.
- Design one-invalid-field tests and a password-length boundary.

## First, define what “login” means here

This is the demo app's simulated form. Valid-looking input causes a success alert; no personal account or real password is needed. These tests teach UI validation and automation structure. They do not verify real credential authentication, a backend session, access control, or account security.

Use the sample data. Do not substitute your work or personal credentials.

The supplied [app.login.spec.ts](../../test/specs/app.login.spec.ts) now contains three reference scenarios: successful input, invalid input, and submission after both fields are cleared. The exercises at the end extend this coverage.

## A line-by-line reading of the source

Use your editor's line numbers, or run:

```bash
nl -ba test/specs/app.login.spec.ts
```

The table follows the supplied reference file. Adding your own tests will move later line numbers; use the statement text as the stable anchor.

| Line | Statement or role | Explanation |
|---|---|---|
| 1 | `import { expect } from 'chai'` | Imports the named assertion function |
| 2 | `import TabBar ...` | Imports bottom-navigation actions |
| 3 | `import LoginScreen ...` | Imports Login controls and form actions |
| 4 | `import NativeAlert ...` | Imports the Android alert helper |
| 5 | `import { restartDemoApp } ...` | Imports the named restart helper |
| 7 | `describe('Login form', () => {` | Opens the suite that groups these scenarios |
| 8 | `beforeEach(async () => {` | Defines asynchronous setup before each scenario |
| 9 | `await restartDemoApp()` | Terminates and activates the demo, then waits for navigation |
| 10 | `await TabBar.openLogin()` | Taps the bottom Login navigation tab |
| 11 | `await LoginScreen.waitForIsShown()` | Waits for the Login screen marker |
| 12 | `await LoginScreen.loginTab.click()` | Selects Login rather than Sign up within the screen |
| 13 | `})` | Closes the setup hook |
| 15 | Successful-input `it(...)` | Registers a test; `@smoke` makes its title match the smoke filter |
| 16 | `await LoginScreen.login(...)` | Enters the two sample strings and submits |
| 18 | `await NativeAlert.waitForIsShown()` | Waits until the success dialog is available |
| 19 | Assert title equals `Success` | Checks the dialog's title |
| 20 | Assert message equals `You are logged in!` | Checks the dialog's body, independently of its title |
| 22 | `await NativeAlert.tapOk()` | Dismisses the dialog |
| 23 | `await NativeAlert.waitForIsShown(false)` | Waits for the dialog to disappear; `false` requests a reversed visibility wait |
| 24 | `})` | Closes the success test |
| 26 | Invalid-input `it(...)` | Registers a separate negative scenario |
| 27 | `login('not-an-email', '123')` | Supplies a malformed email and short password |
| 29 | Wait for `emailError` | Waits for the expected email validation element |
| 30 | Wait for `passwordError` | Waits for the expected password validation element |
| 31 | Assert email error text | Requires the demo's exact email validation wording |
| 32 | Assert password error text | Requires the demo's exact length-validation wording |
| 33 | `})` | Closes the invalid-input test |
| 35 | Empty-fields `it(...)` | Registers the clearing-and-submission scenario |
| 36 | Preparation comment | Explains why the test first puts real text into the fields |
| 37 | Set email to `learner@example.com` | Establishes nonempty email input |
| 38 | Set password to `Practice123!` | Establishes nonempty password input |
| 39 | `await LoginScreen.clearFields()` | Clears both controls explicitly |
| 41 | Android placeholder comment | Explains why an empty input can still expose placeholder text |
| 42 | Check `LoginScreen.emptyEmail.isExisting()` | Requires the email control with `showing-hint="true"` in the native hierarchy |
| 43 | Check `LoginScreen.emptyPassword.isExisting()` | Requires the password control with `showing-hint="true"` in the native hierarchy |
| 44 | Email error must not exist | Rejects stale email validation before submission |
| 45 | Password error must not exist | Rejects stale password validation before submission |
| 47 | `await LoginScreen.submit()` | Submits the now-empty fields |
| 49 | Wait for email error | Synchronizes with validation after the submit |
| 50 | Wait for password error | Synchronizes with the second validation message |
| 51 | Assert exact email message | Checks `Please enter a valid email address` |
| 52 | Assert exact password message | Checks `Please enter at least 8 characters` |
| 53 | `})` | Closes the empty-fields test |
| 54 | `})` | Closes the Login suite |

Blank lines only separate ideas. The restart resets this demo's in-memory state; `beforeEach` does not erase app data merely because of its name.

## Follow the helper instead of treating it as magic

Open [LoginScreen.ts](../../test/screens/LoginScreen.ts).

```ts
async clearFields() {
    await this.email.clearValue()
    await this.password.clearValue()
}

async submit() {
    if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard()
    }
    await this.loginButton.click()
}
```

`clearFields` performs two ordered editing commands. `submit` handles the on-screen keyboard because it can cover the submit button. It then taps the actual form button, `~button-LOGIN`.

`login(email: string, password: string)` selects the internal Login tab, enters both arguments, then calls `submit()`. It is a convenience action, not an assertion that authentication succeeded.

The validation selectors currently use exact Android text. This means altered wording can fail during lookup before the final assertion reports a difference. A stable validation identifier would improve diagnostics; we cannot invent one in a test.

### A real Android trap: empty input does not always return empty text

On the tested Android demo, `LoginScreen.email.getText()` returns `Email` after clearing, because the native input exposes its placeholder. The password control similarly returns `Password`. That is different from the separate Forms result element, whose empty text is `''`.

The empty-login test therefore uses two screen getters that match the inspected hint state:

```ts
expect(await LoginScreen.emptyEmail.isExisting()).to.be.true
expect(await LoginScreen.emptyPassword.isExisting()).to.be.true
```

In `LoginScreen.ts`, the email getter is:

```ts
get emptyEmail() {
    return $('//android.widget.EditText[@content-desc="input-email" and @showing-hint="true"]')
}
```

The password getter uses the same expression with `input-password`. Each XPath combines the control's existing accessibility identity with the required hint state. It does not depend on positions in a chain of layout containers.

The installed driver exposed `showing-hint="true"` in its XML source but rejected a direct `getAttribute('showing-hint')` command. The getters use that observed XML state instead. This is an evidence-based, narrow exception to our usual accessibility-ID lookup: accessibility ID alone identifies the field but cannot express the hint-state condition.

UiAutomator2 documents the hint flag for Android API 26 and later. These getters are Android-specific and depend on the controls having placeholders and the flag being present in the hierarchy. Verify those conditions when changing the app or driver. `isExisting()` returns a boolean, which explains `.to.be.true` in the spec. [UiAutomator2 element attributes](https://github.com/appium/appium-uiautomator2-driver).

Do not repair the test by accepting either `''` or `'Email'` as “empty”: a person could actually enter the word `Email`. Inspecting the hint flag distinguishes that case. This is a useful debugging lesson: inspect the UI's exposed properties before changing the expected result.

## Guided lab: reproduce the empty-fields test

Run the supplied scenario first:

```bash
npm run typecheck
npm run test:login -- --mochaOpts.grep "empty fields"
```

Read it as five phases:

1. **Establish:** put nonempty text in both fields.
2. **Clear:** explicitly clear both fields.
3. **Prove the starting state:** fields empty, no old validation errors.
4. **Act:** submit.
5. **Observe:** wait for both errors and check their exact wording.

This avoids a misleading test that sees errors left by a previous invalid attempt and attributes them to the current submit.

Chai checks once. The visibility waits provide synchronization; they are not built into Chai's equality assertion. See [Chai assertions](https://www.chaijs.com/api/bdd/) and [WebdriverIO visibility waits](https://webdriver.io/docs/api/element/waitForDisplayed/).

For the exercises, add new `it` blocks inside the Login suite. They inherit the existing restart and navigation setup. Their solutions are examples to implement and verify; they are not already part of the supplied suite.

## Exercises

### 07-A · Empty email, valid-length password

Add `should reject an empty email with a valid password`. Establish an empty email, enter `Practice123!` as the password, submit, and require the exact email validation message. Require that the password validation message is absent.

Run:

```bash
npm run test:login -- --mochaOpts.grep "empty email with a valid password"
```

<details><summary>Hint</summary>

Use `clearFields()` to establish emptiness and then fill only the password. Wait for the positive evidence—the email error—before checking the other error is absent.
</details>

**Acceptance:** The scenario isolates the email rule and would fail if a password error appeared as well. It passes alone and does not reuse an old validation message.

### 07-B · Valid email, empty password

Add `should reject an empty password with a valid email`. Enter `learner@example.com` in an otherwise empty form. Submit, verify the exact password message, and require that the email message is absent.

Compare it with 07-A: explain why two isolated cases reveal more than one case where both fields are invalid.

<details><summary>Hint</summary>

Use a separate `it`, not the next phase of 07-A. The setup should be repeated automatically for an independent test.
</details>

**Acceptance:** Only the expected field error is present, and the two tests have distinct names and independent setup.

### 07-C · Test the stated minimum

The demo's displayed requirement says at least eight characters. Add two separate cases with a valid email:

- Seven-character password `1234567`: expect the password validation message.
- Eight-character password `12345678`: expect the demo success alert, then dismiss it and wait for it to disappear.

Explain what these two cases tell you and why they are not a password-security test.

<details><summary>Hint</summary>

The values differ only at the boundary. Reuse the existing successful-alert pattern for the accepted case. Keep all data synthetic.
</details>

**Acceptance:** Separate reported cases for seven and eight characters, correct observable outcomes, and no alert left open after the accepted case.

## Checkpoint

- Why explicitly check that old errors are absent before the empty submit?
- How does a bottom navigation tab differ from the internal Login tab and the submit button?
- Why should the seven-character case not be combined with a malformed email?
- What additional evidence would real authentication testing require?

**Stage exit:** You can explain the full spec, write isolated negative cases, and show a passing `npm run test:login` with your additions.

[Model answers](../solutions/07-login.md) · [Next: 08 · Test data](08-test-data.md)
