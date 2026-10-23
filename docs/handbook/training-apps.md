# Extra apps for workplace assignments

Use the WebdriverIO demo for the first lessons. Move to an extra app when an
assignment asks you to transfer a skill: inspect unfamiliar controls, build new
screen objects, establish a reset strategy and defend a useful assertion.
Choose **one app and one assignment** for a session. Downloading an app or running
the provided template does not complete an assignment.

## Choose the fixture

| App / ID | Best practice topics | Prerequisites and limits |
|---|---|---|
| Existing WebdriverIO demo | Forms, simulated login, waits and basic screen objects | The normal setup and seven reference tests remain the starting point |
| Sauce Labs My Demo App native Android 2.3.0 / `saucelabs` | Product identity, sorting, cart quantities and totals, checkout forms, permission prompts | Android device/emulator and downloaded APK; checkout is a demonstration, not proof of real payment or backend authentication |
| Appium ApiDemos 6.1.2 / `apidemos` | Native lists, dialogs, preferences, text input and controlled scrolling | Android device/emulator and downloaded APK; a collection of widgets rather than a complete business workflow |

No Sauce Labs subscription or BrowserStack account is required for these local
assignments. Node 24 and the locked project dependencies are still required.
Reading/planning needs no Android device. Running a mobile spec does.

These additions have **source-reviewed capabilities, verified download bytes and
inspected APK package/launcher metadata**.
They have not yet been executed on this project's Android baseline. Treat the
first launch, locator inspection and reset behavior as a compatibility check on
your device; record the app version and Android version. An installation or
launch failure is a setup investigation, not a completed assignment.

## Download only the app you need

Run from the project root:

```bash
npm run training:apps -- list
npm run training:apps -- download saucelabs
npm run training:apps -- verify saucelabs
```

For widget assignments, replace `saucelabs` with `apidemos`:

```bash
npm run training:apps -- download apidemos
npm run training:apps -- verify apidemos
```

Downloads require internet access to official GitHub release assets. They go to
ignored `apps/*.apk` files. No app is installed and no device/cloud session starts
when downloading, listing or verifying. A failed download preserves an existing
file. No APK, app source or vendor license text is republished with this course.

The local `apps/training-apps.json` manifest pins the exact release
URL, SHA-256 and byte size. The optional apps reuse the project's HTTPS-only,
bounded, staged downloader. Both downloads were checked against GitHub's
published asset digest on 23 October 2026. This establishes byte identity with
the pinned artifact; it is not an independent signing-certificate audit. Never
replace a hash just because an unexpected download does not match it.

## Create your learner file

Choose a new filename for each assignment and keep earlier attempts. Copy the
starter template into the selected app's directory. The commands below refuse
to overwrite an existing `cart.spec.ts`. On macOS/Linux:

```bash
cp -n test/training/assignment.template.ts test/training/saucelabs/cart.spec.ts
```

On Windows PowerShell:

```powershell
if (Test-Path test/training/saucelabs/cart.spec.ts) {
    throw "cart.spec.ts already exists; choose a new assignment filename."
} else {
    Copy-Item test/training/assignment.template.ts test/training/saucelabs/cart.spec.ts
}
```

For ApiDemos use `test/training/apidemos/widgets.spec.ts`. The template deliberately
fails with **Assignment not implemented** until you replace its assertion. It
does not contain a solved cart or widget test. The app directories are ordinary
project files: save/commit or back them up separately from reader progress.

Before manual exploration, start your emulator/test device and list its serial:

```bash
adb devices
```

Replace `YOUR_DEVICE_SERIAL` with that exact online serial, then install the
selected verified APK. For Sauce Labs:

```bash
adb -s YOUR_DEVICE_SERIAL install -r apps/saucelabs-mda-2.3.0.apk
```

For ApiDemos:

```bash
adb -s YOUR_DEVICE_SERIAL install -r apps/apidemos-6.1.2.apk
```

Open **My Demo App** or **API Demos** from the device's app launcher. The `-r`
option requests replacement while keeping existing app data; it is not a clean
state guarantee. If installation fails, save its exact error and investigate
version/signature/device compatibility. Do not uninstall an existing app or
clear its data as a guessed fix. Later, the assignment runner installs/launches
the same pinned app through Appium and requests its session reset.

1. Read the assignment's prerequisites and acceptance criteria. Write a prediction.
2. Explore the selected app manually on a dedicated test device/emulator. Record
   the starting state, package and one distinguishing visible control.
3. Inspect the actual UI hierarchy. Choose locators from this app/version rather
   than reusing the WDIO demo's accessibility IDs or guessing from old tutorials.
4. Replace the template with arrange, act and assert steps. Put reusable screen
   objects beside your learner spec or in a clearly named training folder.
5. Record one intentional failure that your assertion detects, then restore the
   intended expectation. Explain what the evidence does and does not prove.

The existing `test/helpers` include demo-specific behavior. Inspect their package,
reset and selector assumptions before reusing them with a different app.

## Run exactly one assignment

Start a compatible Android emulator/test device using the [setup guide](setup.md).
Use `ANDROID_UDID` in your existing environment when more than one target is
connected. The project runner starts Appium locally on port 4723, so finish any
other run using that port first.

