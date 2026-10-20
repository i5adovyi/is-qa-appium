# 08 · Test data that tells a story

**Stage:** Build a maintainable suite\
**Estimated time:** 75–100 minutes\
**Prerequisites:** You can explain the Login spec, write a Chai assertion, and run `npm run test:login`.\
**Outcome:** Choose meaningful inputs, give each case its own result, and keep test data separate from account secrets.

## The problem you are solving

Ten almost identical tests are expensive to maintain. One enormous test containing ten submissions is hard to diagnose: its first failure prevents the remaining submissions. A useful compromise is a small table whose rows create separate Mocha tests.

The demo app simulates login. A successful alert establishes that its demo validation accepted the submitted values. It does **not** prove that a backend authenticated a real account. Use synthetic data throughout this course.

Partition inputs by the behavior they challenge:

| Class | Example | What it investigates |
|---|---|---|
| Both absent | email `''`, password `''` | Required-field handling |
| Malformed email | `not-an-email`, valid-length password | Email validation independently |
| Short password | valid email, `1234567` | Just below the displayed minimum |
| Minimum password | valid email, `12345678` | Boundary acceptance; investigate the demo behavior |
| Both malformed | `wrong`, `123` | Multiple messages can be visible together |

One valid representative is enough for many smoke tests. Boundaries deserve their own cases because a one-character implementation mistake can separate them.

## Worked example

Create a learner-owned `test/data/login-practice.ts` when doing this lesson:

```ts
export type InvalidLoginCase = {
    name: string
    email: string
    password: string
    emailError: boolean
    passwordError: boolean
}

export const invalidLoginCases: InvalidLoginCase[] = [
    {
        name: 'both fields missing',
        email: '',
        password: '',
        emailError: true,
        passwordError: true,
    },
    {
        name: 'email malformed with a long enough password',
        email: 'not-an-email',
        password: 'Test1234!',
        emailError: true,
        passwordError: false,
    },
]
```

Put the loop inside the existing Login `describe`, which already restarts the demo, opens Login, and selects the internal Login tab. These are new learner cases, not code already shipped in the baseline:

```ts
for (const sample of invalidLoginCases) {
    it(`rejects ${sample.name}`, async () => {
        await LoginScreen.clearFields()
        if (sample.email !== '') await LoginScreen.email.setValue(sample.email)
        if (sample.password !== '') await LoginScreen.password.setValue(sample.password)
        expect(await LoginScreen.emailError.isExisting()).to.be.false
        expect(await LoginScreen.passwordError.isExisting()).to.be.false

        await LoginScreen.submit()

        if (sample.emailError) {
            await LoginScreen.emailError.waitForDisplayed()
            expect(await LoginScreen.emailError.getText())
                .to.equal('Please enter a valid email address')
        }
        if (sample.passwordError) {
            await LoginScreen.passwordError.waitForDisplayed()
            expect(await LoginScreen.passwordError.getText())
                .to.equal('Please enter at least 8 characters')
        }
        if (!sample.emailError) {
            expect(await LoginScreen.emailError.isExisting()).to.be.false
        }
        if (!sample.passwordError) {
            expect(await LoginScreen.passwordError.isExisting()).to.be.false
        }
    })
}
```

The synchronous `for` registers tests before execution. Each `it` awaits its own device operations. Do not use `forEach(async …)` to drive a device; overlapping input operations make the result unpredictable. Clear the starting state before each test, particularly when asserting that an old error is absent.

The table contains only invalid cases, so every row must expect at least one error. The positive wait provides evidence that submission produced validation before the absence checks. This is sufficient for this demo's local validation; a real form with asynchronous checks may need a distinct “validation complete” signal. An absence check made too early can pass before an unwanted message appears.

An empty string means an explicit clear action here. A string of spaces is different test data and must reach the app unchanged. Do not silently trim every negative test input through a fixture factory.

## Guided lab

1. Run `npm run test:login` and record your starting result.
2. Create the data file above. Add `import { invalidLoginCases } from '../data/login-practice.js'` to `test/specs/app.login.spec.ts`, alongside its Chai and screen imports.
3. Reuse the existing Login setup; add the loop as new tests. Avoid duplicate test names.
4. Run:

   ```bash
   npm run typecheck
   npm run test:login
   ```

5. Run an individual case with `npx wdio run config/wdio.android.conf.ts --spec test/specs/app.login.spec.ts --mochaOpts.grep "both fields missing"` if you added the cases to that file. Confirm the reporter names the data case, rather than reporting one anonymous loop.

## Exercises

### 08-A · Isolate the two validators

Add a third row with a valid-shaped email and a seven-character password. Check the password message **and** the absence of the email message. Submit each case from a known initial state.

**Acceptance:** three named negative cases; independent expectations for both messages; no real credentials; each case passes when run alone.

<details><summary>Hint 1 · Think about the missing half</summary>
The malformed-email row already tests one validator independently. Reverse which input is invalid.
</details>
<details><summary>Hint 2 · A useful fixture</summary>
Use `test@webdriver.io` and `1234567`, with `emailError: false` and `passwordError: true`.
</details>

### 08-B · Investigate a boundary

Compare passwords of lengths 7, 8, and 9 using the same valid-shaped email. Write your expected result **before** running. Use separate tests and dismiss any success alert. Record observed behavior and whether it agrees with the screen's message.

**Acceptance:** a three-row prediction/observation table; successful cases verify both alert title and message; no alert leaks into the next test; a disagreement is documented rather than silently changing the expected value.

<details><summary>Hint 1 · Separate rule from evidence</summary>
The text “at least 8 characters” predicts an inclusive minimum. A passing demo test does not establish password complexity requirements.
</details>
<details><summary>Hint 2 · Keep assertions explicit</summary>
The length-7 case expects validation. The other two investigate success; use `NativeAlert` and close it after checking.
</details>

### 08-C · Make a test-data decision

Design data for Forms echo tests: plain ASCII, an empty value, and one non-ASCII sample. For each, explain the risk it covers, whether `setValue('')` is the right action, and what evidence would distinguish an input-method limitation from an application defect.

**Acceptance:** three named cases with rationale; emptying uses an explicit clear action after populated input; unsupported Unicode entry is recorded as a constraint, not “fixed” by weakening the assertion.

<details><summary>Hint 1 · Different actions exercise different behaviors</summary>
An input that starts empty cannot prove clearing works.
</details>
<details><summary>Hint 2 · Look at both sides</summary>
Compare the input's displayed value and the echoed result, and retain a screenshot when characters differ.
</details>

## Checkpoint

- Why is one `it` per data row more diagnostic than one `it` with a device loop?
- What does an eight-character password acceptance prove in this demo, and what does it leave unknown?
- Why can random text make a failure difficult to reproduce?

Read [TypeScript object and array types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) when the fixture's type is unfamiliar.

[Solutions](../solutions/08-test-data.md) · [Next: waits and state](09-waits-and-state.md) · [Course index](../README.md)
