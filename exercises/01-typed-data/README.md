# Lab 01 — Typed data without hidden changes

**Estimated effort:** 15–25 minutes. **Prerequisite:** variables, objects and functions.

You are building a small fixture factory for test users. Implement
`makeCredentials(email: string, password: string): Credentials` in [starter.ts](starter.ts).

## Contract

- Return a new object containing exactly `email` and `password`.
- Remove surrounding whitespace from the email, preserving its case.
- Preserve the password exactly, including leading and trailing spaces.
- Keep empty strings empty. Do not replace them with a default login.
- Each call creates an independent object.

Example: `makeCredentials('  A@example.com ', ' secret ')` returns
`{ email: 'A@example.com', password: ' secret ' }`.

## Work

1. Predict the result for an email containing a trailing newline.
2. Run `npm run practice -- 01`; read the first failure.
3. Implement the function, rerun, then add a whitespace-only email case.
4. Explain why trimming a password changes the test input.

<details><summary>Hint 1</summary>

A typed object can be returned directly. You do not need a class or global variable.

</details>
<details><summary>Hint 2</summary>

`email.trim()` returns a new string. Call it only on the field the contract says to normalise.

</details>

**Done when:** all tests pass, your added case passes, and you can distinguish sanitising
fixture data from testing the app's own sanitisation. For negative UI tests, sometimes
you must preserve whitespace intentionally rather than using this factory.

**Reference:** [solution.ts](solution.ts). It returns an object literal and trims only email.
The important design decision is what it does *not* change.

[All labs](../README.md)
