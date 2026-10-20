# Lab 02 — Boundaries, not just happy paths

**Estimated effort:** 25–40 minutes. **Prerequisite:** booleans, conditionals, string length.

Implement `validateInput(email, password)` in [starter.ts](starter.ts).
This is an intentionally simplified **exercise specification**, not a copy of the
demo app's production code or a complete internet email validator.

## Contract

Return `{ emailError, passwordError }`, each a message or `null`.

- Email has nonempty parts before `@`, between `@` and `.`, and after `.`.
  No whitespace or extra `@` is permitted in those parts.
- Password is valid when JavaScript `password.length >= 8`. Do not trim it.
- Invalid email message: `Please enter a valid email address`.
- Invalid password message: `Please enter at least 8 characters`.
- Evaluate both fields; a valid password does not make a bad email valid.

For this exercise use `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` as the email rule.
The learning goal is translating requirements into independent results, not writing a regex.

## Work

1. Build a table for password lengths 0, 7, 8, and 9 with expected results.
2. Run `npm run practice -- 02`, implement the function, and rerun.
3. Add a case containing a valid email and empty password.
4. Explain why these offline unit tests cannot prove that the Android app displays its errors.

<details><summary>Hint 1</summary>

A ternary expression returns one value when a condition is true and another when false.
Use `null` for success, not the text `"null"`.

</details>
<details><summary>Hint 2</summary>

Do not return immediately after the first invalid field; calculate both properties.

</details>

**Done when:** all tests pass and you can explain why length 8 is more revealing than
only checking a long valid password.

**Reference:** [solution.ts](solution.ts). The two rules are evaluated independently.
In real UI tests, do not reuse an app's validator as the sole oracle: the test could
copy the same bug. Derive expected results from the requirement.

[All labs](../README.md)
