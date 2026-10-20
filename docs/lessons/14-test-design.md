# 14 · Design tests that deserve to exist

**Stage:** Deliver credible results\
**Estimated time:** 100–150 minutes\
**Prerequisites:** Lessons through 13; at least three tests you can explain unaided.\
**Outcome:** Select coverage by risk, identify a test oracle, and turn exploration into focused automation.

## Your job is to reduce important uncertainty

Automating every visible control is a weak strategy when important behaviors remain unknown. Start with a claim: “A user cannot submit an empty login form without guidance.” Identify an observable result: both validation messages appear. Then ask how that claim could be false.

An **oracle** is the basis for deciding whether a result is correct. The app's current behavior is useful evidence, but it is not automatically the intended requirement. A mistaken UI can consistently produce the wrong result. In this training project, distinguish the displayed demo rules, inspected behavior, and assumptions you choose for an exercise.

## Worked example: a small risk-based test plan

| Risk | Representative check | Test level | Why |
|---|---|---|---|
| Empty submission gives no guidance | Submit empty fields; verify both messages | Mobile UI | Presence and placement belong to the user flow |
| Password boundary implemented incorrectly | 7/8/9 characters | Unit/component if app code is available; selected UI checks here | Many combinations are cheaper below UI |
| Keyboard prevents submission | Enter text, hide keyboard, submit | Mobile UI | Device interaction matters |
| Permission denial makes a real feature unusable | Deny the feature's permission and check its specified fallback | Dedicated mobile scenario in an app with that feature | The baseline's automatic grants hide this branch |
| A background interruption loses a draft | Populate, background/return, verify the agreed retention rule | Mobile lifecycle scenario | Per-test restart is setup, not interruption coverage |
| Backend authenticates the wrong account | Contract/API tests plus selected end-to-end check | Not covered by this demo | Demo success is simulated |
| Screen-reader experience is unusable | Accessibility assessment with assistive tech | Manual plus specialized checks | Accessibility IDs alone do not prove usability |

The training repository has the test client and a packaged demo app, so many lower-level app tests cannot be added here. Recognize that architectural boundary instead of pretending UI automation replaces them.

For your future work app, keep a short mobile risk inventory: permission denial/revocation, background/return, offline/reconnect, supported orientation/screen sizes, accessibility, and install/upgrade state. Classify each as relevant, not applicable, or needing product clarification. Do not automatically add one UI test for every category: first establish a real feature, an oracle, and a controllable environment. The [state field manual](../handbook/mobile-state.md) gives concrete permission and interruption design examples.

## Guided lab

1. Choose Login or Forms. Explore it manually for 15 minutes and record observations, questions, and potential risks.
2. Create `notes/test-design.md` using the [test design template](../handbook/templates.md).
3. Write six scenarios. For each, give the initial state, action, expected observation, oracle, and likely failure impact.
4. Select the two highest-value scenarios that are not already covered.
5. Implement one using existing screen objects. Run the narrow file, then:

   ```bash
   npm run typecheck
   npm run test:android
   ```

6. Review whether the new assertion could pass if its intended action were removed. If so, strengthen the precondition or observation.

## Exercises

### 14-A · Build a decision table

For Login, use two conditions: valid-shaped email and password length at least eight. Create all four combinations. Map expected validation messages and possible success to each row. Label the source of your expectation.

**Acceptance:** four distinct rows; no real authentication claim; each invalid condition is independently observable; uncertainty about backend behavior is explicit.

<details><summary>Hint 1 · Two booleans produce four combinations</summary>
Include valid/invalid and invalid/valid, not only both-valid and both-invalid.
</details>
<details><summary>Hint 2 · “Valid” is scoped</summary>
Here it means the demo's input validation, not that the email address owns an account.
</details>

### 14-B · Design an exploratory charter

Spend 20 minutes investigating form behavior when the keyboard opens, the screen changes, and the user returns. Record observations and questions before deciding which behavior to automate.

**Acceptance:** a focused mission, a timebox, actual observations, at least one follow-up question, and one proposed automated check with a rationale.

If the navigation behavior is already understood, use foreground → background → foreground as the state transition instead. Keep the same timebox and evidence requirements; do not infer persistence requirements from a single observed run.

<details><summary>Hint 1 · A charter is a mission</summary>
“Explore Forms state retention to discover surprising data loss or stale UI” is more focused than “test everything.”
</details>
<details><summary>Hint 2 · Do not invent requirements after seeing behavior</summary>
If returning clears text, ask whether this is intended. An observation is not yet a defect.
</details>

### 14-C · Reduce a bloated suite

A proposed suite has 30 identical successful login tests using different ordinary emails, one empty-input test, and no keyboard or boundary checks. Recommend a smaller suite with better risk coverage and explain what you would defer.

**Acceptance:** rationale for retained and removed classes; at least one boundary and interaction risk; no claim that fewer tests always means better tests; manual exploration remains part of the strategy.

<details><summary>Hint 1 · Count distinct risks</summary>
Thirty strings with equivalent behavior may exercise one partition thirty times.
</details>
<details><summary>Hint 2 · Write the tradeoff</summary>
Time saved can fund a device variant or deeper investigation, but choose that investment based on users and failure history.
</details>

## Checkpoint

- What is the oracle for your last new assertion?
- Which risks cannot be tested using a simulated login?
- What makes an exploratory observation different from a defect report?
- When would adding a UI test be the wrong engineering choice?

[Solutions](../solutions/14-test-design.md) · [Next: capstone](15-capstone.md) · [Review checklist](../handbook/review-checklist.md)
