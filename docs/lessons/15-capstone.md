# 15 · Capstone: own the test strategy

**Stage:** Independent delivery\
**Estimated time:** 8–16 hours over several sessions\
**Prerequisites:** Lessons 01–14; a green local baseline; ability to diagnose one injected defect.\
**Outcome:** Deliver a small, credible automation project with evidence and an honest account of its limits.

## The client brief

You have inherited the demo app's Android acceptance suite. A teammate will maintain it after you. They need reliable regression checks, understandable failure reports, and a clear explanation of what is and is not covered.

Choose a theme: **Login confidence**, **Forms interaction quality**, or **a balanced starter regression suite**. Keep the working baseline and add at least four meaningful scenarios. At least two must exercise behavior not already demonstrated by the supplied tests. Investigated signup, dropdown selection, or a carefully verified gesture can qualify. Rewording a test or changing ordinary text does not establish a new behavior.

Cloud and hybrid work are optional extensions. A strong Android-only submission can earn the core assessment by being explicit about its scope.

Choose additions against your **current** suite, including exercises you have already completed. A switch round trip added in lesson 06 cannot be counted again as new implementation. A corrected-invalid-login recovery, a newly inspected dropdown, or a lifecycle contract with a stated oracle can extend your evidence. Include at least one permission or interruption risk in the plan, classified as implemented, designed only, or explicitly out of scope; no invented demo feature is required.

## Worked example: turn a vague request into evidence

Vague: “Make login well tested.”

Concrete:

```text
Risk: empty submission offers no way to recover.
Scenario: on a clean Login screen, submit both fields empty.
Oracle: demo validation requires a valid email and at least eight characters.
Evidence: both exact messages are visible after submit.
Recovery scenario: correct the inputs and observe the success alert.
Limit: this establishes demo UI validation, not backend authentication.
```

This is the level of specificity your README and test names should reach.

## Guided project

1. Run `npm run typecheck`, `npm run course:check`, and `npm run test:android`. Record the baseline.
2. Create `notes/capstone/` for your plan, evidence inventory, and final report. Use synthetic data.
3. Draft the risk table before coding. Select four additions and explain their unique value.
4. Implement one scenario at a time. Keep selectors in screen objects and expected behavior visible in specs.
5. Run each new case alone, then with its file, then with the full Android suite.
6. Inject one deliberate assertion or selector defect. Preserve the failure evidence, undo the injected change, and prove the final state is green.
7. Score yourself using the [capstone rubric](../handbook/capstone-rubric.md). Address the lowest-scoring area before polishing screenshots.

## Exercises / submission milestones

### 15-A · Strategy and scope

Deliver a one-page test strategy containing user risks, a six-or-more-row scenario table, a selected four-scenario implementation scope, test oracles, environment assumptions, and excluded coverage.

**Acceptance:** scenarios are observably different; at least two extend the supplied suite; the plan can be challenged by a reviewer; excluded iOS/backend/cloud coverage is explicit.

<details><summary>Hint 1 · Resist broad promises</summary>
“All Android login works” is too broad. Identify the app build, tested environment, and concrete behaviors.
</details>
<details><summary>Hint 2 · Prioritize</summary>
Select recovery, boundary behavior, state changes, and interactions because of risks, not because they are easy to screenshot.
</details>

### 15-B · Implementation and failure proof

Implement the four scenarios, keep the original suite passing, and show an intentionally introduced defect being caught. Add or improve one reusable screen action with a clear postcondition.

**Acceptance:** passing narrow and full runs; no fixed synchronization sleeps; no test depends on another's successful completion; diagnostic evidence names the failed behavior; injected defect removed.

<details><summary>Hint 1 · Independence is visible in setup</summary>
Every scenario should establish the screen and values it needs. A prior success alert must not be its hidden precondition.
</details>
<details><summary>Hint 2 · A helper must earn its abstraction</summary>
`selectDropdownOption(label)` is useful after inspected behavior is known. A generic `doEverything()` hides intent.
</details>

### 15-C · Handover and demonstration

Deliver a short maintainer guide and a five-minute demonstration: setup, one test explained, one failure diagnosed, final results, and next risks to investigate. Cloud evidence is optional but must be real if claimed.

**Acceptance:** a new learner can run the exact command; versions and app build are recorded; results distinguish pass/fail/skipped/not-run; no credentials appear; another person can identify where to change a selector.

<details><summary>Hint 1 · Teach your future teammate</summary>
Explain why the test exists and how its failure should be interpreted, not just how many lines you wrote.
</details>
<details><summary>Hint 2 · Show a failure well</summary>
Use the known injected defect. It demonstrates diagnostic skill without pretending the application shipped a bug.
</details>

## Final checkpoint

Answer without opening the solution:

1. Which new test has the highest value, and why?
2. What could make that test pass while the user still has a problem?
3. Which evidence supports your environment and coverage claims?
4. What would you test below the UI if you had the app source?
5. What is your next improvement, and what would justify its cost?

Finishing means you can explain and maintain your work. A purchased tool, high test count, or attractive report cannot substitute for that.

[Sample capstone approach](../solutions/15-capstone.md) · [Assessment rubric](../handbook/capstone-rubric.md) · [Course index](../README.md)
