# Mobile Automation Lab — shared assistant instructions

## Purpose and learner

This is an existing beginner-to-workplace mobile test automation training
project. The learner starts from the foundations and wants to write tests,
diagnose real failures, explain tradeoffs in interviews and build a reviewable
portfolio. The core tools are Appium, TypeScript, Chai and BrowserStack, with
WebdriverIO/Mocha running the tests and Android as the first platform.

Keep the teaching practical: small runnable tasks, predictions, meaningful
failures, investigation and evidence. Include messy workplace situations rather
than only happy paths. The demo app is a learning fixture; its simulated login
does not establish real authentication or backend security.

The repository combines lessons, an executable framework and a personal reader.
It is not a production mobile app or a certification. The project already exists;
extend the current structure instead of replacing it with a new scaffold.

These instructions are shared across assistants. [CLAUDE.md](CLAUDE.md) is a
short entry point to this file, not a second independent set of project rules.
Follow the user's current task; do not mistake old handover suggestions for a
new request to run devices, publish a Site or finish exercises.

## Start a fresh session

1. Read [README.md](README.md) for the project idea and entry points, then
   [docs/RESUME.md](docs/RESUME.md) for the dated handover and pending work.
   The initial build is closed; [docs/PROJECT-CLOSEOUT.md](docs/PROJECT-CLOSEOUT.md)
   records its checkpoint and follow-ups. Resume the user's specific task.
2. Read [docs/validation.md](docs/validation.md) before claiming anything passed.
   Historical evidence belongs to its recorded version and environment.
3. Inspect `git status --short`, the relevant files and `package.json`. Preserve
   existing edits. Do not assume the previous chat, local services, credentials,
   browser state, SDK or cloud access are available.
4. Establish the session's task: tutoring, environment troubleshooting, interview
   practice, course/framework maintenance or account/computer handover.
   If the current lesson is unknown, ask which lesson/exercise to resume.
5. For tutoring, use [the course map](docs/README.md) and
   [study plans](docs/handbook/study-plans.md), then inspect the chosen exercise.
   `npm run progress:status` reports saved counts and the selected database path;
   it does not identify the learner's next task or prove competence.

Do not infer learner completion from the presence of working reference tests,
solutions or green CI. Completion marks are self-reported. Notes, attempts and
an explanation of the result supply better evidence.

## How to teach

For complete beginners, use [Start from zero](docs/handbook/start-from-zero.md)
and its computer/programming/test/lab workbooks before assuming lesson 00's
editor/terminal prerequisites. The eighteen small preparation exercises are
additional practice, not new tracked lessons or proof of learner completion.

- Work on one core task at a time, with prerequisites and a concrete acceptance
  criterion. State whether it needs only Node, an Android device, BrowserStack
  access or an app/backend that the demo does not supply.
- Explain new concepts in plain language. Walk through code line by line when
  asked, connecting each line to its purpose and observable result.
- Ask for a prediction, allow an attempt, offer a small hint, then review the
  code and reasoning. Give full solutions when requested; do not silently solve
  the learner's exercise to make checks green.
- Offline `exercises/*/starter.ts` files intentionally start unfinished (01–10)
  or faulty (11–12). Preserve learner edits and keep `solution.ts` separate.
  An expected starter failure is teaching material, not automatically a bug.
- Use a controlled defect or changed premise to check understanding. Ask what
  the test proves, what it misses and which observation would distinguish
  competing explanations.
- Record a useful next step. Keep personal learning notes local; do not mark
  lessons complete on the learner's behalf without their instruction.

For an implementation or maintenance request, complete the authorized change
and its verification. The tutoring approach is not a reason to leave requested
project fixes unfinished.

## Architecture and boundaries

| Area | Role |
|---|---|
| `docs/lessons/`, `docs/solutions/`, `docs/handbook/` | Lessons, worked answers, real-work scenarios, interview practice and manuals |
| `exercises/` | Offline TypeScript starters, separate references and grading tests |
| `test/specs/`, `test/screens/`, `test/helpers/`, `config/` | Android reference specs, screen objects, lifecycle/wait helpers and local/cloud runner configuration |
| `test/unit/` | Offline framework regression checks; mocks are not device evidence |
| `course/` | Browser reader, lesson catalog, search and progress adapter |
| `scripts/course-server.mjs`, `scripts/progress-*.mjs` | Local HTTP reader, SQLite persistence, backup/import and related checks |
| `scripts/build-course.mjs`, `scripts/prepare-site.mjs`, `scripts/site-profile.mjs` | Static export and isolated Site profiles |
| `.github/workflows/` | Offline CI and an explicitly dispatched BrowserStack workflow |

