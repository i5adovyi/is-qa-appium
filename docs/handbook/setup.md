# Setup manual

This course targets **Node 24, Appium 3, WebdriverIO 9, TypeScript, Mocha and Chai**, initially on Android. The repository's lockfile records package versions. iOS is an extension requiring its own environment, build, selectors, and validation; it is not supplied as a tested path.

The Mac used to develop this project already has an Android toolchain. A new machine still needs the steps below. Never infer that a tool is installed merely because an earlier chat said so: check the commands.

## Choose a learning path

| Path | Requirements | What it can demonstrate |
|---|---|---|
| Course reader and offline exercises | Node 24, installed dependencies | Language, test design, practice feedback |
| Local Android | Above, Android Studio/SDK/JDK, running emulator or test device | Actual mobile interactions |
| BrowserStack | Dependencies, demo APK, authorized App Automate account | Provider-device execution |

The course reader runs with `npm run course`. Offline exercises are described in [the practice manual](../../exercises/README.md). They are not substitutes for mobile execution evidence.

## 1. Node and project dependencies

Install **Node 24** using your existing version manager or the [official Node distribution](https://nodejs.org/en/download). Avoid installing several competing global Node distributions.

```bash
node --version
npm --version
```

The Node result must start with `v24.`. If `nvm` is already installed, `nvm install 24` and `nvm use 24` select the correct major. A terminal launched before installation may need reopening.

From the repository root:

```bash
npm ci
npm run typecheck
```

Use `npm ci` for the supplied lockfile. Use `npm install` deliberately when changing dependencies, then review both manifest and lockfile. Do not apply `npm audit fix --force` blindly: major dependency changes can break the driver/runner stack. See [dependency triage](troubleshooting.md#dependency-audit-findings).

## 2. Android Studio, SDK, and device

Install Android Studio from the Android developer site. In its SDK Manager, install platform-tools, emulator, command-line tools, and an Android system image matching your host architecture. Create a device in Device Manager; an API 35 Android 15 image is the baseline used for this project's emulator.

Hardware acceleration availability depends on host CPU, virtualization support, OS configuration, and whether you are already inside a virtual machine. Use the [official virtual-device guide](https://developer.android.com/studio/run/managing-avds) when the emulator will not boot.

`ANDROID_HOME` points to the SDK directory. `JAVA_HOME` points to a compatible JDK root. Android Studio bundles a Java runtime, but its location differs by OS and installation.

### macOS / zsh

Check these paths on your machine, then add to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$JAVA_HOME/bin"
```

Open a new terminal or run `source ~/.zshrc`. If Android Studio is installed elsewhere, change `JAVA_HOME` accordingly.

### Linux / bash

Use Android Studio's displayed SDK location. The following SDK path is common; the JDK path is an example that must match your installation:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export JAVA_HOME="/opt/android-studio/jbr"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$JAVA_HOME/bin"
```

Place confirmed values in the shell startup file your terminal actually uses, commonly `~/.bashrc`. Configure emulator acceleration according to Android's Linux instructions; a path change cannot repair missing virtualization support.

### Windows / PowerShell

Use **Environment Variables** in Windows settings to persist `ANDROID_HOME`, `JAVA_HOME`, and Path entries. Common locations are `%LOCALAPPDATA%\Android\Sdk` and `C:\Program Files\Android\Android Studio\jbr`; verify them.

For the current PowerShell session only:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:JAVA_HOME\bin"
```

These session assignments do not persist after closing the shell. Use native Windows tools consistently; mixing a WSL test runner with a Windows emulator requires additional connectivity setup not covered by the baseline. If PowerShell blocks `npm.ps1`, use `npm.cmd` while following your machine's policy; do not disable protections globally just to run this course.

Android documents [environment variables](https://developer.android.com/tools/variables); keep duplicate SDK variables consistent if your other tools require them.

## 3. Verify the toolchain

```bash
java -version
adb version
adb devices
emulator -list-avds
```

Start the emulator through Device Manager, or use its actual listed name:

```bash
emulator -avd Pixel_8_API_35
```

`Pixel_8_API_35` is the existing Mac's AVD name, not a universal default. Wait for Android's home screen. `adb devices` should show a chosen device in state `device`, not `offline` or `unauthorized`.

Install/verify the driver and download the app:

```bash
npm run appium:setup
npm run appium:doctor
npm run app:download
npm run preflight
```

If the driver is already installed, inspect `npx appium driver list --installed`; an already-installed message is not a reason to reinstall everything. `app:download` uses `curl` through npm's shell. On a Windows environment without curl, download the exact APK linked by that script into `apps/wdio-demo.apk` or use `curl.exe` with the same URL.

When several devices are connected, set `ANDROID_UDID` in your local `.env` to the intended serial shown by `adb devices`. Preflight diagnoses prerequisites; it does not run a mobile test.

## 4. First mobile run

```bash
npm run test:smoke
npm run test:forms
npm run test:login
```

WebdriverIO starts the local Appium server. Do not simultaneously leave another server or Inspector session using the same port/device.

## 5. Inspector

Install [Appium Inspector](https://appium.github.io/appium-inspector/latest/quickstart/installation/). With the emulator ready and no test run active:

```bash
npx appium --address 127.0.0.1 --port 4723
```

In Inspector use host `127.0.0.1`, port `4723`, path `/`, and:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android Emulator",
  "appium:app": "/absolute/path/to/is-qa-appium/apps/wdio-demo.apk"
}
```

Replace the path with your actual absolute path; JSON Windows paths need escaped backslashes or forward slashes. Add `appium:udid` when device selection is ambiguous. End the Inspector session and stop this server before returning to npm tests.

[Troubleshooting](troubleshooting.md) · [Course index](../README.md)
