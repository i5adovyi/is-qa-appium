# BS-12 · Maintain access, artifacts and reproducibility

**Stage:** Own the result · **Time:** 40–60 minutes

## Prerequisites

[BS-07](07-reporting.md) and knowledge of your team's ownership/retention policy.
Both exercises can be completed offline. Credential rotation and data cleanup
are real account changes: perform them only for resources you own or administer.

## Step by step

1. Keep a reproducibility record: source commit and dirty changes, Node/WDIO
   versions, exact APK identity, device/OS, remote Appium version and selected
   command. Compare this record when “the same test” suddenly behaves differently.
2. Use the lockfile and [dependency maintenance guide](../handbook/dependency-maintenance.md).
   Review compatible changes, run offline checks and then one relevant cloud
   case when access is available. `npm audit fix --force` is not a debugging step.
3. Treat uploaded app identifiers as account-scoped, expiring references. Our
   launcher obtains a fresh identifier from a verified upload each invocation.
   A copied old ID or a mutable custom label is not a permanent artifact record.
4. For a planned key rotation, identify all consumers first: local `.env`, CI
   secrets, optional tunnels and report tools. Follow current account controls
   and coordinate with teammates; do not invalidate a shared key unexpectedly.
   Replace each consumer without printing the key, then preflight and verify
   one selected live run. Old key rejection alone is not successful migration.
5. If a key is exposed, revoke/rotate through the authorized owner promptly,
   review access/use and remove exposed material from its destinations. Deleting
   one Git line does not remove history, logs, cached artifacts or copies.
6. Review evidence sharing and retention. A public report/video URL may carry
   access tokens. Keep links private by default, redact personal inputs and
   avoid including whole API responses in issues. Use synthetic accounts/data.
7. Back up personal notes and evidence intentionally. `.local-data/`, `logs/`
   and provider artifacts have different storage/retention lifetimes. Reader
   progress backups do not contain those files; a GitHub push does not save them.

## Optional read-only API reporting

After learning the dashboard, review the [sessions API](https://www.browserstack.com/docs/app-automate/api-reference/appium/sessions).
You can retrieve sessions for a build or details for one known session. A useful
small tool reads credentials locally, authenticates in headers, limits timeouts,
rejects redirects and extracts only fields needed for a report. Keep raw bodies
and token-bearing URLs out of console output. Handle pagination and non-2xx
responses explicitly; partial results cannot prove complete coverage.

Design before implementing: input exact build/session ID; output count, status,
device and duration; reconcile with the runner's case counts. A session API
response cannot invent test-level metadata the integration never sent. This
repo does not include a live API report collector; BS-07's baseline report
and optional reporter route work independently.

## Exercises

### BS-12-A · Key rotation rehearsal

**Task:** write a rotation runbook for a laptop, GitHub workflow and optional
tunnel. Include inventory, owner coordination, update order, verification and
what to do when one consumer still uses the old key. Use no real secret values.
**Acceptance:** every consumer has an owner and a verification step; no live
credential is revoked for the exercise; sharing/exposure response is included.

<details><summary>Hint and review</summary>
Environment precedence can explain an old key still being used. A secret
changed in GitHub does not automatically update the laptop or a running process.
</details>

### BS-12-B · Yesterday's result no longer reproduces

**Task:** synthetic evidence: same test commit, different uploaded app metadata,
remote Appium default changed, teammate also enabled network logs. Build a
comparison table and propose the smallest controlled experiment.
**Acceptance:** separate the three changed variables; name exact missing
versions/artifacts and avoid asserting a cause before observation.

<details><summary>Hint and review</summary>
The source commit is only one part of the environment. Instrumentation/logging
can alter behavior, and a dashboard's build label does not prove identical bytes.
</details>

## Checkpoint

Can another person reproduce your scope without receiving your access key?

[Previous](11-local-tunnel.md) · [Path](README.md) · [Next: capstone](13-capstone.md)
