# Workplace scenarios: beyond a passing login

These **36 original case exercises** extend the sixteen core lessons. Most start
after lesson 09; follow the prerequisite on each case. Use the interview companion
after you have attempted a case yourself.
Each case should take about 25–45 minutes to design. Device implementation can
take longer and requires the stated feature.

The written product rules below are **fictional training contracts**, not claims
about the demo APK. Do not copy their expected results into demo tests without
checking the app's actual requirements. Technical references were reviewed on
20 October 2026; this is a practical risk inventory, not proof that every employer
or application needs every scenario.

## Choose an honest execution mode

| Mode | What you can do here | What it proves |
|---|---|---|
| Demo investigation | Inspect Forms/Login/Swipe/Webview on the supplied APK | Only the observed build/device behavior; extensions are not pre-verified |
| Offline lab | Run the fake or pure TypeScript exercises | The helper's stated contract, not a device or backend integration |
| Design exercise | Use the supplied situation, trace and requirements | Your reasoning and proposed coverage; record **designed only** |
| Feature environment | Implement on a permitted test app/backend with the feature | Only the scenario and environment actually executed |

Do not turn a missing feature into a passing skipped test. The current baseline
has seven Android tests; adding a design document does not increase that count.

For **every case**, submit a short evidence note with: risk; precondition; action;
expected observation and requirement source; best test layer; setup and cleanup;
evidence needed to distinguish app/test/environment faults; execution status;
and a 90-second spoken explanation. Use the [state worksheet](mobile-state.md).

## RW-01 · The keyboard hides the action

**Start after lesson 06. Mode: demo investigation.** Login works on a tall phone
but the submit button is covered by the keyboard on a smaller display.

Inspect with the keyboard visible. Distinguish an absent element from an existing,
displayed control whose tap is obstructed. Test navigation using the keyboard's
action and the app's submit button if both are supported. Check that keyboard
dismissal does not navigate away or erase input. Inspect identifiers after a
screen rebuild instead of retaining an obsolete element reference.

**Deliver:** one reproducible interaction, screenshot/UI hierarchy, device and
keyboard settings, and a justified fix. Restore changed settings. Avoid unbounded
scrolling or repeatedly tapping Submit.

<details><summary>Review guide</summary>

Compare input focus, button bounds, current screen and the actual tap result.
Wait for the intended state; a longer timeout cannot make an obstructed tap valid.
Re-find an element after the UI changes, but investigate why it changed before
adding a blanket stale-element retry.

</details>

## RW-02 · Permission denied, then revoked

**After lesson 09. Mode: feature environment or design.** A receipt scanner must
offer manual entry if camera access is denied. After access is revoked in Settings,
it must offer the same recovery without crashing.

Design first request → deny → manual entry, grant → scan, and grant → revoke →
return. Include cancellation and the OS-supported re-request path. Turn off
automatic grants in a dedicated configuration, establish the initial permission
state, and verify it. Restore the baseline afterward.

**Deliver:** state table, fallback assertion, OS/build identity and separate app
versus OS-dialog evidence. The demo's automatic grants do not cover this.

<details><summary>Review guide</summary>

