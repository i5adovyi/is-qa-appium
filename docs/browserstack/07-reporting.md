# BS-07 · Turn execution into a trustworthy report

**Stage:** Read and report · **Time:** 60–90 minutes; optional integrations longer

## Prerequisites

[BS-06](06-dashboard.md), a real run record or the synthetic data below. Baseline
reporting needs no new package. JUnit, Allure and Test Reporting & Analytics
ingestion are optional extensions, not installed or validated default features.

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

## Optional lab: add a JUnit report deliberately

JUnit XML is a machine-readable test report; it is unrelated to this project's
failure **page-source XML**. Work on your own branch, preserve unrelated edits
and inspect package compatibility before installing anything:

```bash
npm ls @wdio/cli @wdio/spec-reporter
npm view @wdio/junit-reporter@10.1.0 peerDependencies engines
```

Version 10.1.0 exists and matches the course's WDIO 10.1.0 baseline as checked
on 27 October 2026. For that baseline:

```bash
npm install --save-dev --save-exact @wdio/junit-reporter@10.1.0
npm run audit
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

Use the normal wrapper with that saved config edit:

```bash
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep @smoke
```

Confirm XML exists, matches the expected cases and records a deliberately
failed assertion. Worker-specific filenames prevent workers overwriting each
other; changing the directory between attempts prevents stale result mixing.
Review the [WDIO JUnit configuration](https://webdriver.io/docs/junit-reporter).
Revert only your experimental changes if you do not keep the extension.

## Optional lab: Allure and analytics

Allure has two steps: its WDIO reporter writes **raw results**, then the CLI
generates/views a report. For the WDIO 10.1.0 / Node 24 baseline, this optional
recipe uses the verified published **Allure 3** packages:

```bash
npm install --save-dev --save-exact @wdio/allure-reporter@10.1.0 allure@3.22.1
npm run audit
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

Run a selected case, then generate/open its report as separate commands:

```bash
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep @smoke
npx allure generate logs/allure/bs-report-attempt-01 --output logs/allure-report/bs-report-attempt-01
npx allure open logs/allure-report/bs-report-attempt-01
```

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
