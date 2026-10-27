# BS-13 · Deliver a small cloud automation project

**Stage:** Own the result · **Time:** three to five focused sessions

## Prerequisites

BS-00–09 and a personal practice spec. Design can be completed offline; execution
completion requires an actual authorized App Automate account/session. Parallel,
tunnel and optional reporter extensions are stretch work, not prerequisites.

## Step by step

1. Take this fictional ticket: “Before our demo release, prove one important
   Forms behavior and explain whether login smoke is healthy on one real Android
   device. Make the result repeatable from CI.” Define a narrow scope and risks.
2. Write a small plan: expected cases, device/OS, fixture/app, data, source revision,
   session budget and stopping rules. Predict which commands run which files.
3. Implement an independent Forms populated-to-empty case or missing-field
   Login case in a learner-owned spec. Explain why both setup and assertion
   are meaningful; run typecheck without modifying reference solutions.
4. Execute only your scope, then a controlled defect in your own expectation.
   Retain failure evidence, repair it and justify the next run. Mark missing
   account access blocked rather than inventing results.
5. Produce the baseline report from BS-07. Include planned versus actual counts,
   first failure, rerun, device/session metadata and omitted coverage. A report
   does not need a fancy dashboard to be useful.
6. Dispatch one deliberate CI run if authorized, using the matching pushed
   revision. Compare local-runner and CI configuration. Your custom spec needs
   a reviewed explicit workflow selection or the consciously broader all-specs
   option; the default login-smoke selection will not discover it.
7. Package redacted evidence and source changes for review. Keep private links,
   keys and personal data out of a public portfolio. Explain which evidence is
   real and which scenario is a controlled training fault.

## Acceptance rubric

| Dimension | Ready to review when… |
| --- | --- |
| Scope | Important behavior, explicit exclusions, exact expected case count |
| Test design | Observes app behavior; isolated setup; bounded waits; useful negative proof |
| Execution | Exact command/app/device/source; at least one actual intended cloud case |
| Diagnosis | First meaningful failure preserved and repair justified by evidence |
| Reporting | Case/session/retry counts reconciled; missing coverage visible |
| CI | Actual run/commit reviewed, or clearly blocked with next prerequisite |
| Ownership | No secret committed; personal evidence stored/backed up deliberately |
| Explanation | Can describe what the passing test still does not establish |

This rubric is self/reviewer assessment, not a certification or automatic score.
You may have a strong design review while cloud execution remains blocked.

## Exercises

### BS-13-A · Build the evidence packet

**Task:** complete steps 1–7 and write a short README inside your personal
capstone folder, linking the plan, test diff, run record, defect experiment,
report and CI record.
**Acceptance:** each rubric row has evidence or a precise blocker. No polished
report can substitute for a missing real session; label it a partial portfolio.

<details><summary>Hint and review</summary>
One deeply explained case is more useful than ten unexplained copied specs.
Record uncommitted changes during experiments and the final reviewed revision.
</details>

### BS-13-B · The release meeting changes scope

**Task:** the fictional manager now asks “does this prove checkout works on iOS
and our private staging backend?” Answer with evidence, limits, added prerequisites
and a prioritized next experiment.
**Acceptance:** no extrapolation from Android demo login to iOS/security/checkout;
concrete extra app/build/device/backend requirements and a feasible next step.

<details><summary>Hint and review</summary>
Say what you actually observed first. iOS and real backend behavior require
different artifacts and environments. A synthetic demo success alert cannot
establish either requirement.
</details>

## Checkpoint

Can a reviewer reproduce your selection and follow the evidence to your decision?

[Previous](12-maintenance.md) · [Path](README.md) · [Next: interview practice](14-interviews.md)
