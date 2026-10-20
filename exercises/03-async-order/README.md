# Lab 03 — The missing await

**Estimated effort:** 20–35 minutes. **Prerequisite:** functions and promises.

Implement `runLogin(steps)` in [starter.ts](starter.ts). Three asynchronous functions
are supplied: `open`, `fill`, and `submit`. These are test doubles, not real device commands.

## Contract

Call each function exactly once, in that order, waiting for each to finish before
starting the next. If one rejects, propagate the same error object and do not run
the remaining functions. Resolve only when submission finishes.

## Work

1. Write the required event order: `open:start`, `open:end`, then what?
2. Run `npm run practice -- 03` and implement the function.
3. Temporarily remove the middle `await`. Predict the failure before rerunning.
4. Restore it and add a test where `submit` rejects.

<details><summary>Hint 1</summary>

An `async` function by itself does not automatically wait for every promise it creates.

</details>
<details><summary>Hint 2</summary>

`Promise.all` starts independent work together. These steps depend on each other,
so use three sequential `await` expressions.

</details>

**Done when:** the event trace is ordered, failures stop later actions, and you can
explain why catching an error and returning normally would falsely report success.

**Reference:** [solution.ts](solution.ts). Three awaited calls are sufficient. There
is no need for a `try/catch` unless you intend to add context and rethrow.
Transfer this pattern to `LoginScreen.login()` in the mobile project.

[All labs](../README.md)
