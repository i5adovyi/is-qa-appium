# Small mobile practice sessions

Use these after Forms/Login and [lesson 09](../lessons/09-waits-and-state.md).
Choose **one** task for a session. Each creates evidence you can explain in a
team review or interview. These are learner investigations; none is a newly
verified default device test. The [offline labs](../../exercises/README.md)
remain available when Android is unavailable.

| Task | Allow | Needs | Deliverable |
|---|---|---|---|
| DP-1 · Keyboard and Back | 35–50 min | Android demo, keyboard, Inspector or UI source | Before/after evidence with one deliberate wrong assertion |
| DP-2 · Background and return | 35–50 min | Android demo and a supported background command | Draft-state report separating observation from requirement |
| DP-3 · One inspected gesture | 45–75 min | Android demo Swipe screen, Inspector | Inspected target, bounded action and visible postcondition |
| DP-4 · Safe failure evidence | 20–30 min | This fictional packet only | Redacted report and artifact-sharing decision |

## Set up a learner-owned investigation

Check your selected emulator/device and read the current
[validation limits](../validation.md). Complete `npm run preflight` and
`npm run test:smoke` when your Android environment is ready. These are real
device commands; their prior recorded results are not this session's results.
Stop Inspector's session/server before running WebdriverIO.

Create `test/practice/device-study.spec.ts` yourself; do not overwrite an existing
file of that name. This location is covered by `npm run typecheck` and sits
outside the default `test/specs/` selection. Use a different filename consistently
if it already holds your work. The scaffold below is intentionally unfinished:

```ts
import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import FormsScreen from '../screens/FormsScreen.js'
import { restartDemoApp } from '../helpers/restartApp.js'
import { waitForText } from '../helpers/waitForText.js'

describe('My mobile investigation', () => {
    beforeEach(async () => {
        await restartDemoApp()
        await TabBar.openForms()
        await FormsScreen.waitForIsShown()
    })

    it('replace this title with one observable behavior', async () => {
        throw new Error('Implement the chosen device investigation')
    })
})
```

The imports are available for your implementation, not evidence that it is done.
For DP-3, change the setup to the inspected Swipe screen instead of Forms.
Run only your investigation:

```bash
npm run typecheck
npx wdio run config/wdio.android.conf.ts --spec test/practice/device-study.spec.ts
```

Record the command, app build, Android/device, relevant keyboard or orientation
settings, expected rule, observations and status. If blocked, keep the smallest
error and next diagnostic step; do not mark a device execution complete.

## DP-1 · Dismiss the keyboard without losing your place

