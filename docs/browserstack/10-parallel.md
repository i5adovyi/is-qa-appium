# BS-10 · Expand coverage without losing control

**Stage:** Work with a team · **Time:** 45–90 minutes

## Prerequisites

A trustworthy serial run and [BS-07 reporting](07-reporting.md). Planning is
offline. Real parallel execution additionally needs account capacity and
isolated app/backend data. The project baseline remains one device at a time.

## Step by step

1. Count work before changing a setting. Under the usual separate spec/device
   model, four files × three devices may create twelve sessions. `maxInstances: 1`
   serializes them; it does not reduce twelve to one. Test cases within each
   file are a different count. Grouping can change actual session scheduling.
2. Check permitted concurrency, currently active work and queues in your
   account. Other teammates/CI jobs share that budget. Consult the
   [plan API](https://www.browserstack.com/docs/app-automate/api-reference/appium/plan)
   and [parallel guide](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio/parallelize-tests)
   rather than memorizing a trial's limits.
3. Complete [offline worker-isolation lab 07](../../exercises/07-session-plan/README.md)
   using `npm run practice -- 07`. Allocate unique users/data and report paths
   before scheduling simultaneous workers. Its starter is intentionally unfinished.
4. For an optional live experiment, make a branch and edit the `devices` array
   in the existing cloud config to contain two exact pairs you verified. Keep
   the same spec, APK and build label. Start with `maxInstances: 1` and the
   explicit Login smoke selection; record both devices' results serially.
5. Only if the account permits it, change the cloud `maxInstances` to `2`,
   typecheck and repeat the identical selection with a fresh build label. Verify
   timestamps/worker IDs show what actually ran simultaneously. Do not expand
   to a third device in the same experiment.
6. Compare total duration, session counts, actual executed cases, failures and
   data isolation. Restore your experimental config when finished, preserving
   unrelated changes. Capacity planning is not permission to monopolize a team pool.

## Isolation that survives real work

Use identities such as `runId + workerId + scenarioId` for backend fixtures and
output paths. A different phone does not create a separate backend account.
Reset/cleanup must be owned by the creating job and idempotent; one worker
must not delete another's data. Persist state needed to clean up after failure.
Never assume relaunching the demo clears an external service.

Connection retries, Mocha test retries and rerunning a CI job are different
mechanisms. The baseline has zero Mocha retries. If testing a retry policy,
preserve first failures and account for extra sessions/time; do not mask a
shared-state defect by increasing retries.

## Exercises

### BS-10-A · Plan twelve sessions

**Task:** four spec files, three devices, account permits two simultaneous
sessions, another job currently occupies one. Propose a schedule and a resource
agreement, with assumptions about duration clearly stated.
**Acceptance:** distinguish twelve potential sessions, at most two account-wide
concurrent sessions, currently one free slot, and unknown queue behavior. Include
unique data/report paths and cleanup. Offline planning is sufficient.

<details><summary>Hint and review</summary>
Changing the runner limit cannot grant account capacity. Do not promise an exact
completion time from counts alone; startup, queueing and spec durations matter.
</details>

### BS-10-B · The shared cart race

**Task:** two workers use one synthetic backend account; one empties the cart
while the other checks its total. Both tests pass alone. Design a reproduction
and isolation repair. Use your own authorized backend only for execution.
**Acceptance:** explicit shared resource, deterministic conflicting actions,
worker ownership and cleanup plan; no claim the WDIO demo implements this cart.

<details><summary>Hint and review</summary>
Separate sessions isolate device state, not server state. Coordinate requests
or use controlled fixtures to reproduce the race; fixed sleeps hide causality.
</details>

## Checkpoint

Would increasing parallelism change only speed, or also test meaning and cost?

[Previous](09-ci.md) · [Path](README.md) · [Next: private backends](11-local-tunnel.md)
