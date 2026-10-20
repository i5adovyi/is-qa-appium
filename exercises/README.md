# The offline practice lab

These six small TypeScript problems isolate skills you will use in mobile tests.
They use Node's test runner and Chai, not Appium. No device, network, account or
real credentials are involved. They are **not substitutes for device tests**.

## Your loop

1. Read the exercise's README and write down its input, output and edge cases.
2. Run `npm run practice -- 01` from the project root.
3. Read the failure. The starter intentionally throws an error: this is your work to do.
4. Edit only that exercise's `starter.ts`. Keep its exported name and types.
5. Rerun. Implement the smallest correct behaviour that satisfies the written contract.
6. Add one extra case to `exercise.test.ts` that you think is missing.
7. Explain the implementation aloud before consulting `solution.ts`.

Do not change the assertions simply to get green. If you disagree with a requirement,
write down your reasoning and change the contract and tests together as a separate exercise.

| Lab | Read first | Practises | Course connection |
|---|---|---|---|
| 01 | [Typed data](01-typed-data/README.md) | Types, objects, string handling | [Lesson 02](../docs/lessons/02-typescript.md) |
| 02 | [Validation](02-validation/README.md) | Boundaries and independent errors | [Lesson 07](../docs/lessons/07-login.md) |
| 03 | [Async order](03-async-order/README.md) | Await, sequencing, error propagation | [Lesson 03](../docs/lessons/03-async-and-assertions.md) |
| 04 | [Selectors](04-selectors/README.md) | Decision logic and string escaping | [Lesson 05](../docs/lessons/05-selectors.md) |
| 05 | [Polling](05-polling/README.md) | Bounded retries and failure evidence | [Lesson 09](../docs/lessons/09-waits-and-state.md) |
| 06 | [Diagnosis](06-diagnosis/README.md) | Classifying symptoms without guessing | [Lesson 10](../docs/lessons/10-debugging.md) |

## Commands

```bash
npm run practice                 # list exercises; does not grade anything
npm run practice -- 03           # run your solution to one exercise
npm run practice -- all          # run all learner implementations
npm run practice:solutions       # validate the supplied reference implementations
npm run typecheck:practice       # check TypeScript, including your edits
```

The reference run must pass out of the box. The learner run must initially fail:
otherwise it would not tell you what still needs implementing.

## How to judge your work

- **Correctness:** meets every explicit requirement, including boundaries.
- **Understanding:** you can predict the return value before running the code.
- **Test quality:** your extra case would catch a plausible incorrect implementation.
- **Clarity:** descriptive names and direct control flow; no clever tricks required.
- **Transfer:** explain where the same idea appears in a real Appium test.

Node 24 executes the erasable TypeScript syntax used here directly. The mobile suite
still runs through WebdriverIO. Avoid TypeScript features requiring transformation
(such as enums) in these offline labs.

[Back to the course](../docs/README.md)
