# 11 · Gestures and hybrid app exploration

**Stage:** Diagnose and explain\
**Estimated time:** 120–180 minutes, plus environment investigation if needed\
**Prerequisites:** Lesson 10, working Android emulator, Appium Inspector.\
**Outcome:** Design a gesture around a visible outcome and explain native versus WebView contexts.

> **Exploratory lab:** These are extension tasks, not claims that the baseline suite has validated gestures or hybrid automation. A successful native suite does not prove that a compatible ChromeDriver, debuggable WebView, or internet access is available. Keep experiments out of the default spec directory until they are reliable.

## A gesture is an action, not an assertion

“Swipe command succeeded” proves the driver accepted an action. It does not prove the carousel advanced. Before writing a gesture, inspect the screen and identify something observable: a card title, position indicator, or a revealed control.

Screen coordinates depend on orientation, resolution, system bars, and the area receiving the gesture. Prefer an inspected container's bounds to coordinates copied from a screenshot.

## Worked example: Android-specific swipe mechanics

Inside a connected test session, after inspecting and locating the intended carousel container:

```ts
// `container` is an element you found in Inspector, not a supplied selector.
const location = await container.getLocation()
const size = await container.getSize()
await driver.execute('mobile: swipeGesture', {
    left: location.x,
    top: location.y,
    width: size.width,
    height: size.height,
    direction: 'left',
    percent: 0.75,
})
```

This uses the UiAutomator2 extension rather than promising identical behavior on iOS. A production test must then wait for the inspected next card's identifying state. A visible title alone may be insufficient if off-screen cards remain in the hierarchy; investigate actual visibility and carousel structure.

Read the [UiAutomator2 gesture reference](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/android-mobile-gestures.md) for the installed driver's supported arguments. WebdriverIO also supplies a [swipe helper](https://webdriver.io/docs/api/mobile/swipe), whose abstraction is useful after you understand the underlying motion.

## A context changes how elements are found

Native controls use the accessibility hierarchy. Web content has a DOM and browser locators. The two can coexist in one app. Discover what the session exposes before switching:

```ts
const contexts = await driver.getContexts({ returnDetailedContexts: true })
console.log(contexts) // Demo environment only; inspect URLs before sharing logs.
```

After you identify the actual WebView URL/title, select it deliberately:

```ts
let bodyFailed = false
try {
    await driver.switchContext({ url: /webdriver\.io/ })
    // Now inspect and assert a stable DOM element in the actual loaded page.
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

The URL pattern is an **example for the demo's WebdriverIO content**, not a promise about its current remote page. Verify what loads. A context switch is not proof that the page has finished loading. Read [context discovery](https://webdriver.io/docs/api/mobile/getContexts) and [switching contexts](https://webdriver.io/docs/api/mobile/switchContext) for current behavior.

The nested cleanup catch preserves the original failure if returning to native also fails. If the body succeeded but cleanup failed, cleanup correctly fails the test. A plain `finally { await switchContext(...) }` can replace the original error with the cleanup error. Do not cache a native element and then use it as a web element; locate controls in the context where they belong.

## Guided lab

1. Run `npm run test:smoke` to establish a native baseline.
2. Stop the runner. Start `npx appium --address 127.0.0.1 --port 4723`.
3. Connect Inspector using the capabilities in [setup](../handbook/setup.md). Manually inspect Swipe and Webview. Record labels, bounds, and contexts; avoid assuming selector names.
4. End Inspector and stop its server before running WebdriverIO.
5. Create an exploratory spec in `experiments/gestures.spec.ts` with a narrow scenario and screen setup. Because this file is one directory shallower than `test/specs`, imports of shared helpers use paths such as `../test/helpers/restartApp.js` and `../test/screens/TabBar.js`. The experiment must supply its own `describe`, `it`, imports, and navigation to the inspected screen; the fragments above alone are not complete specs. Run it explicitly:

   ```bash
   npx wdio run config/wdio.android.conf.ts --spec experiments/gestures.spec.ts
   ```

6. The baseline TypeScript configuration includes `config/` and `test/`; it does not typecheck `experiments/`. While developing the extension, add `"experiments/**/*.ts"` to its `include` list and run `npm run typecheck`. This changes typechecking coverage without adding the experiment to default mobile execution.
7. Keep a capability report if execution is blocked. A precise report is a valid exploration deliverable; it is not a passing automated test.

## Exercises

### 11-A · Swipe with evidence

Automate one carousel transition. Capture the initial identity, perform one bounded gesture, then assert a meaningful changed identity. Add a maximum-attempt bound if seeking a later card.

**Acceptance:** documented inspected selectors; expected before/after state; no unbounded swipe loop; observed device/version recorded.

<details><summary>Hint 1 · Define success before motion</summary>
Choose the expected destination, not merely “something changed.”
</details>
<details><summary>Hint 2 · Bound the search</summary>
After at most five attempts, fail with the target and last observed card. Do not swipe forever when the target is wrong.
</details>

### 11-B · Write a hybrid capability report

Inspect the available contexts after opening Webview. Attempt switching only if an appropriate context exists. Record app version, WebView version if known, context metadata, and the first relevant error.

**Acceptance:** report says either “executed with evidence” or “blocked with cause”; no claim of support based only on seeing `NATIVE_APP`; no blanket `--relaxed-security` recommendation.

<details><summary>Hint 1 · Native and web have different dependencies</summary>
ChromeDriver compatibility matters after a WebView becomes available; its absence cannot explain a native Forms locator failure.
</details>
<details><summary>Hint 2 · Separate three stages</summary>
Distinguish context discovery, successful switching, and an actual DOM assertion.
</details>

### 11-C · Recover the native context

Write an exploratory hybrid test that returns to native in `finally`. Deliberately fail a web assertion, then show how cleanup behaves. Add a native-navigation observation when the session remains usable.

**Acceptance:** cleanup is attempted after failure; the original failure remains understandable; successful navigation is claimed only if observed; an unusable session is reported rather than hidden.

<details><summary>Hint 1 · Cleanup should not depend on passing assertions</summary>
Code below a failed assertion never runs; a `finally` block does.
</details>
<details><summary>Hint 2 · Two failures can occur</summary>
If cleanup also fails, retain both pieces of evidence rather than replacing the original error with an unrelated success message.
</details>

## Checkpoint

- Why can native text and a WebView DOM require different locators?
- What extra evidence is needed after a successful gesture command?
- What must be reconsidered before moving this Android experiment to iOS?

[Solutions](../solutions/11-gestures-and-contexts.md) · [Next: BrowserStack](12-browserstack.md) · [Course index](../README.md)
