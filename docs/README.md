# Mobile Automation Lab — course map

An Android-first, self-paced course built around a real, runnable Appium project.
Your destination is not a pile of scripts: it is the ability to choose a valuable test,
write it clearly, diagnose it when it fails, and explain the evidence.

## Pick up here

**Never used a terminal or written code?** Begin with the additional
[Start from zero route](handbook/start-from-zero.md). It gives you smaller
steps before lesson 00, a first-test workbook and help attempting lab 01.
The original lesson sequence below remains available. Preparation does not
add completion marks to the sixteen-lesson tracker.

**New to programming?** Start at lesson 00. **Already running the starter tests?**
Read 02–03, then work through 06–07 before expanding coverage.

Open the local reader with `npm run course`, then visit `http://127.0.0.1:4173`.
The same lessons work in any Markdown editor. Reader completion and notes are saved
in a local SQLite database, so they survive server restarts and reopening this
project. Use `npm run progress:backup` to keep a JSON backup and
`npm run progress:import -- "/path/to/backup.json"` to move it to another
computer. Hosted/static readers use browser storage and **Export progress /
Import progress** instead. Import combines completions, fills missing notes and
preserves current notes when the backup text differs. See
[local data and recovery](handbook/local-data.md).

## Four stages, sixteen lessons

Prefer learning by taking a ticket? Use the separate
[real-world challenge path](challenges/README.md): twelve assignments with their
own saved notes and completion marks. They reuse the existing framework and labs
and add investigation, regression and handover requirements. The briefing gives
an offline route while Android or BrowserStack setup is pending. Use this lesson
map whenever a challenge's prerequisite is unfamiliar.

| Stage | Lesson | Evidence you produce |
|---|---|---|
| Foundations | [00 · Orientation](lessons/00-orientation.md) | A map of how a test reaches the app |
| Foundations | [01 · Toolchain](lessons/01-toolchain.md) | An environment check you can explain |
| Foundations | [02 · TypeScript](lessons/02-typescript.md) | Typed fixture data and a passing offline lab |
| Foundations | [03 · Async and assertions](lessons/03-async-and-assertions.md) | An ordered action trace and meaningful assertions |
| First tests | [04 · First test](lessons/04-first-test.md) | A reproducible smoke run |
| First tests | [05 · Selectors](lessons/05-selectors.md) | A selector backed by a UI hierarchy |
| First tests | [06 · Forms](lessons/06-forms.md) | A test that enters, clears and verifies text |
| First tests | [07 · Login](lessons/07-login.md) | Validation coverage that cannot pass on stale errors |
| Reliability | [08 · Test data](lessons/08-test-data.md) | A boundary table and independent cases |
| Reliability | [09 · Waits and state](lessons/09-waits-and-state.md) | A test that survives repeat and isolated execution |
| Reliability | [10 · Debugging](lessons/10-debugging.md) | A failure investigation with evidence |
| Reliability | [11 · Gestures and contexts](lessons/11-gestures-and-contexts.md) | A documented mobile capability experiment |
| Delivery | [12 · BrowserStack](lessons/12-browserstack.md) | A cloud session report, when account access is available |
| Delivery | [13 · CI and reports](lessons/13-ci-and-reports.md) | A pipeline plan distinguishing static and device checks |
| Delivery | [14 · Test design](lessons/14-test-design.md) | A risk-based selection of tests |
| Delivery | [15 · Capstone](lessons/15-capstone.md) | A reviewable portfolio with an honest quality report |

Each lesson has three exercises, hints, acceptance criteria and a checkpoint.
Matching worked answers live under `docs/solutions/` with the same filenames.
Try the work before opening the solution. A solution is a reasoned example, not a
claim that only one implementation is valid.

## The practice loop

1. Read the learning outcomes and run the supplied baseline.
2. Predict the result of one small change.
3. Make that change and run the smallest relevant test.
4. Collect the evidence: code, command, actual output and explanation.
5. Compare with the checkpoint and solution; record what surprised you.
6. Move on when you can explain the result without reading the answer.

Expect roughly **35–55 focused hours** for lessons and core exercises, plus **8–16 hours**
for a careful capstone. These are planning estimates, not a guarantee or a deadline.
Use the [study plans](handbook/study-plans.md) to adjust for your starting experience.

## Your workbench

- [Project closeout and retrospective](PROJECT-CLOSEOUT.md): delivered work, history, verification, backups and remaining follow-ups.
- [Resume this project](RESUME.md): account changes, GitHub recovery, progress backups and a prompt for your next chat.
- [Open in Codex under another account](handbook/account-handover.md): reopen or clone the project, restore progress and publish a separate private Site.
- [Local data and backups](handbook/local-data.md): SQLite persistence, interrupted drafts, conflicting edits, imports and recovery.
- [Twelve offline TypeScript labs](../exercises/README.md): foundations, workplace helpers and two repairs of inherited faulty code.
- [36 workplace scenarios](handbook/workplace-scenarios.md): real-app situations, prerequisites, evidence and review guides.
- [Six incident shifts](handbook/incident-shifts.md): incomplete evidence, changing requirements, red-to-green repairs and decisions under time pressure.
- [48 interview questions](handbook/interview-practice.md): answer criteria, follow-ups and timed mock interviews.
- [Ten practical interview drills](handbook/interview-drills.md): code, SQL, Git review, architecture, log investigation, API checks, test design and communication.
- [Coverage review](coverage-review.md): gaps found, their exercises, evidence sources and remaining limits.
- [Setup manual](handbook/setup.md): prepare a new machine and understand the existing one.
- [Localhost & OpenAI Sites](handbook/hosting.md): run locally, publish the static reader and transfer progress.
- [Troubleshooting](handbook/troubleshooting.md): symptoms, evidence, next action.
- [Permissions and lifecycle](handbook/mobile-state.md): state layers, permission scenarios and background/resume experiments.
- [Glossary](handbook/glossary.md): the terms used in this course.
- [Dependency and APK maintenance](handbook/dependency-maintenance.md): audited packages, driver provenance, and verified downloads.
- [Review checklist](handbook/review-checklist.md): inspect your test before calling it done.
- [Capstone rubric](handbook/capstone-rubric.md): assess correctness and reasoning.
- [Reading library](resources.md): official documentation, articles and legal book recommendations.
- [Learning journal](learning-journal.md): a reusable evidence template.
- [Validation record](validation.md): tested scope, remaining risks and unverified environments.
- [Second-review findings](review-notes.md): gaps fixed, evidence, and useful next extensions.

## What this course does and does not prove

The supplied Android tests exercise the WebdriverIO demo APK, including its simulated
login. They do not prove real authentication or backend security. Cloud testing requires
your BrowserStack account. Gestures and hybrid exercises are exploratory; iOS needs
additional tooling, a compatible app build and platform-specific review.

You may adapt this into a teaching product, but this repository is not a certification,
a commercial licence grant for third-party material, or a claim of production readiness.
Do not redistribute downloaded books, vendor material, APKs or dependencies without
checking their respective licences. See [resources](resources.md) and [validation](validation.md).

[Project quick start](../README.md)
