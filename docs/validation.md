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

## Finalization checkpoint

### Study themes — 22 October 2026

Added a System/Light/Dark selector, an early theme script and dark screen styles.
The preference uses its own browser storage key; no progress schema, learner
exercise, mobile test or dependency changed.

- `npm run course:check` passed documentation/structure checks.
- `npm run course:test` passed all 73 reader/storage/profile checks, including
  serving the new theme script locally and in the static export.
- `npm run course:build` exported all 186 readable files and the theme asset.
- Focused browser QA on a disposable localhost origin verified selecting Dark,
  persistence after reload, switching back to Light and selecting System.
  The dashboard, lesson text, code blocks, tables and expandable hints were
  inspected in dark mode at desktop and narrower in-app browser widths.

This is reader UI verification, not Android/BrowserStack execution or a complete
accessibility/cross-browser audit. Live OS appearance changes, restricted-storage
behavior and printed output were not exercised in the browser; their handling
was reviewed in the source. Historical device results below retain their dates.

### Subsequent real-world challenge path — 21 October 2026

Added 12 work assignments in four stages, a dedicated reader route, per-challenge
notes/completion and progress compatibility protections. Existing lesson IDs,
starters, reference solutions, mobile specs and the 100-item practice index remain
unchanged. New cases link to runnable local tasks and explicitly separate Node,
Android, cloud and simulated evidence.

- `npm run check` passed: both type checks, course structure/local links,
  72 reference lab cases and 27 framework checks.
- `npm run course:test` passed 73 checks. Added/extended coverage verifies old
  lesson backup merging, challenge notes across full server restart, separate CLI
  completion counts, backup/import, hosted key migration, retained recovery drafts,
  rejection of old reader writes and rejection of old running servers.
- `npm run course:build` exported 186 readable files. The HTTP reader/static
  checks load all challenge pages and preserve the existing course/library pages.
- The CH-10 packet was extracted, typechecked and executed with the reference
  summary helper in a disposable directory. Both documented summaries matched.
  This did not modify or complete the learner's starter.
- Desktop static-preview QA opened the challenge route from the homepage and
  sidebar, navigated between assignments, saved a test-only note and completion,
  reloaded to verify persistence, and confirmed the lesson count remained 0/16
  while the challenge count became 1/12. QA used a separate localhost origin;
  the learner's database and hosted progress were not edited. The code-input
  prediction table was changed to a code block after browser inspection showed
  that whitespace was not sufficiently clear in the table.

No Android or BrowserStack session was run for this change. The new device tickets
are learner assignments using the existing framework; their outcomes are not
claimed here. This was focused desktop QA, not a full accessibility, mobile
viewport or cross-browser audit. Check the pushed commit's CI separately when
making a current CI claim.

### Subsequent beginner extension — 21 October 2026

The [beginner review](beginner-review.md) adds five preparation guides, 18
small exercises and visible reader entry points. The 20 October closeout below
remains a historical checkpoint. Existing lesson/exercise text is retained;
learner starters, reference implementations, mobile specs and data storage code
were not changed.

- `npm run check` passed: both type checks, course structure/links, 72 reference
  cases and 27 framework checks. `npm run course:test` passed all 68 checks.
- `npm run course:build` exported 173 readable files, including all new guides.
- Ten complete TypeScript code blocks were extracted from the new guides into
  disposable files. All typechecked; nine produced the documented successful
  output and the missing-value example produced its intentional error.
- Four deliberate type mistakes and three deliberate assertion failures were
  detected; the object deep-equality example passed. The initial literal-string
  comparison in P2 exposed a TypeScript diagnostic during review and was revised
  to compare its numeric length. The final example then passed.
- The untouched `npm run practice -- 01` produced its expected unfinished-starter
  failure. It was not replaced with a reference answer.
- In the static preview browser, the dashboard beginner cards and sidebar link
  opened the new route, the programming guide rendered its code blocks, and a
  hint expanded successfully. Card title/description spacing was corrected
  after visual inspection. This was a focused desktop check, not a complete
  mobile-viewport, accessibility or cross-browser audit.

These are documentation/offline checks. Android, BrowserStack and a second
account's Site were not executed. PowerShell examples were not run on this Mac.
The preparation route has not been evaluated in a novice-user study.

### Original closeout — 20 October 2026

The [20 October closeout](PROJECT-CLOSEOUT.md) records a fresh full offline
check: 72 reference cases, 27 framework checks, 68 reader/storage checks, zero
audit findings, verified APK bytes and a successful progress-backup restore
into a disposable database. Documentation/static export were checked after
the closeout additions. Android/cloud results below retain their original
execution dates and scope; they were not rerun for finalization.

## Account portability and local database checks

