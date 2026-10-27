# BrowserStack workplace incident bank

All evidence below is **synthetic**. Analyze it without an account, or replace
it with your own authorized observation. Never provoke outages or revoke keys
to manufacture an exercise. Save each attempt in your personal folder.

For every card: identify the last successful stage, two plausible explanations,
one distinguishing observation, the smallest next action, owner and report
impact. Acceptance requires separating facts from hypotheses and naming what
has not executed. Open the review only after an attempt.

## BI-01 · Login fails before a phone exists

**Evidence:** APK verifies; upload HTTP 401; no `bs://` result or session ID.
**Task:** draft a safe credential-source investigation. A teammate suggests a
longer Login timeout. Explain whether it can help.
**Acceptance:** account/upload boundary, no claimed app failure, no key printed.

<details><summary>Review guidance</summary>
Check credential source/precedence, key validity and intended account. The UI
test never started. Typecheck and preflight cannot prove remote authentication.
</details>

## BI-02 · It is in the public catalog

**Evidence:** upload succeeds; requested model/OS is rejected; a different team
can run that model. No app commands appear.
**Task:** separate public inventory, exact combination and account entitlement.
**Acceptance:** verify the pair with the signed-in account before changing tests.

<details><summary>Review guidance</summary>
Different accounts/tiers can have different access. A plausible OS/model pair
is not necessarily available. Preserve the provider's actual error text.
</details>

## BI-03 · Waiting for capacity

**Evidence:** account permits two sessions; two team jobs are active; yours is
queued. Increasing element timeout does nothing.
**Task:** plan coordination and a bounded wait/cancel decision.
**Acceptance:** distinguish queue time from UI wait and avoid repeated submissions.

<details><summary>Review guidance</summary>
Runner settings cannot grant a third slot. Check active work and queue policy;
do not terminate another owner's sessions without coordination.
</details>

## BI-04 · The dashboard says done

**Evidence:** terminal assertion fails; status-hook warning appears; session
ends and dashboard labels it done/completed.
**Task:** write an accurate result and identify reporting follow-up.
**Acceptance:** retain failed assertion status; completed lifetime is not a pass.

<details><summary>Review guidance</summary>
The provider status update may have failed. Preserve the runner result and
investigate the aggregate status mechanism separately from app behavior.
</details>

## BI-05 · A green run selected nothing

**Evidence:** grep contains a typo; a worker/session starts; report contains
zero executed matching cases.
**Task:** propose a selection check and the corrected bounded rerun.
**Acceptance:** use spec plus matching title; require nonzero intended execution.

<details><summary>Review guidance</summary>
A session can exist without executing the intended case. Neither an uploaded
APK nor a zero exit code by itself closes the evidence gap.
</details>

## BI-06 · The keyboard changed the layout

**Evidence:** cloud session starts, inputs fill, screenshot shows the keyboard
covering Login; the failed path directly clicks submit. Shared login helper
already contains keyboard handling.
**Task:** compare the action paths and propose a focused repair.
**Acceptance:** inspect state and shared helper before changing locator/coordinates.

<details><summary>Review guidance</summary>
Use the established action when appropriate and wait for the intended readiness
condition. Confirm the keyboard handling actually succeeded on this device.
</details>

## BI-07 · No failure screenshot in CI

**Evidence:** session creation fails; `logs/` is absent; artifact upload says no
files found. A teammate says the failure handler is broken.
**Task:** explain which evidence can exist and what to inspect first.
**Acceptance:** job/provider setup logs preserved; no invented screenshot.

<details><summary>Review guidance</summary>
No usable session may ever have existed. Diagnostic capture is best effort;
its absence must not replace the original setup failure.
</details>

## BI-08 · Two workers, one XML file

**Evidence:** optional JUnit configured with `results.xml`; workers overlap;
the final report contains only one worker's cases. Yesterday's files also remain.
**Task:** redesign output paths and count reconciliation.
**Acceptance:** separate invocation directories and worker filenames; old attempt
retained without being merged into new results.

<details><summary>Review guidance</summary>
Use run identity plus worker identity. Uploading a directory successfully does
not prove every expected file/case was captured or parsed.
</details>

## BI-09 · Green on the third attempt

**Evidence:** five required cases, one fails twice then passes on rerun; two
unrelated cases were muted in another suite. Report says 100% green.
**Task:** write final outcome, first-attempt reliability and exclusions separately.
**Acceptance:** all attempts visible, unique cases not inflated, muted scope named.

<details><summary>Review guidance</summary>
A rerun changes available evidence but does not erase earlier failures. Muting
changes reporting policy, not behavior. Avoid an unsupported release conclusion.
</details>

## BI-10 · Public internet works, staging fails

**Evidence:** remote app loads public data; private staging DNS fails; laptop on
VPN reaches staging. Later a tunnel makes DNS work but TLS validation fails.
**Task:** distinguish both failure layers and name required app-origin proof.
**Acceptance:** routing/tunnel and certificate trust handled separately.

<details><summary>Review guidance</summary>
Use BS-11. Do not disable TLS verification. A connected tunnel is not evidence
of successful authenticated requests from the actual app.
</details>

## BI-11 · Parallel accounts are not isolated

**Evidence:** two device workers share a backend user; one cleanup deletes the
other's data. Their report filenames also collide.
**Task:** design fixture and evidence ownership, including failed-job cleanup.
**Acceptance:** independent data identities and output paths; no shared destructive cleanup.

<details><summary>Review guidance</summary>
Separate phones do not isolate server state. Use run/worker/scenario ownership
and idempotent cleanup; retries would make this incident harder to explain.
</details>

## BI-12 · Report accepted, evidence incomplete

**Evidence:** JUnit ingestion returns accepted; later only 4 of 6 cases appear;
the report is from the wrong app build, and a public video-share URL was pasted
into a ticket.
**Task:** triage ingestion, provenance and sharing as separate problems.
**Acceptance:** reconcile expected case count and app/source identity; review
sharing access; avoid claiming complete coverage from HTTP acceptance.

<details><summary>Review guidance</summary>
Ingestion can be asynchronous or partial. Inspect schema, files and identifiers;
restrict/remove unintended sharing through the authorized owner. A video link
is not automatically a safe public artifact.
</details>

[Path](README.md) · [Failure lesson](08-failures.md) · [Templates](templates.md)
