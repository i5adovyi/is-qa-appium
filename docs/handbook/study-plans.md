# Study plans that produce working skills

Course time is an estimate, not a promise. If programming is new, budget additional time for TypeScript and command-line practice. The capstone benefits from several separate sessions because next-day recall exposes gaps.

## A session that fits today

Start with [Choose one comfortable study session](study-session.md) for a single
task matched to your experience and available tools. It includes 20-, 45- and
90-minute patterns, a return-after-a-break routine and next-day/one-week recall.
An unfinished exercise can span several sessions. Save one clear next action
instead of trying to finish a whole lesson after work.

The longer plans below are optional ways to group those sessions. The weekly
estimates assume their stated hours; using shorter sessions extends the calendar.

## Every session

For your first programming experience, use [Start from zero](start-from-zero.md)
before the timed plans below. Its 20–40-minute sessions separate setup, coding
and testing. Repeat a session as needed; the four-week plan assumes you can
already save/run files and read basic functions, and is not a deadline.

For a longer session, use this loop; use the shorter guide above when time or
concentration is limited.

1. **Recall, 5 minutes:** explain your last session's concept without notes.
2. **Read, 10–20 minutes:** one worked example and its rationale.
3. **Build, 25–60 minutes:** attempt the exercise before opening hints.
4. **Break and repair, 10–20 minutes:** introduce one controlled defect and interpret it.
5. **Record, 5 minutes:** what you proved, what remains uncertain, next smallest step.

Use [templates](templates.md) for a learning log. Mark a lesson complete when you can demonstrate its outcomes, not when you have scrolled to the bottom.

At the next session, attempt one small prediction before rereading. About a week
later, reconstruct a small part separately from your saved work and change one
input or premise. See the session guide's [recall prompts](study-session.md#recall-without-restarting-the-whole-course).
Needing a hint identifies the next practice task; it does not erase earlier work.

## Four-week beginner plan

| Week | Focus | Sessions and deliverable |
|---|---|---|
| 1 | Environment, language, first tests | Four 2–3-hour blocks; a passing smoke run and a line-by-line explanation |
| 2 | Forms, Login, selectors, screen objects | Four 2–3-hour blocks; your own input/validation tests plus one inspected control |
| 3 | Data, state, debugging, exploration | Four 2–3-hour blocks; named data cases, order-dependency experiment, useful failure report |
| 4 | Cloud design, CI, strategy, capstone | Four 2–3-hour blocks plus 8–16 hours for capstone work; a reproducible handover |

Revisit earlier lessons if you cannot explain `await`, an assertion, or the reset contract. Progress is not improved by carrying those gaps into a larger framework.

## Choose a track and use evidence gates

The case library is a reference, not a requirement to finish every item in four
weeks. Use the core lessons for foundations, then choose interview practice or
the workplace shifts. Keep one core task per session; stretch work is optional.

| Gate | Evidence needed before moving on |
|---|---|
| Foundations → first test | Explain `await` and a failed assertion; finish one small starter without copying |
| First test → reliability | Run a chosen test alone, prove it fails for a relevant defect, restore it |
| Reliability → workplace shifts | Separate app/device/fixture state; write two hypotheses and a discriminating observation |
| Workplace shifts → capstone | Repair one inherited helper, revise a hypothesis after new evidence, and hand over unresolved work honestly |

If a device is unavailable, proceed with offline labs and written designs.
Leave the device gate pending until you have device evidence. Do not mark all
learning blocked, and do not mark unexecuted checks passed.

## Eight-week sustainable plan

Use three 90–120-minute sessions per week. Spend weeks 1–2 on foundations, weeks 3–4 on first mobile scenarios, weeks 5–6 on reliability and diagnosis, and weeks 7–8 on delivery. Add 8–16 hours for the capstone, either as longer weekend blocks or as a ninth week. Split a long session into two shorter sessions when concentration fades.

Each third session is a recall-and-repair session: rebuild a small test from a blank `it` block, deliberately break it, and explain the failure. Avoid spending all three sessions reading.

## One-day preparation sprint

This creates momentum; it does not replace the course:

| Block | Work |
|---|---|
| 60–90 min | Verify setup; run smoke; understand the tool chain |
| 90 min | Explain Forms and Login; add or reconstruct one clear/validation case |
| 60 min | Inspect a control; explain its selector |
| 90 min | Break an assertion and locator; produce two failure reports |
| 45 min | Review state, waits, cloud requirements, and CI boundaries |
| 30 min | Choose your next three lessons and write a concrete practice plan |

