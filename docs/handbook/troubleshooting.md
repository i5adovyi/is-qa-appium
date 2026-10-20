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
| No device | `adb devices` | Start AVD and wait for boot |
| Device unauthorized | Device's USB authorization prompt | Authorize your intended test machine/device |
| Device offline | Device Manager and adb status | Investigate device boot/connection before running tests |
| More than one target | Device serials | Set `ANDROID_UDID` to the intended target |
| APK missing | `apps/wdio-demo.apk` | Run `npm run app:download` and check download completion |
| Driver missing | `npx appium driver list --installed` | Run `npm run appium:setup` once |
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
| All tests skipped | Check grep/spec filters and spelling; “zero failures” with no executed tests proves little |

The shared failure hooks try to save a screenshot and page XML for failed tests and setup hooks. Files are under `logs/` with a `FAILED_` prefix and unique run information. The server writes `logs/wdio-appium.log`. Capture errors warn without replacing the primary failure.

Use [the report template](templates.md) to keep hypotheses separate from observations.

## Cloud-specific failures

- **Missing credentials:** edit local `.env` or repository secrets; never print the access key to verify it.
- **Device/OS unavailable:** confirm a supported pair in your account, then update the configurable device values.
- **Parallel limit:** distinguish number of simultaneous sessions from total matrix work; the starter defaults to one.
- **Upload failure:** verify the local APK exists and account/network access before investigating selectors.
- **Native run works, WebView fails:** context discovery and ChromeDriver compatibility are separate from native automation.

`npm run preflight -- --cloud` checks relevant local inputs without creating a remote session. A successful preflight is not a cloud test pass.

## Dependency audit findings

This training stack has known dependency advisories; see the current repository verification notes for the observed count. Counts change as the registry and lockfile change. Do not describe the repository as vulnerability-free.

Use `npm audit` to inspect affected packages and dependency paths. Determine whether an advisory concerns the runner, local server, reporting integration, or application dependency. Review compatible fixes first, rerun typecheck and relevant device tests after changes, and document remaining issues. `npm audit fix --force` can change major versions and invalidate the tested stack.

For this course, bind standalone Appium to `127.0.0.1`, use the demo APK and synthetic inputs, and avoid treating the repository as a production deployment template.

## When to stop guessing

After two or three unrelated “fixes” without a clearer hypothesis, return to a controlled reproduction. Record versions, exact command, first error, last known good state, and one next observation. A precise blocked report is more useful than a green rerun achieved by disabling the assertion.

[Debugging lesson](../lessons/10-debugging.md) · [Setup](setup.md)
