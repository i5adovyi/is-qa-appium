# Study plans that produce working skills

Course time is an estimate, not a promise. If programming is new, budget additional time for TypeScript and command-line practice. The capstone benefits from several separate sessions because next-day recall exposes gaps.

## Every session

1. **Recall, 5 minutes:** explain yesterday's concept without notes.
2. **Read, 10–20 minutes:** one worked example and its rationale.
3. **Build, 25–60 minutes:** attempt the exercise before opening hints.
4. **Break and repair, 10–20 minutes:** introduce one controlled defect and interpret it.
5. **Record, 5 minutes:** what you proved, what remains uncertain, next smallest step.

Use [templates](templates.md) for a learning log. Mark a lesson complete when you can demonstrate its outcomes, not when you have scrolled to the bottom.

## Four-week beginner plan

| Week | Focus | Sessions and deliverable |
|---|---|---|
| 1 | Environment, language, first tests | Four 2–3-hour blocks; a passing smoke run and a line-by-line explanation |
| 2 | Forms, Login, selectors, screen objects | Four 2–3-hour blocks; your own input/validation tests plus one inspected control |
| 3 | Data, state, debugging, exploration | Four 2–3-hour blocks; named data cases, order-dependency experiment, useful failure report |
| 4 | Cloud design, CI, strategy, capstone | Four 2–3-hour blocks plus 8–16 hours for capstone work; a reproducible handover |

Revisit earlier lessons if you cannot explain `await`, an assertion, or the reset contract. Progress is not improved by carrying those gaps into a larger framework.

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

Use six 60–90-minute sessions, repeating any that expose a weak foundation:

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
| 7 | Lab 10, D8, Q41; RW-16/RW-22 | Passing API contract helper and clear separation of HTTP, data and business failures |
| 8 | D7, RW-21/RW-23/RW-27, Q42–Q44 | Timestamped diagnosis with competing hypotheses and next observations |
| 9 | D9/D10, RW-24/RW-25/RW-26/RW-28, Q45–Q48 | Prioritized test table, rollout/consent risks and a truthful handover |

In the course dashboard, use **Workplace & interview practice** to search full
case text or IDs, then filter by type. Selecting a card opens that exact exercise.

## Getting unstuck

Try for 15–20 focused minutes. Then open the first hint, not the solution. Write your current hypothesis and the observation needed to test it. After seeing a solution, close it and reconstruct the essential code from memory in a fresh practice attempt.

## Skill checkpoints

You are making progress when you can:

- Explain a test from imports through cleanup.
- Find a control in Inspector and justify the selector.
- Write a new assertion that fails when the behavior is broken.
- Run a case independently and explain its initial state.
- Diagnose an injected defect using evidence.
- State precisely what your suite has not tested.

[Course index](../README.md) · [Capstone rubric](capstone-rubric.md)
