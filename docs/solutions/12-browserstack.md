# 12 · Solutions and reasoning

[Return to exercises](../lessons/12-browserstack.md).

## 12-A · Configuration map

Read the current config rather than memorizing provider examples:

| Category | Typical field in this project | Meaning |
|---|---|---|
| Authentication | `user`, `key` from environment | Authorizes provider access |
| Destination | `hostname` | Sends the session to the remote hub |
| Device selection | device name and platform version in capabilities | Requests an available execution target |
| Run labels | `projectName`, `buildName` | Organizes results |
| Upload | Launch script → `BROWSERSTACK_APP_URL` → `appium:app` | Verifies/uploads the APK and selects the uploaded artifact |
| Diagnostics | enabled capability logging options | Determines extra provider evidence |
| Concurrency | `maxInstances` | Bounds simultaneous worker sessions |

The remote device cannot open a path on your laptop. The launch script verifies/uploads the app before starting WebdriverIO, then passes the returned `bs://` identifier through the environment to the config. A cloud configuration without local Appium service is intentional.

The starter's diagnostics are specific: `bstack:options.debug` is `true`, `networkLogs` is `false`, and no Test Observability, Percy or local-tunnel service is installed. The `after` hook sends the full session result using the provider's status executor. Those choices do not prove which artifacts a particular account ultimately provides; inspect the resulting session. Neither local nor cloud `autoGrantPermissions: true` tests the permission prompt flow.

## 12-B · Risk-based device matrix

An example **design**, not a verified provider inventory:

| Device class | OS class | Risk |
|---|---|---|
| Mainstream Pixel-sized phone | Recent supported Android | Baseline behavior close to the main user segment |
| Samsung phone | Recent supported Android | Vendor keyboard/UI behavior |
| Smaller or older supported phone | Oldest materially used supported OS | Layout pressure and compatibility boundary |

Use actual product analytics to improve those choices. Verify available exact device/OS combinations in the provider before execution.

Four files × three devices can create twelve spec/device sessions under the normal separate-file execution model. With one concurrent worker these run serially. Session setup and teardown can dominate a small suite's runtime. Record actual worker/session behavior because grouping or runner settings can change the count.

Use file selection as well as test-title filtering for a small first run. A grep that executes one test is not by itself proof that only one remote session was created.

## 12-C · Keyboard failure

The session started, so initial authentication, allocation, and installation succeeded far enough to interact. Investigate:

1. Does the screenshot show the keyboard overlapping the intended button?
2. Did the test call `LoginScreen.login`, and did `isKeyboardShown`/`hideKeyboard` complete?

A targeted repair may be using the existing shared login action, waiting for the button's actionable state after hiding the keyboard, or using an inspected scroll strategy if the layout still places the button off-screen. Choose the repair from evidence. A universal tap at fixed coordinates is fragile across devices.

If you have no account, your answer is a scenario analysis. Label cloud execution “not run.” It is still a valuable exercise in narrowing hypotheses.

[Next lesson](../lessons/13-ci-and-reports.md)
