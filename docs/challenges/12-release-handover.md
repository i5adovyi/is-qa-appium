# CH-12 · Give the next engineer a defensible decision

**Ticket:** “You are handing over the mobile checks before a release window.
We need a decision and enough evidence for another person to continue.”
A pile of screenshots with no scope or revision is not a handover.

## Prerequisites

CH-01 baseline and at least three attempted coding/investigation tickets.
Use [test design](../lessons/14-test-design.md) and the
[capstone rubric](../handbook/capstone-rubric.md). Node-only work is enough for a
scoped handover; it is not enough to claim a mobile release was validated.
Allow 60–90 minutes.

## Assignment

Create a private draft using your challenge notes and local code changes.
This is a training release decision, not permission to deploy a product.

1. Identify the code revision, app build if tested, environments and actual
   selected scope. Separate newly added checks from existing reference coverage.
2. Build a table: risk → assertion/check → observed evidence → limitation.
   Include at least one meaningful controlled failure and its restored result.
3. Report passed, failed, blocked and not-run work separately. List flaky
   first attempts even if a retry passed. Do not reuse the synthetic CH-10
   packet as if it came from your device.
4. Recommend go, no-go or a precisely bounded scope. Name who must accept any
   residual product risk; do not invent their approval.
5. Write exact reproduction commands for one positive result and one defect.
6. Give the next engineer one small task, its prerequisite and acceptance
   criterion. Review your patch for secrets and accidental learner-data changes.

Run appropriate checks for your changed files. For helper changes use their lab
grader and `npm run typecheck:practice`; for a UI spec use its device command.
Use `npm run check` as an additional framework check, not a substitute for
executing your own UI test. Record commands you could not run.

## Acceptance criteria

A reader can reproduce at least one result without your verbal help, understands
which claims are supported, sees a real limitation and can find the next task.
A scoped “insufficient evidence for a mobile release” decision may be the
correct completed handover. It does not complete blocked CH-03–05 or CH-11.

## Evidence and review

Save the packet in this challenge's notes, with sanitized artifact locations.
Keep actual code and artifacts backed up separately. Never mark other challenges
complete just to make a dashboard full.

<details><summary>Review checklist — after drafting</summary>

Can the reviewer find the exact code and app version? Does an assertion test the
requirement? Does a deliberate defect really fail? Are synthetic, local helper
and real-device evidence distinguished? Are skipped checks named? Is there an
owner and next action for unresolved work?

</details>

**Interview rehearsal:** in three minutes, explain one defect, your competing
hypotheses, the observation that changed your mind, the repair and its limits.
Describe it honestly as a training project, not employment history.

**Next practice:** take one [incident shift](../handbook/incident-shifts.md),
remove the suggested hint from your first attempt, and produce a fresh packet.
Return to the [challenge path](README.md).
