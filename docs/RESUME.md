# Resume this project after switching accounts

This repository is the portable copy of your mobile automation training project.
Its lessons, exercises, reference code and local reader need **no OpenAI account
or API key**. You can study in an editor and run commands from a terminal.

**Initial build closed:** 20 October 2026. Read the
[closeout and retrospective](PROJECT-CLOSEOUT.md) for the historical
`training-baseline-2026-10-20` checkpoint, storage/backup record and deferred
account-dependent work. Continue with a specific learning or maintenance task;
closure does not mean learner exercises or cloud sessions are complete.

## Latest addition — real-world challenge path, 21 October 2026

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
