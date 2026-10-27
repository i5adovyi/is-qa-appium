# BrowserStack workplace incident bank

All evidence below is **synthetic**. Analyze it without an account, or replace
it with your own authorized observation. Never provoke outages or revoke keys
to manufacture an exercise. Save each attempt in your personal folder.

For every card: identify the last successful stage, two plausible explanations,
one distinguishing observation, the smallest next action, owner and report
impact. Acceptance requires separating facts from hypotheses and naming what
has not executed. Open the review only after an attempt.

## How to attempt a card

1. Start with the [failure stages in BS-08](08-failures.md). No account, phone,
   installation or paid run is required to analyze these supplied incidents.
2. Create `.local-data/browserstack/BI-NN-attempt.md` in your editor; replace
   `NN` with the card number. Copy the [incident attempt template](templates.md#incident-attempt).
3. Spend 15–20 minutes on the evidence and task. Label missing information as
   **unknown**; proposing a check does not mean you performed it.
4. Write an answer to the changed condition where supplied, then open the review.
   Improve your reasoning without rewriting your original attempt as a success.
5. Stop when you have a bounded next action, owner and honest outcome. If the
   next check needs an account, approved network access or another app, mark it
   blocked. Do not buy usage, change trust settings or run cloud sessions simply
   to finish an offline card.

The evidence is deliberately incomplete. A good answer can be “this observation
would distinguish the causes”; you do not need to invent a single proven cause.

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

## BI-13 · Browser sign-in works, Node cannot upload

**Prerequisites / mode:** read BS-02 and BS-08; offline investigation. A live
check requires your organization's approved network and trust configuration.

**Evidence (synthetic):**

```text
09:10 Company laptop: BrowserStack dashboard opens in the browser on VPN.
09:12 Project launcher: APK checksum verified; upload fails before an app ID.
09:14 IT's approved Node network diagnostic: certificate issuer not trusted.
      No cloud session ID; no Appium commands; Node is version 24.
```

**Task:** explain why successful browser sign-in does not prove that the Node
process can upload. Prepare a redacted handover to the network/platform owner
with the affected process, stage, destination and error; request the approved
proxy/certificate setup and one bounded verification.

**Acceptance:** distinguish the laptop-to-provider connection from BI-10's
remote-app-to-backend connection. Keep credentials and TLS verification intact;
do not change selectors or upload timeout without evidence. Report zero UI
execution and identify what remains unknown about the connection.

**Changed condition:** after IT applies the approved trust configuration, the
same diagnostic reports a connection timeout instead of a certificate error.
What new observation would distinguish routing/proxy policy from provider reachability?

<details><summary>Review guidance</summary>
Browser and Node processes can have different proxy/trust configuration. The
certificate observation supports investigating trust first; it does not prove
which component presented the certificate or that all network layers work.
Use the organization's supported Node configuration, not a TLS-verification
bypass. A later timeout is new evidence: record both attempts and ask for an
approved connection/proxy diagnostic. Do not claim the first error still explains
the second. The mobile app has not been tested.
</details>

## BI-14 · The fix is pushed, but CI runs the old code

**Prerequisites / mode:** read BS-06 and BS-08; offline investigation. A live
rerun requires repository access and authorization to consume cloud usage.

**Evidence (synthetic):**

```text
09:00 Workflow run 418 started from commit 1111111; a locator assertion failed.
09:20 Locator fix pushed to main at commit 2222222.
09:25 Learner clicks “Re-run failed jobs” on run 418.
09:30 Checkout / GITHUB_SHA in that attempt still shows 1111111.
      The same old selector appears in the failure output.
```

**Task:** explain whether this is evidence against the fix. Specify the source
identity to check and how to start the project's manual workflow for the intended
branch, with login-smoke scope and a recorded resulting commit.

**Acceptance:** preserve the failed old run, distinguish rerun from a new dispatch,
and require the checked-out SHA to match the intended fix before evaluating it.
Do not add sleeps or another locator change to repair a source-selection mistake.

**Changed condition:** the new run checks out `2222222`, but now the app has the
old screen layout. Which app identity or configuration evidence would you inspect
before deciding that GitHub ignored the commit?

<details><summary>Review guidance</summary>
GitHub reruns keep the original event's SHA and ref; pushing a fix does not update
an old run. Start a new workflow dispatch on the intended branch and inspect the
actual checkout, because a branch name alone can move. Test source and uploaded
app are separate versions: compare the APK checksum, upload identity and actual
app build before concluding the fix failed. In this project's pinned demo,
changes to test code do not rebuild the mobile app. See
[GitHub's rerun behavior](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs).
</details>

## BI-15 · An element timeout hides an earlier app crash

**Prerequisites / mode:** read BS-07 and BS-08; offline investigation. Evidence
describes a fictional company app; do not deliberately crash the training device.

**Evidence (synthetic):**

```text
14:02:00 Session starts; company app is visible.
14:02:04 Device log: fatal exception in the company app process.
14:02:05 Video returns to the Android home screen.
14:02:20 Test reports “Login button was not displayed”.
14:02:21 Best-effort screenshot capture also fails.
```

**Task:** build an ordered timeline and choose the first useful investigation.
Write a report with app/build, device/OS, action immediately before the crash and
the missing evidence needed to distinguish an app defect from a launch/environment
problem. Explain what the locator error actually proves here.

**Acceptance:** treat the crash evidence as earlier than the timeout, retain the
assertion failure, and avoid naming a proven root cause from a single log line.
State that screenshot capture is secondary; request authorized device/crash logs
with sensitive content removed instead of blindly increasing the element wait.

**Changed condition:** a second attempt has no crash record, the app process
remains alive and the video shows a permission dialog. Does the first diagnosis
explain this attempt, and what state must the test handle or verify?

<details><summary>Review guidance</summary>
A missing element is consistent with being outside the intended app screen.
Correlate timestamps and the process/package identity; unrelated log errors are
not enough. Preserve available video and logs even if the final screenshot is
missing. A permission prompt supplies a different state explanation for the
second attempt; inspect permission setup and expected flow. Do not group both
attempts under “flaky locator” or assert that the crash proves a backend defect.
</details>

## BI-16 · Usage ends halfway through the planned matrix

**Prerequisites / mode:** read BS-01, BS-07 and BS-10; offline investigation.
This is a proposed three-device job, not the repository's default single-device run.

**Evidence (synthetic):**

```text
Plan: one login case on each of three device/OS combinations: A, B and C.
A: one session created; one case executed and passed.
B: no session created; account notice says available usage is exhausted.
C: launcher stops before requesting a session.
Summary drafted by a teammate: “Login passed on the Android matrix.”
```

**Task:** rewrite the summary and prepare a bounded plan for the unfinished
coverage. Identify the person who can confirm allowance and account access;
keep a purchase or plan change separate from the test investigation.

**Acceptance:** report three planned case/device executions, one executed pass,
and two not executed, with different stopping stages for B and C. Do not report
an app assertion failure for either missing execution or claim three passes.
Retain A's evidence and choose a justified remaining scope before any new run.

**Changed condition:** the account owner confirms usage remains, but all
concurrent slots are occupied. Which diagnosis and next action change?

<details><summary>Review guidance</summary>
Account allowance/access and concurrent capacity are different constraints.
Use the actual signed-in account notice and observation time; do not infer a
plan's current limits from public marketing. An unexecuted requirement remains
uncovered even when a reporter omits it. With occupied slots, use BI-03's
coordination and bounded wait rather than a purchase or repeated submissions.
Never make the incomplete matrix appear green by dropping B and C from the plan.
</details>

## BI-17 · The terminal stopped, but the phone is still busy

**Prerequisites / mode:** read BS-06 and BS-10; offline investigation. Checking
or stopping a real session requires access and confirmation that it is yours.

**Evidence (synthetic):**

```text
16:10 Runner starts build practice-17 with session S-17.
16:11 Laptop loses connectivity; terminal closes before the final result.
16:12 Dashboard observation: S-17 is still running; last command is at 16:11.
16:13 Teammate's job waits for the only available account slot.
      No final case summary or confirmed teardown exists for practice-17.
```

**Task:** draft a recovery and handover checklist: confirm session ownership,
inspect the latest state, preserve available evidence and arrange to stop an
owned orphaned session through an available authorized control or its owner.
Choose the stopping point before considering a rerun.

**Acceptance:** do not assume closing a terminal terminated the remote session.
Record interrupted/unknown outcome and remaining coverage; do not cancel another
person's work. Verify the final observed remote state and capacity before a
bounded rerun, and record any cleanup you could not perform.

**Changed condition:** the dashboard now shows the session ended, but there is
still no assertion result or runner exit status. Can the run be called passed?

<details><summary>Review guidance</summary>
The supplied current observation justifies investigating a still-running
session; it is not a promise that every disconnect leaves one running. Check
identity and timestamps before taking action. A timeout may eventually release
the session, but does not recover a missing test verdict. “Ended” proves neither
that teardown completed nor that the intended case passed. Preserve unknown
outcomes and separate cleanup confirmation from test evidence.
</details>

## BI-18 · A fresh install has a screen the test never considered

**Prerequisites / mode:** read BS-05 and BS-08; offline investigation. The
fictional app has onboarding; this is not a claim about the pinned demo's flow.
Live practice needs an authorized app with a documented first-launch experience.

**Evidence (synthetic):**

```text
Local phone: app used for two weeks; test opens Login and passes.
Cloud phone: fresh install; same APK checksum and intended Android version.
Cloud video: “Welcome — choose your language”, then “Continue”.
Test: waits directly for the Login email input and times out.
No onboarding actions or initial-state assertion appear in the test.
```

**Task:** write separate preconditions for a first-install onboarding test and
a returning-user login test. Propose a deterministic setup and the observation
that proves each is at the intended screen before entering credentials.

**Acceptance:** explain why equal app bytes do not imply equal saved app state.
Do not mask an unexpected screen with an unlimited wait or optional clicks that
silently skip assertions. Name which case covers onboarding and which depends
on it; if setup cannot establish the required state, fail with a useful reason.

**Changed condition:** the welcome page is handled, but the next video frame
shows an Android permission dialog. How does that differ from app onboarding,
and would automatic permission granting test the user's permission decision?

<details><summary>Review guidance</summary>
Treat state as a precondition, not a property of an APK. Verify the team's
documented install/reset behavior; never reset a learner's device or real data
as an offline exercise. A dedicated onboarding assertion and an explicit setup
step give different evidence from a helper that ignores every missing screen.
Android permission UI is a separate flow. The baseline grants permissions
automatically and is not evidence of accept/deny handling; a permission exercise
needs its own configuration, expectations and authorized app.
</details>

[Path](README.md) · [Failure lesson](08-failures.md) · [Templates](templates.md)
