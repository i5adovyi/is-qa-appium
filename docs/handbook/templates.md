# Reusable working templates

Copy a template into your own `notes/` folder. Replace placeholders with observations. Do not fill missing evidence with guesses.

## Learning log

```text
Date / lesson:
Concept explained without notes:
Exercise attempted:
Command and actual result:
Mistake I made:
Evidence that changed my understanding:
What I can now do unaided:
Unanswered question:
Next smallest step:
```

## Test design card

```text
Scenario name:
User risk:
Requirement/oracle:
Initial screen and state:
Synthetic test data:
Action:
Observable expected result:
Cleanup/state left behind:
Could it pass without the action? Why/why not?
Test level: UI / lower-level if source available / manual exploration
Environment assumptions:
Permission / lifecycle / network assumptions:
```

## Failure investigation

```text
Title:
Training mutation or suspected product defect:
App build / device / Android version / Node version:
Commit or local change identity:
Smallest reproducing command:
Preconditions:
Steps:
Expected:
Actual:
First meaningful error:
Evidence filenames and run time:
Hypothesis:
Alternative explanation:
One discriminating experiment:
Observed experiment result:
Repair or next investigation:
Final verification:
Limitations:
```

## Exploratory charter

```text
Mission:
Timebox:
Area and resources:
Risks/questions:
Actions tried:
Actual observations:
Potential defects needing confirmation:
Questions for product/development:
Automation candidates and rationale:
Untested areas:
```

## Device/environment record

```text
Date:
Host OS / architecture:
Node / npm:
Appium / UiAutomator2:
Device or emulator / Android API:
App artifact and version:
Local or cloud:
Relevant capabilities (no credentials):
Permission baseline / restart policy:
Command:
Passed / failed / skipped:
Not run:
Evidence location:
```

## Capstone handover

```text
Purpose and scope:
Key risks:
What is implemented:
What is not covered:
Setup prerequisites:
Exact commands:
Where selectors, data, and specs live:
State/reset strategy:
Failure diagnostics:
Verified environment and results:
Known limitations:
Mobile risk status: permissions / interruption / offline / accessibility
Next improvement and why:
```

[Debugging](../lessons/10-debugging.md) · [Capstone](../lessons/15-capstone.md)
