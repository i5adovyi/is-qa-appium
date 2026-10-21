# Your first lab, with a coach beside you

**Prerequisites:** P1–P7 of [programming first steps](programming-first-steps.md)
or equivalent knowledge of functions, objects and assertions. Node 24 and
dependencies are installed. **Execution:** offline; no Android/cloud account.
This guide helps you attempt lab 01; it does not replace its starter with an answer.

## Know the three files

Open [lab 01](../../exercises/01-typed-data/README.md), then these files:

| File | Role | What you change |
|---|---|---|
| [starter.ts](../../exercises/01-typed-data/starter.ts) | Your implementation | The body of `makeCredentials`; keep its exported name/types |
| [exercise.test.ts](../../exercises/01-typed-data/exercise.test.ts) | The grader and examples of expectations | Read first; add a meaningful case after your implementation works |
| [solution.ts](../../exercises/01-typed-data/solution.ts) | A supplied reference | Consult deliberately after an attempt; it is not the file being graded normally |

The browser reader displays source but does not edit it. Open the file in your
local editor. Lab **01** and lesson **01** are different numbering systems;
this lab connects to the TypeScript lesson, **02**.

## C1 · Turn the contract into predictions

The signature `makeCredentials(email: string, password: string): Credentials`
means two input strings and an output object with `email` and `password`.
`export` lets the grader import the function. The `Credentials` type describes
shape, not automatic trimming or validation.

**Task:** read every contract bullet and predict output for these calls on paper:

| Email input | Password input | What to decide |
|---|---|---|
| `' A@example.com '` | `' secret '` | Which field loses surrounding spaces? |
| `'   '` | `''` | Are defaults permitted? |
| `'Learner@Example.com'` | `'00123'` | Should case or leading zeroes change? |

**Acceptance:** name both output properties, preserve the password exactly and
explain why this factory does not prove the app's own input handling.

<details><summary>Hint / review</summary>

Only the email is trimmed. Case is preserved. Whitespace-only email becomes
empty; defaults are not introduced. Use fictional values, never real credentials.
</details>

## C2 · Change the implementation, one idea at a time

Run from the root:

```bash
npm run practice -- 01
```

An untouched starter throws `Exercise 01: implement makeCredentials`. That
message means the runner found the exercise. It is not a broken Android setup.
If you have already worked on it, its result can differ: inspect your work first.

**Task:** replace the intentional throwing placeholder with your implementation.
Start by returning a new object with the two required fields, then apply the
email-only normalization required by the contract. Save and rerun after each
meaningful change. Use `npm run typecheck:practice` to check the exercise's types.

**Acceptance:** all selected lab checks pass; the implementation is in
`starter.ts`; the original assertions and exported API remain intact. Explain
both how you return the object and why each call creates an independent one.

<details><summary>Hint 1</summary>

Use `return` with an object literal. Printing an object is not returning it.
Do not place the return after the old `throw`: that code will never be reached.
</details>

<details><summary>Hint 2</summary>

`trim()` returns a new string. Call it on the email only. Create the result
inside the function rather than keeping a shared mutable object outside it.
Review P4–P5 if the syntax feels unfamiliar, then try again.
</details>

Green checks from `npm run practice:solutions` validate the supplied answers;
they do not grade your starter. `npm run typecheck` checks the mobile project's
types; `npm run typecheck:practice` checks these exercise types. `npm run check`
runs both plus reference checks, so it is also not proof your lab is finished.

## C3 · Add evidence and check recall

**Task:** add one extra `test(...)` block to `exercise.test.ts` for a
whitespace-only email and a password whose spaces must stay. Follow an existing
test's structure, choose a descriptive title and write the expected object from
the contract. Keep the existing tests. Rerun lab 01 and typecheck:practice.

**Acceptance:** your extra case passes and would fail if all fields were
trimmed. Explain `.deep.equal`, then close the reference and describe your
implementation without reading it. Return tomorrow with different inputs.

<details><summary>Hint / review</summary>

The test callback is the function passed after the title in `test('title',
() => { ... })`. The runner calls it. `expect` compares the returned object
with an independently written object. Password trimming should make your
new assertion fail. If unsure, ask for a review of just this test block.
</details>

Do not erase a working attempt for a recall exercise; use a separate practice
file or explain the algorithm on paper. Keep the original requirements intact.
Record the command, result, one mistake you understood and the next smallest step.

[Back to lab 01](../../exercises/01-typed-data/README.md) · [Lesson 02](../lessons/02-typescript.md) · [Beginner route](start-from-zero.md)
