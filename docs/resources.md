# Reading library: read with a purpose

This course's lessons, manuals, exercises, and solutions are original project material. The links below lead to official documentation, original reference material, and author/publisher book pages. Linked books are **recommendations**, not bundled copies. Purchase or borrow them legally if useful; no purchase is required to complete the core course.

Links were checked during preparation on **20 October 2026**. Documentation, device catalogs, and commercial availability can change. Match examples to this repository's installed versions rather than blindly copying the newest snippet.

## Start with these six references

| Resource | When to read | Reading assignment |
|---|---|---|
| [TypeScript Handbook: everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) | When variables, object fixtures, or function signatures are unclear | Write a typed fixture with `name`, `input`, and `expected` |
| [MDN: async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) | Before diagnosing missing `await` | Explain why a device command returns a promise |
| [Mocha: hooks](https://mochajs.org/features/hooks/) | Before adding shared setup | State exactly when `beforeEach` runs and what it guarantees |
| [Chai: expect/should assertions](https://www.chaijs.com/api/bdd/) | When choosing an assertion | Compare strict equality with deep equality using your own data |
| [WebdriverIO: selectors](https://webdriver.io/docs/selectors) | During Inspector practice | Explain the difference between accessibility ID, resource ID, and XPath |
| [WebdriverIO: waitUntil](https://webdriver.io/docs/api/browser/waitUntil) | During lesson 09 | Write a read-only predicate with an actionable timeout message |

Read only the section that solves your current problem, then apply it. Collecting bookmarks without writing or debugging a test is not practice.

## Environment and architecture

| Official source | What it helps you answer |
|---|---|
| [Node downloads](https://nodejs.org/en/download) | How do I obtain the Node major used by this project? |
| [Appium system requirements](https://appium.io/docs/en/latest/quickstart/requirements/) | What does the server require, and what is driver-specific? |
| [UiAutomator2 driver repository](https://github.com/appium/appium-uiautomator2-driver) | Which Android capabilities and runtime prerequisites apply? |
| [Android virtual-device management](https://developer.android.com/studio/run/managing-avds) | How do hardware profiles, system images, and AVDs fit together? |
| [Android environment variables](https://developer.android.com/tools/variables) | Which directory belongs in `ANDROID_HOME`? |
| [Appium Inspector installation](https://appium.github.io/appium-inspector/latest/quickstart/installation/) | How do I obtain the tool used to inspect the UI hierarchy? |
| [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app) | What app is under test, and where do its release artifacts and source come from? |

Assignment: draw the path from `it(...)` through the client, Appium server, UiAutomator2, and Android app. Label where a missing selector differs from a missing device.

## Advanced mobile work

| Reference/article | Use it for | Produce this artifact |
|---|---|---|
| [WebdriverIO mobile commands overview](https://webdriver.io/docs/api/mobile) | Understand the mobile helper layer | A list of which commands your extension requires |
| [UiAutomator2 mobile gesture reference](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/android-mobile-gestures.md) | Check Android gesture arguments | A bounded gesture and its observable postcondition |
| [WebdriverIO swipe](https://webdriver.io/docs/api/mobile/swipe) | Compare a high-level helper with platform mechanics | A short choice rationale for your scenario |
| [Appium: managing contexts](https://appium.io/docs/en/latest/guides/context/) | Understand native/web context separation | A native-versus-web locator comparison |
| [WebdriverIO getContexts](https://webdriver.io/docs/api/mobile/getContexts) | Inspect actual session contexts | A redacted capability report |
| [WebdriverIO switchContext](https://webdriver.io/docs/api/mobile/switchContext) | Select a context intentionally | A cleanup strategy that returns to native |
| [Android permission workflow](https://developer.android.com/training/permissions/requesting) | Distinguish granted, denied, and revoked states | A permission-state table for a real feature |
| [Android activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle) | Separate navigation, backgrounding, and restart | A state-retention question with an explicit oracle |
| [WebdriverIO background](https://webdriver.io/docs/api/mobile/background/) | Apply a deliberate interruption | A bounded background/return candidate with a postcondition |
| [Android Logcat](https://developer.android.com/tools/logcat) | Investigate device/app process failures | A bounded, redacted excerpt linked to a reproduction |

These are investigation references. Their existence does not mean the repository has verified every feature or platform. Keep unsupported experiments labeled and separated from the default suite.

Use the project's [permissions and lifecycle manual](handbook/mobile-state.md) to connect these references to the current restart helper and automatic-grant settings. A missing demo feature is a scope boundary, not a reason to invent a passing example.
## Cloud and delivery

| Reference | Read when | Apply it by |
|---|---|---|
| [BrowserStack: WebdriverIO App Automate guide](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio) | Preparing lesson 12 | Trace authentication, APK upload, target selection, and result location |
| [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) | Preparing remote execution | Explain how credentials reach the job without entering the repository |
| [GitHub workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data) | Designing failure evidence | Choose explicit paths, audience, and retention |

Assignment: compare a static CI pass, a local emulator pass, and a real cloud-device pass. Write one claim each supports and one claim it does not support.

## Optional books

| Book and primary source | Best point in this course | Why read it / practice afterward |
|---|---|---|
| **Effective TypeScript**, Dan Vanderkam — [author site](https://effectivetypescript.com/) | After basic TypeScript feels comfortable | Deepen type reasoning. Refactor one fixture/helper while keeping behavior and assertions unchanged. |
| **Effective Software Testing**, Maurício Aniche — [publisher page](https://www.manning.com/books/effective-software-testing) | During test-data and test-design lessons | Strengthen systematic test design. Build a boundary table and explain which cases belong below the UI. |
| **Testing JavaScript Applications**, Lucas da Costa — [publisher page](https://www.manning.com/books/testing-javascript-applications) | After you can independently write mobile tests | Broaden understanding of JavaScript testing layers and tradeoffs. Propose a layered strategy for a real app with source access. |

These books develop durable ideas; they are not exact Appium 3 configuration manuals. Use current official tool documentation for APIs. Edition, format, price, and access depend on the publisher or library and are not guaranteed here.

## How to evaluate an outside tutorial

Before adopting its code, check:

1. Which Appium, driver, WebdriverIO, Node, and assertion-library versions does it use?
2. Is the example native Android, native iOS, mobile web, or hybrid?
3. Does its `expect` come from Chai or WebdriverIO?
4. Does it explain initial state and waits, or rely on sleeps?
5. Does it demonstrate a failed assertion and diagnostics?
6. Are selectors inspected, or copied from a different app build?
7. Does it require insecure server options without explaining why?

Translate one useful idea into this repository, run the smallest relevant check, and record what you verified. That is more valuable than adding another untested framework layer.

[Course index](README.md) · [Study plans](handbook/study-plans.md)
