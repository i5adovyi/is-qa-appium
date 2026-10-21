# 03 · Wait for evidence, then make a claim

**Stage:** Foundation · **Estimated time:** 75–100 minutes · **Device needed:** No for the first lab; emulator for exercise 03-C

**Prerequisites:** [Lesson 02](02-typescript.md); you can read functions, strings, and imports.

**By the end you will be able to:**

- Explain what a Promise represents and why device commands are awaited.
- Distinguish command completion, UI readiness, and an assertion.
- Replace an arbitrary delay with a wait for the specific outcome.

## Three moments that are easy to confuse

If expected versus actual results or Chai assertions are still unfamiliar,
do T1–T3 in [your first test workbook](../handbook/first-test-workbook.md)
before introducing asynchronous device behavior here.

Suppose you ask a friend to turn on a projector. Asking, receiving “done,” and seeing the correct slide are separate observations.

Likewise:

1. `await element.click()` waits for the click command.
2. A wait for the result checks that the relevant UI state arrived.
3. An assertion evaluates whether the observed value meets your requirement.

An asynchronous function returns a Promise, representing a result that may arrive later or fail. `await` obtains that result or propagates its failure. It does not mean “sleep for a while.”

For a device interaction, write `await` on the command, then issue the next command. Omitting it can let the next line run before the previous action finishes. If an awaited command fails, the error leaves the current test unless you handle it; Mocha records that test as failed. Catching it and only printing a message can accidentally conceal the failure.

```ts
const actual = await FormsScreen.inputResult.getText()
expect(actual).to.equal('Hello Appium')
```

The first line gets text. The second compares two values. Chai's `.equal` assertion is immediate; it does not repeatedly ask the device for new text. [Chai equality reference](https://www.chaijs.com/api/bdd/#method_equal).

This distinction matters even if a device seems fast today. A result may render after the input command has completed.

## Guided lab: experience async behavior without a phone

Create `test/learning-async.ts`:

```ts
import { expect } from 'chai'

async function readDemoText(): Promise<string> {
    return 'ready'
}

const pending = readDemoText()
console.log('Is this a Promise?', pending instanceof Promise)

const actual = await pending
console.log('Resolved value:', actual)
expect(actual).to.equal('ready')
```

Run:

```bash
npm run typecheck
node test/learning-async.ts
```

Expected output includes `true` and `ready`. There is no Appium session. `readDemoText` is deliberately a local teaching function; it does not read the app.

Now temporarily change the expected string to `'finished'`. Run the file and examine the assertion failure. Restore the expectation after you can identify the actual value, expected value, and line.

A normal successful program exits with status zero; an uncaught assertion exits unsuccessfully. In a macOS/Linux terminal, `echo $?` immediately after the command shows its exit status. Run it before another command changes that status. You do not need to memorize stack traces: start with the failure message and the first location in your own file.

A resolved Promise is not automatically a correct result. Async execution and correctness are separate concerns.

## Wait for the smallest meaningful condition

This mobile example polls the result field until its text matches:

```ts
await driver.waitUntil(
    async () => (await FormsScreen.inputResult.getText()) === text,
    {
        timeout: 5000,
        timeoutMsg: `Expected Forms result to become ${JSON.stringify(text)}`,
    },
)
expect(await FormsScreen.inputResult.getText()).to.equal(text)
```

The callback returns a boolean. WebdriverIO repeats it until it is true or the timeout expires. The timeout is a maximum allowance, not a required delay. [WebdriverIO `waitUntil`](https://webdriver.io/docs/api/browser/waitUntil/).

An arrow without braces returns its expression automatically. If you add braces, include `return`:

```ts
async () => {
    return (await FormsScreen.inputResult.getText()) === text
}
```

The examples using `FormsScreen` and `driver` are fragments for an existing mobile test with its imports and active session. Do not paste them into `learning-async.ts`: the standalone Node lab has no device or runner globals.

The training project's `waitForText` helper packages this pattern. Use the existing helper in normal tests; the expanded form above teaches what it does.

Choose the condition that matches your claim:

| Need | Useful condition |
|---|---|
| Screen ready | Its identifying element is displayed |
| Echo updated | Its text equals the expected input |
| Alert dismissed | The alert is no longer displayed |
| Validation available | The expected validation elements are displayed |

`waitForDisplayed` addresses visibility; it cannot guarantee a changing text value is correct. The real `BaseScreen.waitForIsShown(false)` uses a reversed visibility wait. [WebdriverIO visibility waits](https://webdriver.io/docs/api/element/waitForDisplayed/).

## Exercises

### 03-A · Repair a Promise assertion

In the local lab, temporarily **replace its final assertion** with:

```ts
expect(readDemoText()).to.equal('ready')
```

Explain why this fails, then repair it in two ways: use the lab's existing resolved `actual` variable and use an inline `await`. Try one form at a time. Do not redeclare `const actual` in the same scope.

<details><summary>Hint</summary>

Ask what value is being passed to `expect` before `await` is used. Importing Chai does not make it automatically await a Promise.
</details>

**Acceptance:** Both repaired assertions pass; your explanation names the Promise and its resolved string.

### 03-B · Review a misleading wait

Review this deliberately flawed code; do not add it to the mobile suite:

```ts
const actual = await FormsScreen.inputResult.getText()
await driver.waitUntil(async () => actual === 'Ready')
expect(actual).to.equal('Ready')
```

Identify the defect and write a corrected version. Then explain why `await driver.pause(5000)` is a weaker replacement.

<details><summary>Hint</summary>

The callback is called again, but does it obtain a new observation? A repeated comparison of an old string cannot see a UI update.
</details>

**Acceptance:** Your callback reads fresh text on every attempt, has a useful timeout message, and retains an explicit final assertion.

### 03-C · Synchronize a real observation

In the existing first Forms test, identify the action, wait, and assertion. If you are reconstructing it yourself, add the expanded `waitUntil` above between `setValue` and the Chai assertion. The finished project already uses a helper for this; do not stack duplicate waits.

Temporarily make the expected value impossible while keeping the input unchanged. Run just the echo scenario:

```bash
npm run test:forms -- --mochaOpts.grep "echo typed text"
```

Read the failure, restore the correct expectation, then rerun. Record why a timeout for an impossible expectation is different from an assertion snapshot mismatch.

<details><summary>Hint</summary>

If the wait targets the wrong expectation, it should time out. If the wait targets the correct state but the final assertion uses a different value, Chai should fail immediately afterward.
</details>

**Acceptance:** You can demonstrate a passing version and explain one controlled failure without leaving it broken.

If you are following the device-free route, do 03-A and 03-B now and record 03-C as pending. Complete the emulator setup and this device exercise before beginning lesson 04.

## Checkpoint

- Does awaiting `setValue` guarantee every dependent label has rendered?
- Does Chai retry an assertion because its input came from WebdriverIO?
- Why must a polling callback read a fresh observation?

**Extra deliberate practice:** [Async ordering lab](../../exercises/03-async-order/README.md), `npm run practice -- 03`; later, [polling lab](../../exercises/05-polling/README.md), `npm run practice -- 05`. These are local exercises with intentionally unfinished starters.

[Model answers](../solutions/03-async-and-assertions.md) · [Next: 04 · Your first test](04-first-test.md)
