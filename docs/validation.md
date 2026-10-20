# Validation record

**Prepared:** 20 October 2026. This records checks performed while building the course,
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
| `npm run test:android` | **Passed:** all seven tests in three spec files; final run took 2m 54s |
| `npm run typecheck` | Passed for framework configuration, helpers, screen objects and mobile specs |
| `npm run typecheck:practice` | Passed for offline starters, references and tests |
| `npm run practice:solutions` | **Passed:** 27 test cases across six labs |
| `npm run practice -- 01` before learner edits | Failed as designed: the unfinished starter throws; it is not pre-solved |
| `npm run course:check` | **Passed:** sixteen lessons, 48 exercise/solution pairs, six lab structures and local Markdown links |
| `npm run course:test` | **Passed:** four server test groups, including all lesson routes, source rendering, rejected paths and rejected writes |
| Reader in the browser | Verified dashboard, lesson search/navigation, lesson rendering, expandable hints, skip link, and notes/completion persistence after reload |
| Failure diagnostics with a mocked session | Verified distinct PNG/XML names for repeated titles and preservation of the original failure when capture fails |
| Cloud credential guards with placeholders | Rejected before session creation; no credential values printed |

Saved command output: [Android reference run](evidence/android-reference-run.md)
and [combined local checks](evidence/local-checks.md). These are dated build-time
snapshots; your own run produces current evidence. The final Android command began
at 12:45:51 UTC on 20 October 2026 and exited successfully. It covered text echo,
switch toggling, clearing input, valid login, invalid login, empty login, and launch.

The reference lab test count is not a measurement of product coverage. Device tests,
pure TypeScript tests, and HTTP server tests establish different things. The browser
checks are manual observations, not a complete accessibility or cross-browser audit.
Progress export is implemented; a downloaded export was not independently verified.

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
- GitHub-hosted Actions: workflow files are supplied, but no remote workflow run
  is claimed. The checks can be run locally.
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
