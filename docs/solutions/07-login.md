# 07 · Model answers: Login validation

These are new tests to add inside the existing Login `describe`. They use the imports and `beforeEach` already in that file. Run them against the pinned demo APK; the model answers describe its stated form contract, not a real service's password policy.

The supplied both-empty reference test additionally checks `LoginScreen.emptyEmail.isExisting()` and `LoginScreen.emptyPassword.isExisting()`. It first waits for and checks that these empty-state matches are absent after entering text; after clearing, it waits for and checks that they are present. Those getters use narrow Android XPath expressions combining the field's accessibility identifier with `showing-hint="true"` in the XML hierarchy. This avoids treating placeholder text as entered text. A direct `getAttribute('showing-hint')` read failed with the installed driver, so do not substitute that command without verifying driver support.

## 07-A · Empty email only

```ts
it('should reject an empty email with a valid password', async () => {
    await LoginScreen.clearFields()
    await LoginScreen.password.setValue('Practice123!')
    await LoginScreen.emptyEmail.waitForExist()
    expect(await LoginScreen.emptyEmail.isExisting()).to.be.true
    expect(await LoginScreen.emailError.isExisting()).to.be.false
    expect(await LoginScreen.passwordError.isExisting()).to.be.false

    await LoginScreen.submit()

    await LoginScreen.emailError.waitForDisplayed()
    expect(await LoginScreen.emailError.getText()).to.equal(
        'Please enter a valid email address',
    )
    expect(await LoginScreen.passwordError.isExisting()).to.be.false
})
```

The known-valid password removes the password rule as the intended cause. Waiting for the email error establishes that validation produced observable output before we assert the other message is absent.

This negative check observes absence at that point. For an application with asynchronous server validation, you would need an explicit validation-complete state rather than assuming the first error means every rule has finished.

**Common pitfalls:** Leaving the password empty and accidentally repeating the both-empty case; sending an email made of spaces while calling it empty; putting the assertions before `submit`.

## 07-B · Empty password only

```ts
it('should reject an empty password with a valid email', async () => {
    await LoginScreen.clearFields()
    await LoginScreen.email.setValue('learner@example.com')
    await LoginScreen.emptyPassword.waitForExist()
    expect(await LoginScreen.emptyPassword.isExisting()).to.be.true
    expect(await LoginScreen.emailError.isExisting()).to.be.false
    expect(await LoginScreen.passwordError.isExisting()).to.be.false

    await LoginScreen.submit()

    await LoginScreen.passwordError.waitForDisplayed()
    expect(await LoginScreen.passwordError.getText()).to.equal(
        'Please enter at least 8 characters',
    )
    expect(await LoginScreen.emailError.isExisting()).to.be.false
})
```

The supplied both-invalid test demonstrates that the two expected messages can coexist. These isolated tests additionally detect an error incorrectly attached to a valid field, and make it easier to identify which rule regressed.

A table of intended conditions makes the coverage visible:

| Case | Email | Password | Expected field errors |
|---|---|---|---|
| Supplied invalid | Malformed | Short | Both |
| Supplied empty | Empty | Empty | Both |
| 07-A | Empty | Valid length | Email only |
| 07-B | Valid format | Empty | Password only |

**Common pitfalls:** Continuing 07-A in the same test and inheriting error state; checking `.to.be.true` on an un-awaited Promise; assuming absence of a success dialog proves the correct validation appeared.

## 07-C · Seven and eight characters

```ts
it('should reject a seven-character password', async () => {
    await LoginScreen.login('learner@example.com', '1234567')

    await LoginScreen.passwordError.waitForDisplayed()
    expect(await LoginScreen.passwordError.getText()).to.equal(
        'Please enter at least 8 characters',
    )
    expect(await LoginScreen.emailError.isExisting()).to.be.false
})

it('should accept an eight-character password in the demo', async () => {
    await LoginScreen.login('learner@example.com', '12345678')

    await NativeAlert.waitForIsShown()
    expect(await NativeAlert.title()).to.equal('Success')
    expect(await NativeAlert.message()).to.equal('You are logged in!')

    await NativeAlert.tapOk()
    await NativeAlert.waitForIsShown(false)
})
```

These cases test the transition from just below the stated minimum to exactly the minimum. They would detect an implementation that accidentally used `> 8` rather than `>= 8`, provided the app exposes the corresponding UI result.

They do not establish password strength, resistance to guessing, hashing, secure storage, or correct server authentication. A demo accepting `12345678` tells you about the sample form's length rule.

**Common pitfalls:** Calling these inputs secure passwords; testing seven and twelve characters while skipping the exact boundary; forgetting to close the success alert; giving both cases the same test title.

## Checkpoint answers

- Old errors could make a test pass even if the current submit did nothing. Establishing their absence reduces that false-positive risk.
- `~Login` navigates to the screen; `~button-login-container` selects its internal Login mode; `~button-LOGIN` submits the form.
- A valid email holds one variable constant, so a failure near the password boundary is easier to interpret.
- Real authentication would require an actual service, controlled accounts, expected server/session behavior, invalid-credential cases, and product-specific security requirements. This demo does not provide that evidence.

## Review your own implementation

Before moving on, verify that every asynchronous command is awaited, every negative scenario has positive evidence of the expected error, each test starts independently, and your final report names the failed condition clearly.

Run the complete file after the isolated tests:

```bash
npm run typecheck
npm run test:login
```

If a new case fails, retain the actual result and investigate the app requirement, state, selector, and timing. Do not silently weaken an exact check to make the report green.

[Back to lesson](../lessons/07-login.md) · [Next lesson](../lessons/08-test-data.md)
