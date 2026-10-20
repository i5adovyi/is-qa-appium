# 01 · Model answers: toolchain

## 01-A · Preflight record

A useful record uses your actual values, not these placeholders:

```text
Node version: <output of node --version; expected major 24>
Node executable: <output of command -v node>
ANDROID_HOME: <output of printenv ANDROID_HOME>
JAVA_HOME: <output of printenv JAVA_HOME>
Java version: <output of java -version>
AVD: <selected name from emulator -list-avds>
ADB: <serial> device
Preflight: <result of npm run preflight>
Command: npm run test:smoke
Outcome: <pass, or first actionable error>
Evidence: <relevant log path or screenshot path>
```

A blocked result is acceptable lesson evidence if you identify the layer and a plausible next action. It is not a successful installation claim.

**Common pitfalls:** Copying expected versions without executing checks; running version checks in one terminal but tests in another with different environment variables; collecting an entire environment dump containing secrets.

## 01-B · Setup incidents

1. **No devices:** Check that an AVD actually exists and is running in Device Manager. Wait for boot, then run `adb devices` again. If still empty, confirm `command -v adb` points to the intended SDK's platform-tools. For a physical device, USB debugging/authorization and cable connectivity introduce additional checks.
2. **Driver cannot load:** Run `npx appium driver list --installed` from the project. If UiAutomator2 is absent, run `npm ci`, then `npm run appium:setup` and `npm run appium:doctor`. Setup verifies discovery of the local locked driver. If present but failing to load, read the actual compatibility/load error rather than reinstalling repeatedly.
3. **Port conflict:** Check the terminal where you started Inspector's standalone Appium server. End the Inspector session, stop that server with Ctrl+C, and rerun the suite. If you cannot identify the owner, inspect the listening process with `lsof -nP -iTCP:4723 -sTCP:LISTEN`; identify it before stopping it.

The ownership distinction matters: your test runner can stop the Appium service it started, but it does not make arbitrary old servers disappear.

**Common pitfalls:** Killing every Java/Node process; reinstalling Appium to fix a port conflict; expecting doctor to boot the emulator for you.

## 01-C · Installation/run boundary

| Initial setup or relevant change | A normal practice session |
|---|---|
| Configure SDK and Java paths | Open a terminal with the expected environment |
| Install dependencies, or update them deliberately | Start an existing emulator |
| Install the project driver with `npm ci` when missing | Check `adb devices` |
| Download the APK when missing or changing app version | Run `npm run typecheck` after code edits |
| Create an AVD when no suitable one exists | Run `npm run test:forms` |

`npm install` also belongs after a deliberate dependency change or when dependencies are missing. It is not a prerequisite for every test invocation. On a fresh checkout with a matching lockfile, `npm ci` is useful for a reproducible dependency install; it replaces the dependency directory and requires package/lockfile agreement.

An efficient session:

```bash
node --version
adb devices
npm run preflight
npm run typecheck
npm run test:forms
```

This assumes setup has already been completed and a device is booted. If one check fails, fix the evidence-based cause before running the remaining device steps.

If Java is bundled only inside Android Studio, setting `JAVA_HOME` is not the same as making `java` discoverable in the terminal. The lesson's PATH includes `$JAVA_HOME/bin` so the version check and tools resolve that runtime.

## Checkpoint answers

- Doctor checks environment prerequisites. It cannot guarantee that an app's selector, behavior, expected text, or test logic is correct.
- A friendly device name does not uniquely identify an Android connection. ADB serial/UDID is the practical selection identity when more than one target is connected.
- `@wdio/appium-service`, configured in the Android config, starts Appium for normal local runs.

This repository exposes that selection as `ANDROID_UDID` in local `.env`. Read `adb devices` to choose the actual serial; do not copy a sample serial without checking it.

[Back to lesson](../lessons/01-toolchain.md) · [Next lesson](../lessons/02-typescript.md)
