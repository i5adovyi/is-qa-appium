# Validation record

**Prepared and reviewed:** 20 October 2026. This records checks performed while building the course,
not a permanent guarantee about future installations, devices, or app builds.

## Tested environment

| Component | Observed baseline |
|---|---|
| Host | macOS, Apple Silicon |
| Node / npm | 24.22.0 / 11.19.1 |
| Appium / UiAutomator2 | 3.8.0 / 8.7.0 |
| WebdriverIO | 10.1.0; exact packages recorded in `package-lock.json` |
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
| `npm run test:android` | **Passed:** all seven tests in three spec files after dependency maintenance; run took 1m 13s |
| `npm run typecheck` | Passed for framework configuration, helpers, screen objects and mobile specs |
| `npm run typecheck:practice` | Passed for offline starters, references and tests |
| `npm run preflight` | Passed against this Mac's installed SDK, Java compiler, dependencies, driver and booted emulator |
| `npm run practice:solutions` | **Passed:** 58 test cases across ten labs after the second workplace/interview review |
| `npm run practice -- 01` before learner edits | Failed as designed: the unfinished starter throws; it is not pre-solved |
| `npm run course:check` | **Passed:** sixteen lessons, 48 exercise/solution pairs, ten lab structures, 86 indexed practice items and local Markdown links |
| Reader test suites | **Passed:** sixteen checks covering the server, progress backups and practice search, including every indexed heading target; run with `npm run course:test` |
| `npm run audit` | **Passed:** zero vulnerabilities after a clean `npm ci`; all dependency categories included |
| `npm run app:download` / `app:verify` | **Passed:** fresh download and pinned SHA-256/size verification |
| `npm run appium:setup` / `appium:doctor` | Project driver discovery passed; doctor reported zero required fixes and three optional tools absent |
| `npm run framework:test` | **Passed:** 27 checks covering preflight, diagnostics, APK integrity and mocked BrowserStack upload/launch behavior |
| Original reader in the browser | Previously verified lesson navigation, section links, malformed-link recovery and progress import/export; the later practice search has server/unit checks, not new visual verification |
| Failure diagnostics with a mocked session | Verified distinct PNG/XML names for repeated titles and preservation of the original failure when capture fails |
| Cloud credential guards with placeholders | Rejected before session creation; no credential values printed |
| Hosted GitHub Actions | [Run 39427787762](https://github.com/i5adovyi/is-qa-appium/actions/runs/39427787762) passed for published commit `4f04bd9`; a later commit needs its own run |

Latest saved evidence: [maintenance Android run](evidence/security-android-run.md)
and [dependency/verification record](evidence/security-maintenance.md). The maintenance
Android command began at 15:20:38 UTC on 20 October 2026 and exited successfully.
It covered text echo, switch toggling, clearing input, valid login, invalid login,
empty login, and launch. No test-level retries were enabled.

The [review Android run](evidence/review-android-run.md),
[review local checks](evidence/review-local-checks.md),
[Android baseline](evidence/android-reference-run.md) and
[local baseline](evidence/local-checks.md) remain historical snapshots of earlier
versions. The previous review run logged two stale-element warnings; that observation
belongs to that run, not the latest maintenance result.

The reference lab test count is not a measurement of product coverage. Device tests,
pure TypeScript tests, and HTTP server tests establish different things. The browser
checks are manual observations, not a complete accessibility or cross-browser audit.
The backup check used synthetic notes on a separate local origin. It confirmed the
downloaded JSON contains the merged completions and preserved current note.
See [review findings](review-notes.md) for the changes and targeted fault experiments.

## Workplace and interview extension checks

The [coverage review](coverage-review.md) adds learning material and four offline
helpers across two passes. The second pass also adds reader search and a portable
handover guide. Mobile specs, runtime configs and dependencies remain unchanged.

- `npm run check` passed, including both TypeScript projects, local documentation
  structure/links, **58 reference lab tests** and **27 framework checks**.
- `npm run course:test` passed **16 checks**, including full-text search/category
  filtering and verifying that each of the 86 index links targets a real heading.
- Labs 07–10 each failed with their expected unfinished-starter message.
  Their reference implementations passed; learner work remains intentionally undone.
- Eight deliberately broken helper implementations were caught in disposable copies
  across the two passes, including wrong API identity and unsafe integer amounts.
- Both SQL drill results were verified in an in-memory SQLite database.
- The three checkout pricing examples in D9 were independently calculated.
- Twenty-eight workplace case IDs, forty-eight interview question IDs, ten practical
  drill IDs and balanced expandable answer blocks were checked.

The Android suite and BrowserStack were **not run in these documentation/offline-lab
passes**. Earlier Android evidence remains historical. No new browser interaction
or visual reader verification is claimed. See [extension evidence](evidence/workplace-review.md).

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

The initial audit reported **39 findings**, reduced to **38** during the original
setup. The subsequent maintenance pass resolved all remaining findings: a fresh
`npm ci` followed by `npm run audit` reports **zero vulnerabilities**, including
development and optional dependencies.

The changes include WebdriverIO 10, explicit patched Appium dependency overrides,
and an unbundled UiAutomator2 8.7.0 package with unchanged driver code. BrowserStack
upload/status handling now uses its documented APIs through Node/WebDriver primitives.
See [dependency maintenance](handbook/dependency-maintenance.md) and
[driver provenance](../vendor/README.md) for exact versions and reproduction steps.

CI now fails on findings at any npm severity. This records known advisories at the
time of execution; it is not a certification that software has no vulnerabilities.

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
