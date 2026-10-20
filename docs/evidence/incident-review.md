# Incident-practice review: execution evidence

**Date:** 20 October 2026. **Environment:** existing macOS checkout with Node 24.
Scope: course planning, new fictional incidents, two offline repair labs and
search registration. No mobile runtime behavior was changed.

## Successful checks

```text
npm run check
  typecheck: passed
  typecheck:practice: passed
  course:check: 16 lessons, 48 exercise/solution pairs, 12 lab structures;
                100 indexed items; local Markdown links passed
  practice:solutions: 72 passed, 0 failed
  framework:test: 27 passed, 0 failed

npm run course:test
  17 passed, 0 failed
```

The first practice typecheck exposed missing contextual callback types in the
new lab 12 tests. The conditional module import was given the starter module's
type, then the full check above passed. No typecheck was disabled.

## Learner feedback and defect detection

| Check | Observed result |
|---|---|
| Unedited lab 11 starter | Exit 1; coupon state contaminates the later fixture; some independent checks pass |
| Unedited lab 12 starter | Exit 1; a lost response leads to a duplicate write; ordinary success still passes |
| Lab 11 reference copied incorrectly to clone arrays but share item objects | Disposable copy failed nested-mutation checks |
| Lab 12 reference changed to confirm an unchecked receipt | Disposable copy failed reconciliation identity checks |

Both original starter files remain deliberately faulty. Fault-copy experiments
used temporary directories, preserved originals and removed the copies afterward.
These checks demonstrate selected failure detection, not complete mutation coverage.

## Content and navigation checks

- All 36 workplace cases, 48 questions, 10 drills and 6 shifts have unique,
  sequential IDs in their collections.
- Server tests verify that each indexed link targets an actual rendered heading.
  Search finds text inside incident reveals and respects the new category.
- New reveal and answer tags are balanced.
- Node calculations verified the supplied spring-transition interval is 23 hours;
  `Intl.DateTimeFormat` with Europe/Warsaw confirms both instants are midnight.
- The supplied text examples have JavaScript string lengths 1, 2 and 5.
- The original 16 lesson IDs and progress schema are unchanged.

The reader has automated server/search checks. No new visual browser or device
verification is claimed. A synthetic ledger, hypothetical release decision or
designed cleanup plan is not production execution evidence.

[Coverage review](../coverage-review.md) · [Validation](../validation.md)