The 20 October extension adds SQLite for localhost progress, per-window browser
recovery drafts, JSON backup/import commands and separate Site account profiles.

- `npm run check` passed: both TypeScript projects, documentation, **72**
  reference lab cases and **27** framework checks.
- `npm run course:test` passed **68 checks**. Coverage includes a real server
  process restart, revision conflicts, blank/removed notes, backup round-trips,
  corrupt/future database refusal, same-origin writes, interrupted saves,
  separate browser drafts, migration replay prevention, malformed save
  acknowledgments and Site profile isolation.
- `npm run audit` reported **zero vulnerabilities**.
- `npm run course:build` produced the static reader. Export tests exclude
  tracked credential/progress fixtures and SQLite data, including backups.
- In a disposable local database on a separate port, the browser saved a
  synthetic lesson note and completion mark. Both appeared after restarting
  the server and reopening the page. The save-status panel was checked while
  the notes field was visible. This is a focused manual check, not a full
  cross-browser audit.
- The backup CLI produced a JSON export from that saved record. The
  `second-account` profile was initialized without copying the original Site
  identity or publishing anything.

No second-account sign-in or Site publication was performed for this extension.
Registration must occur with Sites tools while signed in to the intended
account. Android and BrowserStack were not rerun: this change concerns the
reader, data storage and handover. Local SQLite and hosted browser progress do
not sync automatically. See [local data](handbook/local-data.md) and
[account handover](handbook/account-handover.md).

## Earlier localhost and static hosting checks

The hosting extension adds a static course export and a separate OpenAI Sites
source checkout. The live local reader still reads the current project files.

- `npm run check` passed: types, documentation, 72 reference lab cases and
  27 framework checks.
- `npm run course:test` passed **24 checks**, including seven static-export
  checks: all exported pages match the local renderer, the static data client
  works over HTTP without Node API routes, browser modules are served,
  untracked/private files are excluded, symlinks are rejected, and failed
  builds preserve the previous output.
- CI also runs `npm run course:build` to catch missing tracked pages and
  packaging regressions.
- The static reader was opened in the in-app browser on a separate localhost
  port. The dashboard, S4 practice search, section navigation and incident
  text layout were checked. This is a focused browser check, not a complete
  cross-browser or mobile viewport audit.

These are reader/build checks. Android and BrowserStack were not rerun for
this earlier hosting change. That version used browser storage for every reader;
the later database extension above changes localhost storage only.
See the [hosting guide](handbook/hosting.md) for access and publishing steps.

## Executed checks

| Check | Result and scope |
|---|---|
| `npm run test:login` | **Passed:** three device tests, including both-empty validation |
| `npm run test:android` | **Passed:** all seven tests in three spec files after dependency maintenance; run took 1m 13s |
| `npm run typecheck` | Passed for framework configuration, helpers, screen objects and mobile specs |
| `npm run typecheck:practice` | Passed for offline starters, references and tests |
| `npm run preflight` | Passed against this Mac's installed SDK, Java compiler, dependencies, driver and booted emulator |
| `npm run practice:solutions` | **Passed:** 72 test cases across twelve labs after the incident-practice review |
| `npm run practice -- 01` before learner edits | Failed as designed: the unfinished starter throws; it is not pre-solved |
| `npm run course:check` | **Passed:** sixteen lessons, 48 exercise/solution pairs, twelve lab structures, 100 indexed practice items and local Markdown links |
| Reader test suites | **Passed:** seventeen checks covering the server, progress backups and practice search, including every indexed heading target; run with `npm run course:test` |
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

The first two passes of the [coverage review](coverage-review.md) added learning
material and four offline helpers. The second also added reader search and a
portable handover guide. These results are historical; the third pass follows.

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

## Incident-practice review checks

The third pass adds repair labs 11–12, eight workplace cases and six incident
shifts. It adjusts the study plan to one core task per session with evidence gates.
Mobile specs, runtime configuration and dependencies were not changed.

- `npm run check`: both TypeScript projects, course structure/local links,
  **72 reference lab tests** and **27 framework checks** passed.
- `npm run course:test`: **17 checks** passed, including the new shift category
  and all **100** indexed heading targets.
- Each new starter passes some checks and fails the intended causal assertion.
  These are deliberately faulty repair exercises, not blank stubs.
- Disposable incomplete repairs (copied array with shared item objects; unchecked
  reconciliation receipt) were caught by the existing lab tests.
- The Warsaw spring-midnight example was checked against runtime timezone data:
  a **23-hour** interval. The three input examples have UTF-16 lengths **1, 2, 5**.
- New reveal and answer blocks were checked for balanced markup.

No emulator, real backend, cloud device or destructive cleanup was run during
this pass. The new cases and shifts are fictional training evidence. See the
[incident review execution record](evidence/incident-review.md).

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
