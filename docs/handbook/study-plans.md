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

## When stuck

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
