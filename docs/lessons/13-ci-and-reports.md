# 13 · CI and evidence a teammate can trust

**Stage:** Deliver credible results\
**Estimated time:** 90–120 minutes\
**Prerequisites:** Lessons 10 and 12; basic Git concepts.\
**Outcome:** Read a workflow, distinguish static checks from device execution, and retain useful failure evidence.

## Two different questions

“Does the source typecheck?” and “Does the app behave correctly on a device?” require different checks. A TypeScript pass cannot verify a selector against an installed APK. A mobile pass cannot prove every unexecuted source branch is type-correct.

This repository separates its default CI checks from a manually dispatched BrowserStack workflow. Read the actual files:

- `.github/workflows/ci.yml`
- `.github/workflows/browserstack.yml`

The manual cloud workflow avoids consuming account sessions merely because someone pushes a commit. Running it requires a hosted repository, configured secrets, and authorized App Automate access. The existence of a YAML file does not mean GitHub has executed it.

The default workflow runs `audit`, `typecheck`, `typecheck:practice`, `course:check`, `practice:solutions`, `framework:test`, and `course:test`. These check known package advisories, TypeScript, course structure, offline reference solutions, mocked framework regressions, and the local reader/server and progress-backup behavior. The mocked framework checks do not launch Appium or prove a device interaction. The cloud workflow requires the dispatch input `confirm` to be `RUN`, then runs the Android suite remotely. Its failure artifact is named `mobile-failures-<run_id>-<attempt>` and retained for seven days.

## Worked example: evidence belongs to a run

A useful run summary has:

```text
Commit: exact revision under test
Command: npm run test:smoke
Environment: Android emulator, API level, app build
Result: counts of passed / failed / skipped tests
Failure: named test and first meaningful error
Artifacts: screenshot and source from the same run
Limitations: BrowserStack not run; hybrid not evaluated
```

Failure files under `logs/` include a sanitized test title plus uniqueness information, and may include `.png` screenshots and `.xml` page source. Test names should describe behavior without including secrets. Diagnostic capture is best effort: if the session dies, preserving the original failure is more valuable than throwing a replacement screenshot error.

The current cloud workflow uses `if: failure()` to upload `logs/` only after failure, with `if-no-files-found: ignore`. Therefore a failed session setup may legitimately produce no artifact: the run's job log remains important. An alternative `if: always()` would also run after successful jobs; it is a policy choice, not the current configuration. Limit paths to intended diagnostic outputs and choose retention deliberately. See [GitHub workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data).

## Guided lab

1. Read both workflow files line by line. Identify trigger, runner, Node version, install command, checks, secrets, and artifacts.
2. Run the relevant local checks:

   ```bash
   npm run audit
   npm run check
   npm run course:test
   npm run test:smoke
   ```

   `npm run check` includes the source/course/reference-solution checks plus `framework:test`. `course:test` is a separate reader test suite. `test:smoke` is the device run. These commands answer different questions even when all report success.

3. Compare the commands in the default workflow with the commands you ran. Write which evidence requires an emulator.
4. If you own a GitHub repository for this project, configure its BrowserStack secrets through GitHub settings, not committed YAML. Read [GitHub's secrets guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).
5. Dispatch cloud execution only when you intend to use the account. Otherwise complete a workflow review and mark hosted execution “not run.”

For any hosted claim, retain the run URL and commit, verify the expected job actually ran, and check executed test counts. A skipped cloud job (for example, dispatch confirmation not equal to `RUN`) is not a passing mobile run. Environment secrets are unavailable in some untrusted contribution contexts; do not change workflow security boundaries merely to make a fork run cloud tests.

## Exercises

### 13-A · Audit the workflow

Produce a table of each workflow's trigger, checks, external dependencies, secrets, and expected artifacts. Identify one failure that each workflow **cannot** detect.

**Acceptance:** default CI is not described as an emulator run; BrowserStack requirements are explicit; the table matches actual YAML; no invented hosted success badge.

<details><summary>Hint 1 · Read commands before labels</summary>
A job named “test” can run only a compiler. Its name does not establish coverage.
</details>
<details><summary>Hint 2 · Name a concrete blind spot</summary>
An incorrect accessibility ID can typecheck. A device test may pass while a documentation link is broken.
</details>

### 13-B · Design an artifact policy

For a team using synthetic users, propose what to upload on failure, when to delete it, and who can access it. Consider screenshots, page XML, device logs, and command output.

**Acceptance:** paths are limited; retention is stated as a team decision rather than a universal rule; credentials and personal data are excluded; missing artifacts do not hide test failure.

<details><summary>Hint 1 · XML can expose more than a screenshot</summary>
The hierarchy may include text from controls not currently visible.
</details>
<details><summary>Hint 2 · Failure evidence needs access control</summary>
Public repository artifacts and private organization artifacts have different audiences; check the hosting configuration.
</details>

### 13-C · Write a release recommendation

Given: static checks pass, 7 of 8 Android tests pass, one login validation test fails consistently, and BrowserStack has not run. Write a short recommendation with evidence, impact, and next action.

**Acceptance:** no “87.5% quality” claim; failing behavior described; unrun coverage remains explicit; recommendation depends on release risk rather than green percentage.

<details><summary>Hint 1 · Count is not severity</summary>
One critical broken flow can outweigh many passing cosmetic checks.
</details>
<details><summary>Hint 2 · Make the uncertainty actionable</summary>
Request investigation of the reproducible failure and the device coverage justified by the release's users.
</details>

## Checkpoint

- Why is `npm ci` useful for a committed lockfile?
- What evidence proves that a remote workflow actually ran?
- When does `if: always()` help?
- Why is an artifact upload failure a different fact from a product assertion failure?

[Solutions](../solutions/13-ci-and-reports.md) · [Next: test design](14-test-design.md) · [Course index](../README.md)
