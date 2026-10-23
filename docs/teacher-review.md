# Teacher review: a comfortable route to mobile automation work

**Review date: 23 October 2026.** Scope: learning design, daily study experience,
offline practice, mobile-work preparation and interview readiness. This is an
expert walkthrough of the repository and local reader, not a novice-user study
or an assessment of the learner's proficiency.

## Teaching judgment

The foundation is strong: practical lessons, separate unfinished starters and
reference answers, deliberate failures, incident reveals, portable notes and an
honest distinction between simulated login and real authentication. The main
weakness is finding a manageable next task among several overlapping routes.
The material is more complete than its day-to-day study experience suggests.

Keep the existing course and its evidence-based teaching loop. Improve the
entry points and feedback, and add practice where mobile-specific ideas are
currently mostly written investigations. More topic lists alone would increase
the learner's workload without establishing skill.

## Improvement list and acceptance criteria

This is the complete implementation scope selected after the review. Items are
grouped so each has an observable result; no account or device access is assumed.

| ID | Priority | Finding and repository evidence | Improvement / acceptance criterion |
|---|---|---|---|
| T01 | High | `docs/README.md` offers beginner, lesson and challenge routes; `study-plans.md` mainly budgets 55–120-minute sessions | One session-routing guide with 20/45/90-minute choices, exact existing tasks, return-after-a-break advice and next-day/one-week recall. Link it prominently from the reader and course map. |
| T02 | High | Basic test reasoning exists, but the glossary and early lessons provide little shared language for layers, purposes and test doubles before lesson 14 | Add a compact team-testing foundation guide with three exercises and hidden review guidance; connect scope, oracle, risk and team communication to the demo's limits. |
| T03 | Medium | The journal's completion gate allows a prerequisite blocker alongside completed work | Clarify that a design can be complete while its execution gate remains pending; provide a reusable partial/blocked handover. |
| T04 | High | `course/app.js` labels the first unchecked lesson “Continue”, ignoring the guide/challenge actually being read | Save a separate browser reading bookmark; resume the last valid page/section and label the first unchecked lesson honestly. Do not infer completion or change progress protocols. |
| T05 | High | Long guides and workbooks have no generated contents menu; notes sit below the whole lesson | Add accessible “On this page” section links and a direct jump to evidence notes where available. Preserve deep links and heading focus. |
| T06 | High | `course/style.css` hides lesson navigation under 800px; route focus is inconsistent | Make course navigation available on small screens and ensure dashboard/challenge/article transitions have useful keyboard focus. |
| T07 | Medium | Prose drops from 15px to 14px on small screens, with fixed 12px code | Provide Standard/Larger reading text saved separately from progress, usable line lengths and proportional code; check light/dark and narrow layouts. |
| T08 | High | Lab 04 assumes stable selectors, lab 05 polls plain values; stale references and recycled lists remain mostly discussion in Q06/RW-13/lesson 11 | Add two Node-only repair labs: fresh-element observation and bounded scrolling with logical identity. Include separate faulty starters, references, discriminating tests, hints and mobile transfer limits. |
| T09 | Medium | Device investigations need substantial scaffolding; RW-12 asks for artifact privacy review without a supplied packet | Add a small device-practice route for keyboard/back, background/return and inspected scrolling, plus a fictional log/XML privacy exercise. Each task states prerequisites, acceptance, defect experiment, restoration and execution limits. |
| T10 | Medium | `docs/resources.md` has a useful reading shelf but no video route or small mixed-media study selection | Add a short verified video/course shelf and a topic-to-resource-to-exercise map. Identify language/version mismatch, free/optional paid access, and a concrete output after viewing/reading. Keep original books with their publishers. |

## Implementation and verification plan

Three subagents implement reader comfort, pedagogy, and mobile practice in
separate file areas. The coordinating agent updates the resource shelf, integrates
navigation/counts, reviews the combined changes and records observed checks.
Existing learner starters, personal databases, credentials and stored drafts are
preserved. New labs add practice; they do not add lesson/challenge completion IDs.

Run `npm run check`, `npm run course:test` and `npm run course:build` after
integration. Confirm the new faulty starters fail for their intended reasons and
their supplied answers pass. Exercise the local and static reader using disposable
progress, including resume, section links, text preference and small-screen menu.

## Boundaries that remain part of the course

Android experiments require the learner's selected device and observations.
BrowserStack needs account access and a real session; iOS, authentic backend
flows and platform-specific extensions require suitable apps/environments.
Offline simulations do not establish those outcomes. Existing scenarios already
cover these topics as investigations, so this review does not duplicate them or
invent passing mobile evidence. Publishing a hosted reader is a separate action.

## Implemented results

All ten selected improvements are implemented on `codex/teacher-study-comfort`.
Three subagents worked in separate areas, followed by integration review and
focused local/static browser checks. A second teaching review aligned the F1
resource deliverable with its actual task and added direct links into long
practice documents.

| Items | Delivered result |
|---|---|
| T01 | [Session guide](handbook/study-session.md), shorter study plans, recall loop and prominent reader entry |
| T02 | [Testing foundations](handbook/testing-foundations.md), three exercises with hidden reviews, glossary/orientation links |
| T03 | Explicit pending-execution gates and [session bookmark](handbook/templates.md#session-bookmark-and-partial-handover) |
| T04–T07 | Reading bookmark, section/evidence navigation, keyboard-accessible small-screen menu, Standard/Larger text and preference tests |
| T08 | [Lab 13](../exercises/13-stale-observation/README.md) and [lab 14](../exercises/14-bounded-scroll/README.md): 21 additional reference checks with separate faulty starters |
| T09 | [Device practice](handbook/device-practice.md): three Android investigations plus one fictional artifact-review exercise |
| T10 | [Learning library](resources.md): three video/course entry points, seven task pairings and existing optional books/articles |

Observed checks: `npm run check` passed both type checks, documentation checks,
93 reference lab cases and 27 framework checks. `npm run course:test` passed
79 checks; `npm run course:build` exported 201 readable files. New starters fail
their intended causal cases, and three deliberately incomplete repairs were
rejected in disposable copies. Existing learner starters were preserved.

Browser checks used disposable progress on separate localhost ports. They
confirmed mobile-menu keyboard navigation, section/evidence jumps, larger text,
resume/preference persistence, synthetic progress import and static lab/hint
navigation. Integration review also fixed cache invalidation during imports and
same-section links that otherwise would not jump a second time.

The learner's next action is to choose one task in the session guide, make a
prediction and save an attempt. No lesson/challenge was completed on their
behalf. See [the validation record](validation.md) for scope and unexecuted work;
historical reviews retain their dates.

[Course map](README.md) · [Reading library](resources.md)
