# The offline practice lab

These fourteen TypeScript problems isolate skills you will use in mobile tests.
They use Node's test runner and Chai, not Appium. No device, internet service,
account or real credentials are involved. Lab 10 starts a temporary HTTP server
on your own computer. They are **not substitutes for device tests**.

## Your loop

For your first programming exercise, read the
[first lab coach](../docs/handbook/first-lab-coach.md) and its prerequisite
mini-exercises. It explains the three files, expected starter errors and how
to add a test without supplying your implementation.

1. Read the exercise's README and write down its input, output and edge cases.
2. Run `npm run practice -- 01` from the project root.
3. Read the failure. Labs 01–10 have unfinished starters; labs 11–14 have plausible
   faulty implementations that already pass some checks. Diagnose before editing.
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
| 07 | [Parallel worker planning](07-session-plan/README.md) | Immutable inputs, unique ports and data namespaces | [Lesson 12](../docs/lessons/12-browserstack.md) |
| 08 | [Fixture cleanup](08-fixture-cleanup/README.md) | Awaited setup/use/cleanup, preserving two failures | [Lesson 08](../docs/lessons/08-test-data.md) |
| 09 | [Run summary](09-run-summary/README.md) | Typed results, retry evidence and honest rates | [Lesson 13](../docs/lessons/13-ci-and-reports.md) |
| 10 | [API contract](10-api-contract/README.md) | HTTP status, unknown JSON, identity and business state | [Lesson 08](../docs/lessons/08-test-data.md) |
| 11 | [Repair fixture isolation](11-fixture-isolation/README.md) | Nested shared state and order-dependent failures | [Incident shift S2](../docs/handbook/incident-shifts.md) |
| 12 | [Repair uncertain submission](12-uncertain-submit/README.md) | Lost responses, duplicate writes and unknown outcomes | [Incident shift S3](../docs/handbook/incident-shifts.md) |
| 13 | [Repair stale observations](13-stale-observation/README.md) | Fresh element handles, bounded reads and narrow error recovery | [Lesson 09](../docs/lessons/09-waits-and-state.md) |
| 14 | [Repair bounded scrolling](14-bounded-scroll/README.md) | Logical identity, visibility, fresh snapshots and stop conditions | [Lesson 11](../docs/lessons/11-gestures-and-contexts.md) |

Labs 01–06 build foundations. Labs 07–10 extend them into workplace and interview
problems; labs 11–14 practise repairing inherited code. Read the prerequisites
first. They do not enable parallel cloud
sessions, delete real records or change the mobile runner's retry settings.
Labs 13–14 model mobile observation and list-search decisions with fakes; they
do not establish device compatibility. Continue with the
[small device practice route](../docs/handbook/device-practice.md) when ready.

## Commands

```bash
npm run practice                 # list exercises; does not grade anything
npm run practice -- 03           # run your solution to one exercise
npm run practice -- all          # run all learner implementations
npm run practice:solutions       # validate the supplied reference implementations
npm run typecheck:practice       # check TypeScript, including your edits
```

The reference run must pass out of the box. Each learner lab must initially fail
at least one check. In the repair labs, a few green checks are part of the lesson:
happy-path success can coexist with a serious bug.

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
