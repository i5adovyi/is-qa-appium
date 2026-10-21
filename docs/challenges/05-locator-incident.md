# CH-05 · The element disappeared after a change

**Ticket:** “Forms used to pass. Now it says an element cannot be found. Someone
suggests doubling every timeout.” Your job is to produce evidence for a specific
cause before changing timing.

## Prerequisites

Android and your working CH-03 test; [selectors](../lessons/05-selectors.md) and
[debugging](../lessons/10-debugging.md). Allow 45–75 minutes. Defects below are
deliberate practice changes, not evidence of a defect in the demo app.

## Assignment

Use only your `challenge.forms.spec.ts`. Preserve shared screen objects.
Record its passing baseline, then temporarily replace one use of the input
element with a direct lookup of a deliberately nonexistent accessibility ID,
such as `$('~training-missing-input')`.

Run the same narrow command as CH-03. Save the exact failing operation and
inspect the generated failure artifacts under `logs/`.
Read [diagnostic hooks](../../config/wdio.shared.conf.ts) to locate their names.

Investigate three competing explanations:

| Hypothesis | Observation that would distinguish it |
|---|---|
| Wrong locator on the correct screen | Correct control exists in UI source under another ID |
| Wrong screen | Screenshot/root marker shows a different screen |
| Control appears later | Repeated fresh observations show a state transition |

Use screenshot plus UI source or Inspector to locate the intended control.
Record selector type, observed attribute and scope. Restore your bad lookup to
the existing screen getter and rerun. Increasing a timeout is not a repair for
an ID that never exists.

## Acceptance criteria

Your report connects the failure to one falsifiable cause, shows the relevant
UI evidence, and records the exact repair and final narrow result. You can
explain why the evidence rules out at least one competing hypothesis.
Do not paste the entire UI dump if it contains sensitive data.

## Evidence and review

Write a bug/automation incident note: expected, actual, steps, environment,
artifact location, cause, repair and one prevention action.

<details><summary>Hint / reviewer questions — after your attempt</summary>

“Element not found” describes the symptom. A screenshot alone cannot prove an
accessibility ID. UI source alone may be captured after a later state change.
Correlate timestamps, operation and the screen shown. If artifact collection
failed, say so and reproduce; do not invent a screenshot.

</details>

**Change request:** intentionally navigate to Login in your own test before
looking for the real Forms input. Compare the new evidence with the first
incident. Restore only that change. How would the same error wording conceal
different causes? Next: [CH-06](06-waiting-incident.md).
