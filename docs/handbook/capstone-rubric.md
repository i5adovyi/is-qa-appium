# Capstone assessment rubric

Use this as a self-assessment or peer review, not a certification or hiring guarantee. Maximum core score: **100**.

| Dimension | Points | Full-credit evidence | Partial-credit warning |
|---|---:|---|---|
| Test strategy | 15 | Scoped risks, six scenario candidates, justified four-scenario selection, clear exclusions, permission/interruption risk status | Scenario list without rationale |
| Behavioral assertions | 20 | Four meaningful additions beyond the learner's current suite, at least two new behaviors, credible oracles, exact observable checks | Action-only tests or repeated ordinary data |
| Independence and waits | 20 | Initial state owned, narrow/full runs agree, bounded observation waits, no hidden order dependency | Sleeps, blind toggles, retry-based repairs |
| Code clarity | 15 | Focused screen actions, inspected selectors, typed fixtures where useful, readable names | Huge generic helpers or selectors scattered everywhere |
| Diagnostics | 15 | Injected defect caught, evidence tied to run, useful report, restored green state | Screenshot without context or missing original error |
| Handover | 15 | Reproducible commands, version/app identity, truthful scope, concise demonstration | Claims unsupported by actual runs |

## Scoring method

For each row, award:

- **100% of its points:** all listed evidence is present and understandable.
- **75%:** one minor gap, with core behavior and evidence intact.
- **50%:** meaningful work, but a major limitation remains.
- **25%:** mostly a plan or copied example with little demonstrated execution.
- **0%:** absent or contradicted by evidence.

Round the final total to the nearest whole point. Write one sentence of evidence for every awarded category. A copied solution with no explanation cannot earn full credit for clarity or handover.

## Readiness bands

| Score | Interpretation | Next action |
|---|---|---|
| 85–100 | Strong training portfolio within its stated scope | Ask a peer to review assumptions and extend one risk area |
| 70–84 | Useful independent practice, with identifiable gaps | Repair the weakest evidence category |
| 50–69 | Foundations are developing | Repeat a narrow scenario end to end |
| Below 50 | More guided practice needed | Return to the lesson tied to the first major gap |

## Essential integrity gates

Regardless of score, the submission is unfinished if it contains exposed credentials, deliberately broken code left as a passing submission, fabricated execution claims, or assertions disabled to obtain green. Repair the issue before assessing the technical score.

Cloud, hybrid, and iOS are optional extensions. They do not compensate for weak core assertions. Give an extension a separate narrative assessment: goal, environment, evidence, limitations, and maintenance cost. A well-investigated blocked hybrid task can show learning, but it is not a verified supported feature.

## Reviewer questions

1. Show which test fails when you remove the critical action.
2. Explain the exact state your setup establishes—and what it does not clear.
3. Show evidence that your most valuable new scenario ran.
4. Describe one user problem that your suite could miss.
5. Make one small change without consulting the model solution.

[Capstone brief](../lessons/15-capstone.md) · [Review checklist](review-checklist.md)
