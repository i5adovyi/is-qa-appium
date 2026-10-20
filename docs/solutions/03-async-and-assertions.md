# 03 · Model answers: async and assertions

## 03-A · Assert the resolved value

Separate variable:

```ts
const actual = await readDemoText()
expect(actual).to.equal('ready')
```

Inline:

```ts
expect(await readDemoText()).to.equal('ready')
```

Without `await`, `expect` receives a Promise object. That object is not the string `'ready'`. Chai's ordinary `expect(...).to.equal(...)` does not wait for it to resolve.

The separate-variable form is often easier to debug because you can inspect or log `actual` before the assertion. The inline form is concise when the command and result are obvious.

**Common pitfalls:** Writing `await expect(readDemoText()).to.equal(...)`—the incorrect assertion is evaluated before `await` could help; removing `async` from a function that uses `await`; catching the assertion and only logging it, which can make a failing condition look like a passing test.

## 03-B · Fresh observations

Corrected mobile fragment:

```ts
await driver.waitUntil(
    async () => (await FormsScreen.inputResult.getText()) === 'Ready',
    {
        timeout: 5000,
        timeoutMsg: 'Forms result did not become "Ready"',
    },
)
const actual = await FormsScreen.inputResult.getText()
expect(actual).to.equal('Ready')
```

The defective version captured one string before polling. Repeating `actual === 'Ready'` compares the same immutable string every time. It cannot observe the app changing.

A fixed pause spends the full delay even when the result is ready immediately. It can still be too short on a slow device, and it does not explain which state failed to arrive. A condition wait ties synchronization to the requirement.

This does not mean every timeout should be short. A genuinely slow operation may need a larger bound. Choose it based on the operation and expected environment, rather than growing all timeouts whenever a test fails.

**Common pitfalls:** Forgetting to return a boolean from a callback with braces; calling `getText()` outside the callback; changing the expected value to whatever happened to appear.

## 03-C · A controlled failure

The normal structure is:

```ts
const text = 'Hello Appium'
await FormsScreen.input.setValue(text)             // action
await waitForText(FormsScreen.inputResult, text)   // readiness for this value
expect(await FormsScreen.inputResult.getText()).to.equal(text) // assertion
```

This assumes the actual project import:

```ts
import { waitForText } from '../helpers/waitForText.js'
```

Two different experiments teach different failures:

1. **Impossible wait:** Enter `Hello Appium`, then wait for `Never entered`. The condition should time out; inspect its timeout message and screenshot.
2. **Wrong snapshot assertion:** Enter `Hello Appium`, wait for `Hello Appium`, then assert `Never entered`. The wait succeeds and Chai reports the mismatch.

Perform one experiment at a time and restore the correct test afterward. Running only the echo scenario avoids unrelated failures confusing the lesson.

A screenshot shows one instant. A log can show command order and timing. Both are evidence, and neither justifies ignoring the failed requirement.

**Common pitfalls:** Changing the input and expected value together during a negative experiment, which preserves a passing test; leaving a deliberately broken test in the default suite; adding both the helper and an equivalent expanded wait.

## Checkpoint answers

- Awaiting a command orders your commands, but rendering a dependent result may finish later.
- Chai receives the current value and evaluates it once. Explicit synchronization in the project supplies polling.
- A poll must read current UI state; otherwise repetition cannot discover a change.

[Back to lesson](../lessons/03-async-and-assertions.md) · [Next lesson](../lessons/04-first-test.md)