**Risk:** a test sends text and taps a button, while a user cannot reach the
action or Back unexpectedly leaves the screen. Read
[RW-01](workplace-scenarios.md#rw-01-the-keyboard-hides-the-action) and [selectors](../lessons/05-selectors.md).

1. In Forms, focus the input and type synthetic text. Observe whether the actual
   keyboard appears; `setValue` completing alone is not that evidence. If it
   does not appear, investigate the emulator's keyboard settings or manual focus
   before asserting a keyboard scenario.
2. Predict what **one Android Back action** will do in that exact state. Record
   keyboard visibility, current screen and the echoed text before acting.
3. Try Back manually first. Does it dismiss the keyboard, navigate away, or do
   something else? Capture the result; do not assume the answer is portable.
4. After establishing the behavior, automate the chosen transition using a
   supported command for your installed driver. Inspect its reference before
   coding. Assert the intended screen and exact echo after the transition.
5. Keep “keyboard was present” and “screen/text remained correct” as distinct
   evidence. A Back command returning successfully proves neither.

**Acceptance:** a repeatable starting state, one deliberate Back action, screen
and text evidence before/after, and a clear statement of the tested keyboard/OS.
If you cannot establish or observe the keyboard precondition, the scenario stays
blocked even if the text assertion passes.

**Controlled defect:** change the expected echo to a different nonempty string.
Predict the failure, run narrowly, then restore the expectation. Explain what
that failure validates and why it still cannot prove the keyboard precondition.

**Restoration:** restore changed keyboard/device settings and any temporary
assertion. Keep or remove only your own practice file deliberately. Do not alter
shared screen objects to make this one experiment pass.

<details><summary>Review after your attempt</summary>

A screenshot can establish a visible keyboard at its capture time. A UI source
may not expose every system keyboard control. Correlate both with the actual
action; record any observation gap. Never hide all keyboard exceptions in a
generic catch. A control existing in the hierarchy does not prove a user can tap
it. If the demo exposes no obstructed action, report that limit rather than
inventing a reproduced obstruction bug.

</details>

## DP-2 · Preserve the experiment across background and return

**Risk:** setup resets the app in the middle of the scenario and erases the
state it intended to test. Read [the state field guide](mobile-state.md), which
contains the candidate `driver.background(2)` sequence and command reference.

1. Write a training hypothesis: “this Forms draft remains visible after a brief
   background interruption.” It is a hypothesis to inspect, not an invented demo
   product requirement. State the expected result before the run.
2. Establish a nonempty echo and assert it before the interruption.
3. Keep background → return → postcondition inside the **same test**. Use the
   documented command only when supported by your installed environment.
4. Reobserve the current Forms screen and exact echo. Record the result even if
   it contradicts the hypothesis. Classify it as observed demo behavior unless
   an actual product requirement establishes a defect.
5. Explain why this does not test permission revocation, process death, storage
   persistence or backend session expiry.

**Acceptance:** precondition evidence, one uninterrupted scenario, a specific
postcondition and app/device identity. A report can be complete while automation
remains blocked by unsupported execution; label those outcomes separately.

**Controlled defect:** in a temporary copy of your scenario, replace the
background step with `restartDemoApp()` while retaining the draft expectation.
Predict the outcome, compare the actual trace, then restore background/return.
Do not assume the restart will fail the assertion on every future app version;
explain the observed reset contract. It is a different transition even if the
final screen happens to look the same.

**Restoration:** remove the temporary restart from the scenario, restore your
original test setup and record which version of the scenario remains. Do not
change `noReset` globally to manufacture a pass.

<details><summary>Review after your attempt</summary>

The beforeEach restart occurs before the scenario; a restart between input and
postcondition invalidates a background-retention claim. Observing a value after
return must be a fresh UI read, not comparison with a variable saved earlier.
Explain which state layer each operation affects.

</details>

## DP-3 · Prove one gesture changed the intended card

**Risk:** a helper reports success because a gesture command returned, or keeps
scrolling for a missing item forever. First repair
[lab 14](../../exercises/14-bounded-scroll/README.md), then use
[lesson 11](../lessons/11-gestures-and-contexts.md) for the existing inspected
gesture example and supported-driver reference.

1. Inspect the actual Swipe screen. Record the navigation selector, receiving
   container bounds, initial card identity, expected next card and evidence of
   visibility. Do not copy invented selectors from a web example.
2. Adapt your learner-owned setup to navigate there. Observe the initial card,
   send one gesture based on the inspected bounds, then wait for a specific
   visible destination state. Reacquire controls after the transition.
3. If you extend to seeking a later card, define a small maximum gesture count,
   elapsed-time budget and observable no-progress condition before looping.
   The fake lab's `atEnd` flag is not supplied by Appium.
4. Explain whether hidden cards remain in the hierarchy. A title found somewhere
   in the source is weaker than the intended card being visible and usable.

**Acceptance:** inspection evidence, bounded actions, before/after identities,
and a meaningful postcondition. The Android method is not an iOS-support claim.

**Controlled defect:** choose a deliberately impossible destination identity.
Predict the bounded failure and expected last-state evidence, run, then restore
the actual target. Do not “repair” the test by increasing the limit indefinitely.

**Restoration:** restore the actual target and any changed orientation, stop
Inspector when done, and preserve the original default specs. Record supported
execution or the exact capability blocker; no supplied demo gesture is claimed
as passed by this guide.

<details><summary>Review after your attempt</summary>

Reuse the strategy from the offline lab, not its fake row data or tight loop.
Real view settling and logical identity must be established on the inspected
build. Distinguish “gesture rejected”, “gesture accepted but no transition” and
“transition occurred to the wrong destination.”

</details>

## DP-4 · Review a failure packet before sharing it

**Node/device/account not needed.** This packet is entirely fictional. Every
name, address and credential-shaped value below is a training marker. Do not
replace them with personal data. This makes [RW-12](workplace-scenarios.md#rw-12-useful-diagnostics-leak-sensitive-data)
actionable without reading your real logs.

```text
run=training-42 build=demo-training device=emulator-API35
12:00:01 POST /orders?access_token=FAKE_QUERY_TOKEN
Authorization: Bearer FAKE_HEADER_TOKEN
body={"email":"learner@example.invalid","orderId":"order-training-17"}
12:00:03 assertion: expected confirmation, observed payment-form
artifacts: training-42.png, training-42.xml, session-video.mp4
```

```xml
<hierarchy>
  <node content-desc="delivery-address" text="14 Fictional Street" />
  <node content-desc="account-email" text="learner@example.invalid" />
  <node content-desc="password" password="true" text="FAKE_PASSWORD_DO_NOT_USE" />
  <node content-desc="order-status" text="Awaiting confirmation" />
</hierarchy>
```

**Assignment:** create a short shareable report from the packet. Preserve the
diagnostic relationship between run, build, assertion and order using a stable
synthetic alias if needed. Remove credential and personal-content fields from
the shared copy. List which binary artifacts need inspection before release;
their contents are deliberately not supplied. Do not claim the screenshot or
video has been sanitized by redacting this text.

**Acceptance:** identify token exposure in both header and URL, personal data in
body/XML, and the absence of evidence about image/video contents. State who
needs the sanitized evidence, where it may be shared under the team's policy,
and what remains withheld pending review. Keep originals restricted according
to that policy; do not upload them to another service to perform this exercise.

**Controlled defect:** compare a draft that redacts only the Authorization
header with the full packet. Identify what still leaks and repair the draft.
**Restoration:** discard only your disposable unsafe draft, preserve the
fictional source, and leave the final copy explicitly labelled synthetic.

<details><summary>Review after your attempt</summary>

Redaction must consider URLs, headers, bodies, XML, image pixels and video frames.
Replacing one secret does not sanitize all artifacts. Keep useful sequence,
failure operation and environment metadata where appropriate. The exact access
and retention policy belongs to the team; this exercise supplies no universal
retention period and does not certify mobile security.

</details>

## Finish with a small handover

Write five lines: intended behavior; what you actually ran or inspected; most
useful evidence; remaining uncertainty; next smallest action. Give a 90-second
spoken explanation without reading the reference. Link your evidence in your
own notes; do not mark a lesson complete solely because this guide was read.

[Course map](../README.md) · [Review checklist](review-checklist.md) · [Mobile state](mobile-state.md)
