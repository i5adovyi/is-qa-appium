# CH-01 · Inherit a project with a green badge

**Ticket:** “You join the mobile team today. Tell us what you can reproduce on
your machine before changing our tests.” A colleague says the green badge means
Android is ready. Treat that statement as a hypothesis.

## Prerequisites

Node 24, installed locked dependencies and a local checkout. No device or paid
account. If installation is new, follow [new machine setup](../../README.md)
and [computer basics](../handbook/computer-basics.md). Allow 30–60 minutes.

## Assignment

Read [package.json](../../package.json), [validation](../validation.md) and the
[runner configuration](../../config/wdio.shared.conf.ts). Before running, predict
which command starts a device session and which command checks only Node code.

Run these separately from the repository root so you can associate each result
with one command:

```bash
git status --short
node --version
npm run check
npm run course:test
```

1. Record the code revision with `git rev-parse HEAD`, Node version, any existing
   edits and the observed results. Do not print environment variables or secrets.
2. Build a table with **scope / actual result / evidence / not covered** for each
   check. A framework mock passing is not an Android UI result.
3. Choose one supplied reference test and trace it from spec → screen → selector.
   Point to the assertion that could fail.
4. Write a five-line first-day handover: reproducible baseline, blocker if any,
   one unanswered question and the next smallest useful task.

## Acceptance criteria

Another learner can repeat your commands. Your table separates types, reference
lab answers, reader checks and device tests. You have not marked learner
starters complete because the reference suite passed. If a check fails, the
handover includes its first meaningful error and next diagnostic action;
repairing unrelated dependencies is outside this ticket.

## Evidence and review

Save your table and handover in this challenge's notes. Use actual command
output counts; do not copy historical counts from validation.md.

<details><summary>Hint / reviewer questions — after your attempt</summary>

Read the scripts behind `check` and `course:test`. Neither invokes a mobile
runner. `npm run practice:solutions` selects references; `npm run practice -- 01`
selects the learner attempt. Ask: could the app crash while these checks pass?
Which additional observation would answer that?

</details>

**Change request:** the manager asks “Can we release today?” Respond with the
missing evidence, not a broad yes/no based on this baseline.
Continue to [CH-02](02-fixture-ticket.md) or [path briefing](README.md).
