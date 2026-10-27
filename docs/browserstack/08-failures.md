# BS-08 · Investigate the earliest useful failure

**Stage:** Read and report · **Time:** 45–75 minutes

## Prerequisites

[BS-03](03-first-run.md) and [BS-06](06-dashboard.md). The incident cards can be
analyzed entirely offline. A deliberate live failure uses your own practice
spec and account resources; it must never alter supplied reference expectations.

If BS-03 failed before a session existed, you can come here immediately. BS-06
helps only with evidence that was actually produced; account/setup failures do
not require a successful cloud run before you investigate them.

## Step by step

1. Preserve the first attempt's command, time, versions and earliest meaningful
   error before rerunning. Later screenshot failures may just mean the session died.
2. Identify the last stage that actually succeeded using the table below.
3. Make two competing hypotheses and choose one observation that distinguishes
   them. “Increase every timeout” is not an observation.
4. Change only the relevant variable in your own experiment. Use one selected
   case. If the evidence does not justify another paid attempt, continue offline.
5. Compare before/after evidence, restore deliberate defects, and record the
   remaining uncertainty. A successful retry alone does not establish a root cause.

| Earliest signal | Investigate first | Do not start with |
| --- | --- | --- |
| Missing/placeholder credential | `.env`/CI input source | Locator edits |
| Upload HTTP 401/403 | Credential validity, organization access, entitlement | UI waits |
| Upload timeout/network failure | Provider reachability, proxy, bounded request | Changing expected alert text |
| APK checksum mismatch | Artifact/version/download integrity | Disabling verification |
| Device/capability rejected | Exact pair, remote version, supported namespaces | Reinstalling local emulator |
| Queue/parallel limit | Active sessions and account capacity | Increasing element waits |
| Session starts, wrong screen | App identity, navigation, state | Guessing a new XPath |
| Button covered by keyboard | Video, layout, shared action path | Fixed-coordinate tapping |
| Session dies | App/device/instrumentation logs | Blaming secondary screenshot error |
| Assertion differs | Requirement, observed state, synchronization | Changing expected to observed blindly |
| Runner fails; dashboard looks green/done | Status-hook warning and aggregate outcome | Calling the run passed |
| Report missing cases | File selection, grep, ingestion, skipped/excluded work | Using pass percentage alone |

Consult the [provider error reference](https://www.browserstack.com/docs/app-automate/appium/error-codes)
for the actual error returned. Do not copy guessed error strings into a bug report.
Use [incident cards](incidents.md) for supplied evidence and review questions.

## Exercises

### BS-08-A · Controlled failure and recovery

**Task:** after a passing personal Forms case, change only its expected echoed
text to an intentionally wrong value. Predict the failing assertion, execute
that case once, inspect the artifacts, restore the correct expectation and
rerun. This is a training defect, not a reported product bug.
**Acceptance:** original failure retained; expected/actual difference explained;
restored code passes if live access works; no `.skip`, `.only`, retry inflation
or catch-and-ignore fix. Record blocked execution honestly.

<details><summary>Hint and review</summary>
An assertion mismatch should reach a valid session and the intended screen.
If setup fails first, you have not yet tested the deliberate defect. Do not
delete that evidence; resolve the earlier prerequisite separately.
</details>

### BS-08-B · Triage three tickets

**Task:** select one pre-session, one interaction and one reporting incident
from the bank. For each, write last successful stage, two hypotheses, next
observation, likely owner and smallest justified rerun.
**Acceptance:** three evidence-based plans, with no invented successful cloud
execution and no secret-bearing logs. Use the bug report template.

<details><summary>Hint and review</summary>
Authentication, app behavior and reporting have different owners. When no
session started, no device video can exist for that attempt. When DNS fails,
changing the login element ID does not reach the backend.
</details>

## Checkpoint

Can you defend the next action using evidence from this attempt? For real
network issues, follow BS-11; for maintenance/credential rotation, BS-12.

[Previous](07-reporting.md) · [Path](README.md) · [Next: CI execution](09-ci.md)
