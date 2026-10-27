# BS-05 · Choose devices, versions and app builds

**Stage:** Run automation · **Time:** 40–60 minutes

## Prerequisites

[BS-02](02-project.md); access to the current device catalog for exact selections.
Planning exercises need no live sessions. Changing a configuration is not proof
that the provider accepted it.

## Step by step

1. Inspect [the remote config](../../config/wdio.browserstack.conf.ts). Map
   `platformName`, `appium:automationName`, `appium:app`, `bstack:options.deviceName`
   and `platformVersion` to their purposes. The last two come from `.env`.
2. Check the [public App Automate device list](https://www.browserstack.com/list-of-browsers-and-platforms/app_automate)
   and the signed-in selector. Choose an exact supported pair, not a plausible
   model/OS combination from memory. Record requested and actual values.
3. Use a single baseline device first. For later coverage, choose devices by
   app users and risk: vendor keyboard behavior, screen constraints and oldest
   materially supported OS. Three similar flagship phones may add little evidence.
4. Record remote versions. Your locally installed Appium/UiAutomator2 packages
   do not select the provider's server versions. This config omits
   `bstack:options.appiumVersion`, so provider defaults apply. Consult
   [remote version selection](https://www.browserstack.com/docs/app-automate/appium/set-up-tests/set-appium-version)
   before deliberately pinning a supported value. Typecheck after config edits.
5. Verify app identity: local pinned APK/version/checksum, returned upload ID,
   and app metadata shown by the session. Our wrapper uploads verified bytes on
   every invocation. You do not have to maintain a permanent `bs://` value.
6. If an older uploaded app ID is rejected, check account ownership and lifecycle,
   then upload the intended verified artifact. Provider uploads are not permanent;
   see [upload and retention guidance](https://www.browserstack.com/docs/app-automate/appium/upload-app-from-filesystem).
   A mutable custom app label can select newer bytes; preserve exact identity.

## Session settings you should question

`autoGrantPermissions: true` is convenient for these demo cases. It means they
do not establish the permission-prompt flow. Permission-denial coverage needs
deliberate settings, reset policy and its own scenario. A device label, a build
label and a session name are different things. A larger timeout cannot make an
unsupported capability supported.

The direct WDIO 10 integration must be validated against a real session. The
provider's WDIO quickstarts currently name versions 7–9; do not silently change
packages, install a mismatched service or claim vendor-certified support.
Document an actual incompatibility before choosing a supported migration.

## Exercises

### BS-05-A · Defend three devices

**Task:** hypothetical audience: 65% recent Samsung, 25% recent Pixel-class,
10% older supported small screens. Fill the device matrix template with three
classes, unique risks and exact current candidates if account access exists.
**Acceptance:** distinguish audience assumptions from measured analytics; state
what remains uncovered. Planning does not require running three paid sessions.

<details><summary>Hint and review</summary>
OS age and vendor/keyboard behavior can matter more than model prestige.
Mark candidate combinations unverified until checked against your account.
</details>

### BS-05-B · Same source, different environment

**Task:** synthetic evidence: the same APK and test pass locally; the cloud
session rejects a driver capability before app launch. Draft a version matrix
and the next two observations needed.
**Acceptance:** include local and remote Appium/driver/OS versions, classify
setup failure and avoid changing selectors or the APK checksum without evidence.

<details><summary>Hint and review</summary>
The Node lockfile does not lock BrowserStack's remote Appium server. Verify
provider support and capability namespace before a small, documented retry.
</details>

## Checkpoint

Can you identify the exact artifact and environment your result applies to?

[Previous](04-automation.md) · [Path](README.md) · [Next: dashboard walkthrough](06-dashboard.md)
