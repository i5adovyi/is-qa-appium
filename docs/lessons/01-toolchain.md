# 01 · Own your toolchain

**Stage:** Foundation · **Estimated time:** 60–90 minutes on an existing setup; first downloads may add an hour · **Device needed:** Android emulator

**Prerequisites:** [Lesson 00](00-orientation.md). This walkthrough uses macOS with zsh, Node 24, Android Studio, and the repository checked out locally.

**By the end you will be able to:**

- Verify each prerequisite independently.
- Explain the difference between an npm package and an installed Appium driver.
- Start one local smoke run and retain useful evidence if it fails.

## A toolchain is a series of contracts

The shell must find Node. Appium must find Java and the Android SDK. ADB must see a device. The driver must support the requested automation name. The runner must find the APK.

If a contract fails, fix that specific connection. Reinstalling every tool obscures the cause and can introduce new versions.

The project has two layers of configuration:

- [Shared config](../../config/wdio.shared.conf.ts): test discovery, Mocha, timeouts, reporter, failure evidence.
- [Android config](../../config/wdio.android.conf.ts): local Appium service and Android capabilities.

This real capability means “automate this session using UiAutomator2”:

```ts
'appium:automationName': 'UiAutomator2'
```

It does not install the driver. The project's setup script performs installation; the doctor script checks driver prerequisites.

## Guided lab: verify from the outside in

Run each command separately so you can identify the failing step.

### 1. Check your shell and runtime

```bash
node --version
npm --version
command -v node
```

For this course, use Node 24. A different shell can select a different Node installation. If you manage Node with nvm, use `nvm use 24` in the current terminal; do not assume nvm exists on every machine.

On the prepared Mac, these environment values belong in `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
```

Verify the directories on your machine before adding them. Android Studio can be installed elsewhere, and an SDK can have a custom location. Preserve existing shell configuration instead of overwriting the file.

```bash
source ~/.zshrc
printenv ANDROID_HOME JAVA_HOME
java -version
adb version
emulator -list-avds
```

Expected evidence: nonempty paths, a working Java command, an ADB version, and at least one configured virtual device. `printenv` here requests only these two values, not all environment variables.

### 2. Verify project dependencies and driver

From the repository root:

```bash
npm install
npm run appium:doctor
```

If doctor reports the driver is missing, install it once:

```bash
npm run appium:setup
npm run appium:doctor
```

Do not repeatedly install a driver that is already present. An npm package dependency makes code available; Appium's extension registry determines which driver it can load for sessions. The [UiAutomator2 driver README](https://github.com/appium/appium-uiautomator2-driver) documents its requirements and doctor checks.

### 3. Start a device and obtain the app

Start your virtual device in Android Studio's Device Manager. If you have the prepared AVD named `Pixel_8_API_35`, an equivalent command in another terminal is:

```bash
emulator -avd Pixel_8_API_35
```

If that name is absent from `emulator -list-avds`, use the name that actually exists. Wait for Android to boot, then:

```bash
adb devices
npm run app:download
ls -lh apps/wdio-demo.apk
```

For the introductory lessons, keep exactly one emulator/device connected. ADB should list it with state `device`. `offline` is not ready, and an empty list means there is no connected target.

### 4. Run a cheap check, then the smoke suite

```bash
npm run typecheck
npm run test:smoke
```

The local WebdriverIO service starts Appium. Do not start a second Appium server on the same port for this run.

Record the Node version, device identity, command, and outcome. If it fails, preserve the first meaningful error and available files under `logs/`. Do not paste your entire `.env` into a bug report.

## Reading a capability without guessing

| Setting | Meaning in this project | Does not mean |
|---|---|---|
| `platformName: 'Android'` | Request an Android session | Download Android |
| `appium:automationName` | Select the driver family | Create an AVD |
| `appium:app` | APK path for the session | Source code of the app |
| `appium:deviceName` | Device label in this local setup | Reliable selection among multiple connected devices |

For multiple Android targets, explicit device selection needs additional configuration; do not learn parallel execution before you can explain one session.

## Exercises

### 01-A · Build a preflight record

Run the prerequisite checks above and record seven facts: Node version, Node executable, SDK path, Java path, Java version, AVD name, and ADB state. Add a redacted smoke-run result.

<details><summary>Hint</summary>

“Installed” is weaker evidence than a command that resolves and returns a version. Paths must describe the same shell in which you run npm.
</details>

**Acceptance:** Every fact has a command or observed source; the smoke run passes or has one clearly classified blocker.

### 01-B · Solve three setup incidents

Write the next two diagnostic steps for each:

1. `adb devices` is empty.
2. Appium says it cannot load `UiAutomator2`.
3. A local run reports port 4723 is already in use after an Inspector session.

<details><summary>Hint</summary>

Check device boot/connection, driver registration, and who owns the existing Appium server. Do not kill unrelated processes blindly.
</details>

**Acceptance:** Each response checks the relevant layer before changing it; no generic “increase timeout” fixes.

### 01-C · Explain the installation/run boundary

Create a two-column checklist: “once per machine or dependency change” and “before/for a normal practice run.” Place these tasks: configure SDK paths, install npm dependencies, install driver, download APK, start emulator, check `adb devices`, typecheck, run Forms tests.

Then run:

```bash
npm run test:forms
```

<details><summary>Hint</summary>

The APK may be reused until its version changes. The emulator must be running for every local device test, but need not be recreated.
</details>

**Acceptance:** A repeatable normal-session checklist with no unnecessary reinstall, and an observed Forms outcome.

## Checkpoint

- Why can doctor succeed while a test still fails?
- Why is `deviceName` alone a poor way to choose between two Android devices?
- Which component starts the Appium server during normal local test execution?

[Model answers](../solutions/01-toolchain.md) · [Next: 02 · TypeScript](02-typescript.md)
