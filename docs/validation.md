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

### BrowserStack beginner review — 27 October 2026

Reviewed onboarding, reporting/advanced labs and workplace practice separately,
then cross-reviewed the beginner instructions against the actual runner/specs.
Added a short first-session guide and BI-13–BI-18, bringing the incident bank to
18 cards. The 15 academy lessons/30 lesson exercises remain, along with all
original course paths, starters and progress identifiers.

Resolved missing working-folder/file-saving instructions, ambiguous command
sequences, literal test-filter quoting, expected output/stop conditions,
credential-free preparation, baseline-versus-optional reporting choices and
returning safely from optional experiments. The course checker now verifies
all 18 sequential incident IDs, tasks, acceptance criteria and hidden reviews.

Observed on Node **24.22.0** / macOS:

- `npm run check` passed both TypeScript projects, course/link checks,
  **93 supplied reference cases** and **33 offline framework checks**.
- `npm run course:test` passed **83 reader/storage/profile checks**, including
  temporary local/static content checks. No personal progress was changed.
- `npm run course:build` exported **243 readable files**, including the new
  first-session page. `git diff --check` passed.
- Browser preview confirmed the academy's first-session link, the route guide
  and its readable desktop layout. This is a focused reader inspection, not
  a complete accessibility or mobile-device audit.

The added incidents are synthetic investigations. No paid cloud session, Android
run, optional reporter installation, analytics ingestion, tunnel or cloud workflow
was executed. Learner credentials, notes, database and starter code were preserved.
Deployment and CI for the new commit are separate checks; their current results
must be read from the actual version/run, not inferred from this local record.

### BrowserStack academy and second reporting review — 27 October 2026

Added a separate five-stage path with 15 lessons, 30 exercises, 12 synthetic
incident cards, evidence templates and a primary-source register. The original
16 lessons, 12 challenges, 24 topic assignments and 14 labs remain in place.
BS lesson identifiers do not join the completion/notes storage protocol. New
reader navigation and static export include the academy and its supporting pages.

Related execution improvements generate a build label once in the parent cloud
launcher and pass it to every worker; a regression checks propagation, separate
default attempts and preserved custom labels. The manual cloud workflow now
defaults to the selected Login smoke, with device/OS inputs and a retained
explicit all-specs option. Inputs enter the shell through environment variables
and a fixed scope dispatch, not interpolated command text.

Observed on Node **24.22.0** / macOS:

- `npm run check` passed both TypeScript projects, course/link checks,
  **93 supplied reference cases** and **33 offline framework checks**.
- `npm run course:test` passed **83 reader/storage/profile checks**, including
  disposable local/static HTTP loading and content comparison for every exported
  page. Catalog coverage includes all 15 new academy lessons.
- `npm run course:build` exported **242 readable files**; docs/link checks and
  `node --check course/app.js` passed. The manual workflow YAML parsed and its
  default smoke/device-input wiring was checked without dispatching it.
- Static-preview browser inspection verified the five-stage dashboard in the
  existing dark palette, a lesson-card route, next-lesson navigation, the
  reporting content, exercise deep-link focus and expandable review guidance.
  This was desktop inspection, not a complete accessibility/mobile-browser audit.
- The first sandboxed `npm run check` stopped at the existing disposable HTTP
  test with `listen EPERM`. With listener permission, the complete check passed;
  no learner starter was changed to repair that environment restriction.

Two research/review passes used primary BrowserStack, WDIO, Allure and GitHub
documentation. Corrected the cloud-only prerequisite contradiction, made the
reporter edit location and commands explicit, moved `.env` ignore checking
before credential entry, and corrected the CI exercise because GitHub expression
string equality is case-insensitive. Reviewed package metadata for optional
reporters; those packages were **not installed** into this baseline. The native
Local sample config was not readable through the research client, so the guide
links the official sample and explicitly avoids inventing its schema.

These are course/framework/reader checks, not cloud-device evidence. No Android
or BrowserStack session, optional JUnit/Allure/analytics ingestion, Local tunnel,
paid workflow or learner exercise was executed. No personal progress was marked,
credentials printed or learning data modified. First real BrowserStack execution
remains pending account access. GitHub CI and deployment results must be matched
to their pushed revision/saved version separately.