An `autoGrantPermissions` setting alone does not prove a clean denied state.
Use the actual OS/target-SDK behavior; permission prompts and re-request rules
vary. Repeated denial must not trap the user. See the
[Android permission workflow](https://developer.android.com/training/permissions/requesting).

</details>

## RW-03 · A draft survives one interruption but not another

**After lesson 09. Mode: demo investigation plus design.** Fictional requirement:
a saved draft survives background/resume and process recreation; an unsaved
password is cleared on logout.

Separate navigation, short backgrounding, activity recreation, OS process death,
force-stop, and reinstall. For each, name the state layer affected and a
reproducible trigger appropriate to the test environment. Do not call the normal
restart helper midway through a background/resume test.

**Deliver:** a transition table and one observed demo experiment. Mark persistent
draft/authentication cases as designed only unless your test app implements them.

<details><summary>Review guide</summary>

`terminateApp`/activation is not proof of low-memory process-death recovery.
“Don't keep activities” is also not an equivalent process-death test. Match the
trigger to the requirement and observe restored state, not just app launch.
[Android process lifecycle](https://developer.android.com/guide/components/activities/process-lifecycle).

</details>

## RW-04 · Offline submission and a lost response

**After lesson 14. Mode: design or feature environment.** A delivery app queues
one order offline and submits it once when connectivity returns. The server may
commit an order before its response is lost.

Cover offline before submission, connection loss during submission, slow response,
server error, reconnect, and repeated user taps. Define “pending,” “confirmed”
and “failed” UI states. Verify one server order by a correlation/idempotency key,
not only one visible confirmation.

**Deliver:** a transition diagram/table, a controlled fault plan and UI plus API
oracles. Restore connectivity in cleanup; do not disrupt unrelated host traffic.

<details><summary>Review guide</summary>

An HTTP timeout does not prove that no write occurred. Reconcile the operation's
identity before retrying. HTTP method semantics alone do not make an arbitrary
POST safe to repeat; the application needs an explicit idempotency contract.
[HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods).

</details>

## RW-05 · Login is valid but the session expires

**After lesson 07. Mode: design or feature environment.** A staging app refreshes
an expired access token once. A revoked refresh token returns the user to Login
and removes access to private screens.

Cover expired access token, revoked refresh token, logout → Back/deep link, and
two accounts used sequentially on one device. Arrange expiry through a documented
test API or controllable clock, rather than a long sleep.

**Deliver:** a distinction between validation, authentication and authorization;
UI and API checks; fixture ownership; no tokens in evidence.

<details><summary>Review guide</summary>

A success label proves none of these server guarantees. Verify the resource
belongs to the signed-in user and that logged-out access is rejected. The demo
login cannot execute this case. Use [OWASP MASVS](https://mas.owasp.org/MASVS/) to
identify further authentication/storage risks, not to claim a security certification.

</details>

## RW-06 · A deep link opens the wrong screen

**After lesson 11. Mode: design or feature environment.** An order link must open
the specified order when authorized, request login when signed out, and show a
safe error for an invalid or unauthorized ID.

Cross cold/warm app state with signed-in/signed-out state. Include malformed
parameters, another user's order, unavailable content and Back navigation.
Record whether you are testing a custom scheme or a verified HTTPS App Link.

**Deliver:** at least six justified cases, route and authorization oracles, and
the app/domain configuration needed to execute them.

<details><summary>Review guide</summary>

Launching an activity directly can bypass link resolution. Test the actual link
entry point and destination identity. Installation/domain verification and
in-app routing are separate possible failure layers.
[Android deep links](https://developer.android.com/training/app-links).

</details>

## RW-07 · Notifications and third-party entry points

**After lesson 11. Mode: design or feature environment.** A shipping notification
opens the matching order once. Its content must not expose private details while
the device is locked.

Cover foreground/background/not-running states, permission denied, duplicate
delivery, stale order, signed-out arrival, and tap → Back behavior. Use a staging
notification sender with a traceable message ID. Apply the same entry-point
reasoning to an incoming share or approved external authentication callback.

**Deliver:** a delivery-versus-navigation diagnostic plan and a privacy
observation. Clean only notifications and records owned by this exercise.

<details><summary>Review guide</summary>

No notification on screen can mean sender failure, delivery delay, OS policy,
permission state or app handling. Do not immediately rewrite the locator. A
manual injected notification does not prove end-to-end push delivery.

</details>

## RW-08 · The upgrade destroys saved data

**After lesson 09. Mode: design or feature environment.** Version N+1 must preserve
saved addresses from N, migrate their schema, and remain usable offline.

Arrange N with known data, install a compatible N+1 over it, then verify the same
identities and editable values. Contrast with clean install, reinstall and
clear-data behavior. Add first launch, interrupted migration and storage-pressure
risks to the plan; identify which require developer support.

**Deliver:** old/new build identities, signing/package compatibility assumptions,
migration oracle and recovery plan. Use a disposable test device/snapshot.

<details><summary>Review guide</summary>

An uninstall or full reset before N+1 destroys the very state under test. A
fresh-install pass is not upgrade evidence. Do not promise downgrade support
unless the product and platform explicitly provide it.

</details>

## RW-09 · Locale, font scale and device shape

**After lesson 08. Mode: demo investigation plus design.** A form must remain
usable with supported locales, large text, a small screen and right-to-left
layout. Amounts and dates must follow the product's formatting contract.

Choose representative combinations instead of a Cartesian explosion. Include
accented/Unicode input, password whitespace, long labels, font scaling,
orientation where supported, and time-zone/date-boundary cases for a real feature.

**Deliver:** a risk-based matrix, stable selectors independent of translated
labels where available, visual/semantic observations, and restoration of settings.

<details><summary>Review guide</summary>

A text locator can legitimately require locale-specific data; document that
tradeoff. A field accepting characters does not establish correct formatting,
storage or display. Unsupported demo locales remain design exercises.

</details>

## RW-10 · Accessibility IDs exist but the app is unusable

**After lesson 05. Mode: device investigation.** A user relying on TalkBack must
complete the form and hear meaningful validation feedback.

Explore labels, role/state announcements, focus order, errors, large text, target
size and contrast. Define a short task, perform it with assistive technology,
and compare it with your selector-based automated checks.

**Deliver:** a usability observation, reproduction and a proposed automated
check where appropriate. Restore assistive-technology settings after the exercise.

<details><summary>Review guide</summary>

Accessibility IDs facilitate locating elements; they do not certify a usable
screen-reader experience. Combine automation with interaction by a user or
tester using assistive technology.
[Android accessibility testing](https://developer.android.com/guide/topics/ui/accessibility/testing).

</details>

## RW-11 · “The test is slow” is not a performance diagnosis

**After lesson 10. Mode: design; demo timing is exploratory.** A proposed release
appears slower at cold startup and scrolling.

Separate runner/queue/install time from app startup, frame rendering, backend
latency and command transport. Define representative devices, build type,
thermal conditions, repeated measurements and a product-approved threshold.
Include crash/ANR, battery and memory as separate signals when relevant.

**Deliver:** a measurement plan, distributions rather than one timing, and an
instrumentation request. Do not invent a universal “fast enough” number.

<details><summary>Review guide</summary>

Increasing a UI timeout hides no performance problem and measures little. Use
appropriate profiling/benchmark tools for app performance; UI timing is a coarse
journey signal. See [Android Macrobenchmark](https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview).

</details>

## RW-12 · Useful diagnostics leak sensitive data

**After lesson 13. Mode: offline artifact review plus design.** Failure evidence
contains a user's address and a bearer token. The UI test otherwise passed.

Design synthetic fixtures and an artifact policy covering screenshot/XML/video,
HTTP headers, logs, retention and access. Identify storage, transport and
authorization checks that require dedicated security testing.

**Deliver:** a redacted synthetic report and a list of fields never to record.
Do not copy real tokens into your journal.

<details><summary>Review guide</summary>

An APK checksum and zero npm advisories address different risks from app security.
Review each artifact type; masking one logger does not sanitize a screenshot.
[OWASP MASVS](https://mas.owasp.org/MASVS/) supplies a broader security framework.

</details>

## RW-13 · A recycled list defeats a scroll helper

**After lesson 11. Mode: inspected demo gesture or feature environment.** A long
list renders only nearby items; the desired record may be absent entirely.

Design a bounded search that identifies the container, searches for a unique
record, detects no progress/end-of-list, and fails with useful evidence. Re-find
elements after scrolling and distinguish off-screen presence from usability.

**Deliver:** max-attempt/time bounds, postcondition, missing-target case and
cleanup/navigation. Never claim success because the gesture command returned.

<details><summary>Review guide</summary>

Index-based selectors and cached element references are fragile when cells are
recycled. The helper must terminate when the item is missing. Verify driver
gesture support for the current platform.

</details>

## RW-14 · Native tests pass but the WebView is missing

**After lesson 11. Mode: demo investigation or supplied evidence.** The native
screen is visible; `getContexts` returns only `NATIVE_APP`. A teammate proposes
changing every locator to XPath.

Investigate the current screen, whether content is a WebView, debugging support,
webview/driver compatibility and whether content finished loading. For multiple
WebViews, identify the intended one by observed metadata. After switching, locate
DOM elements afresh and restore native context without hiding the primary error.

**Deliver:** a capability report with observed contexts and either actual evidence
or a precise blocked condition.

<details><summary>Review guide</summary>

A native XPath cannot create an unavailable web context. Client, driver and
provider capabilities differ; do not grant broad insecure server features as a
default fix. Extend the existing lesson 11 investigation.

</details>

## RW-15 · Parallel workers corrupt each other's state

**After lesson 12. Mode: [offline lab 07](../../exercises/07-session-plan/README.md), then design.**
Two workers use one account, one device and the same output filename.

Identify device/session ownership, local UiAutomator2 ports, backend fixture
namespaces and artifact names. Distinguish local port allocation from a cloud
provider's concurrency quota. Plan cancellation and cleanup per worker.

**Deliver:** an isolated worker plan and a serial-versus-parallel experiment for a
future environment. The current suite stays at `maxInstances: 1`.

<details><summary>Review guide</summary>

Raising `maxInstances` alone does not create devices or isolate accounts. The
offline planner does not reserve free ports. Coordinate allocation between jobs;
add feature-specific ports only where needed.
[UiAutomator2 parallel tests](https://github.com/appium/appium-uiautomator2-driver#parallel-tests).

</details>

## RW-16 · API fixtures and UI evidence disagree

**After lessons 08 and 14. Mode: [offline lab 08](../../exercises/08-fixture-cleanup/README.md), then design.**
An API creates order A, but the app displays cached order B. Cleanup fails after
the assertion fails.

Define API response/status/schema checks, resource identity, a bounded readiness
observation for eventual consistency, and a UI assertion for the same order.
Separate backend contract, client rendering and end-to-end coverage.

**Deliver:** lifecycle pseudocode, both errors preserved, cleanup restricted to
owned fixtures, and a policy for a created resource whose response was lost.

<details><summary>Review guide</summary>

“HTTP 200” or “a row exists” is too weak. Assert the created ID and relevant
business state, then verify the UI presents that resource. Do not replay a
business action inside a wait predicate. Keep setup APIs out of production data.

</details>

## RW-17 · A green pipeline ran no useful tests

**After lesson 13. Mode: [offline lab 09](../../exercises/09-run-summary/README.md) and workflow review.**
A changed filter selects no specs; another run has three failures that pass on
retry. The dashboard labels both runs “green.”

Define expected suite selection/count, setup status, explicit skips, not-run
coverage, first-attempt pass rate and final status. Trace a manual workflow's
confirmation input and missing-secret behavior. Propose a quarantine policy with
owner, reason, expiry and visible coverage loss.

**Deliver:** an honest run summary and a release recommendation. Do not enable
retries in the baseline to manufacture this exercise.

<details><summary>Review guide</summary>

No executed tests is not 100% success. Failed setup must fail the job/session
even if it produced no test attempts. A passing rerun is evidence to investigate,
not proof that the first failure was harmless.

</details>

## RW-18 · There is one hour before release

**After lesson 14. Mode: design.** Login changed; 70% of active users are on two
Android OS versions, 20% use an older supported version, and 10% use iOS. One
older device has a known keyboard regression. You have two concurrent slots.

Choose a smoke/device matrix, assign priorities and estimate execution plus
queue/setup time. Include release scope, affected users, failure severity,
rollback readiness and missing evidence. Treat these percentages as fictional
planning inputs, not market statistics.

**Deliver:** a one-page go/no-go recommendation with assumptions and follow-up
owners. Explain what changes if iOS is outside this release.

<details><summary>Review guide</summary>

Choose representatives by user impact and known risks, not just newest hardware.
Passing Android does not cover iOS. A reasoned “no-go until this blocker is
understood” can be stronger than maximizing a green test count.

</details>

## RW-19 · Port the intent to iOS

**After lesson 12. Mode: design unless an iOS environment exists.** A team asks to
reuse this Android project for iPhone tests.

Inventory reusable scenario intent, fixtures and assertions versus driver,
signing/WDA, app artifact, bundle identity, selectors, alerts, gestures and
permission handling. Distinguish local macOS/Xcode execution from using a remote
provider. Explain simulator versus real-device constraints.

**Deliver:** a migration plan and one proposed Login screen interface with
platform-specific implementation points. Do not rename an APK to an IPA.

<details><summary>Review guide</summary>

Cross-platform does not mean changing only `platformName`. A real-device iOS app
and WDA require compatible provisioning; a simulator build is a different
artifact. Consult the driver's
[system requirements](https://github.com/appium/appium-xcuitest-driver/blob/master/docs/getting-started/system-requirements.md).

</details>

## RW-20 · Hardware, payments and external services

**After lesson 14. Mode: design or a dedicated feature environment.** Choose
one feature below and make a test strategy that separates a controlled fake from
a real integration:

| Feature | Minimum branches to investigate | Separate evidence needed |
|---|---|---|
| Biometric unlock | Success, cancel, failure, lockout, fallback, enrollment change | Real device/platform behavior; a mocked success is not sensor assurance |
| Camera/QR/file picker | Valid/invalid content, deny, cancel, unavailable file | Image injection versus actual capture; OS picker permissions |
| Location/Bluetooth | Allowed/denied, stale/missing signal, disconnect/reconnect | Simulated coordinates versus physical radio/device behavior |
| Payment/OTP/SSO | Success, decline/expiry, cancel, duplicate submit, callback return | Provider sandbox, transaction identity and server-side authorization |

**Deliver:** three highest-risk cases, an approved test seam/sandbox, cleanup and
what remains manual or hardware-dependent. Use fictional accounts and provider
test instruments; no real purchase or message is needed for this design task.

<details><summary>Review guide</summary>

Avoid depending on personal SMS inboxes or live payments for routine regression.
A stable contract fake can cover many branches, while a small authorized
integration suite verifies the real boundary. Report the two types separately.

</details>

## RW-21 · Old search results replace the newest query

**After lessons 08–10. Mode: supplied evidence, then feature environment.**
A shopping app must show results for the latest submitted search. Its backend
uses cursor pagination; changing the query must discard the previous cursor.

```text
Synthetic request trace:
10:00:00.000  request A: query=ca, cursor=none
10:00:00.100  request B: query=camera, cursor=none
10:00:00.250  response B: items=[camera-1], nextCursor=b2
10:00:00.500  response A: items=[cable-1], nextCursor=a2
10:00:00.510  UI query=camera; displayed item=cable-1
```

**Task:** design a deterministic response-order experiment, then cover empty
results, repeated pages, end-of-list, query changes and refresh after a cached
result. Identify which checks belong in client logic versus a UI journey.
**Deliver:** a minimal defect report, query/result identity oracle, controlled
responses and cleanup. Do not depend on real internet timing to create the race.

<details><summary>Review guide</summary>

The supplied trace supports a stale-result defect under the stated contract.
Waiting longer is not a fix: the old response is the last arrival. Verify that
late results cannot replace a newer query and that pagination belongs to the
current query. Compare records by stable ID, not just list size.

</details>

## RW-22 · Two devices edit the same account

**After lesson 09. Mode: design or feature environment.** Device A and B load
address revision 4. A saves revision 5. B then submits its older draft. Training
contract: stale edits must produce an explicit conflict; the app must not
silently overwrite the newer address.

Include offline edit/reconnect, logout/account switch and a second request
arriving while access-token refresh is in progress. For this exercise, concurrent
expired requests must share one refresh operation; a failed refresh returns to
Login once and does not keep replaying requests.

**Deliver:** two separate state diagrams (data conflict and session refresh),
revision/identity checks, a synchronized request trace and per-device cleanup.
Do not confuse intentionally shared data in this scenario with accidental shared
fixtures in unrelated parallel tests.

<details><summary>Review guide</summary>

Use controllable request barriers rather than sleeps. Test the product's chosen
conflict policy explicitly; “last write wins” is not universally correct.
Network connectivity alone does not establish synchronization or cache ownership.
[Android offline-first guidance](https://developer.android.com/topic/architecture/data-layer/offline-first).

</details>

## RW-23 · Cloud devices cannot reach staging

**After lesson 12. Mode: supplied evidence or authorized feature environment.**
The APK uploads and a BrowserStack session starts. Public content loads; an app
request to `https://staging.example.test` fails before login.

```text
Synthetic evidence, same app build:
Laptop on VPN: staging health endpoint responds 200.
Cloud device: public endpoint responds 200.
Cloud device: staging hostname cannot be resolved.
No login request reaches the staging service.
```

**Task:** distinguish account/session setup, app configuration, DNS/routing,
private-network tunnel, proxy and TLS trust. Explain what changes if the device
instead reports a certificate-chain failure.
**Deliver:** a layer-by-layer investigation plan, an app-origin request proving
connectivity when repaired, and tunnel ownership/cleanup.

<details><summary>Review guide</summary>

A reachable laptop endpoint does not prove a remote phone can reach it. Do not
change login selectors or disable TLS checks. A tunnel and certificate trust
solve different problems; inspect the actual app build's network configuration.
[BrowserStack Local](https://www.browserstack.com/docs/local-testing) and
[Android network security](https://developer.android.com/privacy-and-security/security-config).

</details>

## RW-24 · A feature flag changes during a staged rollout

**After lesson 14. Mode: design.** Version N and N+1 remain active together.
A new checkout is enabled for a named test cohort. Turning the flag off must
restore the old route without losing a saved basket.

Build a small matrix of app version, backend schema, flag state and cached
configuration. Include fresh launch, a mid-session change, a stale offline flag,
unknown enum values and missing optional fields. Establish which states are
supported before selecting assertions.

**Deliver:** compatibility cases, a test-cohort setup/restore plan, release
evidence including the flag/config revision, and a rollback verification.

<details><summary>Review guide</summary>

“Same APK” does not mean the same behavior when remote configuration differs.
Use explicit cohorts and known config versions; do not flip a global production
flag for a test. Contract tests should expose incompatible payload changes before
an expensive end-to-end run.

</details>

## RW-25 · The UI passes but analytics counts purchases twice

**After lessons 13–14. Mode: design or synthetic event analysis.**
Training contract: one confirmed order produces one `purchase_completed` event
with its order ID and integer amount, and analytics emission requires consent.

```text
Synthetic event trace:
order o-7 confirmed, amountCents=2400
purchase_completed {orderId:o-7, amountCents:2400, eventId:e-1}
app background → foreground
purchase_completed {orderId:o-7, amountCents:2400, eventId:e-2}
```

Cover consent absent/granted/revoked, duplicated lifecycle callbacks, offline
buffering, schema values and prohibited personal fields. Distinguish a client
emission from ingestion/deduplication by the analytics backend.

**Deliver:** a contract violation supported by the trace, an event-level check
and a separate ingestion check. Use a test sink and restore consent state.

<details><summary>Review guide</summary>

A confirmation screen cannot prove correct event counts. Decide what “once”
means at each boundary and retain a stable business/event identity. Do not
assume an SDK's retry or backend deduplication makes duplicate emission harmless.
The consent rule here is a training requirement, not legal advice.

</details>

## RW-26 · Upload stops halfway and leaves a ghost attachment

**After lessons 09–10. Mode: design or feature environment.** A support app
accepts PNG/JPEG attachments up to **5 MiB inclusive** (5 × 1024 × 1024 bytes).
Cancel must remove the pending attachment and must not create a completed server
record. A transport failure must permit an explicit retry without duplicates.

Cover sizes 0, limit−1, limit, limit+1; mislabeled/unsupported content; picker
cancellation; interruption while uploading; expired credentials; storage pressure;
and returning to the draft. Separate client validation from server validation.

**Deliver:** boundary data, progress/completion/cancellation oracles, request and
attachment identities, and cleanup of temporary files and owned records.

<details><summary>Review guide</summary>

A progress bar reaching 100% may mean bytes sent, not server acceptance. Do not
use filename extension as the sole content check. A completed record after an
ambiguous transport timeout needs reconciliation before retry; “cancel” and
“connection lost” need different expectations.

</details>

## RW-27 · The wrong app build is under test

**After lessons 01 and 10. Mode: evidence drill.** CI reports a missing Login
button after an APK release. A teammate wants to update the selector.

```text
Synthetic run manifest:
Expected package=com.example.training.staging, versionCode=108, digest=build-A
Installed package=com.example.training, versionCode=107, digest=build-B
Current foreground package=com.android.permissioncontroller
Session created successfully; first app element lookup fails.
```

**Task:** identify what each fact proves. Propose checks for artifact identity,
package/activity, app focus, system dialogs, driver compatibility and installation
errors. Use safe read-only `adb`/driver evidence; copy no imaginary activity names.
**Deliver:** a pre-session/setup failure report and the smallest verification
needed before changing selectors. Restore only the dedicated test environment.

<details><summary>Review guide</summary>

This evidence does not establish a selector regression. The expected build was
not confirmed and a system UI owns focus. Diagnose the artifact and permission
state first. A valid checksum for the wrong artifact is still the wrong artifact.
Continue with practical drill D7.

</details>

## RW-28 · You inherit a flaky suite and a release deadline

**After lessons 10–15. Mode: incident simulation.** The team asks you to “fix
flakiness” by Friday. You receive this synthetic first-attempt history:

| Group | Executed runs | First-attempt failures | Common evidence |
|---|---:|---:|---|
| Login | 20 | 6 | Account shared by workers; logout during another session |
| Search | 20 | 4 | Old response replaces newer query |
| Install | 20 | 3 | Device unavailable before any app interaction |

**Task:** calculate rates, group by evidence, choose a first investigation and
propose ownership, temporary quarantine criteria and an expiry date. Separate
test defects, product races and infrastructure failures as hypotheses until
confirmed. Add a next-sprint plan for regression and monitoring.

**Deliver:** a short issue, one discriminating experiment, a release message and
a before/after comparison with equivalent conditions. Count quarantined coverage.

<details><summary>Review guide</summary>

Rates are 30%, 20%, 15% for their respective groups, not product-quality scores.
Removing failing tests changes the denominator; it does not prove repair. Compare
first-attempt results, keep excluded coverage visible and avoid claiming
statistical certainty from twenty observations. Practise the handover in D10.

</details>

## RW-29 · Product and development disagree about the expected result

**After lesson 07. Mode: requirements investigation.** A ticket says “email is
optional.” The acceptance table says an empty email must block submission.
A designer's mock shows no required marker. The previous release accepted empty
email. A developer asks you to “just automate the current behavior.”

**Task:** separate observations, assumptions and conflicting sources. Draft
three questions that change the test design, identify the decision owner, and
prepare a provisional table with unresolved rows marked **blocked**.
**Deliver:** a concise clarification request, conditional acceptance examples,
and useful checks you can still run while waiting. Do not invent agreement.

<details><summary>Review guide</summary>

Neither an old build nor the newest comment automatically establishes the intended
contract. Ask which users/flow the rule covers and whether this is a deliberate
change. Test unrelated settled behavior while the owner decides. After a decision,
record its source/version and update the test, not just the ticket text.
Shift S1 supplies a follow-up decision to practise revising your plan.

</details>

## RW-30 · Different account IDs still share the same mutable fixture

**After lessons 02, 08–09. Mode: [repair lab 11](../../exercises/11-fixture-isolation/README.md).**
Checkout passes alone. After the coupon case it unexpectedly sees `SAVE10`.
App restart and different account IDs do not repair it. The fixture factory
creates a fresh outer object with `{ ...template }`.

**Task:** predict the leaking reference, run the faulty helper and explain why
this failure can occur even without parallel execution.
**Deliver:** before/after test output, an ownership sketch, a narrow repair and
a regression case that mutates a nested item. Preserve the intended coupon test.

<details><summary>Review guide</summary>

A new outer object does not make its nested cart, item objects or arrays new.
Separate process state, fixture memory, device state and backend records.
Serializing the suite can still leave an order dependency; randomizing order
can expose it but does not fix it.
[Shallow-copy reference](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy).

</details>

## RW-31 · The job was killed before cleanup could run

**After lab 08 and lesson 13. Mode: supplied-data investigation.** The CI runner
disappeared while fixtures existed. Its `finally` block never completed.
Fictional cleanup policy: consider only this team's **staging** fixtures whose
run is confirmed terminated and whose lease is strictly expired at **12:00 UTC**.
Unknown run status is a hold. Recheck lease/version atomically before deletion.

| Record | Environment | Owner | Run status | Lease expiry UTC |
|---|---|---|---|---|
| a | staging | mobile-qa | terminated | 11:45 |
| b | staging | mobile-qa | active | 11:40 |
| c | staging | another-team | terminated | 11:30 |
| d | production | mobile-qa | terminated | 11:20 |
| e | staging | mobile-qa | unknown | 11:10 |
| f | staging | mobile-qa | terminated | 12:00 |

**Task:** produce a dry-run candidate list and reason for every exclusion.
Then handle a heartbeat that renews candidate `a` after your first read.
**Deliver:** a cleanup proposal with owner, scope, concurrency check and audit
record. This exercise performs no deletion and asks for no production access.

<details><summary>Review guide</summary>

Only `a` is initially a candidate, not permission to delete it blindly. `f` is
not strictly expired. A changed lease/version invalidates the original selection.
Cleanup hooks handle ordinary control flow; they do not guarantee cleanup after
process loss. A separate reconciler/lease policy and bounded ownership are needed.
Node cannot install a handler for `SIGKILL`; catching every promise cannot fix
that. [Node signal events](https://nodejs.org/docs/latest-v24.x/api/process.html#signal-events).

**Follow-up:** distinguish process death from a caller giving up through a timeout.
A timeout wrapper does not necessarily cancel the underlying request. Before
cleanup, establish whether the operation stopped, may still commit, or is unknown;
an abort request itself is not proof that a server-side write was rolled back.

</details>

## RW-32 · The test passes all year except the clock-change weekend

**After lessons 08–09. Mode: time-contract investigation.** A fictional offer
expires at the **next local midnight in Europe/Warsaw**, not after 24 elapsed
hours. The UI displays a localized date; the API stores an instant.

```text
Synthetic oracle inputs:
Start:        2026-03-29T00:00:00+01:00
Next midnight:2026-03-30T00:00:00+02:00
Implementation expiry: startInstant + 24 * 60 * 60 * 1000
```

**Task:** calculate the elapsed interval and compare the implementation.
Cover just before/at/after expiry, device/server clock disagreement, a different
display zone and the autumn transition. State which clock owns eligibility.
**Deliver:** a table with zone, instant, expected eligibility and source of truth.
Inject a controlled clock in owned code; do not change a shared device's time.

<details><summary>Review guide</summary>

The supplied instants are 23 hours apart; the fixed-duration implementation is
one hour late. A date-only business rule, an absolute instant and an elapsed
duration are different contracts. Local calendar arithmetic across DST can change
elapsed duration. A formatted display string alone is not the eligibility oracle.
[Date arithmetic reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate).

</details>

## RW-33 · Direct value entry passes while a user cannot finish typing

**After lessons 06–09. Mode: demo comparison plus feature design.** A fictional
profile editor promises ten “characters.” Its developer counts JavaScript string
length. Compare `é`, `e` followed by a combining accent, and `👩‍💻`.
The field also has formatting, a keyboard action and an autofill path.

**Task:** clarify whether the limit means UTF-16 units, Unicode code points,
grapheme clusters or bytes. Compare value-setting, keyboard entry, paste, clear,
autofill and committing composition where the test app supports them.
**Deliver:** exact input/code-point evidence, a clarified limit and a small
interaction matrix. Mark unsupported demo interactions as designed only.

<details><summary>Review guide</summary>

The supplied examples have JavaScript lengths 1, 2 and 5. That does not make them
one, two and five user-perceived characters. Do not trim or normalize passwords
or arbitrary user input without a requirement. A value visible in a field does
not prove validation, blur/submit handling or keyboard interaction worked.
Document the actual input method and committed value instead of equating every
automation entry method with every user entry path.

</details>

## RW-34 · The test is green after you deliberately break the feature

**After lessons 06 and 10. Mode: controlled local experiment or supplied evidence.**
An input-clear test asserts only that the Forms screen exists. A checkout test
calculates its expected amount using the same pricing helper as the app.

**Task:** choose one controlled defect that each assertion should detect.
Predict the result before changing anything, then explain a passing test that
survives that defect. Use only a disposable experiment or restore the exact edit.
**Deliver:** an action-to-observation map, independent expected values and evidence
that a meaningful mutation fails. A different arbitrary failure is not enough.

<details><summary>Review guide</summary>

A surviving defect exposes a missing or coupled oracle; green execution alone
does not establish feature coverage. Assert the empty value after proving it was
populated. Derive pricing examples from an agreed table, not from the implementation
under test. Do not turn every implementation detail into a brittle assertion.
Lesson 09-B already demonstrates this habit; apply it across your suite.

</details>

## RW-35 · You have the APK but no useful diagnostics or test data API

**After lessons 10–12. Mode: team negotiation.** The production-like build has
certificate pinning, no debug logs and no test-data endpoint. You have a dedicated
test account but cannot see server-side state. The team requests “full automation”
by Friday.

**Task:** define what observable UI behavior you can establish today and what
requires cooperation. Request the smallest testability changes with owners:
stable IDs, redacted correlation IDs, scoped fixtures and a supported test build.
**Deliver:** a staged plan and a precise blocker report with the next observation
needed. Include how a test build differs from the release build.

<details><summary>Review guide</summary>

Do not invent backend evidence or bypass production protections to meet a number.
A debug build is useful evidence for its configuration, not proof the release
artifact behaves identically. Agree which critical flows still need the release
build, what logging may be collected and who can provide a sanitized server trace.
Limited access is a real planning constraint, not automatically a tester failure.

</details>

## RW-36 · A timeout hides a committed order and the retry doubles it

**After lab 10. Mode: [repair lab 12](../../exercises/12-uncertain-submit/README.md).**
The server creates an order but the response disappears. An inherited helper
submits again; its returned success hides two orders. The request carries a
correlation key, but the backend does not enforce idempotency.

**Task:** repair the unsafe replay and classify the outcomes: confirmed, explicitly
rejected, unresolved and lookup unavailable. Inspect the fake ledger.
**Deliver:** tests proving a single write per invocation, a matching-receipt check
and an unresolved-state policy. Explain why a new helper invocation could still
duplicate the order without caller/server coordination.

<details><summary>Review guide</summary>

Retrying a read and repeating a write have different consequences. A timeout
does not prove rejection; a lookup returning nothing may lag behind a commit.
Server-enforced idempotency needs defined scope, parameter matching and retention.
Also identify which layer owns retry limits: transport, service client, helper
and test-runner retries can otherwise multiply requests.
[Safe retries reference](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

</details>

## Assess a completed case

Score each dimension 0 (absent), 1 (partial), or 2 (clear): risk and oracle;
state/setup; meaningful checks; cleanup/isolation; discriminating evidence.
Maximum **10**. A design-only answer can earn a good design score but must never
be presented as executed coverage. Ask one follow-up that changes a premise.

[Interview practice](interview-practice.md) · [Coverage review](../coverage-review.md) · [Course map](../README.md)
