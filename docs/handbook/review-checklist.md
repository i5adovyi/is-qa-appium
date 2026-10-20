# Review checklist

Review one scenario at a time. Answer with evidence, not a blanket “looks good.”

## Intent and coverage

- [ ] The name describes observable behavior.
- [ ] A risk or requirement explains why the test exists.
- [ ] Expected results have an identified oracle.
- [ ] The test adds meaningful coverage rather than duplicating an ordinary data value.
- [ ] Demo validation is not described as real backend authentication.

## Setup and actions

- [ ] The test establishes its screen and required starting state.
- [ ] It can run without a previous case having passed.
- [ ] Asynchronous commands are awaited.
- [ ] Selectors are inspected and kept in screen objects/helpers.
- [ ] The keyboard and dialogs are handled where relevant.
- [ ] Actions have clear names and do not hide unrelated assertions.

## Waiting and assertions

- [ ] Waits observe meaningful state with a finite bound.
- [ ] Polling callbacks do not repeatedly click or submit.
- [ ] Chai is not confused with WebdriverIO's retrying matcher API.
- [ ] A negative assertion cannot pass before the event under test occurred.
- [ ] The assertion would catch removal or corruption of the intended action.
- [ ] Error messages distinguish timeout/readiness from wrong values.

## Evidence

- [ ] The narrow case and relevant suite have actual recorded results.
- [ ] Test counts distinguish passed, failed, skipped, and not run.
- [ ] Device/OS/app build and command are identifiable.
- [ ] Screenshots/source/logs correspond to this run.
- [ ] Failure collection preserves the original test error.
- [ ] Any deliberately injected defect has been restored.

## Maintainability and sharing

- [ ] Data is synthetic; secrets stay outside committed code.
- [ ] Diagnostic contents were reviewed before external sharing.
- [ ] No accidental `.only`, ignored assertion, or broad retry hides coverage.
- [ ] No dependency/tool upgrade is mixed in without a reason and validation.
- [ ] Cloud, hybrid, and iOS claims match actual verification.
- [ ] A future learner can identify where to change a locator or expected message.

**Review response format:** identify the scenario, explain the concrete failure risk, point to the smallest relevant code location, and recommend a repair. Prefer “this assertion can pass before submission because…” to “this is bad practice.”

[Capstone rubric](capstone-rubric.md) · [Test design](../lessons/14-test-design.md)
