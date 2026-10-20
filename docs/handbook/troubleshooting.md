# Troubleshooting field guide

Run the smallest diagnostic that can distinguish the next cause. Keep the first meaningful error; changing unrelated settings makes a result harder to explain.

## Quick decision tree

1. **No test execution starts:** run `npm run typecheck`; check Node 24 and dependencies.
2. **No mobile session starts:** run `npm run preflight`, then `npm run appium:doctor`.
3. **Session starts, wrong screen:** inspect navigation, app state, and any blocking dialog.
4. **Right screen, target unavailable:** compare the selector with Inspector/page XML.
5. **Action works, expected result differs:** inspect the actual value and test oracle.
6. **Intermittent behavior:** control starting state, observe a readiness condition, and retain both failed and passing observations.

## Environment and session failures

| Symptom | Inspect | Smallest useful action |
|---|---|---|
| Node major is wrong | `node --version`, shell PATH | Select Node 24; reopen terminal |
| `JAVA_HOME` or SDK missing | `npm run preflight`, doctor | Correct actual paths; do not guess a JDK path |
| `javac` missing or SDK build-tools incomplete | Preflight's named check, SDK Manager | Point at a complete JDK or install the missing Android build-tools |
| No device | `adb devices` | Start AVD and wait for boot |
| Device unauthorized | Device's USB authorization prompt | Authorize your intended test machine/device |
| Device offline | Device Manager and adb status | Investigate device boot/connection before running tests |
| More than one target | Device serials | Set `ANDROID_UDID` to the intended target |
| APK missing or checksum mismatch | `npm run app:verify` | Run `npm run app:download`; do not bypass a mismatch or replace the pinned digest with an unexpected hash |
| Driver missing or from a different installation | `npm run appium:setup` | Run `npm ci` from the repository, then verify discovery again |
| Port 4723 in use | Standalone Appium/Inspector terminal | Stop the known unused server; do not kill unrelated processes |
| Session dies during setup | Appium log and device state | Fix that first; screenshots may be unavailable |

Do not repeatedly wipe emulator data as a first response. It changes state and can hide the cause. If a fresh emulator is part of your experiment, label the change and compare observations.

## Test failures

| Symptom | Useful distinction |
|---|---|
| Element not found | Does the expected screen root exist? Is the selector actually present? |
| Button cannot be tapped | Keyboard, overlay, viewport, and enabled state are separate possibilities |
| Empty text after entry | Did the field receive input? Did the echo update? |
| Switch test passes alone only | Was off-state established, or inherited from another case? |
| Success dialog blocks next case | Did the scenario close it? Did restart setup run? |
| Chai assertion fails immediately | Chai checks once; use a bounded condition wait where asynchronous state is expected |
| Cleared Login field reports `Email`/`Password` | Android may expose hint text; use the inspected empty-field getters, not equality with `''` |
| Attribute exists in XML but its direct read fails | Driver attribute APIs can differ from XML source; the Login hint getters use a justified narrow XPath |
| Permission dialog never appears | Check existing grants and `autoGrantPermissions`; disabling the capability alone does not revoke permission |
| State disappears during a retention test | Check whether your own restart/reset ran between the states being compared |
| All tests skipped | Check grep/spec filters and spelling; “zero failures” with no executed tests proves little |

The shared failure hooks try to save a screenshot and page XML for failed tests and setup hooks; dynamically skipped tests do not generate false failure artifacts. Files are under `logs/` with a `FAILED_` prefix and unique run information. The server writes `logs/wdio-appium.log`. Capture errors warn without replacing the primary failure.

If instrumentation stops or the session becomes invalid, inspect ADB connectivity and the earliest Appium/device error before changing a locator. A failed screenshot request after session death is secondary evidence. For app-crash triage, the [debugging lesson](../lessons/10-debugging.md) shows a bounded Logcat read; identify whether the failed process belongs to the app, UiAutomator2, or the emulator.

Use [the report template](templates.md) to keep hypotheses separate from observations.

## Cloud-specific failures

- **Missing credentials:** edit local `.env` or repository secrets; never print the access key to verify it.
- **Device/OS unavailable:** confirm a supported pair in your account, then update the configurable device values.
- **Parallel limit:** distinguish number of simultaneous sessions from total matrix work; the starter defaults to one.
- **Upload failure:** verify the local APK exists and account/network access before investigating selectors.
- **Native run works, WebView fails:** context discovery and ChromeDriver compatibility are separate from native automation.

`npm run preflight -- --cloud` checks relevant local inputs without creating a remote session. A successful preflight is not a cloud test pass.

Limit the spec files as well as the Mocha grep for a small paid experiment. A filter selecting one test can still leave other spec files scheduled, depending on runner behavior. Confirm the dashboard's actual session count.

## Dependency audit findings

The 20 October 2026 maintenance baseline reports zero npm audit findings; see [dependency maintenance](dependency-maintenance.md) for the changes and repeatable checks. Counts change as the registry and lockfile change. Do not describe the repository as vulnerability-free.

Use `npm audit` to inspect affected packages and dependency paths. Determine whether an advisory concerns the runner, local server, reporting integration, or application dependency. Review compatible fixes first, rerun typecheck and relevant device tests after changes, and document remaining issues. `npm audit fix --force` can change major versions and invalidate the tested stack.

For this course, bind standalone Appium to `127.0.0.1`, use the demo APK and synthetic inputs, and avoid treating the repository as a production deployment template.

## When to stop guessing

After two or three unrelated “fixes” without a clearer hypothesis, return to a controlled reproduction. Record versions, exact command, first error, last known good state, and one next observation. A precise blocked report is more useful than a green rerun achieved by disabling the assertion.

[Debugging lesson](../lessons/10-debugging.md) · [Setup](setup.md)
