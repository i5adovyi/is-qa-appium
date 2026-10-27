# BrowserStack academy · from your first account to a useful release report

An independent Android automation path inside Mobile Automation Lab. Begin with
an account and one supplied test; finish with your own test, a diagnosis, CI
evidence and a report another person can review. The original sixteen lessons,
challenge path and assignments remain available.

**Start here:** [BS-00 · Choose your route](00-start.md). Complete beginners can
pause for [terminal basics](../handbook/computer-basics.md) and
[testing foundations](../handbook/testing-foundations.md). You do not need to
finish every original lesson before reading this path.

## Five stages

| Stage | Lessons | What you produce |
| --- | --- | --- |
| 1 · Get ready | [00 · Map](00-start.md), [01 · Account](01-account.md), [02 · Project](02-project.md) | A ready environment or a precise blocker |
| 2 · Run automation | [03 · First run](03-first-run.md), [04 · Write and select tests](04-automation.md), [05 · Devices and versions](05-devices.md) | One real session and a test you can explain |
| 3 · Read and report | [06 · Dashboard](06-dashboard.md), [07 · Reporting](07-reporting.md), [08 · Failure investigation](08-failures.md) | Traceable evidence and an honest outcome |
| 4 · Work with a team | [09 · CI](09-ci.md), [10 · Parallel work](10-parallel.md), [11 · Private backends](11-local-tunnel.md) | A controlled pipeline and environment plan |
| 5 · Own the result | [12 · Maintenance](12-maintenance.md), [13 · Capstone](13-capstone.md), [14 · Interview practice](14-interviews.md) | A reviewable portfolio and defensible decisions |

Every lesson has two exercises: **30 exercises** in this path. Additional
[incident cards](incidents.md) provide twelve workplace situations, with
hidden review guidance. [Templates](templates.md) provide a run record, bug
report, daily summary, device matrix and readiness checklist.

## First journey and second round

- **First journey:** BS-00–03, then BS-06. Set aside separate setup and execution
  sessions. Running one login case and locating its evidence is the first milestone.
- **Round 2 — automation and reporting:** BS-04–08. Write a small test, select it
  precisely, investigate a deliberate failure and compare terminal, session and
  report counts. These are additional hands-on lessons, not a repeat of signup.
- **Team practice:** BS-09–14. Do offline planning first; execute advanced labs
  only when their prerequisites exist. No backend is provided by the demo login.

Times in lessons assume prerequisites work. Stop after one useful exercise; a
cloud error is material for investigation, not a reason to run all commands again.

## Keep your evidence

Create personal files under `.local-data/browserstack/` in your editor. Name
them with the lesson/exercise ID, such as `BS-03-A.md`. Start from the templates.
The directory is ignored by Git. Back it up separately: reader progress exports
do not contain these files, screenshots, terminal logs or learner code.

BS-00–BS-14 identify this study path; they do not add completion records to the
existing lesson/challenge database. Use a personal checklist with **planned,
attempted, blocked, investigated, demonstrated** and an evidence link. Reading
is useful but does not mark a cloud exercise demonstrated.

## Execution boundaries

The hosted website is a reader. Commands run in your cloned project terminal.
Node 24, dependencies, a verified APK and App Automate account access can run
the cloud path without Android Studio or a local emulator. Offline exercises
need no paid account. Live sessions consume the account's available resources.

This is an end-to-end guide for this project's Android/Appium workflow, not a
promise to cover every BrowserStack product. iOS requires its own signed app,
capabilities, locators and validation. App Percy, accessibility products and
device-specific features are further specializations. Optional reporting and
tunnel extensions below have separate prerequisites.

The integration has offline regression tests; its first real BrowserStack run
remains pending learner account access. No lesson, screenshot description or
sample report is evidence that such a run happened. The demo's success message
is simulated login, not proof of backend authentication.

## Sources and currency

Official documentation was reviewed **27 October 2026**. Account interfaces,
available devices, quotas and supported versions change. Links appear at the
point of use; [the source register](sources.md) records the main references and
the repository's integration boundary. Follow the current signed-in UI if
labels differ, and record what you actually observed.

[Begin BS-00](00-start.md) · [Original BrowserStack lesson](../lessons/12-browserstack.md) · [Course map](../README.md)
