# Real-world challenge path

This is a **separate practice track** alongside the 16 lessons. You take a work
ticket, make or investigate a change, run it and hand over evidence. Reading the
ticket is the beginning, not the deliverable. The tickets are fictional; your
observations and code should be real.

## Before your first ticket

Start with [the beginner route](../handbook/start-from-zero.md) if you cannot yet
find a file, run a command and explain a simple assertion. Complete that
preparation before CH-02. You do not need to finish the whole course first.

Use one ticket per session; take several sessions when needed. The suggested
order builds difficulty, but prerequisites matter more than the number.
The Site is a reader: execute code in your local checkout, not in a website box.
Keep existing learner work. Check `git status --short` before editing; never
reset a starter to match a screenshot. If you already solved a lab, use its
new regression or changed requirement to test understanding.

## Choose a route

| Stage | Assignment | Needs | Deliverable |
|---|---|---|---|
| 1 · Take your first ticket | [CH-01 · Inherit the project](01-project-takeover.md) | Node 24 | Reproducible baseline report |
| 1 | [CH-02 · Build safe test data](02-fixture-ticket.md) | Node | Helper + regression |
| 1 | [CH-03 · Clear a populated field](03-forms-clear.md) | Android | Independent UI test + failure proof |
| 1 | [CH-04 · Close a login coverage gap](04-login-validation.md) | Android | Two focused negative tests |
| 2 · Investigate before guessing | [CH-05 · The element disappeared](05-locator-incident.md) | Android | Diagnosis + controlled repair |
| 2 | [CH-06 · The result arrives late](06-waiting-incident.md) | Node | Bounded observation helper |
| 3 · Fix inherited defects | [CH-07 · Tests contaminate each other](07-fixture-contamination.md) | Node | Isolation fix + reproduction |
| 3 | [CH-08 · A retry creates two orders](08-uncertain-write.md) | Node | Safe uncertainty handling |
| 3 | [CH-09 · HTTP 200, wrong order](09-api-contract.md) | Node + loopback HTTP | Runtime contract checks |
| 4 · Deliver evidence | [CH-10 · Green CI hides missing tests](10-ci-evidence.md) | Node | Correct summary + release comment |
| 4 | [CH-11 · Move one smoke test to cloud](11-cloud-smoke.md) | BrowserStack App Automate | Real Android session evidence |
| 4 | [CH-12 · Hand over a release decision](12-release-handover.md) | Node + your previous evidence | Reviewable decision packet |

**No device yet?** Follow CH-01 → CH-02 → CH-06 → CH-07 → CH-09 →
CH-08 → CH-10. CH-08 requires lab 10's contract concepts, so this route
places CH-09 first. Draft CH-12 with device/cloud scope explicitly unexecuted.
Return to CH-03–05 and CH-11 when their prerequisites are available.
An unavailable service is a blocker to record, not permission to invent a pass.

## How to work a ticket

1. Read its requirement and write a prediction before running it.
2. Record the baseline or initial failure. Identify the exact file you own.
3. Make the smallest useful change. Keep reference solutions and existing tests.
4. Run the narrow check. Inspect the first meaningful failure, not only the exit code.
5. Add the required extra regression or controlled defect; predict its result.
6. Revert only your deliberate defect, rerun and explain what the result proves.
7. Save a short evidence note. Then decide whether its acceptance criteria are met.

Use the notes box under each challenge; it has its own completion mark.
On localhost these share the existing SQLite database with lesson progress.
On the Site they use this browser's storage. Export/import moves both kinds of
notes and marks; it does not move your test files, screenshots or logs.
See [local data and recovery](../handbook/local-data.md). Never put credentials,
personal customer data or secret-bearing logs in an evidence note.

## Evidence note template

Copy this into a challenge's notes, or a private local journal:

```text
Ticket / date / code revision:
Requirement in my own words:
Prediction:
Starting state and prerequisites:
Command / selected scope:
Observed result (pass, fail, blocked or not run):
Change made and why:
Regression or deliberate defect:
Evidence location (sanitized log, assertion, screenshot or session):
What this proves / what it does not prove:
Remaining uncertainty / next smallest action:
```

Do not paste the reference answer and call it an attempt. After you try, open the
hint/review section. If blocked, save the smallest reproduction and ask for one
hint. If a helper passes but you cannot explain its edge cases, return to the
linked lesson. Completion marks are self-reported; there is no automatic grade
for a whole ticket. Existing lab graders check their contracts only.

## Review your work

A reviewer should be able to reproduce the result from your note, see the
requirement in the assertion and understand why the controlled failure mattered.
A useful handover includes uncertainty. It does not promise production security,
all-device compatibility or employment experience from a training demo.

The [36 workplace cases](../handbook/workplace-scenarios.md),
[six incident shifts](../handbook/incident-shifts.md) and
[interview drills](../handbook/interview-drills.md) remain the larger practice
library. Use their variations after finishing the core assignment. Existing
lessons, 14 labs and reference solutions remain available.
