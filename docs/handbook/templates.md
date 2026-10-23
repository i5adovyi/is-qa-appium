# Reusable working templates

Copy a template into the relevant reader notes or your private notebook. If you
use a `notes/` folder in the project, it is not automatically excluded from Git;
review what you share. Replace placeholders with observations. Do not fill
missing evidence with guesses.

## Session bookmark and partial handover

Use this when stopping, even if the exercise is unfinished. Keep design,
implementation and execution separate. A clear blocked handover is useful work;
it does not satisfy the missing execution criterion.

```text
Date / lesson or challenge / exercise ID:
Current page or section:
Attempt file and last saved change:
Prediction before the last run:
Last command and observed result (or no command run):
Evidence location:
Design: complete / in progress / not started
Implementation: complete / in progress / not started / not required
Required execution: passed / failed / blocked / not run
What I can explain unaided / where I needed a hint:
Pending prerequisite and who or what can resolve it:
Next smallest action, including file and command if relevant:
One question or changed input to revisit next session:
```

In a browser, wait for the save confirmation. Export notes before moving reader
addresses; save source changes separately. See [local data](local-data.md).

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

## Decision and evidence log

Use this during an incident shift. Keep your initial prediction so a later
correction is visible; changing your mind after evidence is useful work.

```text
Run / test / attempt / app build:
Observed facts and source timestamps:
Requirement source / revision / unresolved conflict:
Hypothesis A / what would disprove it:
Hypothesis B / what would disprove it:
Next smallest observation, owner and timebox:
Prediction before reveal or experiment:
New evidence:
What changed in my explanation:
Current status: passed / failed / blocked / not run / designed only
User impact and residual uncertainty:
Repair or containment, scope and rollback:
Next action / decision owner:
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

[Choose a study session](study-session.md) · [Debugging](../lessons/10-debugging.md) · [Capstone](../lessons/15-capstone.md)
