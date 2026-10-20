# 11 · Reference approaches for exploratory work

[Return to exercises](../lessons/11-gestures-and-contexts.md).

**Verification boundary:** These solutions describe approaches that require inspection and execution on your installed app. They deliberately do not invent a carousel selector, current web-page heading, or a successful hybrid run.

## 11-A · Gesture with a destination

A complete solution has four parts:

1. Inspect and record a stable carousel container and the identity of the expected next card.
2. Verify the starting card's observable state.
3. Execute one bounded gesture within that container.
4. Wait for the expected destination and verify it.

If you must search a carousel, use at most a small stated number of gestures, checking after each one. On exhaustion, report target, last observed identity, and attempt count. Do not use a bare `isDisplayed()` on an off-screen card until you have investigated how that carousel exposes visibility.

The code from the lesson computes bounds from the element. A gesture returning successfully is only the action evidence. The final assertion is what turns it into a behavioral test.

## 11-B · Capability report

```text
App: actual demo release / APK name
Device: actual model/emulator and Android version
Native baseline: command and result
WebView opened: yes/no, observed screen
Context discovery: actual returned IDs and relevant metadata
Switch attempted: target selection criterion
Switch result: succeeded / failed with first meaningful error
DOM observation: what was actually inspected/asserted, or not reached
Constraint: missing context / incompatible driver / network / unknown
Next check: one action that would narrow the constraint
```

If only `NATIVE_APP` appears, do not claim a working WebView. If a WebView appears but switching reports a ChromeDriver mismatch, do not blame CSS selectors yet; DOM interaction has not started. Investigate the driver README's version/configuration guidance before enabling any download or insecure server feature. Keep the Appium server bound locally for exploration.

## 11-C · Cleanup without losing the original failure

Here is a teaching pattern for a connected exploratory test:

```ts
let bodyFailed = false
try {
    await driver.switchContext({ url: /webdriver\.io/ })
    // Perform the inspected web assertion here.
} catch (error) {
    bodyFailed = true
    throw error
} finally {
    try {
        await driver.switchContext('NATIVE_APP')
    } catch (cleanupError) {
        if (!bodyFailed) throw cleanupError
        console.warn('Native context cleanup also failed', cleanupError)
    }
}
```

The primary assertion remains the thrown failure; a second cleanup failure is reported separately. If cleanup fails after an otherwise successful body, the test fails because its state contract was not restored. In a real framework you may aggregate errors, but do not silently suppress them.

**Common pitfalls:** assuming `contexts[1]` always selects the intended page; copying a native accessibility selector into web context; calling a cleanup failure a pass because the body passed; forgetting that code in `experiments/` needs different relative imports and explicit typecheck inclusion.

After a successful switch back, verify a known native control in a separate successful-path check. An already failed assertion prevents ordinary later lines from running, so a deliberately failing test needs its cleanup observation inside the cleanup path or in recorded diagnostics.

[Next lesson](../lessons/12-browserstack.md)
