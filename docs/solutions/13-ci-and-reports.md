# 13 · Solutions and reasoning

[Return to exercises](../lessons/13-ci-and-reports.md).

## 13-A · Workflow audit

Your table must match the checked-in YAML. A sound interpretation distinguishes:

- Default CI: install locked dependencies and run configured source/course checks, reference solutions, mocked `framework:test`, and reader/progress `course:test`. It needs Node and package access. It cannot prove a mobile element exists.
- Manually dispatched BrowserStack workflow: install dependencies, obtain the demo APK, read repository secrets, and execute the configured remote suite. It needs account access and provider availability. It cannot prove untested devices or iOS work.

If a workflow includes additional offline solution checks, list them separately from mobile tests. The hosted evidence is a run URL with commit, job logs, conclusion, and artifacts. A local check or a YAML file is not hosted execution evidence.

For the supplied workflow, `inputs.confirm == 'RUN'` gates the cloud job. Its artifact step uses `failure()`, uploads `logs/`, retains files for seven days, and ignores a missing artifact directory. A skipped job and a failed job with no collected screenshots are different outcomes; inspect job logs and test counts before claiming execution.

`npm ci` uses the committed lockfile and fails on dependency-manifest disagreement. It is appropriate for reproducible CI installation, although package availability and platform requirements remain external dependencies.

## 13-B · Example artifact policy

For a private training team using only synthetic data:

```text
Upload: logs/*.png, logs/*.xml, relevant runner/server log files
When: after a failed run; preserve the original exit status
Retention proposal: 7 days for routine runs; reviewed incident evidence retained separately
Access: repository members with an operational need
Exclude: .env, home directories, access keys, unrelated files, real customer data
Review: inspect screenshot/XML/log content before external sharing
Missing files: warn clearly; do not turn the failed test into a pass
```

Seven days is an example policy choice, not a legal or universal requirement. Align it with the team's data and hosting rules. Use explicit upload paths rather than the entire checkout.

## 13-C · Release recommendation

> Static checks pass, but one of eight Android checks consistently fails on login validation. We should investigate that reproducible behavior before approving the login change. Confirm the actual user impact using the failing scenario and its artifacts, repair or explicitly accept the scoped risk, then rerun the relevant case and regression suite. BrowserStack has not run, so we have no cloud-device evidence for this build.

If the release does not touch login and the failure is a known test defect, the decision could differ—but that needs evidence. “Seven passed” alone is not a risk argument. Percent of passing tests is a suite statistic, not a measurement of product quality.

Artifact collection after failure keeps investigation possible. An upload outage and a product assertion failure are independent facts; report both.

[Next lesson](../lessons/14-test-design.md)