### Dependency audit repair during finalization — 27 October 2026

The first consolidation push, `56b1db5`, failed its
[GitHub audit job](https://github.com/i5adovyi/is-qa-appium/actions/runs/40464501408).
Installation passed; subsequent checks were skipped. The current audit reported
five affected packages arising from two advisories published after the earlier
zero-finding baseline: body-parser's compressed-body handling and
serialize-javascript's function escaping. The historical audit remains dated.

Added a body-parser **2.4.0** override to replace base-driver's exact 2.3.0 pin,
and resolved serialize-javascript **7.1.4** within Mocha's existing range. Only
those two resolved package versions changed. Appium 3.8.0, WebdriverIO 10.1.0,
the unbundled UiAutomator2 8.7.0 artifact, other overrides and CI audit threshold
remain unchanged. Advisory references and rationale are in
[dependency maintenance](handbook/dependency-maintenance.md).

Observed after the targeted repair on Node **24.22.0**:

- `npm ci` succeeded and `npm run audit` reported **zero vulnerabilities**.
- `npm run check` passed both type checks, documentation checks, **93 reference
  lab cases** and **32 framework checks**; `npm run course:test` passed **83 checks**.
- `npm run course:build` exported **223 readable files**; `npm run app:verify`
  confirmed the existing pinned APK, and `npm run appium:setup` found UiAutomator2 8.7.0.
- `npm run appium:doctor` reported **zero required fixes**, with three optional
  tool warnings (bundletool, ffmpeg and GStreamer). `npm run preflight` passed
  other checks but failed device selection because no Android device was online.
- A temporary Appium server accepted ordinary JSON and gzip bodies, returning
  the expected 404 for a nonexistent session. A malformed compressed body
  returned Appium's handled 500 response, and subsequent `/status` calls still
  succeeded. The initial probe expected 400/404 for that malformed body; after
  inspecting Appium's error mapping, the probe verified its actual 500/error body
  and continued server health. A focused serializer probe escaped a trailing
  script delimiter. Both temporary server processes were stopped.

These are installation, offline and HTTP checks, not an Android test pass or a
complete security assessment. No device session, BrowserStack execution or Site
publication was performed. Device compatibility after this dependency repair
remains unexecuted; the earlier emulator evidence retains its original scope.

### Branch and worktree consolidation — 27 October 2026

Reviewed all local branches and both worktrees, refreshed both configured Git
remotes, and checked GitHub for open pull requests: none were open in the course
repository. `main` was fast-forwarded from `7d08181` through the five maintenance
commits ending at `da1df1f`; both maintenance branches were then removed.

The clean personal learning worktree at `b932318` had separate saved progress.
Before retirement, its progress was exported with the supported CLI, a complete
Git bundle was verified, and all **17,597 regular files** in a compressed archive
were compared with the source using SHA-256; symbolic-link targets were checked
too. Recovery files are in the ignored local directory
`.local-data/archives/2026-10-27-worktree-cleanup/`. Git unregistered the worktree
but left some files behind; those remaining files were also moved into the
archive, with their stale Git pointer renamed. The complete compressed copy is
the recovery source. The local learning branch and unused remote were removed;
the separate private learning GitHub repository was preserved. The resulting
local inventory contains one worktree and only the `main` branch.

Observed on macOS with Node **24.22.0**:

- `npm run check` passed both TypeScript projects, documentation/link checks,
  **93 reference lab cases** and **32 offline framework checks**.
- `npm run course:test` passed all **83 reader/storage/profile checks** using
  disposable data, including local/static HTTP loading.
- `npm run course:build` exported **223 readable files**.
- Initial sandboxed check attempts could not open disposable localhost test
  servers (`listen EPERM`). Reruns with listener access passed without changing
  source. These permission failures were not project defects.

These checks validate consolidation of the existing implementation. No Android,
BrowserStack, learner exercise attempt or Site publication was run. Personal
data was preserved; no progress was merged or completion marked. Hosted CI is
separate evidence and must be matched to the final pushed commit.

### VS Code workflow guide — 25 October 2026

Added [Work with this project in VS Code](handbook/vscode.md), linked from the
README, course map, computer-basics workbook, usage guide and reader library.
The guide covers Markdown preview beside code, integrated-terminal execution,
offline/default/optional-app command selection, typechecking and personal notes.
The general usage guide now explicitly identifies the browser as optional.

- `npm run course:check` passed documentation structure and local-link checks.
- `npm run course:test` passed **83 reader/storage/profile checks** using
  disposable data, including local/static loading and HTTP comparison of all
  exported pages. The new guide was staged for export.
- `npm run course:build` exported **223 readable files**. The exported catalog
  lists the new guide and its page payload has the expected title/path. Source
  diff checks passed.
- VS Code preview, terminal and TypeScript selection instructions were checked
  against the linked official documentation. Repository-specific commands and
  configuration boundaries received an independent source review. Clarified
  that preflight verifies the default demo APK and optional apps require their
  selected artifact verification command.

This was documentation and reader verification, not a live VS Code GUI test.
No extensions/settings were installed or changed, no learner attempt or mobile/
cloud test was run, and no personal progress or hosted deployment was changed.

### Project usage guide — 25 October 2026

Added [How to use this project](handbook/how-to-use.md) with the reader/editor/
terminal workflow, route selection, an offline lab walkthrough, assignment and
Android execution guidance, and save/backup instructions. Linked it from the
README, course map, study-session guide, reader workbench and small-screen
navigation. Existing task IDs, learner files and progress storage are unchanged.

- `npm run course:check` passed documentation structure and local-link checks.
- `npm run course:test` passed **83 reader/storage/profile checks** with
  disposable data, including local/static page loading and HTTP comparison of
  every exported page. The new guide was staged for the tracked-file export.
- `npm run course:build` exported **222 readable files**. Node **24.22.0** was
  used; source diff checks passed.
- Focused browser inspection on a separate static-preview origin, port 4193,
  verified the guide title/content, code blocks and the new **Browse course**
  entry. Selecting that entry closed the menu and focused the guide heading.
- Independent source review checked command meanings, reader labels and the
  distinction between learner work and references. Corrected the extra-test
  advice: the lab runner selects `exercise.test.ts`, so adding a separate test
  file does not automatically include it in `npm run practice -- 01`.

This verifies documentation and reader integration. Installation commands,
learner attempts, Android tests, BrowserStack and Site publication were not
executed for this change. No personal progress was edited or marked complete.
The Android evidence below retains its original date and scope.

### Optional training apps: live Appium validation — 23 October 2026

Executed both pinned optional fixtures on the existing **Pixel_8_API_35** AVD,
serial `emulator-5554`, Android **15 / API 35**, `arm64-v8a`, on macOS Apple Silicon.
Used Node **24.22.0**, Appium **3.8.0**, UiAutomator2 **8.7.0** and the locked
WebdriverIO **10.1.0** dependencies. `npm run appium:setup` confirmed the installed
driver. Both APK downloads passed the manifest's SHA-256 and size verification.
Neither optional package was installed before this session's first run; Appium
installed and launched them successfully. The existing AVD was started without
wiping its data or saving a replacement snapshot.

Commands, run sequentially against the explicitly selected emulator:

```bash
ANDROID_UDID=emulator-5554 npm run test:training -- saucelabs --spec test/training/saucelabs/reference/compatibility.spec.ts
ANDROID_UDID=emulator-5554 npm run test:training -- apidemos --spec test/training/apidemos/reference/compatibility.spec.ts
```

| Fixture | Final result | Observed assertions |
|---|---|---|
| Sauce Labs native My Demo App 2.3.0, version code 27 | **2/2 passed**, zero test retries | Exact backpack identity; quantity 2, unit price $29.99 and total $59.98; decrease to quantity 1 / $29.99; remove to empty cart; a populated cart is empty after a fresh session |
| Appium ApiDemos 6.1.2, version code 47 | **3/3 passed**, zero test retries | Scoped preference checkbox false → true → false; saved true state survives terminate/activate but resets to false in a fresh session; an observed native dialog closes with Back and its underlying screen remains visible |

Final suite executions began at **17:02:24 UTC** (My Demo App, 36 seconds) and
**17:03:01 UTC** (ApiDemos, 45 seconds). These five cases are separate from the
default seven WebdriverIO demo reference tests and from learner assignments.
Exploratory launch/hierarchy probes are not counted as additional final cases.

Successful checkpoints saved **9 PNG/XML pairs** locally. The cart and dialog
screenshots were also visually inspected. Evidence is ignored, not committed or
published:

- `logs/training-validation/saucelabs-compatibility-2026-10-23.log`
- `logs/training-validation/apidemos-compatibility-2026-10-23.log`
- `logs/training-validation/saucelabs/2026-10-23T17-02-24-705Z-4722/`
- `logs/training-validation/apidemos/2026-10-23T17-03-02-524Z-4941/`

No install/launch/runner defect was found within the tested scope. Added reusable
maintenance specs using locators inspected from the actual UI. In particular,
the ApiDemos hierarchy repeats checkbox resource IDs, so the test scopes its
checkbox to the exact preference title; the cart row shows unit price separately
from the total. Corrected the guide's unexecuted status and clarified that
`noReset: false` can clear selected app data/permissions at session start, not
before every test. The references explicitly reload sessions for isolation and
verify the resulting UI state; the default runner configuration is unchanged.

Project verification after adding the checks and documentation:

- `npm run check` passed both TypeScript projects, documentation checks,
  **93 reference lab cases** and **32 offline framework checks**. Its first
  sandboxed attempt hit `listen EPERM` in the disposable loopback API lab;
  rerunning with local listener access passed without a source change.
- `npm run course:test` passed **83 reader/storage/profile checks**, including
  HTTP comparison of every exported page with the local renderer. It used
  disposable data; the new reference sources were staged for export.
- `npm run course:build` exported **221 readable files**, including the two
  compatibility specs and evidence helper. Source diff checks passed.
- An independent source review found no actionable test/runner issues. The
  local Appium service had stopped after the runs (port 4723 had no listener).

This is one emulator/OS baseline with focused native flows, not full app testing.
Checkout, authentication/payment/backend behavior, permission prompts/denial,
WebViews, scrolling/gestures, other Android versions, physical devices, iOS,
BrowserStack, hosted CI and Site publication were **not exercised**. Default
WDIO-demo mobile tests were not rerun for this change. Learner files, completion
marks and personal reader data were not changed. Earlier unexecuted-app notes
below describe their historical implementation checkpoint.

### Topic assignments and optional training apps — 23 October 2026

Added the [24-ticket assignment bank](assignments/README.md), eight topics with
L1/L2/L3 complexity, reader filters, and [two optional Android fixtures](handbook/training-apps.md).
The new assignment IDs do not change lesson/challenge progress or protocol 2.
Default mobile specs and dependencies were unchanged. Checks used Node **24.22.0**.

- `npm run check` passed both TypeScript projects, documentation structure/links,
  **93 reference lab cases** and **32 offline framework checks**. The five new
  runner checks cover explicit app/spec selection, cross-app/reference paths,
  symlink escapes, actual files containing wildcard characters, and invalid CLI
  requests failing before runner launch.
- `npm run course:test` passed **83 reader/storage/profile checks**. Three new
  filter checks cover combined search, intersecting filters and independence
  from progress. HTTP coverage checks all 24 rendered ticket anchors and the
  unchanged 28 progress IDs; static tests require assignment pages to be staged.
- `npm run course:build` exported **218 readable files**, 16 lessons, 100 existing
  indexed practice items and 24 topic assignments. Static HTTP comparisons
  checked every exported page against local rendering. Source diff checks passed.
- Both pinned APKs were freshly downloaded from official GitHub releases into
  disposable directories, verified against published SHA-256 and byte size,
  inspected with Android Build-Tools 35 `aapt`, then removed. My Demo App 2.3.0
  matched **18,239,748 bytes**, package `com.saucelabs.mydemoapp.android`, launcher
  `view.activities.SplashActivity`, version code 27, minimum API 21 and target 31.
  Its declared MainActivity was checked as the wait target. ApiDemos 6.1.2 matched
  **6,986,399 bytes**, package `io.appium.android.apis`, launcher `.ApiDemos`,
  version code 47, minimum API 26 and target 33. Exact hashes and provenance are
  recorded in `apps/training-apps.json`. No app was installed or launched.
- The documented offline Node/Chai execution and explicit TypeScript-check
  commands passed with a small disposable example. This verifies the authoring
  workflow, not solutions or grades for the new assignments. Content review
  corrected the cart task to distinguish displayed unit prices from calculated
  line contributions and aligned written investigations with the tool filter.
- Local browser QA used a separate temporary database on port 4190. It verified
  topic/level/environment intersections, assignment-ID search, empty results,
  reset, retained filters on return, and focus at the selected ticket heading.
  Keyboard navigation and hint expansion were checked at 390px in dark mode;
  there was no horizontal page overflow. Assignment pages hid lesson completion
  controls. Desktop light layout was also inspected.
- The final static preview on port 4191 opened AS-24 at its heading and loaded
  the app guide. The three commerce levels were inspected together at 1600px.
  No learner progress or existing personal attempts were modified by QA.

These are source, artifact, offline and focused browser checks. Android execution,
optional-app selector/reset compatibility, real backend/payment flows,
BrowserStack, hosted CI and Site publication were **not run** in this change.
No new assignment is claimed complete. Existing Android evidence belongs to
its earlier build/environment; a first optional-app device run remains a learner
setup/compatibility investigation. This is not a complete accessibility audit.

### Teacher review and study comfort — 23 October 2026

Implemented the ten items in [the teacher review](teacher-review.md): a shorter
study route, early testing vocabulary, clearer evidence gates, reader comfort,
two mobile-focused offline repair labs, a device-practice guide and a curated
resource route. Node **24.22.0** was used. Dependencies and default mobile
specs/configuration were unchanged; existing learner starters were preserved.

- `npm run check` passed both TypeScript projects, course structure/local links,
  **93 reference lab cases** across 14 labs and **27 framework checks**.
- `npm run course:test` passed **79 reader/storage/profile checks**, including
  six new bookmark/preference checks. These cover invalid bookmark refusal,
  blocked storage, selected section persistence, independence from progress,
  reading-size fallback and preference changes across tabs/system appearance.
  Local/static module-serving checks include the new reader-state module.
- `npm run course:build` exported **201 readable files**, including the new
  guides, labs and review. Static HTTP checks compare all exported pages with
  the local renderer; new files were staged for the builder's tracked-file rule.
- Lab 13's new faulty starter passed 7 and failed 3 checks; lab 14's passed 4
  and failed 7. Their separate references passed 10/10 and 11/11. Three
  disposable mutants were rejected: broad retry of unrelated errors, accepting
  hidden rows, and skipping the final permitted viewport. These are intentional
  teaching failures, not unfixed project regressions.
- The intentionally unfinished device-study scaffold was extracted and
  typechecked in a disposable directory. It was not run on a device or installed
  over a learner file. New hint/review markup and section links were inspected.
- Focused browser QA used a disposable local database at port 4187 and static
  browser storage at port 4188. It checked the course menu with keyboard input,
  article heading focus, section links used twice, the evidence-note jump,
  Standard/Larger text, light/dark layouts, and bookmark/text persistence after
  reload. Layouts were inspected at desktop and narrow widths, including 390px.
- A synthetic progress import showed the new note/completion state after a
  cached lesson visit; the original database was never used. Reader integration
  fixes invalidate the article cache before forced home/challenge refreshes
  and handle repeated clicks on the current section URL. Static QA also opened
  labs 13/14 and expanded a hint; reading alone left completion at 0/16.
- Selected new resource links/content were checked on provider/author/official
  pages. This does not validate an entire external video course or every older
  library link. Documentation clearly labels older Java/Appium setup examples.

This was an expert review with focused browser checks, not a novice-user study,
full accessibility audit or cross-browser certification. Print output and live
assistive-technology use were not manually tested. Android, BrowserStack, real
backend flows, hosted CI and Site publication were **not executed** for this
change. Synthetic offline behavior and a compiled scaffold are not mobile
execution evidence. Existing lesson/challenge progress IDs and protocol 2 remain
unchanged; no learner completion is inferred.

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
