# BS-11 · Reach a private test backend

**Stage:** Work with a team · **Time:** 60–120 minutes after prerequisites

## Prerequisites

[BS-08](08-failures.md), App Automate access and, for a real tunnel lab, an
authorized app build that calls an authorized private test backend. The supplied
WDIO demo login is simulated and cannot prove backend connectivity. You need
the backend owner to identify the intended hostname, route and TLS policy.
Without these, complete the synthetic exercise and label execution not run.

## Step by step

1. Establish the failing app request: target hostname, time, build and error
   layer. Compare a public endpoint and the intended private endpoint. A health
   check on your VPN-connected laptop does not prove a remote phone can connect.
2. Review [BrowserStack Local](https://www.browserstack.com/docs/app-automate/appium/test-on-internal-network)
   and download the official binary for your host. Confirm your team permits
   the connection. The repository does not install/start a tunnel automatically.
3. Use the binary's documented `--config-file` option to keep the access key
   out of command arguments/history. Create a secret-bearing config in ignored
   `.local-data/browserstack/`, restrict its access using your OS, and follow
   the [current option names](https://www.browserstack.com/docs/local-testing/binary-params).
   Download the provider's [config sample](https://www.browserstack.com/downloads/local_testing.yml)
   and edit its documented key field locally; do not guess a YAML schema.
   Select a unique local identifier for this run/job. Do not use a shared generic
   identifier across independent CI jobs.
4. Start the binary with the config file in a separate terminal. Wait for its
   reported connection readiness; a started process alone is not readiness.
   Keep its logs private. Do not paste a sample access key into a shell command.

   From the project root, if you placed the downloaded binary/config in that
   ignored directory, the foreground commands are:

   ```bash
   # macOS/Linux; use your actual downloaded executable path
   ./.local-data/browserstack/BrowserStackLocal --config-file .local-data/browserstack/local_testing.yml --local-identifier bs-private-attempt-01
   ```

   ```powershell
   # Windows PowerShell
   .\.local-data\browserstack\BrowserStackLocal.exe --config-file .local-data/browserstack/local_testing.yml --local-identifier bs-private-attempt-01
   ```

   On macOS/Linux the official binary may need execute permission; follow the
   download instructions. If the official sample is inaccessible, stop this
   binary setup rather than inventing fields. The provider also supplies a
   [Node binding](https://github.com/browserstack/browserstack-local-nodejs)
   with documented `Local.start({ key, localIdentifier }, callback)` and
   `Local.stop(callback)` as an alternative integration exercise. A shell does
   not automatically load the project's `.env` for a standalone binary.
5. In a branch for this optional app/environment experiment, add the matching
   settings to the cloud capabilities' `bstack:options`, preserving other fields:

   ```ts
   local: true,
   localIdentifier: 'bs-private-attempt-01',
   ```

   This value must match the binary's identifier. The existing launcher uploads
   the pinned demo only; an authorized private-app experiment also needs its
   own verified artifact/runner configuration. Do not weaken the demo manifest
   or claim it will automatically upload another APK.
6. Run one selected scenario against that app. Observe the request **from the
   remote app** and a corresponding backend request/log. A tunnel connection
   banner and a laptop curl response are insufficient evidence.
7. Diagnose DNS/routing, proxy and TLS separately. A tunnel does not repair an
   invalid certificate chain or certificate pinning mismatch. Use the approved
   test-build/network configuration; do not disable TLS checks to get green.
8. Stop the connection you started, including after failure. In CI, give each
   job a unique identifier and an always-run cleanup step for its owned process.
   Revert your experiment's capability changes when you return to the baseline.
   For the foreground commands above, use Ctrl+C in their terminal and verify
   that the connection ended. Do not use a force option to take over another
   job's connection. Background/daemon ownership needs its own cleanup design.

See [multiple connection identifiers](https://www.browserstack.com/docs/app-automate/appium/test-on-internal-network/manage-multiple-connections)
and [Android network security](https://developer.android.com/privacy-and-security/security-config).
This extension needs extra infrastructure and is not a tested default course path.

## Exercises

### BS-11-A · Public works, staging does not

**Task:** supplied evidence: same app build; laptop on VPN gets staging HTTP 200;
remote phone gets public HTTP 200; staging DNS lookup fails; backend sees no
login request. Make a layer-by-layer investigation and repair-verification plan.
**Acceptance:** distinguish app configuration, DNS/routing, tunnel identity and
authentication. Require an app-origin request as proof. No account is needed
to analyze this fictional evidence.

<details><summary>Hint and review</summary>
The failure occurs before the backend can authenticate. Inspect hostname and
connectivity before changing login credentials or selectors. This extends RW-23.
</details>

### BS-11-B · Connected tunnel, broken TLS

**Task:** the tunnel reports ready but the app now reports certificate-chain
failure. Explain what improved and what remains broken. Add cleanup ownership
for two simultaneously running CI jobs.
**Acceptance:** separate transport reachability from trust; obtain approved
certificate/test-build evidence; two distinct identifiers and job-owned cleanup.

<details><summary>Hint and review</summary>
Do not treat every private-network symptom as a tunnel fault. One job stopping
another job's shared tunnel creates a second intermittent failure.
</details>

## Checkpoint

Can you demonstrate connectivity from the app, and show that your cleanup cannot
stop a colleague's work? Record missing prerequisites explicitly.

[Previous](10-parallel.md) · [Path](README.md) · [Next: maintenance](12-maintenance.md)
