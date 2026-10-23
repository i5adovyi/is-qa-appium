# Hybrid and integration boundaries

Native controls, WebView attachment and loaded web content are different layers.
Start with fictional evidence, then attempt a narrowly scoped real observation.
Do not turn a missing environment dependency into a passing skipped assertion.

## AS-19 · Classify three WebView failures

**L1 · Guided · Design · 30–45 min · App: synthetic WebView packets.**

### Prerequisites

[Hybrid lesson](../lessons/11-gestures-and-contexts.md) and basic failure
diagnosis. No Node, device or account is needed. Own
`.local-data/assignments/AS-19/evidence.md`.

### Assignment

**Ticket:** “Three jobs say the help page failed. Should we retry all of them?”
Use only these independent fictional packets:

```text
A: native help container is visible
   contexts = [NATIVE_APP]
   no context switch attempted

B: contexts = [NATIVE_APP, WEBVIEW_training]
   expected training URL identified
   switch fails: compatible browser driver unavailable
   no DOM assertion attempted

C: expected URL identified; switch succeeds
   DOM loaded with heading "Service unavailable"
   assertion expected "Help topics"
   native return succeeds
```

For each packet, name the furthest established layer, two plausible causes, one
observation that would distinguish them and the next owner/action. Write a short
team update without changing “not attempted” into “failed.” Separate the provided
error message in B from your own explanation of its cause.

### Acceptance criteria

The three investigations differ. You do not recommend changing a native locator
to fix B or installing a driver to explain C's observed content. You identify
what packet A cannot prove about debuggability, load timing or context exposure.
No packet is reported as a current project run.

### Changed condition

Packet C also shows the same unavailable page in a normal browser at that time.
Revise the next discriminating check. Explain why this supports an external
content/environment hypothesis without proving every app integration is correct.

### Evidence and review

Deliver three short diagnosis cards and the revised C update.
**90-second explanation:** what must succeed between “a WebView is on screen”
and “a DOM assertion passed”?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Discovery, attachment, navigation/content readiness and business assertions have
different dependencies. A retry might change timing; it does not establish which
dependency was missing. Request the next small observation instead of installing
several tools and losing the original evidence.

</details>

## AS-20 · Preserve the original context failure

**L2 · Independent · Offline · 45–70 min · App: synthetic context adapter.**

### Prerequisites

Node 24, async functions and the hybrid lesson's cleanup discussion. Own
`AS-20/attempt.ts` and `attempt.test.ts` in your private bank directory; use the
[offline commands](README.md#make-an-attempt-you-can-keep).

### Assignment

**Ticket:** “Returning to native failed and replaced the useful web assertion.”
Implement `runInContext(enter, body, restore, recordCleanup)`. Each of the first
three callbacks is async; `recordCleanup` is a synchronous observer that, by this
contract, does not throw. Await enter once, then body once only if enter succeeds.
Always attempt and await restore once after enter/body finishes or rejects.

If enter/body and restore succeed, return body's value. If enter/body fails,
reject with its exact rejection value. If restore alone fails, reject with its
exact value. If both fail, call recordCleanup with the restore rejection once,
then preserve the primary rejection. Do not retry any callback.

Author fake callback tests for every success/failure combination, verifying call
order, counts and rejection identity. Include enter failing, so body must not run.

### Acceptance criteria

Tests establish exact primary rejection preservation, restore on both failure
paths, and a visible restore-only failure. The helper does not require or pretend
to create an Appium session. Run tests and the explicit typecheck.

### Changed condition

The body rejects with `undefined` rather than an Error object. Add a regression
where restore also fails. Explain why testing the truthiness of a saved error
cannot tell you whether the body succeeded. Preserve that rejection exactly.

### Evidence and review

Deliver the failure matrix and call traces. **90-second explanation:** why can a
simple awaited `finally` accidentally conceal the first failure, and how should
a real reporter retain the secondary cleanup failure?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Track whether an operation failed separately from the value it rejected with.
Cleanup has a result too. This deterministic adapter exercises control flow;
actual session recovery needs its own driver behavior and observed native state.

</details>

## AS-21 · Investigate a real WebView boundary

**L3 · Investigation · Android · 60–90 min · App: WebdriverIO demo.**

### Prerequisites

AS-19, AS-20, a working Android baseline, and the
[hybrid environment prerequisites](../lessons/11-gestures-and-contexts.md).
The demo's web content may require internet access and compatible WebView/browser
driver support. Own `test/training/wdio/as-21-webview.spec.ts`.

### Assignment

**Ticket:** “Native smoke is green. Can we trust one embedded help-page check?”
Inspect the actual Webview tab and capture sanitized context metadata before and
after opening it. Identify the intended URL/title and package context deliberately;
do not switch to the first string containing `WEBVIEW`.

If attachment is supported, assert one meaningful element from the actual loaded
page and return to native. Observe a native screen marker afterward. Introduce
a deliberate wrong DOM expectation and record whether the original failure and
native restoration remain visible. Use the lesson's documented API as a starting
point, inspected on your installed versions.

```bash
./node_modules/.bin/wdio run config/wdio.android.conf.ts --spec test/training/wdio/as-21-webview.spec.ts
npm run typecheck
```

### Acceptance criteria

Report discovery, attachment, DOM assertion and native recovery separately, with
app/OS/WebView versions where available. If blocked, provide the earliest failed
layer and a reproducible prerequisite request; execution remains pending. Do not
enable broad relaxed security or auto-download arbitrary drivers to hide a
missing dependency. Follow the documented setup for a justified specific need.

### Changed condition

Two WebView contexts are exposed. Show how your selection identifies the intended
content and fails clearly on ambiguity. A labelled synthetic metadata pair is
acceptable for this design variation if the actual device exposes only one;
do not report the pair as observed.

### Evidence and review

Deliver a capability report, selected command and observed outcomes or blocker.
**90-second explanation:** why does this check depend on more than the APK, and
how would you distinguish a third-party page outage from an app navigation bug?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Seeing the context does not prove attachment succeeded. Switching does not prove
content is ready. Preserve only sanitized URLs/metadata in the report; real pages
can place personal or secret values in URLs. Do not reuse a cached native element
as a DOM element across the boundary.

</details>

[Assignment bank](README.md) · [Next topic: delivery](08-delivery.md)
