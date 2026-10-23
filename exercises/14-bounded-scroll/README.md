# Lab 14 — Repair a search through a recycled list

**Time:** 40–60 minutes. **Prerequisites:** arrays, async functions,
[lab 13](../13-stale-observation/README.md) and [lesson 11](../../docs/lessons/11-gestures-and-contexts.md).
**Environment:** Node 24 only; no gestures are sent to a device.

An inherited helper reads once, scrolls repeatedly, then reports a missing order.
Sometimes it also returns a hidden row. Repair `findVisibleRow` in
[starter.ts](starter.ts). A viewport is a fake snapshot of rows, not a DOM or
Appium element. Multiple orders deliberately have the same display label.

## Contract

1. Validate a nonempty, unpadded `targetId` and a nonnegative safe integer
   `maxScrolls` before any interaction. Do not normalize the supplied ID.
2. Read once initially and once after every completed scroll. Match logical ID
   **and** `visible: true`; label and position do not establish record identity.
3. If exactly one visible row matches, return that row without another scroll.
   If more than one visible row matches, fail with target ID and `ambiguous`.
4. If no target matches, check these stop conditions in this order:
   `atEnd` → `end reached`; unchanged ordered visible IDs since the preceding
   read → `no progress`; exhausted budget → `scroll limit reached`.
   Every failure message includes the target ID and stop reason.
5. Otherwise await one `scrollForward()` and observe afresh. Never exceed
   `maxScrolls`; budget 0 permits the initial observation and no gesture.
6. Propagate read/scroll rejections unchanged. Do not click a row, rewrite the
   snapshots, retry failures or invent a successful result.

For this deterministic model, equal ordered visible IDs mean no progress. Use
`JSON.stringify` or an equally unambiguous representation rather than joining
IDs with a separator that might occur inside an ID. The snapshots are immutable.

## Work

1. Predict reads and scrolls for target on the first page, target after two
   scrolls, hidden target, duplicated visible target, end reached and zero budget.
2. Run `npm run practice -- 14`; explain the failing observation before editing.
3. Repair the helper, then add a case where a target appears exactly at the final
   allowed scroll. Add a separate case with an empty viewport at the end.
4. Explain why a reused row position can now represent a different order.
5. Record one thing this simulation cannot establish on an actual Android list.

<details><summary>Hint 1 · Check before acting</summary>

Read, inspect visible matches, decide whether to stop, and only then scroll.
Re-read after the awaited action. A successful gesture is not a successful search.

</details>
<details><summary>Hint 2 · Count actions, not pages</summary>

Two allowed scrolls permit up to three snapshots: the initial page and two
results. Check for the target before deciding that the budget is exhausted.

</details>

**Acceptance:** checks and your added boundary cases pass; call traces establish
the gesture bound, visible uniqueness and fresh observations. You can explain
how end, no progress and budget exhaustion produce different evidence.

**Controlled defect:** temporarily accept the first row whose label equals the
target label, or stop one read before the final permitted result. Add a case that
catches your chosen mistake, run it, then restore the repair. Keep the
[reference solution](solution.ts) separate from your attempt.

**Mobile transfer limit:** a real adapter must establish the correct container,
inspect a stable record identity, determine actual visibility, wait for settling
and bound elapsed time as well as gestures. Unchanged IDs during an animation do
not by themselves prove a real list has stopped. This fake `atEnd` flag is a
supplied contract, not a universal Appium property. No generic scrolling helper
is added to the device framework. Use [RW-13](../../docs/handbook/workplace-scenarios.md#rw-13-a-recycled-list-defeats-a-scroll-helper)
and the [device practice route](../../docs/handbook/device-practice.md) for transfer.

[All labs](../README.md)
