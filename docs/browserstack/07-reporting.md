# BS-07 · Turn execution into a trustworthy report

**Stage:** Read and report · **Time:** 60–90 minutes; optional integrations longer

## Prerequisites

[BS-06](06-dashboard.md), a real run record or the synthetic data below. Baseline
reporting needs no new package. JUnit, Allure and Test Reporting & Analytics
ingestion are optional extensions, not installed or validated default features.

Choose **baseline reporting first**: complete the next section and BS-07-A with
your real record or the fictional data provided. You can then continue to BS-08.
JUnit, Allure and analytics are separate experiments; you do not need to install
all three to finish this lesson or to explain a test failure.

## Step by step: the report you can produce today

1. Start with the [run record and daily summary](templates.md). Record source,
   dirty changes, app identity, selected command, environment and run/session IDs.
2. Count **planned, selected, executed, passed, failed and skipped cases** separately.
   Setup failure may prevent execution; zero failed with zero executed is not
   success. Record retry attempts separately from final case outcomes.
3. Cross-check terminal output with the provider session status. The supplied
   `after(result)` hook reports the entire session outcome. A warning about
   status reporting means the provider view may not match the runner.
4. Link private evidence from the actual attempt. Keep the original failure
   before any repair and rerun. Record missing screenshots honestly.
5. State impact and next action: what behavior was covered, what failed or
   remained untested, and who needs to investigate. Avoid “all good” without scope.
6. Save under `.local-data/browserstack/`. Evidence files need their own backup;
   progress exports do not archive them. Share only reviewed/redacted material.

Example **synthetic** summary:

```text
Scope: three Login cases, one Android device, commit SAMPLE (fictional).
Executed: 3. Passed: 2. Failed: 1. Skipped: 0. Sessions: 1.
Failure: empty-field validation timed out after submit.
Evidence: keyboard obscures the button in supplied video; no submit command success.
Decision: login coverage incomplete. Investigate action readiness; no release sign-off.
Not covered: real authentication, other devices, offline mode, permission denial.
```

For a completed attempt, executed cases normally split into passed and failed.
List skipped, excluded and never-started cases separately: none is evidence of
passing behavior. A setup/hook error can fail a session without a failed test
assertion; record that error as well as the case counts.

## Prepare and return from an optional experiment

Use these steps for either reporter lab, and for the later optional parallel
configuration exercise. A Git branch saves a version of tracked source; it does
not isolate installed `node_modules`, `.env`, or ignored personal evidence.

1. In the project terminal, save editor files and run `git status --short`.
   If it lists earlier work, review and save that work first. Do not reset or
   discard it to make this lab easier. Keep credentials/evidence out of commits.
