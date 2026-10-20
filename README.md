# Mobile Automation Lab

**Learn mobile test automation by building, breaking, investigating, and explaining real tests.**

An Android-first training project using **Appium 3 · TypeScript · Chai · WebdriverIO 10 · Mocha · BrowserStack App Automate**. It uses the [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app), so you can practise without a company app or real account credentials.

## Start the course

```bash
npm run course
```

Open **http://127.0.0.1:4173**. The local reader includes lesson navigation, code copying, expandable hints, personal notes, progress tracking, and progress export/import. It binds to your own machine and does not upload your notes. Use the same browser/origin to retain progress, or import an exported JSON backup. Import adds completions and missing notes; it keeps your current note when a backup has different text for the same lesson.

Prefer your editor? Open **[the course map](docs/README.md)**. Every lesson is an ordinary Markdown file you own and can edit.

| What is included | What you do with it |
|---|---|
| **16 lessons across 4 stages** | Learn programming foundations, write tests, make them reliable, then deliver them |
| **48 lesson exercises + worked answers** | Practise with hints, acceptance criteria and an explanation of the solution |
| **6 offline TypeScript labs** | Implement small functions and get feedback without an emulator |
| **7 Android reference tests** | Study working examples for launch, Forms, login and empty-field validation |
| **Setup and debugging manuals** | Diagnose failures from evidence rather than guessing |
| **Permissions and app-lifecycle field guide** | Distinguish app restart, background/resume, stored data and permission state |
| **Reading library** | Find official documentation, selected articles and legitimate book recommendations |
| **Capstone + assessment rubric** | Build a reviewable portfolio and assess its quality |
| **CI templates** | Separate quick offline checks from manual cloud-device runs |

These counts describe the supplied course. Your learner implementations intentionally start unfinished; the Android reference suite starts complete.

## Your first hour

1. Read [00 · Orientation](docs/lessons/00-orientation.md), then [02 · TypeScript](docs/lessons/02-typescript.md) and [03 · Async and assertions](docs/lessons/03-async-and-assertions.md) if these concepts are new.
2. Run `npm run practice -- 01`. Read [the lab](exercises/01-typed-data/README.md), edit its `starter.ts`, and make it pass.
3. Start the Android emulator, then run `npm run preflight` and `npm run test:smoke`.
4. Work through [06 · Forms](docs/lessons/06-forms.md) and [07 · Login](docs/lessons/07-login.md). Both include code walkthroughs and guided changes.
5. Record one result in your [learning journal](docs/learning-journal.md). Explain what passed, not only that it passed.

## Setup on this Mac

Node 24, Android Studio, the Android SDK, and `Pixel_8_API_35` were installed during the initial setup. For a new terminal:

```bash
source ~/.zshrc
```

Start the emulator in Android Studio's Device Manager or in another terminal:

```bash
emulator -avd Pixel_8_API_35
```

Wait for Android to boot, then:

```bash
npm run preflight
npm run test:smoke
```

For a **new machine or checkout**, follow the [setup manual](docs/handbook/setup.md). With Node 24 and the SDK installed:

```bash
npm ci
npm run app:download
npm run appium:doctor
```

UiAutomator2 is a project dependency. If `appium driver list --installed` does not discover it, follow the setup manual's driver diagnostics before reinstalling it. Do not rerun the driver-install command blindly when it is already installed.

## Commands you will actually use

Run from the project root. Device commands require a booted emulator or connected Android device.

| Command | Purpose |
|---|---|
| `npm run course` | Open the local course reader |
| `npm run check` | TypeScript, documentation links, reference lab tests, offline framework regression checks |
| `npm run practice` | List the six offline labs |
| `npm run practice -- 03` | Test your work on one lab; initial failure is expected |
| `npm run practice:solutions` | Test the supplied offline solutions |
| `npm run preflight` | Check local prerequisites without running a UI test |
| `npm run test:smoke` | App launch and successful login |
| `npm run test:forms` | Forms reference tests |
| `npm run test:login` | Valid, invalid, and empty-login reference tests |
| `npm run test:android` | All seven Android reference tests |
| `npm run test:bs` | Run the same specs on BrowserStack, using your credentials |
| `npm run course:test` | Check reader routes, file restrictions and progress-backup handling |
| `npm run framework:test` | Check preflight and failure diagnostics without a device |

WebdriverIO starts the local Appium server automatically. Stop a separately started Inspector/Appium session before running tests on port 4723. Failures produce screenshots and UI-source files in `logs/`; the server log is `logs/wdio-appium.log`.

`npm run check` verifies the supplied offline reference solutions. To grade your own
exercise implementations, use `npm run practice -- 01` (or `-- all`) and
`npm run typecheck:practice`. Unfinished starters are expected to fail.

## Where things live

```text
course/                 Local reader interface and lesson catalog
config/                 Shared, local Android, and BrowserStack runner settings
docs/lessons/           The sixteen guided lessons
docs/solutions/         Worked answers — try the exercise first
docs/handbook/          Setup, debugging, glossary, review and study guides
exercises/             Six offline TypeScript labs, tests and reference solutions
scripts/               Preflight, course server, validation and practice runners
test/screens/          Element selectors and screen actions
test/helpers/          App lifecycle, waits, native alerts and failure evidence
test/specs/            Runnable Android reference tests
.github/workflows/     Static checks and a manual BrowserStack workflow
apps/                  Downloaded demo APK, ignored by Git
logs/                  Local test artifacts, ignored by Git
```

## BrowserStack comes after local confidence

Read [lesson 12](docs/lessons/12-browserstack.md). Create `.env` from `.env.example` only if it does not exist, then add your BrowserStack username and access key locally. Never commit credentials. The cloud preflight does not start a paid session:

```bash
npm run preflight -- --cloud
```

`npm run test:bs` uploads the demo APK and creates a cloud session. Your account needs App Automate access and an available configured device. The manual GitHub Actions workflow additionally requires repository secrets and an explicit `RUN` input. No cloud run was performed while building this course.

## Quality and scope

See **[the validation record](docs/validation.md)** and **[second-review findings](docs/review-notes.md)** for executed checks and limitations. This is a training framework, not a production-security certification. The maintenance pass resolved all 38 dependency audit findings and added pinned APK checksums; see [dependency maintenance](docs/handbook/dependency-maintenance.md) for the driver packaging, overrides and verification commands. Hosted CI evidence is tied to its exact commit. BrowserStack, iOS and exploratory hybrid/gesture labs have separate prerequisites and are not claimed as validated.

The demo login checks simulated client-side behaviour; it is not a real authentication service. Restarting this demo resets its in-memory state, not arbitrary app storage or backend data.

Course lessons and exercises are original project content. External books and articles are linked, not copied or redistributed. Review all relevant licences before distributing third-party APKs, dependencies, or a commercial derivative.