```bash
npm run test:training -- saucelabs --spec test/training/saucelabs/cart.spec.ts
```

Or, after creating the ApiDemos learner file:

```bash
npm run test:training -- apidemos --spec test/training/apidemos/widgets.spec.ts
```

The wrapper verifies the APK and accepts a single existing `.spec.ts` file inside
the selected app's learner directory. It rejects missing files, wildcards,
cross-app paths and extra runner options before starting WebdriverIO. It passes
the app ID and spec to a separate local configuration. The normal `test:android`,
`test:smoke`, `test:forms`, `test:login` and `test:bs` commands still use the WDIO demo.
Do not run the optional app through `test:bs`: that workflow uploads the default
APK. Optional cloud execution is not configured here.

The optional configuration requests an app reset at session start
(`noReset: false`), not before every test. It leaves automatic permission grants
off. Define per-test setup and cleanup yourself, verify the resulting state, and
handle a permission prompt only when it belongs to the scenario. For a
permission-denial assignment, a previously granted permission is not a fresh
denial test. Use the [device-practice guide](device-practice.md) to distinguish
process restart, app data and permission state.

`npm run preflight` remains a check of the shared Android tooling and the WDIO
demo APK. Use the selected `training:apps -- verify` command as the additional
artifact check. Neither command proves UI behavior. Failed specs use the shared
screenshot/XML diagnostics in ignored `logs/`; inspect typed data before sharing.

## What each app can teach

### Sauce Labs: a small shopping journey

The pinned source has a catalog, product details, cart removal, plus/minus
quantity controls, total item count, price totals and checkout screens. Start
with an item identified by its name and visible price, then verify its identity
in the cart. Advance to two products, changed quantities, interrupted checkout
and order-independent tests. A success screen establishes a displayed UI result;
it does not establish a real order, charge, stock reservation or receipt in a
production backend. [Pinned cart source](https://github.com/saucelabs/my-demo-app-android/blob/2.3.0/app/src/main/java/com/saucelabs/mydemoapp/android/view/fragments/CartFragment.java)
and [cart controls](https://github.com/saucelabs/my-demo-app-android/blob/2.3.0/app/src/main/java/com/saucelabs/mydemoapp/android/view/adapters/CartItemAdapter.java).

The app also exposes QR scanning and a WebView. Camera/QR work needs suitable
input and device permissions; WebView automation needs a debuggable context and
a compatible Chromedriver. Those remain investigations with prerequisites, not
promised ready-made tests. The main activity declares portrait orientation, so
rotation work should first characterize that constraint. [Pinned manifest](https://github.com/saucelabs/my-demo-app-android/blob/2.3.0/app/src/main/AndroidManifest.xml).

Use invented names, addresses and payment values. Upstream describes reporting
SDKs and demo network calls, so this is not an offline vault for personal data.
The native repository had no explicit license file at tag 2.3.0; this project
links its public release and does not copy its source or distribute its binary.
The older React Native app is archived and deprecated in favor of the native
apps; its selectors and tutorials should not be treated as interchangeable.
[Native project notes](https://github.com/saucelabs/my-demo-app-android/tree/2.3.0)
and [archived React Native repository](https://github.com/saucelabs/my-demo-app-rn).

### ApiDemos: native controls without a business backend

Explore **Views**, **App** and **Preference** entries to find lists, input and
dialogs. Make one control's state your oracle; then add a missing-item case with
a bounded search and a useful diagnostic. Reinspect after a transition instead
of keeping a stale element reference. The source is a fork of Google's Android
ApiDemos used by Appium; development moved to the Appium Android monorepo in
October 2026. It is Apache-2.0 licensed. [Current fixture documentation](https://github.com/appium/appium-android/tree/android-apidemos%406.1.2/packages/android-apidemos)
and [license](https://github.com/appium/appium-android/blob/android-apidemos%406.1.2/packages/android-apidemos/LICENSE).

Some examples exercise contacts, notifications, location or other device
features. Stay within the selected assignment on a dedicated test device; many
samples have no business meaning and do not belong in an ecommerce smoke suite.

## When the first run fails

| Observation | Next distinguishing check |
|---|---|
| SHA-256/size mismatch | Retry the exact pinned download; compare the official asset metadata rather than bypassing the check |
| No matching learner spec | Check the filename ends in `.spec.ts` and sits under the chosen app's directory |
| APK install/launch fails | Save Android version, architecture and installation error; separate device incompatibility from a test assertion failure |
| Permission dialog blocks the test | Inspect the actual dialog and prior permission state; automatic grants are intentionally off |
| Cart/widget state leaks between tests | Compare a fresh session with a second test in the same session; design a scoped reset and verify it |
| Selector copied from a tutorial fails | Compare its app/release to the pinned native app and inspect the current hierarchy |
| Native test works but WebView cannot attach | Record available contexts, WebView debugging/version and driver compatibility before changing locators |

Review completion through the assignment's evidence criteria. A blocked run
stays pending with its next diagnostic step. Keep lesson and challenge completion
marks separate from assignment attempts.

[Course map](../README.md) · [Device practice](device-practice.md) · [Dependency integrity](dependency-maintenance.md)
