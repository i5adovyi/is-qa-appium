# Resume this project after switching accounts

This repository is the portable copy of your mobile automation training project.
Its lessons, exercises, reference code and local reader need **no OpenAI account
or API key**. You can study in an editor and run commands from a terminal.

**Initial build closed:** 20 October 2026. Read the
[closeout and retrospective](PROJECT-CLOSEOUT.md) for the historical
`training-baseline-2026-10-20` checkpoint, storage/backup record and deferred
account-dependent work. Continue with a specific learning or maintenance task;
closure does not mean learner exercises or cloud sessions are complete.

## Latest maintenance — branch consolidation, 27 October 2026

The original checkout is now the only active worktree, on `main`. Its history
includes the five maintenance commits through `da1df1f`: teacher/study improvements,
topic assignments, optional Android fixture checks, the usage guide and the
VS Code guide. The two completed maintenance branches were removed.

The separate personal learning worktree and its local branch were retired
without merging its workspace-specific instructions into the course. A verified
Git bundle and full file archive, including saved progress and a supported JSON
export, are under `.local-data/archives/2026-10-27-worktree-cleanup/` on this Mac.
Read that directory's `RESTORE.md` for recovery. This ignored archive is local
and contains personal data; it is not part of GitHub or the static reader.
The separate private learning GitHub repository remains intact; its unused
remote was removed from this checkout. Existing main progress, credentials,
Site identities and learner starters were preserved.

Current offline checks passed: both TypeScript projects, documentation checks,
93 reference lab cases, 32 framework checks, 83 reader/storage checks and the
223-file static build. See [validation](validation.md) for scope. Resume study
from this folder on `main`, choosing one task with the learner; no lesson was
marked complete. BrowserStack and separate-account Site follow-ups remain pending.

## Previous addition — VS Code workflow, 25 October 2026

[Work with this project in VS Code](handbook/vscode.md) explains the editor-only
route: open the repository, preview Markdown beside code, save an attempt and
run the appropriate command in the integrated terminal. It covers offline labs,
default/optional Android specs, typechecking and file-based evidence. The usage
guide now states explicitly that the browser reader is optional; it supplies
navigation, saved lesson/challenge notes and completion controls.

The guide is linked from the README, course map, computer-basics workbook,
usage guide and reader library. No editor settings, extensions, learner files
or progress records were changed. The next smallest action is the guide's lab
01 preview/edit/run walkthrough. Documentation checks, all 83 reader/storage/
profile checks and the static build (223 readable files) passed. Editor menus
were checked against official documentation; a live VS Code GUI session was
not exercised. Verification scope is in [validation](validation.md).

## Previous addition — project usage guide, 25 October 2026

[How to use this project](handbook/how-to-use.md) brings the daily workflow into
one guide: open the reader, work in an editor and second terminal, choose among
lessons/labs/challenges/assignments, run a selected test, and save evidence.
It distinguishes learner attempts from supplied references and explains which
data needs a separate backup. Find it near the top of the README/course map,
in the reader's workbench and in the small-screen Browse course menu.

This is a documentation/navigation update; existing exercise files and progress
IDs remain unchanged. The next study action is to open the guide and choose one
route matching your current prerequisites. Documentation checks, all 83 reader/
storage/profile checks and the static build (222 readable files) passed; the
guide and navigation were inspected in a separate local static preview. No
device/cloud tests or publication were performed for this update. Details are
in [the validation record](validation.md).

## Previous validation — optional apps on Android, 23 October 2026

