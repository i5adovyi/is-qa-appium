# Lab 07 — Plan isolated parallel workers

**Time:** 30–45 minutes. **After:** lessons 08, 12 and 13. No devices are started.

Two workers share a port and a test account. Each test passes alone; together they
fail. Implement `planWorkers(runId, udids, firstPort)` in [starter.ts](starter.ts)
to make part of the isolation contract explicit.

## Contract

- `runId` must contain one or more ASCII letters, digits, underscores or hyphens.
  Otherwise throw `Error('Invalid run ID')`.
- Device IDs must be nonempty, unique, and have no surrounding whitespace.
  Reject violations with `Error('Invalid device IDs')`; do not trim, deduplicate,
  sort or change the caller's input.
- `firstPort` must be an integer from 1024 through 65535. Every assigned port must
  fit that range. Otherwise throw `Error('Invalid port range')`.
- Validate in the order above, even when the device list is empty.
- Return one object per device, in input order:
  `{ udid, systemPort: firstPort + index, namespace: runId + '-w' + index }`.
  With valid inputs and no devices, return `[]`.

## Work

1. Run `npm run practice -- 07`; implement the contract and rerun.
2. Add a test with three devices. Explain why mutating the input is a defect.
3. Explain which values belong in local UiAutomator2 capabilities and which belong
   in account/fixture names and artifact paths.
4. Propose a run ID including a CI run ID and rerun attempt. Explain why a fixed
   value like `training` can collide across simultaneous jobs.

<details><summary>Hint</summary>

Use a `Set` to detect duplicates. Validate the last assigned port before mapping.
Use the input index, not a mutable counter shared between invocations.

</details>

**Done when:** tests pass and you can explain the limitations. This pure function
does **not** reserve ports, provision accounts, detect other processes, allocate
devices, or configure BrowserStack. Disjoint plans in separate processes still
need coordinated port allocation. Hybrid/video features may need additional ports.
The project's default runner remains sequential.

**Reference:** [solution.ts](solution.ts). For local driver requirements, read the
[UiAutomator2 parallel-testing guide](https://github.com/appium/appium-uiautomator2-driver#parallel-tests).
Connect this to scenario RW-15 in the [workplace workbook](../../docs/handbook/workplace-scenarios.md).

[All labs](../README.md)
