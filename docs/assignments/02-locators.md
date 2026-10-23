# Locators and screen contracts

Practise logical identity offline, then inspect a different native app. A stable
selector is valuable only when it identifies the intended visible control.

## AS-04 · Identify a row with repeated labels

**L1 · Guided · Offline · 30–45 min · App: synthetic catalog.**

### Prerequisites

Arrays and [selector concepts](../lessons/05-selectors.md). Node 24 only.
Own `.local-data/assignments/AS-04/attempt.ts` and `attempt.test.ts`; follow the
[attempt workflow](README.md#make-an-attempt-you-can-keep).

### Assignment

**Ticket:** “The Remove button deletes a different product after sorting.”
Implement `selectRow(rows, wantedId)` over rows with `id`, `label`, `visible`
and `removeEnabled` fields. Return the original row object only when exactly one
visible row has the requested ID and its remove action is enabled. Otherwise
throw with one of `missing`, `ambiguous` or `disabled`; check ambiguity before
action state. Assume correctly typed rows and a nonempty requested ID.

Use rows `p-1/Mug/visible/enabled`, `p-2/Mug/visible/enabled` and
`p-2/Mug/hidden/enabled`. Request `p-2`. Test original order, reversed order,
missing ID, two visible `p-2` rows, and one disabled visible `p-2` row. The hidden
copy must not create ambiguity. Do not mutate the source array or return its index.

### Acceptance criteria

The returned object is the intended record regardless of ordering. Each failure
has the correct reason; your test proves the input order and values remain intact.
This is a pure identity model, not an Appium visibility implementation.

### Changed condition

Give both products the same label and reverse their order in a regression.
Temporarily select by label or first position, observe the failure, then restore.

### Evidence and review

Save the test command and failure that catches the bad selector.
**90-second explanation:** why can a freshly acquired element still be the wrong
element, and what would establish product identity on a real screen?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Filter by logical ID and visibility before checking whether an action is enabled.
“There is a Remove button” cannot tell you which product owns it. On a device,
inspect the row scope and identity; the fake `visible` field is not supplied by
the driver for arbitrary data records.

</details>

## AS-05 · Own a native widget test

**L2 · Independent · Android · 50–80 min · App: ApiDemos.**

### Prerequisites

A compatible Android device, [training-app setup](../handbook/training-apps.md),
AS-04 and [first-test structure](../lessons/04-first-test.md). Own
`test/training/apidemos/as-05-widget.spec.ts`; do not edit the reference specs.

### Assignment

**Ticket:** “Our automation is tied to one demo's selectors. Show that you can
test an unfamiliar native widget.” Inspect ApiDemos and choose one reachable
toggle or selection control with an observable state. Record the actual menu
route, screen marker, control identity and initial state before implementing.

Write one test that establishes the initial state, changes the control, observes
the new state, then returns it to the initial state. Keep navigation and the
control lookup separate. Use a semantic state observation where the inspected
widget supports one; a tap command's success is insufficient.

```bash
npm run test:training -- apidemos --spec test/training/apidemos/as-05-widget.spec.ts
npm run typecheck
```

### Acceptance criteria

Evidence identifies app/build/device and your inspected selector choices. Both
transitions have meaningful assertions, the test establishes its own start and
the narrow run is recorded. A control missing from your build is a prerequisite
finding: choose another actual widget and document the substitution.

### Changed condition

In your own test, omit the first toggle action while retaining the expected
changed-state assertion. Predict, run and restore. A test already starting in
the target state must not pass this mutation unnoticed.

### Evidence and review

Deliver your spec and a small selector/state inventory. **90-second explanation:**
which test ideas transferred from the original app, and which selectors or setup
assumptions had to be inspected again?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Do not copy a WebdriverIO demo screen object into ApiDemos unchanged. Reacquire
controls after navigation. Separate “correct screen,” “correct control” and
“correct state” so the first useful failure explains the problem.

</details>

## AS-06 · Hand over a testability request

**L3 · Investigation · Android · 55–85 min · App: ApiDemos and WebdriverIO demo.**

### Prerequisites

AS-05, working inspection on both apps and
[failure diagnosis](../lessons/10-debugging.md). Own `AS-06/evidence.md` and
`test/training/apidemos/as-06-selector-probe.spec.ts` if automating the probe.

### Assignment

**Ticket:** “A reusable screen abstraction selects by visible text everywhere.
The team wants to know where stable IDs would help.” Inspect one small screen
in each app. For three controls per screen, record observed identity attributes,
uniqueness, row/container scope and whether hidden duplicates exist. Do not
infer an attribute from a screenshot.

Choose one genuinely weak selector from your inventory. Propose a specific
developer-facing testability contract: which control should expose which stable
identity and how repeats are distinguished. If every selector is adequate,
identify a realistic future change and label the proposed risk as hypothetical.
Write one probe or manual inspection procedure that would verify the contract.

### Acceptance criteria

Deliver an evidence-backed request a developer could act on, plus an interim
selector with stated limits. Explain why its structure is scoped and why one
global text search is insufficient. Run any probe with the explicit training
spec command from AS-05, substituting your filename; otherwise label it manual.

### Changed condition

The product adds a translated label and a second control with the original text.
Use a labelled synthetic hierarchy sketch to demonstrate which selectors become
ambiguous. Do not claim that you changed or localized the installed app.

### Evidence and review

Attach sanitized hierarchy excerpts and the proposed verification procedure.
**90-second explanation:** how would you ask a developer for testability without
requesting brittle test-only coordinates or making an accessibility claim?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Stable identity and accessible naming are related but different requirements.
A content description used by assistive technology should remain meaningful.
A testability request should preserve user-facing semantics, not replace them
with opaque automation text. A scoped XPath can be a justified interim choice.

</details>

[Assignment bank](README.md) · [Next topic: synchronization](03-synchronization.md)
