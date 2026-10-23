# Android state and everyday usability

Use an isolated training device or emulator. Record settings before changing
them and restore them afterward. A lifecycle or layout investigation needs a
specific transition and observation, not a general claim that mobile is covered.

## AS-16 · Dismiss a modal without losing the screen

**L1 · Guided · Android · 40–60 min · App: ApiDemos.**

### Prerequisites

AS-05, working [ApiDemos setup](../handbook/training-apps.md), state concepts and
a compatible Android device. Own `test/training/apidemos/as-16-modal.spec.ts`.

### Assignment

**Ticket:** “Our generic Back helper sometimes leaves the feature instead of
closing a dialog.” Inspect a native dialog example in ApiDemos. Record the route,
underlying screen marker, dialog marker and whether that dialog is intended to
be cancellable with Back. Choose a cancellable example based on observation or
fixture source; do not assume every modal should dismiss.

Write one test that establishes the underlying screen, opens the modal, proves
it is present, sends one Android Back action and observes the modal gone while
the underlying screen remains. Use a bounded condition wait. Start the next
iteration from your own known state.

```bash
npm run test:training -- apidemos --spec test/training/apidemos/as-16-modal.spec.ts
npm run typecheck
```

### Acceptance criteria

The modal is definitely open before Back; both dismissal and the remaining
screen are asserted afterward. Your evidence identifies the real build/OS and
selected dialog. Explain why the same action with a keyboard, modal and ordinary
screen can have different meanings.

### Changed condition

Temporarily omit the dialog-opening action. The precondition must fail before
your test can send Back to an unintended layer. Observe that failure, restore,
then rerun. Do not “fix” the test by making the precondition optional.

### Evidence and review

Deliver one spec and before/after state evidence. **90-second explanation:**
how do you prove that Back dismissed the intended layer rather than accidentally
recovering by navigation?

<details><summary>Hint and reviewer questions — after your attempt</summary>

“Dialog absent” alone can pass if it never opened or the whole app disappeared.
The underlying screen marker distinguishes useful dismissal from unwanted
navigation. Reacquire controls after the modal transition.

</details>

## AS-17 · Test a screen with larger text

**L2 · Independent · Android · 55–85 min · App: Sauce Labs My Demo App.**

### Prerequisites

AS-13, access to the training device's font-size setting and selector inspection.
Own `test/training/saucelabs/as-17-large-text.spec.ts` and an AS-17 comparison
note. No accessibility certification or screen-reader setup is assumed.

### Assignment

**Ticket:** “The cart is usable at default settings but may clip controls for
someone using larger text.” Record the current font and display settings. Choose
one supported larger font-size option while leaving other settings unchanged.
On the same app build and device, compare baseline and larger text for a chosen
product-detail → cart journey. Record identity, price readability, actionable
button visibility, text overlap and ability to remove the intended item.

Automate the stable journey where useful; inspect visual clipping manually and
label those observations separately. Use the AS-13 training command with your
filename. Restore the exact original setting and verify the restoration even if
your investigation fails. The native app's main activity is portrait-locked in
the pinned source; do not turn this into an assumed landscape requirement.

### Acceptance criteria

Both settings and outcomes are recorded, at least one meaningful action is
executed in each, and observed defects have reproducible evidence. A successful
locator does not count as proof of readable or accessible layout. Keep unsupported
behavior and an unexecuted profile explicit.

### Changed condition

Review this fictional result: “The Remove element exists in XML, so large text
passes,” while its bounds lie beyond the visible screen. Name the additional
observation and interaction required before accepting that result.

### Evidence and review

Deliver a two-profile comparison and settings-restoration note.
**90-second explanation:** which parts of this task can Appium automate, which
need visual judgment, and why do accessibility IDs alone not prove accessibility?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Keep font size and display size separate so you know which factor changed.
Use actual visible bounds and interaction results; a control in the hierarchy
can be off screen or obstructed. Avoid expanding one device observation into an
all-device usability claim.

</details>

## AS-18 · Map what a restart really resets

**L3 · Investigation · Android · 60–90 min · App: WebdriverIO demo.**

### Prerequisites

[State lesson](../lessons/09-waits-and-state.md), a working baseline device and
[device practice](../handbook/device-practice.md). Own
`test/training/wdio/as-18-state.spec.ts`; this uses the original app config,
not an optional training-app ID.

### Assignment

**Ticket:** “A teammate says restart gives every test a completely clean device.”
Inspect [restartDemoApp](../../test/helpers/restartApp.ts) and the Android
configuration. Write a table for UI/process state, app storage, OS settings and
server/account state, marking what the helper actually changes.

Using Forms, compare three isolated experiments: in-app navigation away/return,
brief background/return, and terminate/activate. Begin each with a new known
screen and distinct synthetic input. Record whether the draft and intended
screen survive. Keep the transition inside one test; reset only before a new
experiment. Characterize current behavior without inventing a product requirement.

```bash
./node_modules/.bin/wdio run config/wdio.android.conf.ts --spec test/training/wdio/as-18-state.spec.ts
npm run typecheck
```

### Acceptance criteria

Every observation has a precise trigger and before/after evidence. The report
distinguishes app restart from storage erase, reinstall, permission reset and
server cleanup. It does not call terminate/activate a low-memory process-death
simulation. Missing capabilities leave the corresponding row pending.

### Changed condition

A hypothetical product now requires a draft to survive an app upgrade. Explain
the extra signed build pair, preserved install/data procedure and oracle needed.
Do not uninstall your app or claim the restart experiment covered upgrades.

### Evidence and review

Deliver the state-layer table and three observations. **90-second explanation:**
how would an over-aggressive setup invalidate a persistence test even while making
the suite appear more reliable?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Setup is part of the test's meaning. Clearing the draft before checking recovery
answers a different question. Read the helper and capability lifecycle instead
of inferring all reset behavior from its name.

</details>

[Assignment bank](README.md) · [Next topic: hybrid boundaries](07-hybrid-boundaries.md)
