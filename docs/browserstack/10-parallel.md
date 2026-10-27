# BS-10 · Expand coverage without losing control

**Stage:** Work with a team · **Time:** 45–90 minutes

## Prerequisites

A trustworthy serial run and [BS-07 reporting](07-reporting.md). Planning is
offline. Real parallel execution additionally needs account capacity and
isolated app/backend data. The project baseline remains one device at a time.

For a first study pass, finish BS-10-A and BS-10-B on paper without changing the
runner. The live experiment is optional: continue only after you can select
one known-good case, identify your account's available capacity and retain
separate reports for each attempt.

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
4. For an optional live experiment, use the
   [branch preparation and return steps](07-reporting.md#prepare-and-return-from-an-optional-experiment).
   Edit the `devices` array in **`config/wdio.browserstack.conf.ts`** to contain
   two exact Android device/OS pairs you verified in your account. The `.env`
   fields currently supply one pair. When adding a second array entry, give it
   its own verified `deviceName` and `platformVersion` strings; duplicating the
   same environment-variable reads would select the same pair twice.
   Keep the same spec and APK. Start with `maxInstances: 1`, save and run
   `npm run typecheck`. Stop if that fails. Then use the explicit Login smoke
   selection below and record both devices' results serially.
5. Only if the account permits it, change `maxInstances` in that same config to
   `2`, typecheck and repeat the identical selection with a fresh build label.
   Stop if the typecheck fails. Verify
   timestamps/worker IDs show what actually ran simultaneously. Do not expand
   to a third device in the same experiment.
6. Compare total duration, session counts, actual executed cases, failures and
   data isolation. Restore your experimental config when finished, preserving
   unrelated changes. Capacity planning is not permission to monopolize a team pool.

Use this selection once for each deliberate experiment:

```bash
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "@smoke"
```

With two devices, the unchanged baseline selection targets one case on each,
so expect two case executions and two device sessions, not one case total.
The launcher assigns one shared build label **within** an invocation and a
new label for the next invocation. If you set `BROWSERSTACK_BUILD_NAME` yourself,
change it between the serial and parallel attempts. A shared label within a run
helps correlation; reusing it across both experiments mixes their evidence.
Keep reporter output directories fresh too if you added BS-07's reporter lab.

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
