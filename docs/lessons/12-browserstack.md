# 12 · Run the same scenario on a cloud device

**Stage:** Deliver credible results\
**Time:** 75–120 minutes; account setup time varies\
**Prerequisites:** Passing local smoke suite; Lesson 10; BrowserStack App Automate access for execution.\
**Outcome:** Explain configuration differences, protect credentials, and interpret one real cloud session.

> Cloud execution is optional and credential gated. This repository prepares the integration; it does not supply an account, promise trial availability, or claim that a cloud run has happened. Completing the design exercises without access is useful, but record execution as **not run**.

## What changes in the cloud

The test still calls the same screen methods. The connection and device provisioning change:

| Local | BrowserStack |
|---|---|
| Appium service starts a local server | Runner connects to the provider's hub |
| APK path points to your disk | BrowserStack service uploads the configured APK |
| You start and maintain the emulator | Provider allocates an available real device |
| Local screenshot/source/log evidence | Provider session evidence plus configured local artifacts |
| Local CPU and SDK constraints | Account access, concurrency and device availability constraints |

Read `config/wdio.browserstack.conf.ts` before running. The starter uses a conservative serial configuration. Device names and platform combinations are service data: check the provider's current selection tools before changing them.

## Worked example: the secret boundary

The configuration obtains its credentials from environment variables. The idea is:

```ts
const user = process.env.BROWSERSTACK_USERNAME
const key = process.env.BROWSERSTACK_ACCESS_KEY
```

The actual config wraps this lookup in `credential(...)` so missing or obvious placeholder values fail before a session starts.

Neither belongs in a spec, screenshot annotation, committed fixture, or issue report. `.env` is a local convenience, not a secret manager. An ignored file can still be manually attached or copied; review artifacts before sharing.

For a new local file, copy `.env.example` without overwriting an existing `.env`:

```bash
# macOS/Linux shell
test -f .env || cp .env.example .env
```

PowerShell equivalent:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Edit it locally and keep credentials out of terminal history. The username and access key must belong to an account authorized to upload this demo APK and use App Automate.

## Guided lab

1. Run `npm run typecheck` and `npm run test:smoke` locally.
2. Read `.env.example`, the BrowserStack config, and the `browserstack` service options.
3. If you have authorized account access, enter credentials locally and run:

   ```bash
   npm run test:bs -- --mochaOpts.grep @smoke
   ```

4. Locate the build and session in the App Automate dashboard. Record device, OS, test names, duration, and pass/fail outcome.
5. Compare one action in the session log with one line in the Login test. Inspect video if available in your account.
6. Record “not run—no account access” if execution is unavailable. Do not substitute a local pass for cloud evidence.

Consult the [official WebdriverIO integration guide](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio) for the current provider workflow.

## Exercises

### 12-A · Explain a capability

Annotate the cloud config in your study notes: which values select the device, which label a build, which authenticate, and which enable diagnostics? Trace how the APK reaches the provider.

**Acceptance:** every category has an actual config example; secrets are redacted; you can explain why a local absolute APK path is not itself a cloud app identifier.

<details><summary>Hint 1 · Follow the service</summary>
The `app` service option supplies the upload. The provider makes that uploaded application available to its session.
</details>
<details><summary>Hint 2 · Do not confuse labels and selectors</summary>
A build name groups results; a device name requests an execution environment.
</details>

### 12-B · Design a three-device matrix

Create a matrix for a hypothetical app with mostly recent Android users and a meaningful older-device minority. Select three device/OS classes and explain what unique risk each adds. Estimate session demand for four spec files.

**Acceptance:** classes are justified by risk; exact available models are verified before any run; concurrency differs from total sessions; no new paid execution is required.

<details><summary>Hint 1 · Three expensive duplicates add little evidence</summary>
Consider OS age, screen size, and vendor behavior rather than choosing only flagship phones.
</details>
<details><summary>Hint 2 · Count work and simultaneous work separately</summary>
With one session per spec/device combination, four files across three devices can mean twelve sessions. `maxInstances: 1` serializes them; it does not turn them into one session.
</details>

### 12-C · Investigate a cloud-only failure

Use a real cloud failure if available; otherwise analyze this supplied scenario: local login passes, cloud session starts successfully, and the login button cannot be tapped while the keyboard is visible. Propose two observations and one targeted fix.

**Acceptance:** distinguishes infrastructure setup from interaction failure; retains current device/OS evidence; fix addresses keyboard/layout state; account availability is honestly recorded.

<details><summary>Hint 1 · Session creation already succeeded</summary>
The evidence does not support blaming credentials or APK upload first.
</details>
<details><summary>Hint 2 · Inspect the shared action</summary>
`LoginScreen.login` already handles the keyboard. Check whether the failing path used that action and what the device reported.
</details>

## Checkpoint

- Does a passing cloud session on one device prove all Android devices work?
- Why can a serial matrix still consume many sessions?
- Which artifacts might contain entered text?
- Why should you verify local correctness before paying the setup cost of a remote session?

[Solutions](../solutions/12-browserstack.md) · [Next: CI and reports](13-ci-and-reports.md) · [Course index](../README.md)