2. Run `git branch --show-current` and write down your starting branch. From a
   clean working tree, create a new experimental branch:

   ```bash
   git switch -c codex/browserstack-reporting
   ```

   If that name already exists, choose a new name rather than replacing it.
   See [Git's branch switching guide](https://git-scm.com/docs/git-switch).
3. Complete **one** optional recipe below. Run commands one at a time. If an
   install, audit or typecheck fails, **stop before running a cloud test**.
   Preserve the error, investigate compatibility and use the baseline report
   while the extension is blocked. The examples are not permission to ignore
   audit findings or continue after an unsuccessful install.
4. To keep your experiment and return to the baseline, inspect `git diff` and
   save a commit on this experimental branch containing only your reviewed
   experiment changes (for reporters, `package.json`, `package-lock.json` and
   the cloud config; for the parallel lab, the cloud config).
   Use your editor's Source Control view to select those files; do not stage
   `.env`, generated reports or unrelated work. Then switch to the starting
   branch you recorded. For example, **only if it was `main`**:

   ```bash
   git switch main
   ```

5. On the starting branch, run `npm ci`, then `npm run typecheck`, stopping if
   either fails. This reinstalls that branch's locked packages; switching Git
   branches alone does not restore dependencies. Your experiment stays on its
   own branch, and your private evidence stays in ignored files. If you prefer
   to undo unsaved experimental edits instead, reverse only your own reviewed
   changes in the editor; do not use a blanket reset/restore on existing work.

## Optional lab: add a JUnit report deliberately

JUnit XML is a machine-readable test report; it is unrelated to this project's
failure **page-source XML**. Complete the experiment preparation above and
inspect package compatibility before installing anything:

```bash
npm ls @wdio/cli @wdio/spec-reporter
npm view @wdio/junit-reporter@10.1.0 peerDependencies engines
```

Version 10.1.0 exists and matches the course's WDIO 10.1.0 baseline as checked
on 27 October 2026. For that baseline:

```bash
npm install --save-dev --save-exact @wdio/junit-reporter@10.1.0
```

Only if installation succeeds, audit the updated dependency tree:

```bash
npm run audit
```

Only if the audit passes, check the project's types:

```bash
npm run typecheck
```

Review the lockfile diff. If your runner has changed or compatibility fails, stop
that extension and use the baseline report. Do not downgrade the course blindly.

On your experimental branch, edit **`config/wdio.browserstack.conf.ts`**.
Inside `export const config = { ... }`, add the `reporters` property below,
for example immediately after `maxInstances: 1,`. This overrides the inherited
terminal-only reporter while preserving `spec`. The launcher always loads this
exact file; creating a differently named config does not select it automatically.

```ts
// Choose a fresh run directory before EACH invocation, including reruns.
reporters: [
    'spec',
    ['junit', {
        outputDir: './logs/junit/bs-report-attempt-01',
        outputFileFormat: options => `results-${options.cid}.xml`,
        addWorkerLogs: false,
    }],
],
```

Save the config and run `npm run typecheck` again. Only after it passes, use the
normal wrapper with that saved config edit:

```bash
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "@smoke"
```

Open the resulting file under `logs/junit/bs-report-attempt-01/` in your editor.
For the baseline Login smoke selection, expect one selected case; compare its
name and outcome with the terminal. An error before test execution may produce
no test-result file, so missing XML is not evidence of an app assertion failure.
For BS-07-B, confirm the XML also records your controlled failed assertion.
Worker-specific filenames prevent workers overwriting each
other; changing the directory between attempts prevents stale result mixing.
Review the [WDIO JUnit configuration](https://webdriver.io/docs/junit-reporter).
Use the return steps above when you finish this extension.

## Optional lab: Allure and analytics

Start from your baseline branch with the experiment preparation above if you
want to try Allure independently of JUnit. Allure has two steps: its WDIO
reporter writes **raw results**, then the CLI
generates/views a report. For the WDIO 10.1.0 / Node 24 baseline, this optional
recipe uses the verified published **Allure 3** packages:

```bash
npm install --save-dev --save-exact @wdio/allure-reporter@10.1.0 allure@3.22.1
```

Only if installation succeeds:

```bash
npm run audit
```

Only if the audit passes:

```bash
npm run typecheck
```

This uses the Node-based `allure` CLI, not the older Java-based
`allure-commandline` package. Recheck compatibility if the baseline changes.
Keep existing hooks and a new results directory per attempt. In that same
**`config/wdio.browserstack.conf.ts`** object, use this complete `reporters`
property instead of the JUnit example (or deliberately combine both entries):

```ts
reporters: [
    'spec',
    ['allure', {
        outputDir: './logs/allure/bs-report-attempt-01',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        addConsoleLogs: false,
    }],
],
```

Save the config and run `npm run typecheck` again; stop if it fails. Then run a
selected case:

```bash
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "@smoke"
```

After the runner finishes, confirm that `logs/allure/bs-report-attempt-01/`
contains this attempt's results. Generate the HTML report from that directory:

```bash
npx allure generate logs/allure/bs-report-attempt-01 --output logs/allure-report/bs-report-attempt-01
```

If generation succeeds, open the generated report:

```bash
npx allure open logs/allure-report/bs-report-attempt-01
```

If `npx` asks to download a package, stop and check the installation step rather
than accepting a different version. For attempt 02, change the config's raw
results directory **and both command paths** to `bs-report-attempt-02`. A report
from attempt 01 cannot describe attempt 02.

Report generation is useful after a failed test too; don't join these commands
with `&&` if you need to inspect that failure. It reads existing results and
does not execute tests. Stop the report server with Ctrl+C. A successful report
build does not mean its cases passed. Repeat with a
[controlled failure in your own Forms practice spec](08-failures.md#bs-08-a-controlled-failure-and-recovery) and a
fresh directory. This minimal config deliberately omits screenshot/console
attachments; add only reviewed evidence and never the entire environment/key.
History also needs deliberate retention, not a directory of mixed old results.
See [WDIO's reporter](https://webdriver.io/docs/allure-reporter) and the
[Allure 3 CLI guide](https://allurereport.org/docs/v3/migrate/).

BrowserStack's newer dashboard may already show device sessions, while deeper
**Test Reporting & Analytics** needs supported test-level ingestion. Review the
[WDIO analytics integration](https://www.browserstack.com/docs/test-reporting-and-analytics/getting-started/javascript/webdriverio/integrate-your-tests)
as a compatibility investigation: this repo has no BrowserStack service/SDK.
Adding an unused YAML file or a guessed capability cannot enable it.

An alternative is generating real JUnit, then following the authenticated
[JUnit upload procedure](https://www.browserstack.com/docs/test-reporting-and-analytics/references/upload-junit-reports).
Confirm your account has access. Keep credentials in its supported secret
mechanism, submit only reviewed reports, wait for ingestion, then reconcile
imported test counts and failures. Upload acceptance is not completed ingestion;
JUnit import does not automatically link a device video. Use a stable logical
build name and the integration's run identifier for trends; the baseline direct
hub route uses a unique build label per invocation for easy manual correlation.

After ingestion, use this reporting walkthrough:

1. Select the intended project and **Build Runs**, then the run matching your
   report's source/time/identifier. Wait for ingestion to finish before counting.
2. Open **Tests**, filter failed cases and compare the case names and total with
   the runner's planned/selected/executed record. Investigate missing cases.
3. Open one failed case. Read expected/actual output and attempt history; compare
   first failure and rerun without erasing the earlier result.
4. Inspect available attachments and record missing video/steps as limitations
   of that ingestion route. A session dashboard and imported JUnit need not have
   the same detail or automatically link to each other.
5. Remove filters and check skipped/muted/excluded scope before using any pass
   percentage. Save a reviewed report link plus your summary and next action.

The source record remains the authority for what was selected and actually ran.
Follow [build insights](https://www.browserstack.com/docs/test-reporting-and-analytics/features/insights)
for the current account interface; account access and integration features vary.

## Exercises

### BS-07-A · Repair a misleading report

**Task:** planned cases 8; executed 6; passed 5; failed 1; excluded 2; a separate
rerun of the failed case passes. A teammate says “100% green.” Rewrite it using
the daily summary template. Then attempt [offline run-summary lab 09](../../exercises/09-run-summary/README.md)
with `npm run practice -- 09` (its starter intentionally needs your work).
**Acceptance:** correct denominators, visible initial failure and exclusions,
no double-counted unique cases, explicit evidence still needed.

<details><summary>Hint and review</summary>
The initial run is 5/6 passing among executed cases and incomplete against eight
planned cases. The rerun is a different attempt, not proof that the first failure
never happened. Report final status and instability separately.
</details>

### BS-07-B · Prove your report can be red

**Task:** choose baseline reporting or the optional JUnit extension. Use a
controlled wrong assertion in your own practice spec (BS-08). Compare terminal,
session and report counts/status; restore it and rerun deliberately.
**Acceptance:** two distinct attempts, failure retained, correct case/session
counts and a useful handover. For JUnit, verify each worker's unique XML file;
artifact upload alone is not a test-results dashboard.

<details><summary>Hint and review</summary>
Keep failed and corrected outputs in different directories. The original
screenshot `.xml` describes the UI; it is not JUnit and cannot substitute for it.
</details>

## Checkpoint

Explain what your report proves, what it cannot prove, and how you know the
intended tests actually ran. Optional integrations remain unexecuted until you
install, configure and observe them with your own account.

[Previous](06-dashboard.md) · [Path](README.md) · [Next: investigate failures](08-failures.md)
