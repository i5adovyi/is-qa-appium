# Learning library: watch, read, then practise

This course's lessons, manuals, exercises, and solutions are original project material. The links below lead to official documentation, original reference material, and author/publisher book pages. Linked books are **recommendations**, not bundled copies. Purchase or borrow them legally if useful; no purchase is required to complete the core course.

Links were checked during preparation on **20 October 2026**. Documentation, device catalogs, and commercial availability can change. Match examples to this repository's installed versions rather than blindly copying the newest snippet.

**23 October update:** the short video shelf and selected study pairings below
were checked against provider, author and official project pages. This is a
focused link/content review, not a claim that every older link or full video
course was revalidated. No purchase or extra subscription is needed for the
project's core path.

## Choose one resource for today's task

Set a 10–20-minute reading/viewing budget, then spend the rest of the session
making or explaining something. Times below are suggested study slices, not
provider course durations. Use [today's session guide](handbook/study-session.md)
if the choice itself feels like work.

| Need right now | One resource / suggested slice | Follow with this project task | Stop when you can show |
|---|---|---|---|
| “I cannot read a function yet” | JavaScript introduction below; one chapter | [Programming first steps](handbook/programming-first-steps.md), one exercise | Your prediction, output and a changed input |
| “What do team members mean by test layers?” | [Team testing foundations](handbook/testing-foundations.md#f1-name-the-check-precisely); 15 minutes | Its scope-versus-purpose exercise | Four scope/purpose classifications and the limits of their evidence |
| “How does Appium reach the app?” | Appium Java course overview below; focus on architecture | [00-A](lessons/00-orientation.md#00-a-trace-one-command) in lesson 00 | Explain the client/server/driver/device path without copying the slide |
| “My element changes while I wait” | [WebdriverIO retry guidance](https://webdriver.io/docs/retry); distinguish test retries from observation | [Lab 13](../exercises/13-stale-observation/README.md) | A bounded repair that preserves unrelated errors |
| “Scrolling finds the wrong row” | [Android gesture reference](https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/android-mobile-gestures.md); one relevant gesture | [Lab 14](../exercises/14-bounded-scroll/README.md), then [device practice](handbook/device-practice.md) when ready | Logical identity, an end condition and an honest simulation/device boundary |
| “I have a failure but no diagnosis” | [Google SRE troubleshooting chapter](https://sre.google/sre-book/effective-troubleshooting/); hypothesis section | [Incident shift S1](handbook/incident-shifts.md#s1-the-requirement-changes-after-you-wrote-the-test) or one chosen shift | Two competing explanations and a distinguishing observation |
| “I need stronger test design for interviews” | *Effective Software Testing* below; one relevant section, or free [lesson 14](lessons/14-test-design.md) | [Practical drill D9](handbook/interview-drills.md#d9-design-tests-from-a-small-checkout-requirement) | A risk-ranked test table and a defensible oracle |

## Short video and course shelf

The two Test Automation University courses are part of its
[free learning programme](https://testautomationu.applitools.com/demo-course/chapter1.html).
Public chapter pages include written material; use it if video is inconvenient.
Provider sign-in and playback options can vary. Do not install a second stack
just to follow an optional video.

| Video/course and primary provider | Level, access and fit | Watch with this question / practical output |
|---|---|---|
| [Introduction to JavaScript — Test Automation University](https://testautomationu.applitools.com/javascript-tutorial/) | Beginner; free. Uses JavaScript in a browser, rather than this project's TypeScript/Node runner. | How do values travel into and out of a function? Recreate one small example in the programming workbook and explain which TypeScript annotation you added. |
| [Mobile Automation with Appium in Java — Moataz Nabil / Test Automation University](https://testautomationu.applitools.com/appium-java-tutorial/) | After basic programming; free. Java/Maven examples and older installation instructions (including Appium Desktop) differ from the pinned Appium 3/WDIO 10 project. Use selected concept chapters; follow this repository's setup for execution. | What belongs to the client, driver and app? Draw the command path, then inspect one locator using lesson 05. Do not copy Java imports or legacy capabilities into the TypeScript suite. |
| [Appium conference archives — official resource index](https://appium.io/docs/en/latest/resources/#conference-archives) | Intermediate elective; publicly linked recordings, mixed dates/languages. The index links the [AppiumConf 2024 playlist](https://www.youtube.com/playlist?list=PL9Z-JgiTsOYQaU5i5LJtAWlh5WVZPi3If). | Pick one talk about a problem you have encountered. Record its date/stack, one hypothesis to try, and the smallest check in this project. A conference talk is not an end-to-end setup course. |

The [official Appium resource list](https://appium.io/docs/en/latest/resources/)
also links other courses, including commercial providers. These are optional
discovery links; payment/access and whole-course compatibility were not assessed.
Start with the free shelf and the existing labs before buying another course.

Use this small note after any resource:

```text
Question I brought:
Resource + chapter/section + version/date:
Idea in my own words:
One experiment in this repository:
Actual result, or why execution remains pending:
One point I would explain to a teammate:
```

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

## Workplace and interview reference shelf

Use the [workplace cases](handbook/workplace-scenarios.md) and
[interview drills](handbook/interview-drills.md) to apply these sources:

| Primary source | Reading task |
|---|---|
| [Appium session capabilities](https://appium.io/docs/en/latest/guides/caps/) | Distinguish session negotiation, extension prefixes and runtime settings |
| [UiAutomator2 parallel tests](https://github.com/appium/appium-uiautomator2-driver#parallel-tests) | Identify device and port isolation needed beyond worker count |
| [Android core app quality](https://developer.android.com/docs/quality-guidelines/core-app-quality) | Choose three risks absent from a login-only suite |
| [Android process lifecycle](https://developer.android.com/guide/components/activities/process-lifecycle) | Explain why backgrounding, activity recreation and process death differ |
| [Android deep links](https://developer.android.com/training/app-links) | Separate OS link resolution from app routing and authorization |
| [Android accessibility testing](https://developer.android.com/guide/topics/ui/accessibility/testing) | Plan a task with assistive technology, beyond locator checks |
| [Android Macrobenchmark](https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview) | Separate app-performance measurements from test-runner duration |
| [XCUITest requirements](https://github.com/appium/appium-xcuitest-driver/blob/master/docs/getting-started/system-requirements.md) | List the prerequisites missing from an Android-to-iOS port |
| [OWASP MASVS](https://mas.owasp.org/MASVS/) | Identify authentication, storage and privacy checks outside functional UI coverage |
| [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods) | Explain why a timeout is not proof that a write did not occur |
| [SQLite SELECT](https://www.sqlite.org/lang_select.html) | Explain the left-join and grouping behavior in drill D3 |

Employer descriptions used as examples of workplace expectations are linked in
the [coverage review](coverage-review.md). They are not evidence of interview
question frequency. The practice questions and fictional situations are original
course material.

## Workplace investigation reading

For the workplace apprenticeship, read a focused section and apply it to one shift:

| Primary source | Apply it here |
|---|---|
| [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/) | Write two hypotheses and a discriminating observation before opening a shift's reveal |
| [AWS Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) | Explain why the lab 12 correlation key does not make duplicate creation safe |
| [Node 24 signal events](https://nodejs.org/docs/latest-v24.x/api/process.html#signal-events) | Explain the boundary of cleanup hooks in RW-31 |
| [MDN shallow copies](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) | Draw the shared references before repairing lab 11 |
| [MDN local date arithmetic](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate) | Separate calendar rules from elapsed durations in RW-32 |

## Optional books to deepen the foundations

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
