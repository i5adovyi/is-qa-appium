# Workplace and interview extension evidence

**Date:** 20 October 2026. **Environment:** existing macOS checkout, Node 24.22.0.
This is a concise execution record, not a device test report. The first pass below
covered three new labs and catalog links; the second-pass record follows it.

## Successful checks

```text
npm run check
  typecheck: passed
  typecheck:practice: passed
  course:check: 16 lessons, 48 exercise/solution pairs, 9 lab structures;
                local Markdown links passed
  practice:solutions: 49 passed, 0 failed
  framework:test: 27 passed, 0 failed

npm run course:test
  11 passed, 0 failed
```

The reader server check fetches every catalog lesson, matching solution and
workbench page and checks successful HTML responses. It includes all four new
workbench entries. That does not establish visual layout in a browser.

The new TypeScript test callbacks initially lacked three explicit parameter types.
Those were corrected before the successful complete check above.

## Learner feedback checks

Each command below exited 1 with the corresponding `Exercise NN: implement ...`
message, as required for an unfinished starter:

```bash
npm run practice -- 07
npm run practice -- 08
npm run practice -- 09
```

No starter was replaced with its reference implementation.

## Deliberate fault checks

Each faulty implementation was made in a disposable copy, executed with the lab's
existing tests, and removed afterward. The real reference files were unchanged.

| Lab | Injected mistake | Result |
|---|---|---|
| 07 | Every worker receives the same `systemPort` | Tests failed |
| 07 | Padded run IDs are accepted through normalization | Tests failed |
| 08 | Cleanup is omitted | Tests failed |
| 08 | A falsy rejection is treated as success | Tests failed |
| 09 | Zero execution is reported with a pass rate of 1 | Tests failed |
| 09 | A successful retry is counted as a first-attempt pass | Tests failed |

These demonstrate detection of selected mistakes, not every possible incorrect
learner implementation.

## Content checks

- Confirmed sequential document counts: 20 workplace cases, 40 question headings
  and 6 practical drill headings; expandable answer tags are balanced.
- Executed the SQL setup and first reference query from drill D3 in SQLite memory:
  `(1, 2, 2000), (2, 0, 0), (3, 0, 0)`.
- Added the documented `HAVING` clause and confirmed IDs 2 and 3 remain.
- Source links and employer examples are listed in the [coverage review](../coverage-review.md).
- `git diff --check` passed.

No emulator, cloud, iOS, API-backend or hardware scenarios were executed during
this pass. Existing device evidence is retained in the [validation record](../validation.md).

## Second-pass evidence

The follow-up added lab 10, eight workplace cases, eight interview questions,
four drills, searchable practice cards and the account-change handover guide.
Commands were run on the same macOS/Node 24 environment.

```text
npm run check
  typecheck: passed
  typecheck:practice: passed
  course:check: 16 lessons, 48 exercise/solution pairs, 10 lab structures;
                86 indexed items with unique sequential IDs; local links passed
  practice:solutions: 58 passed, 0 failed
  framework:test: 27 passed, 0 failed

npm run course:test
  16 passed, 0 failed
```

The reader tests fetch the catalog and every library page, check all 86 indexed
heading targets, and exercise search terms, category filters and section boundaries.
Code blocks containing heading-shaped text do not create false navigation items.
Progress import/export format remains compatible. These are unit/server checks;
no visual browser check of the new cards was performed.

Lab 10's test suite starts and closes a loopback HTTP server for real `fetch`
responses. It verifies a successful order, a 403 response and malformed JSON;
injected callbacks cover additional status, schema and identity cases. This is
not a live company API or BrowserStack run.

`npm run practice -- 10` exited 1 with `Exercise 10: implement loadOrder`, as
expected. Two faults in disposable reference copies were caught:

| Injected mistake | Result |
|---|---|
| Accepting an order whose ID differs from the request | Contract tests failed |
| Accepting integers beyond JavaScript's safe range | Contract tests failed |

The real starter and reference remained intact. The D9 coupon/delivery examples
were independently calculated as 1500, 2460 and 3240 cents. All three workbooks'
expandable answer blocks were checked for balanced tags.

GitHub metadata was checked through the existing Git credential: the target
repository was private, default branch `main`, with push permission. Secrets,
runtime data and personal progress exports are excluded from Git. The repository
does not contain browser-stored progress or a copy of the original conversation.
