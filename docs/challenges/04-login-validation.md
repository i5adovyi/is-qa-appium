# CH-04 · Both-invalid tests miss one-field validation

**Ticket:** “Our suite checks success, invalid inputs and both fields empty.
What if only one field is missing?” You own the missing coverage, not a rewrite
of working reference tests.

## Prerequisites

Android prerequisites from CH-03 and [login lesson](../lessons/07-login.md).
Read [LoginScreen](../../test/screens/LoginScreen.ts) and
[existing specs](../../test/specs/app.login.spec.ts). Allow 45–90 minutes.

## Assignment

Create `test/specs/challenge.login.spec.ts` alongside the references.
Reuse their imports, independent setup and submit helper. Write two cases:

| Case | Email | Password | Expected validation |
|---|---|---|---|
| A | empty | `Practice123!` | Email error visible; password error absent |
| B | `learner@example.com` | empty | Password error visible; email error absent |

1. Run the reference login scope once to establish what currently works.
2. Reproduce both cases manually on the same demo build. If the observed rule
   differs, capture the mismatch and investigate before encoding an assumption.
3. For each automated case, start clean and explicitly arrange the inputs.
   Wait for the expected error and assert its exact text. Check the irrelevant
   error is absent after that validation result has arrived.
4. Run your two cases:

```bash
npm run test:login
npm run test:android -- --spec test/specs/challenge.login.spec.ts
```

5. Temporarily swap one expected message with the other. Observe a failure,
   restore it and rerun. Run the cases separately using `--mochaOpts.grep`
   with a unique phrase from your case title.

## Acceptance criteria

Both cases pass independently and identify their own assertion on failure.
Use the messages defined in LoginScreen: “Please enter a valid email address”
and “Please enter at least 8 characters”. No result depends on errors left by
another test. Preserve the supplied both-empty scenario.

## Evidence and review

Record the two input partitions, actual messages and deliberate failure.
Explain what a negative case proves besides “the success dialog did not open”.

<details><summary>Hint / reviewer questions — after your attempt</summary>

Android empty EditText fields can expose hint text through getText. Inspect the
existing empty-field selectors and clearing helper before assuming hint text is
a typed value. Wait for the positive signal of validation before checking that
the other error is absent.

</details>

**Limit:** this demo simulates login. These tests do not validate real accounts,
tokens, server authentication or password security.
Next: [CH-05](05-locator-incident.md).
