# 10 · Solutions and reasoning

[Return to exercises](../lessons/10-debugging.md).

## 10-A · Locate the failing layer

| Injected defect | Earliest meaningful failure | Expected evidence |
|---|---|---|
| Input selector changed to `~missing-training-input` | Element/action cannot resolve | Forms screen may still be visible; no text entered |
| Expected echo changed to `unexpected` | Equality assertion | Text entry completed; actual echo differs from the test's expected string |

The first directs investigation to locator or screen readiness. The second directs it to the expectation or app behavior. Screenshot alone cannot tell you whether an accessibility ID exists; compare the page hierarchy or Inspector attributes. Restore only the injected changes, then rerun.

## 10-B · Competing explanations

| Hypothesis | Observation that discriminates |
|---|---|
| Result update happens after the first read | Input already correct; a bounded read-only wait sees result catch up |
| Text never reached the input | Both field and result remain empty; inspect keyboard and interaction logs |
| Test acted on stale/wrong screen state | Root screen or context differs; screenshot/source shows another screen or blocking dialog |

If evidence supports delayed echo, wait for the echo with a named timeout. Do not extend the entire suite's timeout to minutes. If evidence shows the wrong screen, fix navigation. If the app never updates the result, a wait should fail and preserve the useful symptom.

Without a reproduction, this remains a hypothesis table. “Added a wait and one run passed” is weaker evidence than a controlled reproduction and repair.

## 10-C · Example investigation note

```text
Title: Injected expectation defect in Forms echo
Scope: Training mutation, not a product bug
Environment: Record actual Node / Android API / device / APK build
Command: npm run test:forms
Change: Expected echo changed to "unexpected" in the first Forms case
Expected by scenario: Result matches the entered training text
Observed: Entered text was echoed, assertion compared it with "unexpected"
Evidence: Actual timestamped PNG/XML filenames from this run
Hypothesis: Assertion data was wrong; interaction and app binding worked
Experiment: Restore the expected value only
Outcome: Record actual pass/fail result of the rerun
Final state: Mutation restored; typecheck and Forms file status recorded
```

Do not populate the environment or outcome with guesses. A dead Appium session can prevent screenshot and XML retrieval; retain terminal/server errors and record the missing evidence. A later pass is a new observation, not permission to erase an earlier failure.

[Next lesson](../lessons/11-gestures-and-contexts.md)