Both optional apps now have observed Appium evidence on `Pixel_8_API_35`,
Android 15 / API 35, arm64 (`emulator-5554`). My Demo App 2.3.0 passed **2 cart/reset
checks**; ApiDemos 6.1.2 passed **3 preference/restart/dialog checks**, with zero
test retries. Runnable maintenance specs live in each app's `test/training/<app>/reference/`
directory. The [training-app guide](handbook/training-apps.md#check-fixture-compatibility-before-an-assignment)
gives commands, scope and the session-reset/data-clearing behavior. Detailed
results and local evidence locations are in [validation](validation.md).
`npm run check`, all 83 reader/storage/profile checks, and the static build
(221 readable files) passed. No cloud or hosted deployment was performed.

No install, launch or runner defect was found in these flows. The guide's former
unexecuted status and unclear reset consequences were corrected. These are
maintainer checks, not learner assignment completions. Checkout, permission
denial, WebViews, scrolling, other Android versions, physical devices and optional
cloud execution remain unvalidated. For study, choose one ticket and write an
independent attempt; for further fixture coverage, the next small investigation
is one checkout form validation case on the pinned My Demo App.

## Previous addition — topic assignments and extra training apps, 23 October 2026

The [assignment bank](assignments/README.md) adds **24 tickets in eight topics**,
each with L1 guided, L2 independent and L3 investigation work. The reader's
`#assignments` route filters by topic, level, environment and text. Tickets give
concrete contracts, acceptance criteria, changed conditions, hidden review hints
and an interview explanation. Offline implementations/tests are learner-owned;
the bank guide explains how to execute and typecheck them with Node 24.

AS-01–AS-24 identify personal work; they do not join the 16 lesson or 12 challenge
progress records. Keep attempts/evidence under `.local-data/assignments/` and
back those files up separately. Reader notes/progress exports do not include
them. Existing lab starters, mobile references and progress protocol 2 remain
in place. No assignment has been completed on the learner's behalf.

The [training-app guide](handbook/training-apps.md) adds optional pinned downloads
for Sauce Labs native My Demo App 2.3.0 and Appium ApiDemos 6.1.2. Use
`npm run training:apps -- list`, then the guide's download/verify command for the
chosen app. `npm run test:training -- <app> --spec <learner-file>` requires one
explicit spec under that app's `test/training/` directory. It starts a local
Android session only after verifying the APK and selected file. The supplied
template deliberately fails until the learner writes a meaningful test.

The default seven tests and BrowserStack path still use the WebdriverIO demo.
Extra apps are local opt-in fixtures; their checkout/login/platform samples do
not establish real backend behavior. See [validation](validation.md) for the
maintenance checks and any unexecuted device work. The next smallest study
action is one L1 ticket in a chosen topic (AS-04 or AS-07 for Node practice), or
the app guide followed by AS-13 for a new Android commerce investigation.

## Previous addition — teacher review and study comfort, 23 October 2026

The [teacher review](teacher-review.md) defines ten improvements for everyday
study. Start with [Choose today's session](handbook/study-session.md): it points
to one existing task, offers 20/45/90-minute sessions and gives a return/recall
routine. [Testing foundations](handbook/testing-foundations.md) adds three written
tasks for team vocabulary, test boundaries, oracles and honest evidence updates.
Blocked execution remains pending in the journal and handover templates.

The reader adds a separate last-opened page/section bookmark, page contents,
an evidence-note jump, a small-screen course menu and Standard/Larger text.
Reading preferences are browser/address-specific and do not join progress
exports or change the v2 progress protocol. Resume means a reading location,
not demonstrated proficiency or automatic completion.

There are now **14 offline labs**. New repair labs
[13: fresh-element observation](../exercises/13-stale-observation/README.md) and
[14: bounded scrolling](../exercises/14-bounded-scroll/README.md) use synthetic
elements/pages. Their faulty starters are learner work; supplied references
remain separate. [Device practice](handbook/device-practice.md) bridges these
ideas to scoped Android investigations and includes a fictional artifact
privacy exercise. The [learning library](resources.md) pairs selected videos,
articles and books with practical outputs and explains version/language gaps.

See the dated [validation entry](validation.md) for observed checks and limits.
This change does not establish learner completion, new Android/cloud evidence
or a new hosted deployment. The next smallest study action is to choose one
row in the session guide and record a prediction before attempting it.

## Previous addition — study themes, 22 October 2026

The reader now has a top-bar Theme control: System (default), Light and Dark.
`course/theme.js` applies the preference before rendering and stores it in the
browser's `mobile-automation-lab-theme` key. This is independent of SQLite,
progress exports and the lesson/challenge completion record. The theme script
is included in both local serving and static exports. Dark screen styles cover
the dashboard, challenges, prose, code, hints and notes; print keeps light colors.
This maintenance change does not complete any learner exercise. See the dated
[validation record](validation.md) for verification and its limits.

## Previous addition — real-world challenge path, 21 October 2026

The separate `#challenges` reader route adds twelve practical work tickets in
`docs/challenges/`, with prerequisites, learner-owned changes, controlled failures,
acceptance criteria and evidence notes. The original lessons, labs, references
and 100 indexed workplace/interview entries are retained. Start with
[the briefing](challenges/README.md); its offline route works while device/cloud
access is pending. Do not infer that the learner completed any ticket.

Challenge IDs CH-01–CH-12 share the portable progress record with lesson IDs
00–15, with separate UI counts. SQLite, browser notes, CLI status and backup/import
recognize both. The hosted reader migrates old browser data to a separate v2 key;
old tabs cannot overwrite challenge notes. Export any old-tab drafts before
reloading. Restart a running local reader after pulling this update: older
servers/readers are rejected by the new progress protocol rather than dropping
unknown IDs. Database/export schemas remain version 1. See
[recovery guidance](handbook/local-data.md).

The new track is teaching material; no learner starter or mobile reference spec
was changed to solve it. Validation below/in the [validation record](validation.md)
covers maintenance checks, not learner completion or a new real-device run.
BrowserStack's first real session and separate-account Site ownership remain
user-dependent follow-ups. The next smallest study action is CH-01's baseline
report, if the learner chooses this track.

## Where the project lives

- Private GitHub repository: [i5adovyi/is-qa-appium](https://github.com/i5adovyi/is-qa-appium).
- Existing Mac folder: `/Users/igor_sadovyi/Projects/is-qa-appium`.
- Main entry points: [README](../README.md), [course map](README.md),
  [coverage review](coverage-review.md), [validation record](validation.md),
  [account and computer handover](handbook/account-handover.md).

GitHub access belongs to your GitHub identity. Keep using the GitHub account with
access to this repository even if you change your OpenAI account. On the same Mac,
open the existing folder in a new Codex chat. If it is missing from the sidebar,
add/open that folder again. On another computer, clone it using your GitHub login:

```bash
git clone https://github.com/i5adovyi/is-qa-appium.git
cd is-qa-appium
npm ci
npm run check
npm run course:test
npm run course
```

Install **Node 24** before `npm ci`; `.nvmrc` records the major version. Then open
`http://127.0.0.1:4173` in your browser. On the original Mac, use the existing
checkout instead of cloning over it. Check `git status` before pulling if you
have edited learner exercises.

The [official local-project guidance](https://learn.chatgpt.com/docs/projects)
describes opening folders for local work. It does not establish that this
conversation or connected services transfer between accounts. This guide
deliberately contains the context needed for a fresh chat. The new account's
Codex availability and any connector sign-ins must be checked separately.

## Preserve your own progress

The local reader saves completed lessons and lesson notes in
`.local-data/progress.sqlite`, outside Git. Restarting the server or signing into
another OpenAI account on the same computer keeps this database. Reopen the same
project folder. `COURSE_DATA_DIR` can select another data directory; use that same
setting for the reader and backup commands.

Before moving computers:

```bash
npm run progress:status
npm run progress:backup
```

Keep the printed JSON backup file outside Git. On the destination computer,
restore it with `npm run progress:import -- "/path/to/backup.json"`, then start
the reader. Import saves a backup of the previous record and merges progress.
Use this supported export rather than copying a running database file.

Import merges completed lessons and keeps an existing note when imported text
conflicts. It does not upload notes. The hosted/static reader still uses browser
storage: use **Export progress** there, then **Import progress** in the destination
reader. It does not automatically sync with the local database. Before closing a
local page with a pending or failed save, export progress to preserve browser edits.
Older browser progress migrates automatically only when the database has not yet
been used and that browser record has not already migrated. Later empty
databases require explicit import. Interrupted per-window drafts are offered
for explicit recovery; opening a new window loads the database instead of
replaying another window's edits. See [local-data recovery](handbook/local-data.md).

Learner code in `exercises/*/starter.ts` and edits to `docs/learning-journal.md`
are ordinary files: save/commit those changes separately. GitHub does not receive
unsaved editor buffers, the local database or browser storage.

The Git repository excludes `.env`, downloaded APKs, `node_modules` and runtime
logs. On this Mac, keep your local `.env`. On another machine, create one from
`.env.example` and enter credentials locally when needed. Do not paste keys into
a chat or commit them. Download the demo APK with `npm run app:download`.

For mobile execution on another machine, follow the [setup manual](handbook/setup.md)
for Android Studio, Java, SDK variables and an emulator. Offline study needs
neither Android nor BrowserStack.

The reader also supports a static build and private OpenAI Sites hosting.
See the [hosting guide](handbook/hosting.md). GitHub access does not grant access
to the original account's private Site; localhost continues to work independently.
Export/import progress when moving between the two reader addresses. Each Site
has a separate ignored `.sites/<profile>` checkout. The tracked root manifest is
account-neutral. Under a different OpenAI account, follow the
[new-account Site prompt](handbook/account-handover.md#create-a-new-private-openai-site-under-the-new-account)
to register and publish an independent private Site; do not overwrite the old
Site identity. Registration and publication must run while signed in to the
intended account.

## Current learning and implementation state

**21 October 2026 beginner extension:** the initial build's historical closeout
is unchanged. Added a slower eight-session entry route and 18 small preparation
exercises covering computers/terminals, programming, test reasoning and the first
offline lab. All original lessons, exercises and learner implementations are
retained. Start with [the beginner route](handbook/start-from-zero.md); see
[the review](beginner-review.md) and validation record for evidence and limits.
The original Site was observed with public access on this date; earlier
private-audience descriptions are historical. No access setting was changed.

As reviewed on **20 October 2026**:

- Project purpose: take a beginner from understanding a single mobile command
  to writing useful tests, investigating workplace failures and defending
  decisions in interviews. The course and framework already exist. A fresh
  session should continue the current work, not regenerate a starter project.
- Shared assistant guidance is in [AGENTS.md](../AGENTS.md);
  [CLAUDE.md](../CLAUDE.md) points to the same guidance. Distinguish a tutoring
  session from an implementation/maintenance request.
- Stack: Node 24, Appium 3, WebdriverIO 10, TypeScript, Mocha/Chai,
  Android UiAutomator2 and BrowserStack App Automate.
- Course: 16 lessons, 48 lesson exercises, 12 offline coding labs,
  36 workplace scenarios, 48 interview questions, 10 practical drills and
  six staged incident shifts.
- Forms and Login have walkthroughs and reference tests, including clearing
  text and submitting empty login fields.
- Labs 01–10 have unfinished starters; labs 11–12 have deliberate bugs to repair. Use
  `npm run practice -- 01` for your work and `npm run practice:solutions`
  to check the supplied references. Keep these meanings separate.
- Dependency remediation and pinned APK SHA-256/size verification are already
  implemented. Preserve the documented driver packaging and overrides unless
  intentionally updating and validating them.
- Local checks and historical Android execution are recorded in
  [validation](validation.md). Design-only scenarios are not device passes.
- **BrowserStack remains pending:** you still need an account, local credentials
  and an actual real-device session. No successful BrowserStack run is claimed.
- The workplace review added an apprenticeship with staged evidence,
  conflicting requirements and two faulty-code repair labs. Search includes
  all scenarios, questions, drills and shifts. See the coverage review for
  requirements that need another app or backend.
- The latest implemented extension adds local SQLite persistence, protected
  browser draft recovery, JSON backups/imports and separate Site profiles.
  Its recorded offline checks and limits are in the validation record.
- **New-account Site publication remains pending:** the workflow and
  `second-account` profile initialization are supplied; registration/publication
  must happen with Sites access while signed into the intended owner account.
  A local profile or Git push is not a deployed Site.
- **The learner's last completed exercise is not established here.** Inspect
  relevant attempts and available notes, or ask which lesson to resume.
  The journal template, supplied solutions and completed reference tests do
  not establish learner progress.

## Prompt for the next chat

Open this project folder first, then paste:

> Read AGENTS.md, docs/RESUME.md, docs/README.md, docs/validation.md and
> docs/handbook/account-handover.md in this
> repository. Help me continue learning mobile test automation from beginner
> level using Appium, TypeScript, Chai and BrowserStack. Check my actual files
> and local progress status rather than assuming earlier chat history is available. Give me
> one practical task at a time, let me attempt it, then explain and review it.
> Do not replace unfinished exercise starters with solutions. BrowserStack
> account setup and the first real Android cloud login smoke run are still
> pending; keep credentials out of chat and Git.

If you only want interview preparation, add your target job description and ask
for a practice session from the existing question bank. Use the dashboard search
to choose a topic, then record evidence in your learning journal.

[Course map](README.md) · [Study plans](handbook/study-plans.md)
