# Lab 06 — Classify symptoms honestly

**Estimated effort:** 20–35 minutes. **Prerequisite:** strings, conditions, union types.

Implement `classifyFailure(message)` in [starter.ts](starter.ts).
This is a small routing exercise, **not a root-cause detector**.

## Contract

Match case-insensitively using this precedence:

| Evidence anywhere in message | Return |
|---|---|
| `device offline` or `no devices` | `device` |
| `ECONNREFUSED` | `connection` |
| `still not displayed` or `no such element` | `locator-or-state` |
| `AssertionError` | `assertion` |
| None of the above | `unknown` |

The order matters for wrapped errors. Return `unknown` for an empty message.

## Work

1. Run `npm run practice -- 06`.
2. Implement the exact contract, including precedence.
3. Add a case where a connection message contains `AssertionError`.
4. For each category, write the **next evidence you would collect**. For example,
   locator-or-state needs the current screenshot and UI hierarchy, not an immediate timeout increase.

<details><summary>Hint 1</summary>

Normalise the message once with `toLowerCase()`.

</details>
<details><summary>Hint 2</summary>

The name `locator-or-state` is intentional: a missing element might mean the app is
on the wrong screen, the locator is wrong, or the expected state never appeared.

</details>

**Done when:** every category passes and you can state both what the log proves and
what it leaves uncertain.

**Reference:** [solution.ts](solution.ts). Simple early returns show the precedence.
A production triage tool would require richer structured evidence and human review.

[All labs](../README.md)