Use Node 24 and the locked dependencies. Local course reading and offline labs
need no OpenAI API key, Android installation or paid cloud account. Mobile tests
need a running compatible device; BrowserStack needs the learner's credentials
and App Automate access. Some iOS, gesture, hybrid and backend scenarios are
guided investigations with extra prerequisites, not validated default tests.

## Commands and verification

| Task | Command and meaning |
|---|---|
| Study locally | `npm run course` → `http://127.0.0.1:4173` |
| Grade a learner attempt | `npm run practice -- NN` (for example `01`); expected to fail before implementation |
| Check supplied lab answers | `npm run practice:solutions`; does not grade starters |
| Check project types/docs/references/helpers | `npm run check`; no mobile execution |
| Check reader/storage/profiles | `npm run course:test`; uses disposable test data |
| Check a static export | `npm run course:build`; new published pages must be Git-tracked/staged |
| Diagnose local Android setup | `npm run preflight`; not a UI test pass |
| Run a chosen device scope | `npm run test:smoke`, `test:forms`, `test:login` or `test:android` |
| Run cloud tests when requested and configured | `npm run test:bs`; uploads the APK and creates real cloud sessions |

Choose checks appropriate to the change. For documentation, run
`npm run course:check`; when reader links or published pages change, verify
reader/static loading too. For framework changes, use `npm run check` and the
relevant regression/device checks. For reader/storage changes, use
`npm run course:test` and `npm run course:build`. Record unavailable prerequisites
and unexecuted checks explicitly. Do not claim current CI passed without
checking the run for the pushed commit.

Keep new exercises reachable from the course map and reader. Include
prerequisites, a concrete task, acceptance criteria, hints/review guidance and
execution limits. If adding a root-level document linked in the reader, check
the allowlist in `scripts/course-content.mjs` and the documentation file list in
`scripts/check-course.mjs`; a working GitHub link alone does not prove it opens
in the local/static reader.

The separate `#challenges` path is defined by `challengeStages` and `challenges`
in the catalog and `docs/challenges/`. CH-01–CH-12 are stable progress IDs,
independent of lesson IDs 00–15. Use `progressIdsForCatalog` for storage and
imports; keep lesson and challenge totals separate in the UI. Challenge tickets
reuse learner labs and mobile specs without pre-solving the learner's work.
Hosted progress uses the v2 browser key, preserving the old lesson record during
migration. Local API writes require progress protocol 2 to prevent old readers
from silently discarding challenge IDs. Do not bypass that protection.

## Preserve personal data and portable ownership

- Preserve `.env`, learner code, notes, databases and unsaved browser drafts.
  Never reset a database or wipe ignored directories to repair an error.
  Keep credentials, logs, APKs, personal progress exports and databases out of
  commits. Read `.env.example` for names; never print local secret values.
- Local completions and notes live in `.local-data/progress.sqlite`, or the
  directory selected by `COURSE_DATA_DIR`. Use `npm run progress:status`,
  `progress:backup` and `progress:import -- <file>`. Backup reads saved database
  data; an unsaved browser draft needs its own export. Follow
  [local-data recovery](docs/handbook/local-data.md) for conflicts/corruption.
- Hosted/static readers use browser storage. There is no automatic sync with
  SQLite or another machine. Exercise code and journal files remain ordinary
  files and need their own save/commit or backup.
- Account changes do not transfer chats, service sign-ins or private Site
  ownership. Follow [account handover](docs/handbook/account-handover.md).
  The tracked root hosting manifest has no Site identity. Identities belong
  in ignored `.sites/<profile>/.openai/hosting.json` files. Preserve each
  existing identity, select a profile explicitly and register through native
  Sites tools only while signed into the intended account.
- Local profile commands do not authenticate, register or publish a Site.
  A GitHub push does not deploy it. Follow [hosting](docs/handbook/hosting.md)
  and the available Sites skill when a Site action is requested.
- Preserve APK checksum verification and the documented unbundled driver
  package when maintaining dependencies. Read
  [dependency maintenance](docs/handbook/dependency-maintenance.md).

## Leave useful context for the next session

Keep durable guidance here and the user-facing overview in README.md. Keep
CLAUDE.md short and linked to this shared file. Update docs/RESUME.md when the
implementation state, known blocker or project-level next step changes. Update
docs/validation.md with observed commands/results and their scope when recording
new verification evidence; do not rewrite historical runs as current ones.

In the handover, distinguish what changed, what was verified, what remains
pending and the next smallest action. Do not invent the learner's last exercise,
an active device, a successful BrowserStack session or a new-account Site URL.
Keep personal study notes and secrets out of shared assistant instructions.
