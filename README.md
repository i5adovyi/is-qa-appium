# Mobile Automation Lab

**Learn mobile test automation by building, breaking, investigating, and explaining real tests.**

**[Open the Mobile Automation Lab course](https://i5adovyi.github.io/is-qa-appium/)** — read the lessons, search the course, and save notes and progress in your browser. No sign-in or installation is required. To write and run tests, [clone the project](#setup-on-a-new-machine).

An Android-first training project using **Appium 3 · TypeScript · Chai · WebdriverIO 10 · Mocha · BrowserStack App Automate**. It uses the [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app), so you can practise without a company app or real account credentials.

**New to this project?** Read [How to use this project](docs/handbook/how-to-use.md)
for the browser/editor/terminal workflow, choosing tasks, running tests and saving work.

**Prefer VS Code?** [Read and write tests in VS Code](docs/handbook/vscode.md)
with Markdown preview and the integrated terminal. The browser reader is optional.

**Here to study today?** Open [Choose today's session](docs/handbook/study-session.md)
for one task that fits 20, 45 or 90 minutes. New learners can start without Android.
Run `npm run course` after [setup](#setup-on-a-new-machine), then use the reader's
**Resume reading**, **On this page**, and **Text size** controls to pick up comfortably.
The [teacher review](docs/teacher-review.md) explains the 23 October improvements.

**Build status:** the initial training-project build is complete as of
20 October 2026. See the [closeout and retrospective](docs/PROJECT-CLOSEOUT.md)
for the historical checkpoint, verification, backup locations and explicit
follow-ups. The project remains ready for study and future maintenance.

## Why this project exists

**Want more practice by topic and difficulty?** Open the
[assignment bank](docs/assignments/README.md), or choose **Assignment bank · topic & level**
in the reader. It adds 24 workplace tickets across eight topics and three levels:
guided, independent, and investigation/handover. Filter by topic, level and
available tools; save a prediction, attempt and review evidence for each ticket.
[Optional training apps](docs/handbook/training-apps.md) add commerce and Android
platform investigations through a separate runner. Assignment files are personal
work, backed up separately from lesson/challenge progress.

**Prefer a continuous project handover?** Open the
[real-world challenge path](docs/challenges/README.md), or choose **Real-world
challenge path** in the reader. Twelve tickets take you from inheriting the
project to writing tests, diagnosing failures, fixing shared data and unsafe
retries, and handing over a release decision. Each has prerequisites, a runnable
task, acceptance criteria, hints and an evidence requirement. Challenge notes and
completion marks persist separately from the sixteen-lesson checklist, using the
same local database or hosted browser storage and progress export/import.
Existing lessons, lab starters, references and practice workbooks remain available.

This project helps a learner go from no mobile automation experience to writing,
debugging and explaining useful tests, then handling workplace problems and job
interviews. The goal is independent skill: understand the code, make a prediction,
run an experiment and explain the evidence. Passing supplied examples alone does
not establish that skill.

The repository brings three parts together:

- **A course and practice library:** staged lessons, exercises, hints, worked
  answers, interview drills and investigations with incomplete or misleading
  evidence.
- **A runnable training framework:** Android demo tests, offline TypeScript labs,
  diagnostic helpers, CI checks and a BrowserStack execution path.
- **A personal learning workspace:** the same course reader on GitHub Pages and
  on your computer. The local version stores your notes and progress in SQLite.

Lessons and offline labs work without an AI subscription. An assistant can tutor
you or maintain the project; your files and progress must remain useful when you
change computers, accounts or assistants. The current project is already built.
Continue from its existing lessons and code instead of generating a new starter.

## Starting a new assistant session

Open this repository's root folder in your editor or assistant. These files carry
the context that a previous conversation cannot be assumed to provide:

| File | What it explains |
|---|---|
| [AGENTS.md](AGENTS.md) | Shared assistant instructions, teaching approach, architecture and safeguards |
| [CLAUDE.md](CLAUDE.md) | Claude entry point to the same shared instructions |
| [Resume guide](docs/RESUME.md) | Dated implementation state, pending work and continuation prompt |
| [Validation record](docs/validation.md) | What was actually checked, on which environment, and what remains unverified |
| [Course map](docs/README.md) and [study plans](docs/handbook/study-plans.md) | Lesson order, practice tracks and evidence needed to advance |
| [Account handover](docs/handbook/account-handover.md) | Moving accounts/computers and creating a separately owned Site |

For a learning session, paste:

> Read AGENTS.md, README.md, docs/RESUME.md and docs/validation.md first.
> Inspect the current project and my relevant exercise edits; do not assume
> earlier chat history or that I completed the supplied examples. Help me
> continue learning Appium, TypeScript, Chai and BrowserStack. Choose one
> practical task at my current level, explain prerequisites, let me attempt it,
> then review my reasoning and evidence. Use hints before full solutions unless
> I ask for the answer. Preserve my code, notes, database and credentials.
> If my latest exercise is unclear, ask which lesson or exercise I want to resume.

For maintenance, give the assistant a concrete change or failure to investigate.
It should implement and verify that work while preserving learner exercises.
Teaching and maintaining the course are different session goals.

The latest recorded baseline includes runnable Android reference tests, local
SQLite progress and account-specific Site tooling. BrowserStack's first real
device run and publication under another OpenAI account remain unverified in the
saved handover. Check [the current handover](docs/RESUME.md#current-learning-and-implementation-state)
before treating either as complete. Supplied solutions, green CI and self-marked
lessons are separate from the learner's demonstrated progress.

## Start the course

**BrowserStack from A to Z:** open the independent
[BrowserStack academy](docs/browserstack/README.md), or **BrowserStack academy**
in the reader navigation (`#browserstack`). Five stages contain 15 lessons,
30 exercises and 18 workplace incident cards: account setup, a first real-device
run, writing/selecting tests, dashboard/reporting, CI, parallelism, private
backends, maintenance and interviews. Round 2 focuses on execution and reports,
including optional JUnit, Allure and analytics integration. Cloud-only setup
does not require a local emulator. Keep this path's evidence in personal files;
it does not change the original lesson/challenge progress records.

New to the academy? [Choose one first study session](docs/browserstack/first-session.md)
for a short offline, setup, first-run or reporting route with a clear stopping point.

**Completely new to coding or testing?** Use [Start from zero](docs/handbook/start-from-zero.md)
for a slower eight-session route. It adds computer/terminal basics, eight tiny
programming exercises, a first-test workbook and a first-lab coach. These
supplement the existing course; Android and BrowserStack can wait until the
offline foundations make sense. The reader now links this route prominently.

**On a new computer? Start with [Setup on a new machine](#setup-on-a-new-machine)** to install the prerequisites and clone the project.

```bash
npm run course
```

Open **http://127.0.0.1:4173**. The local reader includes lesson navigation, code copying, expandable hints, personal notes, progress tracking, and progress export/import. It binds to your own machine and saves completed lessons and notes in a **local SQLite database**, `.local-data/progress.sqlite`. Stop the server and start it again to continue from the same record. It does not upload your notes. See [local data and backups](docs/handbook/local-data.md) for recovery and moving computers.

Prefer your editor? Open **[the course map](docs/README.md)**. Every lesson is an ordinary Markdown file you own and can edit.

For late-night reading, choose **Theme → Dark** in the top bar. **Light** keeps
the original palette; **System** follows your device's appearance. The choice
is saved in this browser for the current site address, independently of study
progress, and works on localhost and the hosted Site. Printed lessons use the
light palette. If browser storage is blocked, the choice lasts for this visit.

**Text size → Larger** increases reading text and code. The reader remembers the
last successfully opened page/section separately from completion marks; **Resume
reading** is a bookmark, while **First unchecked lesson** reflects your checklist.
These reading preferences belong to this browser/address and are not included
in progress exports. On a small screen, open **Browse course** for lessons
and study routes. Long pages have an **On this page** menu.

## Where to use the course

Use GitHub Pages to study without an account. Clone the project when you want
to run an exercise or drive an Android device. The original OpenAI Site is
separate and restricted to its owner.

| Mode | Command or link |
|---|---|
| Public course reader, with progress saved in this browser | [Mobile Automation Lab on GitHub Pages](https://i5adovyi.github.io/is-qa-appium/) |
| Local reader, with project files and SQLite progress | `npm run course` → http://127.0.0.1:4173 |
| Original account's private OpenAI Site | [Open Mobile Automation Lab](https://mobile-automation-lab.igor-sadovyi87.chatgpt.site) — sign in with its owner account |
| Preview the static build | `npm run course:build`, then `npm run course:preview` → http://127.0.0.1:4174 |
| Prepare a registered Site profile | `npm run course:sites -- --profile second-account`, then publish with the native Sites tools |

See the [hosting guide](docs/handbook/hosting.md) for publishing, updates and
account changes. Reading, search and progress work in both modes. Coding
exercises and Appium tests run from your cloned project, not in the hosted page.
Use **Export progress / Import progress** to move notes between localhost and
the hosted Site. Localhost uses SQLite; hosted/static readers use browser
storage. There is no automatic sync. A GitHub push does not
automatically publish a Site update.

The private Site belongs to the OpenAI account used to publish it. To publish
under another account, sign in to that account, initialize a separate profile
with `npm run course:site-profile -- init second-account`, then use the
[new-account publishing prompt](docs/handbook/account-handover.md#create-a-new-private-openai-site-under-the-new-account).
The profile command does not sign in or create a Site. Each registered Site
keeps its own identity; the original Site is not overwritten.

**Open this project in Codex under another account:** sign in to Codex, then
open your existing local folder, or clone this public repository and open the clone. Follow the
[account and computer handover](docs/handbook/account-handover.md) and paste its
fresh-chat prompt. Source files are portable; previous chats, connected accounts
and access to the original private Site do not automatically transfer.
The local reader and tests run without an OpenAI account.

## Keep your progress between sessions

This is a local desktop **project**, opened in Codex or another editor and
served in your browser. It does not require a packaged desktop application.
Run `npm run course` and wait for the reader to report **Saved to local
database** after editing a note or completion mark.

```bash
npm run progress:status
npm run progress:backup
```

The backup command prints the path to a personal JSON backup. On another
computer, clone/install the project, copy that JSON file across, then run:

```bash
npm run progress:import -- "/path/to/your-backup.json"
npm run course
```

Use the actual path to your backup. On the same computer after changing OpenAI
accounts, reopening the same project reuses its database without an import.
The database, backups and `.env` are excluded from Git and Site builds.
`COURSE_DATA_DIR` can select another local data directory; see the
[local-data guide](docs/handbook/local-data.md). Exercise code remains in your
files and moves through Git or a separate file backup.

If another window changes progress first, the reader preserves your draft and
asks you to reconcile it. Use **Export draft & load saved**, then deliberately
import or copy the notes you want to keep. Interrupted drafts are offered for
explicit recovery; opening a new tab does not replay another window's edits.

| What is included | What you do with it |
|---|---|
| **16 lessons across 4 stages** | Learn programming foundations, write tests, make them reliable, then deliver them |
| **48 lesson exercises + worked answers** | Practise with hints, acceptance criteria and an explanation of the solution |
| **14 offline TypeScript labs** | Build helpers and repair fixture isolation, unsafe retries, stale observations and scrolling |
| **24 topic assignments at 3 difficulty levels** | Take realistic tickets in test design, locators, waits, data, commerce, device state, hybrid boundaries and delivery |
| **2 optional Android training apps** | Transfer skills to My Demo App commerce flows and ApiDemos platform examples |
| **36 workplace scenario exercises** | Investigate recovery, races, conflicting requirements, misleading results and real-app incidents |
| **6 incident shifts** | Revise hypotheses from new evidence and hand over incomplete work under constraints |
| **48 interview questions + 10 practical drills** | Explain tradeoffs, review code, practise SQL and defend your decisions |
| **7 Android reference tests** | Study working examples for launch, Forms, login and empty-field validation |
| **Setup and debugging manuals** | Diagnose failures from evidence rather than guessing |
| **Permissions and app-lifecycle field guide** | Distinguish app restart, background/resume, stored data and permission state |
| **Learning library** | Choose a video, article or book section, then apply it to a specific exercise |
| **Short study sessions + testing foundations** | Choose a manageable task, learn team vocabulary and return after a break |
| **Capstone + assessment rubric** | Build a reviewable portfolio and assess its quality |
| **CI templates** | Separate quick offline checks from manual cloud-device runs |

These counts describe the supplied course. Learner labs start unfinished or
deliberately faulty; the Android reference suite starts complete.

Preparing for a job? Start with the [coverage review](docs/coverage-review.md),
then use the [workplace scenarios](docs/handbook/workplace-scenarios.md) and
[interview practice](docs/handbook/interview-practice.md). These are also in the
reader's workbench. Use **Workplace & interview practice** on the dashboard to
search full case text or a case ID and jump directly to its exercise.
Design exercises identify features the demo does not implement.

## Your first hour

Treat the following list as an accelerated tour once setup and basic coding
are familiar. If starting from zero, spread it across sessions using the
[beginner route](docs/handbook/start-from-zero.md); a first device run is not
a one-hour requirement.

1. Read [00 · Orientation](docs/lessons/00-orientation.md), then [02 · TypeScript](docs/lessons/02-typescript.md) and [03 · Async and assertions](docs/lessons/03-async-and-assertions.md) if these concepts are new.
2. Run `npm run practice -- 01`. Read [the lab](exercises/01-typed-data/README.md), edit its `starter.ts`, and make it pass.
3. Start the Android emulator, then run `npm run preflight` and `npm run test:smoke`.
4. Work through [06 · Forms](docs/lessons/06-forms.md) and [07 · Login](docs/lessons/07-login.md). Both include code walkthroughs and guided changes.
5. Record one result in your [learning journal](docs/learning-journal.md). Explain what passed, not only that it passed.

## Setup on a new machine

The lessons, exercises and tests run independently of your OpenAI account.
No GitHub account is required to clone [the source](https://github.com/i5adovyi/is-qa-appium).

| What you want to do | What you need |
|---|---|
| Read lessons and practise TypeScript | Git, Node 24, installed project dependencies, a browser and an editor |
| Run local Android tests | The above plus Android Studio, SDK/JDK and a running emulator or connected Android test device |
| Run BrowserStack tests | Project dependencies, the demo APK and your own BrowserStack App Automate access; no local emulator required |

Complete steps 1–4 to start learning. Steps 5–7 add local Android execution.
Step 8 is the optional cloud path; step 9 transfers your existing progress.
The [setup manual](docs/handbook/setup.md) contains more detailed platform
instructions, and the [validation record](docs/validation.md) identifies what
has actually been tested.

### 1. Install Git and Node 24

Install [Git](https://git-scm.com/downloads/) and
[Node.js **24**](https://nodejs.org/en/download) for your operating system.
Node includes npm. If you already use a Node version manager, use it to select
24 instead of adding another global installation.

Open a new terminal after installation and check:

```bash
git --version
node --version
npm --version
```

The Node result must start with **`v24.`**. If you already use `nvm`,
`nvm install 24` followed by `nvm use 24` selects the required version.

### 2. Clone the repository and install dependencies

In a terminal, navigate to the folder where you keep projects, then run:

```bash
git clone https://github.com/i5adovyi/is-qa-appium.git
cd is-qa-appium
npm ci
```

You can also clone through GitHub Desktop and open a terminal in the cloned folder.

`npm ci` installs the versions recorded in the lockfile, including Appium,
TypeScript, Chai and the Android automation driver. No separate global Appium
or driver installation is needed.

**Run all remaining commands from inside the `is-qa-appium` folder.** On
Windows, use PowerShell; if its policy blocks `npm.ps1`, use `npm.cmd` in place
of `npm` as described in the setup manual.

### 3. Check the installation and open the course

Run these commands one at a time. Resolve a failed check before continuing:

```bash
npm run check
npm run course:test
npm run course
```

The first two commands check the project without an emulator or BrowserStack
account. The last starts the course website. Open
**http://127.0.0.1:4173** in your browser.

Keep that terminal open while using the reader. Open a second terminal in the
project folder for exercises, or press **Ctrl+C** to stop the reader.
Saved notes and completion marks remain in `.local-data/progress.sqlite` when
you stop it. Use the exact printed `http://127.0.0.1:4173` address for a
consistent browser origin.

Start with [Lesson 00: Orientation](docs/lessons/00-orientation.md), then follow
the [learning plan](docs/handbook/study-plans.md). You can also read the lessons
directly in your editor through [the course map](docs/README.md).

### 4. Try your first coding exercise

```bash
npm run practice
npm run practice -- 01
```

The first command lists the fourteen labs. The second checks your work in lab 01.
Read [the lab instructions](exercises/01-typed-data/README.md), open
[`starter.ts`](exercises/01-typed-data/starter.ts) in your editor, complete the
task and save it. Run `npm run practice -- 01` again to check your changes.

**An unfinished exercise failing is expected.** Labs 01–10 need implementation;
labs 11–14 contain deliberate bugs to repair. `npm run check` and
`npm run practice:solutions` validate the supplied reference solutions, not
completion of your exercises.

You can study and practise at this point without installing Android Studio.

### 5. Install Android Studio and create an emulator

Install [Android Studio](https://developer.android.com/studio). In its
**SDK Manager**, install:

- Android SDK Platform **35 / Android 15**, the project's emulator baseline.
- Android SDK Platform-Tools and Build-Tools.
- Android SDK Command-line Tools (latest).
- Android Emulator.

Open **Device Manager → Create Device**, select a phone such as Pixel 8,
and download an Android 15 system image matching your computer's architecture.
Start the emulator and wait for the Android home screen.

You do not need to create a new Android app project. Your emulator's name is
whatever you choose; `Pixel_8_API_35` in older examples is the original Mac's
device name. If the emulator cannot boot, follow the
[official virtual-device guide](https://developer.android.com/studio/run/managing-avds)
and check your host's virtualization/acceleration setup.

### 6. Configure the Android and Java paths

`ANDROID_HOME` must point to your Android SDK directory. `JAVA_HOME` must point
to a JDK, including `javac`; Android Studio's bundled `jbr` is used by this
project's baseline.

On **macOS with zsh**, verify the following paths match your installation,
then add these lines to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$JAVA_HOME/bin"
```

Reload the settings:

```bash
source ~/.zshrc
```

On **Windows or Linux**, use your platform's environment-variable instructions
in the [setup manual](docs/handbook/setup.md); the paths and shell commands
differ from macOS. Persist the settings so they survive a new terminal.

With the emulator running, verify:

```bash
java -version
javac -version
adb version
adb devices
```

Your emulator should appear in `adb devices` with status **`device`**, not
`offline` or `unauthorized`. If several devices are connected, create a local
`.env` from `.env.example` if needed and set `ANDROID_UDID` to the intended
serial shown by `adb devices`.

### 7. Download the demo app and run local Android tests

Run these commands one at a time, fixing any required prerequisite before
continuing:

```bash
npm run appium:setup
npm run appium:doctor
npm run app:download
npm run preflight
npm run test:smoke
```

`appium:setup` verifies the project driver installed by `npm ci`.
`app:download` downloads the demo APK and verifies its pinned SHA-256 checksum
and size. Preflight diagnoses prerequisites; the smoke test performs actual
Android interactions.

After the smoke test passes, try the Forms and Login suites:

```bash
npm run test:forms
npm run test:login
```

Or run all seven Android reference tests:

```bash
npm run test:android
```

WebdriverIO starts Appium automatically. Stop any separately started Appium
server or Inspector session before running these tests.
Use [troubleshooting](docs/handbook/troubleshooting.md) if a command fails.

### 8. Use BrowserStack when your account is ready (optional)

After steps 1–3, you can use this cloud path without steps 5–7. You need your
own **BrowserStack App Automate access**, credentials, and a device/OS pair
available in your account.

In your editor or file manager, copy `.env.example` to `.env` **only if `.env`
does not already exist**. Enter your credentials in that local file:

```dotenv
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

Replace these placeholders and check `BROWSERSTACK_DEVICE_NAME` and
`BROWSERSTACK_PLATFORM_VERSION` against the devices available in your account.
Keep credentials out of Git and chat.

```bash
npm run app:download
npm run preflight -- --cloud
npm run test:bs
```

Cloud preflight checks local prerequisites and credential presence; it does
not prove account access or run a device session. `test:bs` uploads the
verified APK and starts cloud tests. See [lesson 12](docs/lessons/12-browserstack.md)
for the full walkthrough.

For the smallest first run, follow the new [step-by-step cloud guide](docs/browserstack/03-first-run.md)
and use `npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "@smoke"`.
The unfiltered command above runs all matching specs. The
[reporting lesson](docs/browserstack/07-reporting.md) explains how to interpret
counts and collect useful evidence.

### 9. Bring your progress to the new computer

Before leaving the old computer:

1. Check the reader's save status, then run `npm run progress:backup`. Copy
   the printed JSON backup file to the new computer and run
   `npm run progress:import -- "/path/to/backup.json"` in the installed
   project. If using the hosted Site, or if browser edits have not saved,
   use **Export progress** there and import that file separately.
2. Save and commit/push your exercise and learning-journal edits, or copy those
   files separately. Only committed and pushed edits arrive through a new clone.
3. Recreate `.env` locally when needed. Download the APK and install dependencies
   using the commands above.

The local database and hosted browser progress are separate from Git. The
repository excludes `.env`, `.local-data`, downloaded APKs, `node_modules`,
runtime logs, personal progress backups and account-specific Site profiles.
Import merges completions and preserves an existing note if imported text
conflicts with it. CLI import backs up the previous database record first.

On later days, open a terminal in this project and run `npm run course`.
For mobile practice, also start the emulator, then run `npm run preflight`
and the test you are working on. Installation and APK download are not daily
steps.

The [account handover](docs/handbook/account-handover.md) and
[resume guide](docs/RESUME.md) contain prompts for reopening the folder in Codex
and continuing your training after changing OpenAI accounts.

## Commands you will actually use

Run from the project root. Device commands require a booted emulator or connected Android device.

| Command | Purpose |
|---|---|
| `npm run course` | Open the local course reader with persistent SQLite progress |
| `npm run progress:status` | Show database location and saved lesson/note counts |
| `npm run progress:backup` | Export saved database progress to a personal JSON backup |
| `npm run progress:import -- "/path/to/backup.json"` | Back up current database progress, then merge an exported record |
| `npm run course:build` | Export a portable static course to `dist/` |
| `npm run course:preview` | Serve the static build on localhost port 4174 |
| `npm run course:site-profile -- init second-account` | Initialize an account-specific local profile; does not register a Site |
| `npm run course:site-profile -- status second-account` | Inspect the selected profile and its recorded Site ID |
| `npm run course:sites -- --profile second-account` | Build and prepare a registered Site profile; does not publish |
| `npm run check` | TypeScript, documentation links, reference lab tests, offline framework regression checks |
| `npm run practice` | List the fourteen offline labs |
| `npm run practice -- 03` | Test your work on one lab; initial failure is expected |
| `npm run practice:solutions` | Test the supplied offline solutions |
| `npm run preflight` | Check local prerequisites without running a UI test |
| `npm run test:smoke` | App launch and successful login |
| `npm run test:forms` | Forms reference tests |
| `npm run test:login` | Valid, invalid, and empty-login reference tests |
| `npm run test:android` | All seven Android reference tests |
| `npm run training:apps -- list` | List optional pinned Android fixtures; see the training-app guide |
| `npm run training:apps -- download saucelabs` | Download and verify the optional My Demo App APK |
| `npm run test:training -- saucelabs --spec test/training/saucelabs/cart.spec.ts` | Run your own named spec after creating it; separate from reference tests |
| `npm run test:bs` | Run the same specs on BrowserStack, using your credentials |
| `npm run course:test` | Check reader routes, SQLite, draft recovery, progress transfers, static builds and Site profiles |
| `npm run framework:test` | Check preflight and failure diagnostics without a device |

WebdriverIO starts the local Appium server automatically. Stop a separately started Inspector/Appium session before running tests on port 4723. Failures produce screenshots and UI-source files in `logs/`; the server log is `logs/wdio-appium.log`.

`npm run check` verifies the supplied offline reference solutions. To grade your own
exercise implementations, use `npm run practice -- 01` (or `-- all`) and
`npm run typecheck:practice`. Unfinished starters are expected to fail.

## Where things live

```text
README.md               Project purpose, entry points and setup
AGENTS.md               Shared instructions for assistants working in this repository
CLAUDE.md               Claude entry point; refers to the shared instructions
docs/RESUME.md          Portable session handover and dated project state
course/                 Local reader interface and lesson catalog
config/                 Shared, local Android, and BrowserStack runner settings
docs/lessons/           The sixteen guided lessons
docs/solutions/         Worked answers — try the exercise first
docs/handbook/          Setup, debugging, glossary, review and study guides
docs/assignments/       Twenty-four workplace tickets grouped by topic and level
exercises/             Fourteen offline TypeScript labs, tests and reference solutions
scripts/               Preflight, course server, validation and practice runners
.openai/hosting.json    Account-neutral static hosting template; no Site identity
.sites/<profile>/      Separate registered Site checkout/identity, ignored by Git
.local-data/           Local SQLite progress and JSON backups, ignored by Git
dist/                  Generated static course, ignored by Git
test/screens/          Element selectors and screen actions
test/helpers/          App lifecycle, waits, native alerts and failure evidence
test/specs/            Runnable Android reference tests
test/training/         Optional app templates and learner-owned device specs
.github/workflows/     Offline checks; manual Android, BrowserStack and Pages runs
apps/                  Pinned artifact manifests and ignored downloaded APKs
logs/                  Local test artifacts, ignored by Git
```

## BrowserStack comes after local confidence

Local confidence is useful preparation; a local emulator pass is optional for
the [cloud-only route](docs/browserstack/00-start.md). The independent academy
starts with account creation and reaches reporting/CI in five stages.

Read [lesson 12](docs/lessons/12-browserstack.md). Create `.env` from `.env.example` only if it does not exist, then add your BrowserStack username and access key locally. Never commit credentials. The cloud preflight does not start a paid session:

```bash
npm run preflight -- --cloud
```

`npm run test:bs` uploads the demo APK and creates a cloud session. Your account needs App Automate access and an available configured device. The manual GitHub Actions workflow additionally requires repository secrets and an explicit `RUN` input. No cloud run was performed while building this course.

The manual workflow now defaults to one `login-smoke` selection, with device/OS
inputs. Select `all-specs` deliberately for the original full-suite behavior.
Default build labels are generated once in the launcher so all workers share
one invocation label. [CI walkthrough](docs/browserstack/09-ci.md).

## Quality and scope

See **[the validation record](docs/validation.md)** and **[second-review findings](docs/review-notes.md)** for executed checks and limitations. This is a training framework, not a production-security certification. The maintenance pass resolved all 38 dependency audit findings and added pinned APK checksums; see [dependency maintenance](docs/handbook/dependency-maintenance.md) for the driver packaging, overrides and verification commands. Hosted CI evidence is tied to its exact commit. BrowserStack, iOS and exploratory hybrid/gesture labs have separate prerequisites and are not claimed as validated.

The demo login checks simulated client-side behaviour; it is not a real authentication service. Restarting this demo resets its in-memory state, not arbitrary app storage or backend data.

Course lessons and exercises are original project content. External books and articles are linked, not copied or redistributed. Review all relevant licences before distributing third-party APKs, dependencies, or a commercial derivative.
