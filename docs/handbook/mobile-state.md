# Permissions, interruptions, and app state

Use this field manual after [lesson 09](../lessons/09-waits-and-state.md). It extends your test-design vocabulary; it does not claim these scenarios have been executed by the supplied suite.

## Separate the state you are changing

| State layer | Examples | What this project's restart clears |
|---|---|---|
| Current UI/process | Open screen, in-memory form values, transient alert | Restarting the demo resets its in-memory UI |
| App storage | Saved settings, cached data, persisted session | Not guaranteed; process termination does not erase storage |
| Android settings | Permission grants, keyboard, orientation | Not reset by `restartDemoApp()` |
| Server/account | Account data, authentication tokens, shopping basket | Outside this demo; not reset by device operations |
| Automation session | Appium connection, driver settings, selected context | Not recreated by the per-test restart helper |

The local `appium:noReset: false` capability applies when a session starts. Multiple `it` blocks can share that session. `restartDemoApp()` is the separate per-test action that terminates and activates `com.wdiodemoapp`. Read the actual helper before promising a clean install.

Choose the smallest setup that establishes the scenario's contract. Reinstallation or clearing app data may be appropriate for a first-install scenario, but it can destroy the very saved state a persistence test needs.

## Permission coverage is intentionally absent from the baseline

Both mobile configs set `appium:autoGrantPermissions: true`. This asks the driver to grant supported requested permissions during setup; it does not assert the permission-request experience. Turning it off also does not revoke a permission already granted. Driver capabilities and behavior depend on Android/app versions and permission type. [UiAutomator2 capabilities](https://github.com/appium/appium-uiautomator2-driver).

A useful permission scenario needs a real feature that requests a particular permission. Do not invent a camera flow in this demo to make the course seem complete. For a future app with such a feature, design these distinct starting states:

| State before action | User action | Evidence to collect |
|---|---|---|
| Permission not yet requested | Open the relevant feature, then allow | Correct prompt and usable feature after approval |
| Permission denied | Open the feature and deny | Clear explanation or usable fallback; no crash |
| Permission granted earlier | Reopen the feature | Feature works without an unnecessary repeated prompt |
| Permission revoked in settings | Return and use the feature | App detects the changed state and recovers appropriately |

Expected fallback behavior must come from the product requirement. Android guidance distinguishes runtime permissions from special permissions and recommends accommodating denial; one generic “tap Allow whenever anything appears” helper cannot test those distinctions. [Android permission workflow](https://developer.android.com/training/permissions/requesting).

Use an isolated test device/profile and a dedicated configuration for permission experiments. Record the actual starting grant state, the requested permission, app/Android versions, and system-dialog selectors inspected on that OS. Restore the agreed baseline afterward. A changed capability without state verification is not a complete setup.

## Backgrounding is different from killing the process

Going to the home screen and returning, terminating a process, and navigating to another in-app tab are different transitions. Android's lifecycle can change while the app is not in the foreground; preserving or clearing a draft is a product decision, not something a test should assume. [Android activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle).

A focused exploration can compare:

| Transition | Question |
|---|---|
| Forms → Login → Forms | Should a draft survive in-app navigation? |
| Foreground → background → foreground | Should the current form and entered data remain usable? |
| Terminate → activate | Should any stored state survive process restart? |
| Rotate, if the app supports it | Does layout and intended state survive configuration change? |

First write the intended rule or mark it as an open question. Do not call a result a defect simply because the observed behavior surprised you.

If the chosen requirement is **preserve a Forms draft during a brief background interruption**, a candidate body inside a connected test is:

```ts
const text = 'Draft before interruption'
await FormsScreen.input.setValue(text)
await waitForText(FormsScreen.inputResult, text)
expect(await FormsScreen.inputResult.getText()).to.equal(text)

await driver.background(2)

await FormsScreen.waitForIsShown()
await waitForText(FormsScreen.inputResult, text)
expect(await FormsScreen.inputResult.getText()).to.equal(text)
```

This is a learner extension requiring the existing imports and Forms setup, not a shipped or verified test. The `2` is a deliberate interruption duration in seconds. The waits after return synchronize on UI state; there is no extra fixed sleep to guess at rendering time. Confirm command support for the installed driver. [WebdriverIO background command](https://webdriver.io/docs/api/mobile/background/).

Keep the transition inside one test. Calling `restartDemoApp()` between background and return would invalidate a draft-retention scenario. A deliberate app restart belongs in a separate scenario with its own expected state.

## State contract worksheet

Before implementing one of these checks, write:

```text
Feature and required behavior:
State layer being changed:
Known starting state and how it is verified:
Action that changes state:
Observable result after the action:
Requirement source, or open product question:
What setup must NOT reset during this scenario:
Cleanup and baseline restoration:
Execution status: designed only / blocked / observed pass / observed fail
```

This worksheet also applies to offline/reconnect behavior, app upgrades, deep links, and session expiration. Those need an app or service that actually exposes the behavior; the simulated login does not provide it.

[State lesson](../lessons/09-waits-and-state.md) · [Test design](../lessons/14-test-design.md) · [Review checklist](review-checklist.md)
