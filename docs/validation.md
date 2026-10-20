# Validation record

**Prepared and reviewed:** 20 October 2026. This records checks performed while building the course,
not a permanent guarantee about future installations, devices, or app builds.

## Tested environment

| Component | Observed baseline |
|---|---|
| Host | macOS, Apple Silicon |
| Node / npm | 24.22.0 / 11.19.1 |
| Appium / UiAutomator2 | 3.8.0 / 8.7.0 |
| WebdriverIO | 9.x; exact packages recorded in `package-lock.json` |
| TypeScript / Chai | 5.9.3 / 5.3.3 |
| Android | `Pixel_8_API_35` emulator, Android 15 / API 35 |
| App | WebdriverIO native demo app 2.2.0, package `com.wdiodemoapp` |

Use `npm ci` to install the locked dependencies. The Android SDK, emulator image,
Java runtime, and externally installed Appium extensions also affect reproducibility.
See the [setup manual](handbook/setup.md).

## Executed checks

| Check | Result and scope |
|---|---|
| `npm run test:login` | **Passed:** three device tests, including both-empty validation |
| `npm run test:android` | **Passed:** all seven tests in three spec files after the second review; run took 1m 18s |
| `npm run typecheck` | Passed for framework configuration, helpers, screen objects and mobile specs |
| `npm run typecheck:practice` | Passed for offline starters, references and tests |
| `npm run preflight` | Passed against this Mac's installed SDK, Java compiler, dependencies, driver and booted emulator |
| `npm run practice:solutions` | **Passed:** 31 test cases across six labs |
| `npm run practice -- 01` before learner edits | Failed as designed: the unfinished starter throws; it is not pre-solved |
| `npm run course:check` | **Passed:** sixteen lessons, 48 exercise/solution pairs, six lab structures and local Markdown links |
| Reader test suites | **Passed:** five server and six progress test groups, including every lesson, solution and library page, module routes, file restrictions and backup merging; runnable together with `npm run course:test` |
| `npm run framework:test` | **Passed:** eight mocked regression checks for preflight and failure diagnostics |
| Reader in the browser | Verified lesson rendering/navigation, section links, malformed-link recovery, progress import, conflict preservation, downloaded export contents and reload persistence |
| Failure diagnostics with a mocked session | Verified distinct PNG/XML names for repeated titles and preservation of the original failure when capture fails |
| Cloud credential guards with placeholders | Rejected before session creation; no credential values printed |
| Hosted GitHub Actions | [Run 39427787762](https://github.com/i5adovyi/is-qa-appium/actions/runs/39427787762) passed for published commit `4f04bd9`; a later commit needs its own run |

Latest saved command output: [review Android run](evidence/review-android-run.md)
and [review local checks](evidence/review-local-checks.md). The earlier
[Android baseline](evidence/android-reference-run.md) and [local baseline](evidence/local-checks.md)
remain as historical snapshots. The review Android command began
at 13:49:44 UTC on 20 October 2026 and exited successfully. It covered text echo,
switch toggling, clearing input, valid login, invalid login, empty login, and launch.
The passing Login run logged two stale-element warnings while the UI changed; no
test-level retries were enabled. Keep those observations distinct from failed tests.

The reference lab test count is not a measurement of product coverage. Device tests,
pure TypeScript tests, and HTTP server tests establish different things. The browser
checks are manual observations, not a complete accessibility or cross-browser audit.
The backup check used synthetic notes on a separate local origin. It confirmed the
downloaded JSON contains the merged completions and preserved current note.
See [review findings](review-notes.md) for the changes and targeted fault experiments.

## Android lesson learned during validation

The empty-login test seeds real input, clears it, checks the empty state, verifies no
old validation messages are present, then submits and checks both exact messages.

On the tested Android build, `getText()` on an empty input returns the placeholder
`Email` or `Password`. Its XML hierarchy marks the control `showing-hint="true"`.
A direct attribute read was rejected by this driver, so the screen object uses a
narrow XPath combining the field's accessibility identifier and that observed hint
flag. This is documented in [lesson 07](lessons/07-login.md), rather than hidden as a
magic selector. Reinspect this behavior when changing app builds or drivers.

An earlier emulator run also encountered an offline-device failure. The emulator was
restarted, then the tests were rerun. This is environment evidence, not proof that an
assertion or app feature was wrong. No test retries were added to conceal failures.

## Dependency review

The installation audit initially reported **39 findings**. A compatible `npm audit fix`
reduced that to **38: 3 moderate, 28 high, 7 critical**. No forced major framework
upgrade or downgrade was applied. Remaining reports include Appium, WebdriverIO,
BrowserStack tooling and UiAutomator2 dependency chains.

These are npm audit package findings, including inherited dependency advisories;
they are not 38 separately demonstrated exploits in this course. Their reachability
has not been fully assessed. The audit result is a real limitation, so this project
should not be described as security-hardened or production-certified.

To reassess later:

```bash
npm audit
npm outdated
npm audit fix --dry-run
```

Review a proposed dependency change, then rerun `npm run check`,
`npm run course:test`, and the Android suite. A command suggesting `--force` is not
evidence that the resulting framework versions are compatible. Keep Appium bound
to localhost for these local exercises.

## Not executed or not supplied

- BrowserStack device sessions: require the learner's working account, credentials
  and an available device. The configuration and placeholder guards were checked;
  cloud device availability and behavior were not.
- Hosted CI for every future change: the linked run proves only its own commit.
  The latest commit's Actions status must be checked separately.
- iOS: no compatible build, Xcode/XCUITest setup, or validated iOS suite is supplied.
- Gesture and hybrid-context extensions: guided investigations, not guaranteed
  working scenarios in the default reference suite.
- Every possible learner solution: the supplied examples were reviewed, and the
  offline reference functions were executed; exploratory mobile modifications need
  their own device verification.
- Commercial certification, learner outcomes, or a market valuation: not assessed.
  The capstone rubric is for self-review and peer review.

The demo has simulated login behavior. It does not validate real authentication or
backend security. Restarting it resets in-memory state, not arbitrary persisted or
server-side data. External book content is linked, not redistributed.

[Course map](README.md) · [Troubleshooting](handbook/troubleshooting.md)
