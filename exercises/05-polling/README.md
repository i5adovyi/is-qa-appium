# Lab 05 — Wait for a condition

**Estimated effort:** 30–45 minutes. **Prerequisite:** loops, async functions, throwing errors.

Implement `waitForValue(read, expected, attempts)` in [starter.ts](starter.ts).
This deterministic teaching model has **no real time delay**. In mobile tests use
the framework's timed wait helpers; do not copy this tight loop into a device test.

## Contract

- `attempts` must be a positive integer; otherwise reject with
  `attempts must be a positive integer` before reading anything.
- Await at most that many calls to `read()`.
- Return the matching string as soon as it equals `expected`.
- If the final observation still differs, throw an error containing expected and last actual values.
- If `read()` rejects, propagate its error without retrying or swallowing it.

## Work

1. Predict the result of `['loading', 'loading', 'ready']` with a limit of 3 and then 2.
2. Run `npm run practice -- 05` and implement the function.
3. Add a test proving that an empty string is a valid expected value.
4. Explain the difference between retrying an observation and retrying a purchase button click.

<details><summary>Hint 1</summary>

Use a counter starting at zero with `counter < attempts`, not `<=`.

</details>
<details><summary>Hint 2</summary>

Compare with `===`. A truthiness check would mishandle the empty-string scenario.

</details>

**Done when:** you can explain why the function stops, why errors remain visible,
and what diagnostic information its timeout message contains.

**Reference:** [solution.ts](solution.ts). It returns early on success, preserves the
last observation, and rejects invalid limits. Mobile waiting additionally needs elapsed
time, an interval and a policy for transient failures; see the project's `waitForText` helper.

[All labs](../README.md)