If setup consumes the day, use the offline exercises and preserve a precise environment report. Do not label unexecuted mobile work complete.

## Interview preparation after the foundations

Use six 60–90-minute sessions, repeating any that expose a weak foundation.
Choose three questions from each listed range per session; the range is a topic
pool, not a demand to complete every question plus a lab in ninety minutes.

| Session | Work | Evidence |
|---|---|---|
| 1 | Q01–Q12; practical drill D1 | Explain the command path and repair an assertion |
| 2 | Q13–Q20; D3 SQL | Fixture ownership, a query and its limitations |
| 3 | Lab 07; RW-15 | Isolated worker plan with edge cases |
| 4 | Lab 08; RW-04/RW-05 | Cleanup behavior and an authentication/recovery design |
| 5 | Lab 09; RW-17; D4 | Honest result summary and actionable review comments |
| 6 | Q33–Q40; a timed mock; D6 | Recorded explanation, rubric scores and next steps |

The [question bank](interview-practice.md), [drills](interview-drills.md) and
[workplace cases](workplace-scenarios.md) contain the referenced tasks. This is
additional practice, not a promise of interview readiness in six sessions. Choose
iOS, hardware and framework-owner extensions from the target job's requirements.

## Incident practice after the interview foundation

After those six sessions, use three incident sessions to turn explanations into
evidence. Each is 60–90 minutes; repeat weak areas before adding more topics.

| Session | Work | Evidence |
|---|---|---|
| 7 | Core: lab 10. Optional follow-up: D8/Q41 | Passing API contract helper and separation of HTTP, data and business failures |
| 8 | Core: D7 timeline. Choose one follow-up from RW-21/RW-23/RW-27 | Diagnosis with competing hypotheses and next observations |
| 9 | Core: D9 checkout design. Optional follow-up: D10 handover | Prioritized test table with requirement-based expected values |

In the course dashboard, use **Workplace & interview practice** to search full
case text or IDs, then filter by type. Selecting a card opens that exact exercise.

## Workplace apprenticeship: six messy shifts

Use [incident shifts S1–S6](incident-shifts.md) after the reliability gate.
Each shift has an opening packet, an additional-evidence reveal, a task and a
review guide. Write your prediction before revealing more evidence.

| Session | Core work | Deliverable |
|---|---|---|
| S1 | Conflicting requirements and a changed decision | Provisional and revised acceptance tables; a clarification message |
| S2 | Lab 11: shared nested fixture | Red-to-green repair, ownership sketch and one extra regression case |
| S3 | Lab 12: committed write with lost response | Single-write recovery and an explicit unknown-outcome policy |
| S4 | Killed worker and stale artifacts | Run/attempt evidence manifest and scoped cleanup dry-run |
| S5 | A green test misses a deliberate defect | Independent oracle and mutation evidence, or clearly labeled design |
| S6 | Incomplete release evidence and limited access | A recommendation, owner, next observation and residual risk |

Give a repair lab a second session if needed. After each shift, repeat one small
part the next day with a changed premise. The purpose is to defend your reasoning
under change, not memorize the answer guide.

Keep broader topics such as iOS, hardware, feature flags and analytics as
job-specific electives. Select one relevant case at a time. Stop adding breadth
when you cannot independently explain and reproduce your last repair.

## Getting unstuck

Try for 15–20 focused minutes. Then open the first hint, not the solution. Write your current hypothesis and the observation needed to test it. After seeing a solution, close it and reconstruct the essential code from memory in a fresh practice attempt.

For a 20-minute session, stop earlier if you keep making the same guess without
new evidence. Save the command, first useful error, your hypothesis and one
question in the [partial handover](templates.md#session-bookmark-and-partial-handover).
If a prerequisite is missing, choose an independent offline task and leave that
execution pending. Do not overwrite a working starter to practise recall.

## Skill checkpoints

You are making progress when you can:

- Explain a test from imports through cleanup.
- Find a control in Inspector and justify the selector.
- Write a new assertion that fails when the behavior is broken.
- Run a case independently and explain its initial state.
- Diagnose an injected defect using evidence.
- State precisely what your suite has not tested.

[Course index](../README.md) · [Capstone rubric](capstone-rubric.md)
