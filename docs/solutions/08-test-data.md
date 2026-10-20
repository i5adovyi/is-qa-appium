# 08 · Solutions and reasoning

Try [the exercises](../lessons/08-test-data.md) before reading. These are reference approaches for learner changes, not a claim that every suggested device experiment has been executed.

## 08-A · Independent validators

Add this row to `invalidLoginCases`:

```ts
{
    name: 'password below minimum with a valid-shaped email',
    email: 'test@webdriver.io',
    password: '1234567',
    emailError: false,
    passwordError: true,
}
```

The lesson's loop waits for expected positive messages, then checks both booleans. Its setup must clear previous validation state. In the supplied suite, restarting the demo process before a case establishes its in-memory starting state; read the actual `beforeEach` to understand the guarantee. If your app persists errors or data, process restart may be insufficient.

An assertion that the password error appears is incomplete when the scenario also promises that the email is accepted. Checking the email error is absent detects an accidentally broad validator.

## 08-B · Boundary investigation

Use a valid-shaped email for all three rows:

| Password | Prediction from displayed rule | Required observation |
|---|---|---|
| `1234567` | Rejected | Password validation message |
| `12345678` | Accepted by demo validation | Success title and login message |
| `123456789` | Accepted by demo validation | Same success evidence |

Implement success cases with the existing helper:

```ts
for (const password of ['12345678', '123456789']) {
    it(`accepts a ${password.length}-character demo password`, async () => {
        await LoginScreen.login('test@webdriver.io', password)
        await NativeAlert.waitForIsShown()
        expect(await NativeAlert.title()).to.equal('Success')
        expect(await NativeAlert.message()).to.equal('You are logged in!')
        await NativeAlert.tapOk()
        await NativeAlert.waitForIsShown(false)
    })
}
```

Keep the negative case separate so success handling cannot accidentally consume the wrong outcome. This is a prediction-based exercise; fill in actual observations from your run. If the installed build behaves differently, report the build and discrepancy before revising the oracle.

## 08-C · Forms data choices

| Case | Data/action | Risk and useful evidence |
|---|---|---|
| Ordinary text | `Mobile practice` via `setValue` | Basic input-to-result binding |
| Clear populated text | Type `Before clear`, verify, call `clearValue` | Clearing updates the dependent result |
| Non-ASCII | `Zażółć` via `setValue` | Character preservation across input and echo |

For the last case, if the input itself never receives the intended characters, investigate the input method/driver first. If input is correct but echo differs, investigate app transformation or rendering. Do not change the expected value to a corrupted result merely to get green. Record the exact strings, Unicode differences where needed, device, keyboard, and screenshot.

Checkpoint answers: one test per row creates individual results; an eight-character pass proves only that specific demo input was accepted; uncontrolled randomness prevents exact reproduction unless the generated value and seed are captured.

[Next lesson](../lessons/09-waits-and-state.md)
