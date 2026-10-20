# Second review: findings and improvements

**Reviewed:** 20 October 2026. Scope: all sixteen lessons and solutions, handbooks,
offline labs, Android framework, course reader and CI configuration. Three reviewers
covered teaching and framework concerns; their findings were integrated and checked
against the current project.

## Fixed findings

| Area | Finding | Improvement |
|---|---|---|
| Failure handling | A hybrid example's cleanup could replace the original test error | Lesson 11 now preserves the primary error and reports cleanup failure separately |
| Diagnostics | A dynamically skipped test could create misleading `FAILED_` artifacts | Failure capture distinguishes skipped tests; a regression check covers it |
| Setup | Preflight could pass with missing dependencies, a JRE without a compiler, or incomplete SDK tooling | It checks declared packages, `javac`, Build-Tools, directories and explicit device selection |
| Login | Clearing inputs lacked an observed populated-state precondition and explicit empty-state waits | The test observes both transitions before checking validation; lesson 07 matches the source |
| Beginner sequence | Several examples assumed terminal, function, import and runner knowledge too early | Lessons 00–07 explain those assumptions, separate device-free work, and provide isolated commands |
| Exercise feedback | Some contract violations could pass the supplied checks | Stronger checks cover exact error text, password whitespace, unchanged selector values, read-error propagation and evidence priority |
| Mobile coverage | Permission grants and process restarts could be mistaken for permission/lifecycle test coverage | A new state manual distinguishes the layers and supplies scenario matrices and an investigation worksheet |
| Advanced exercises | Data cases, capstone scope and artifact instructions left room for stale state or duplicate coverage | Clear/submit setup, exact assertions, unique scenario requirements and CI behavior are explicit |
| Progress backup | Exported progress had no restore workflow | Import validates a backup, merges completion, restores missing notes and preserves conflicting current notes |
| Reader navigation | Links to a section in another page lost their section; malformed route encoding could break navigation | Section links retain their target; invalid links show a recoverable error |

The practice runner now says whether it is checking learner files or supplied reference
solutions. `npm run check` passing does not mean your unfinished starters are complete.

## Evidence

- The updated full Android suite passed **7 tests** on the API 35 emulator.
- The six offline reference labs passed **31 tests**.
- **8 framework regression checks** passed with mocked device and Java commands.
- **11 reader checks** passed, covering every lesson, solution and library page,
  file restrictions, modules and progress-backup validation/merging, including long
  evidence notes that exceed 1 MB.
- TypeScript and local course-structure/link checks passed.
- Four deliberately incorrect reference implementations were tested in disposable
  copies. The strengthened checks caught incorrect password trimming, identifier
  rewriting, retrying a rejected read and incorrect failure-category priority.
- Twenty documentation example files/snippets were typechecked during the cross-review;
  two beginner examples were also executed. That is not a claim that all exploratory
  mobile snippets ran on a device.
- Browser testing on a separate local origin verified import, conflict preservation,
  downloaded export contents, reload persistence, section navigation and malformed-link
  recovery. The learner's existing course progress was not used for these tests.

A subsequent preview request was declined by the browser permission gate, so browser
interaction stopped. The additional lesson-number search check and a fresh screenshot
were not completed. The earlier browser observations above had already succeeded.

Commands and saved outputs are in the [validation record](validation.md). The original
published commit's hosted [GitHub Actions run](https://github.com/i5adovyi/is-qa-appium/actions/runs/39427787762)
also passed. Hosted results belong to their exact commit, not every subsequent edit.

## Remaining boundaries and useful next work

1. **Real cloud evidence:** run the first BrowserStack exercise with working account
   credentials and a deliberately selected device. Configuration checks cannot
   establish provider availability or cloud UI behavior.
2. **Dependency maintenance:** the earlier audit reported 38 unresolved package
   findings. A compatibility-tested dependency migration remains separate work;
   this review did not force framework version changes.
3. **Broader mobile coverage:** iOS needs its own toolchain and app build. Permission,
   network, deep-link and upgrade scenarios need an app that exposes those features.
   Gesture and hybrid tasks remain exploratory until you execute and verify them.
4. **Distribution reproducibility:** the APK release is version-pinned, but the current
   download command has no checksum/signature verification and replaces the target
   file. The preflight's ZIP/header check is only a quick sanity check.

These boundaries are explicit learning and maintenance work, not passing coverage
claims. Use the [state manual](handbook/mobile-state.md) and
[capstone rubric](handbook/capstone-rubric.md) to choose the next extension.

[Course map](README.md)
