# CH-02 · A helper silently changes passwords

**Ticket:** “Make a small factory for test credentials. Ignore accidental spaces
around email addresses, but do not alter passwords.” A reviewer proposes applying
the same cleanup to every field because it looks simpler.

## Prerequisites

Node only; functions, strings and objects from
[programming first steps](../handbook/programming-first-steps.md).
Use [the first lab coach](../handbook/first-lab-coach.md) if this is your first edit.
Allow 30–60 minutes.

## Assignment

Own [lab 01 starter](../../exercises/01-typed-data/starter.ts) and an additional
test in [its grading file](../../exercises/01-typed-data/exercise.test.ts).
Preserve existing assertions and any previous attempt. Read the complete
[contract](../../exercises/01-typed-data/README.md).

Before editing, write expected values for these inputs:

These are JavaScript string literals; \t represents a tab and \n a newline.
Spaces inside quotes are part of the input. Predict all three calls without
running them first:

```typescript
makeCredentials('  A@example.com ', ' secret ')
makeCredentials('\t\n ', '')
makeCredentials('Learner@example.com\n', '  ')
```

Run, implement and rerun:

```bash
npm run practice -- 01
npm run typecheck:practice
```

Add a case that combines a whitespace-only email with a password consisting of
two spaces. Assert exact values, not merely “an object exists”. Call the factory
twice and explain why one returned object should not be reused for both tests.

Then deliberately trim the password in your own implementation. Predict the
failing assertion, run the grader, capture the failure, and restore only that
deliberate change.

## Acceptance criteria

The helper meets the original contract; your added case passes and detects the
deliberate password mutation. The original tests remain intact. You explain why
a UI test of email whitespace might need raw input instead of this factory.

## Evidence and review

Record the first failure, final command, added case and mutation result.
Passing references is not evidence that you implemented the starter.

<details><summary>Hint / reviewer questions — after your attempt</summary>

Email normalization and password fidelity are different requirements. An object
literal creates a new top-level object. Compare exact strings with Chai, including
spaces. Use the separate lab solution only after trying; explain every operation
you borrow.

</details>

**Change request:** passwords may contain leading newlines. Does the helper need
new behavior, or does its current contract already cover this? Add a boundary
case to support your answer. Next: [CH-03](03-forms-clear.md).
