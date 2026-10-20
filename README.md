# is-qa-appium — mobile test automation training project

Starter project for learning mobile UI automation from zero:

| Tool | Role in this project |
|---|---|
| **Appium 3** (+ UiAutomator2 driver) | Server that drives the real app on an Android emulator/device |
| **WebdriverIO 9** | Test runner + client that talks to Appium (`$('~id').click()`) |
| **Mocha** | Test structure: `describe` / `it` / `beforeEach` |
| **Chai** | Assertions: `expect(x).to.equal(y)` |
| **TypeScript** | Typed test code, autocompletion for every WebdriverIO command |
| **BrowserStack App Automate** | Same tests, run on real devices in the cloud |

The app under test is the open-source [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app)
(login form, forms, swipe, drag & drop, webview), built for practicing automation.

This project uses WebdriverIO 9 to match the installed BrowserStack service's declared peer dependencies.

## Start here: your first practice session

On the Mac already configured for this project, Node 24, Android Studio, the SDK and
the `Pixel_8_API_35` emulator are installed. Dependencies, the UiAutomator2 driver and
the demo APK are also installed. On a new machine, follow sections 1 and 2 first.

1. Open a terminal in this project and run `source ~/.zshrc`.
2. Start `Pixel_8_API_35` from Android Studio's Device Manager, or run
   `emulator -avd Pixel_8_API_35` in a separate terminal. Wait for the Android home screen.
3. Run `adb devices`. The emulator should have status `device`.
4. Run `npm run test:smoke`. This runs two tests: app launch and successful login.
   The Forms file is skipped because it has no `@smoke` tests.
5. Run `npm run test:android` for all five starter tests.

The demo login is simulated: no account registration or real credentials are needed.
Use the sample values in the tests, not personal credentials.

### Understand one test before writing another

Open `test/specs/app.forms.spec.ts`. Its first test has three parts:

```ts
it('should echo typed text in the result field', async () => {
    const text = 'Hello Appium' // arrange: choose test data
    await FormsScreen.input.setValue(text) // act: enter text on the device
    expect(await FormsScreen.inputResult.getText()).to.equal(text) // assert: check the result
})
```

- `describe` groups related tests; `it` defines one test.
- `beforeEach` opens the Forms screen before each test in that group.
- `async` and `await` let a test wait for device commands to finish.
- `FormsScreen.input` is a getter in `test/screens/FormsScreen.ts`.
  It uses `$('~text-input')`: `$` finds an element and `~` selects by accessibility ID.
- Chai's `expect(actual).to.equal(expected)` fails when the values differ.
  Chai assertions do not retry automatically; wait for the relevant UI state before asserting.
- The `.js` imports in these TypeScript files are intentional; the test runner resolves
  them to the TypeScript sources.

Your first exercise: change `Hello Appium` to your own text and run only the Forms tests:

```bash
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.forms.spec.ts
```

Next, temporarily change the expected text to a different value. Run again, read the
failure message, and inspect the screenshot in `logs/`. Restore the correct expectation
and make the test pass. This teaches you how to recognise a real test failure.

Then add your first independent test inside the Forms `describe` block:
enter text, clear the input with `clearValue()`, and assert the result text is empty.
Keep the existing tests passing. Use `npm run typecheck` to catch TypeScript mistakes.

### What to learn next

| Stage | Practise | Done when |
|---|---|---|
| 1. TypeScript basics | Variables, strings, functions, imports, `async` / `await` | You can explain each line of the Forms test |
| 2. Read and debug | Run one test, make an assertion fail, inspect the screenshot | You can distinguish a selector failure from a wrong expected value |
| 3. Write tests | Clear a text field; add a separate empty-login test | You have written a passing test without copying a whole spec |
| 4. Find elements | Inspect the app and add selectors to a screen object | You can automate a new control such as the dropdown |
| 5. Cloud execution | Add BrowserStack credentials and run the same Android tests | You can find the session's video and logs in App Automate |

Start with Android. The current selectors and alert helper are Android-specific;
adding iOS later requires an iOS app build, a driver configuration and selector review.

---

## 1. One-time machine setup (macOS)

### 1.1 Node.js (≥ 22.12, 24 LTS recommended)
```bash
brew install nvm            # or download from https://nodejs.org
nvm install 24 && nvm use 24
node -v
```

### 1.2 Android Studio (gives you SDK, emulator and a Java runtime)
1. Install from https://developer.android.com/studio and open it once — let it download the SDK.
2. **Settings → Languages & Frameworks → Android SDK → SDK Tools**: tick *Android SDK Command-line Tools* and *Android Emulator*.
3. **Device Manager → Create device**: e.g. *Pixel 8*, system image *API 35*. Start it.

Add to `~/.zshrc`, then open a new terminal:
```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
```
Check: `adb devices` should list `emulator-5554   device`.

### 1.3 Appium Inspector (to find element selectors)
Download the desktop app: https://github.com/appium/appium-inspector/releases

---

## 2. Project setup
```bash
npm install            # WebdriverIO, Appium, Chai, TypeScript...
npm run appium:setup   # first-time install of the UiAutomator2 driver (already installed on this Mac)
npm run appium:doctor  # verifies ANDROID_HOME, JAVA_HOME, adb... fix anything red
npm run app:download   # downloads the demo app to apps/wdio-demo.apk
npm run typecheck      # TypeScript compiles?
```

## 3. Run tests

**Locally** (emulator must be running):
```bash
npm run test:android                      # all specs
npm run test:smoke                        # only tests tagged @smoke
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.login.spec.ts   # one file
```
WebdriverIO starts Appium for you. Appium log: `logs/wdio-appium.log`; failure screenshots: `logs/`.

**On BrowserStack** (free trial: https://www.browserstack.com/app-automate):
```bash
test -f .env || cp .env.example .env   # preserve existing credentials
# Edit .env locally: set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.
npm run test:bs
```
Use a BrowserStack account with App Automate access. The service uploads the APK, runs on the devices listed in `config/wdio.browserstack.conf.ts`,
and you watch video/logs at https://app-automate.browserstack.com.
The cloud configuration is prepared but needs your credentials for verification.
If your account allows only one concurrent session, set its `maxInstances` to `1`.
`.env` is ignored by Git; never commit or paste access keys into test code.

---

## 4. Project structure
```
config/
  wdio.shared.conf.ts        # common settings: specs, Mocha, timeouts, reporter, screenshot-on-fail
  wdio.android.conf.ts       # local: Appium service + emulator capabilities
  wdio.browserstack.conf.ts  # cloud: BrowserStack service + real devices
test/
  screens/                   # Screen Objects (= Page Objects for mobile): selectors + actions
  helpers/NativeAlert.ts     # Android system dialog helper
  specs/                     # the tests — only describe/it + Chai assertions
apps/                        # downloaded .apk (git-ignored)
```
Rule of thumb: **selectors live in `screens/` or shared UI helpers**, specs read like a scenario.

---

## 5. Learning path (zero → confident)

Work through these in order. Each step = one small commit.

**Step 1 — Get green.** Run `npm run test:smoke` locally until it passes. Read every file in `config/` and
`test/` — they are short and commented.

**Step 2 — Learn selectors.** With the emulator running, start a standalone Appium server:

```bash
npx appium --address 127.0.0.1 --port 4723
```

Open Appium Inspector, connect to host `127.0.0.1`, port `4723`, path `/`, using these capabilities
(replace the app path with the absolute path on your machine):

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android Emulator",
  "appium:app": "/absolute/path/to/is-qa-appium/apps/wdio-demo.apk"
}
```

Explore the Login screen. End the Inspector session and stop its Appium server with Ctrl+C
before running tests; the test runner starts its own server on the same port.
Prefer stable accessibility IDs or resource IDs; use text or XPath when needed:
- `~accessibility-id` (works on Android *and* iOS — preferred)
- `id=com.app:id/...` (Android resource-id)
- `android=new UiSelector().text("...")` (Android-only)
- XPath (`//android.widget.TextView[@text="..."]`) — slow and brittle, last resort

**Step 3 — Write your own tests** (exercises against the demo app):
1. Sign Up: open *Sign up* tab, fill email/password/repeat password (`~input-repeat-password`), tap `~button-SIGN UP`, assert the success alert.
2. Sign Up negative: passwords don't match → assert `Please enter the same password`.
3. Forms: open the *Dropdown*, choose an item, assert the selected value.
4. Swipe tab: swipe the carousel left with `driver.swipe()` / `element.scrollIntoView()`; assert a different card is visible.
5. Drag tab: drag a piece to its target with `element.dragAndDrop()`.
6. Webview tab: switch context with `driver.switchContext()` and assert web content — hybrid apps are common in real projects.

**Step 4 — Make it robust.**
- Never use `driver.pause()` for syncing — use `waitForDisplayed`, `waitUntil`.
- Make each test establish its starting state. Restarting an app does not clear stored data,
  and `appium:noReset: true` preserves state. Explicitly restore controls or reset app data
  when your scenario needs it.
- Test data in one place (`test/data/users.ts`), secrets in `.env` only.

**Step 5 — Cloud.** Run `npm run test:bs`, add/remove devices, look at the video & Appium logs in the dashboard.

**Step 6 — Grow like a real project.**
- Add iOS: `config/wdio.ios.conf.ts` with `appium:automationName: 'XCUITest'` (needs Xcode + simulator build of the demo app).
- Reporting: `@wdio/allure-reporter`.
- CI: GitHub Actions job running `npm run test:bs` on every push.
- Lint/format: ESLint + Prettier.

---

## 6. Troubleshooting
| Symptom | Fix |
|---|---|
| `Could not find a connected Android device` | Start the emulator; `adb devices` must list it |
| `ANDROID_HOME / JAVA_HOME is not set` | Re-check `~/.zshrc`, open a new terminal, run `npm run appium:doctor` |
| `Could not find a driver for automationName 'UiAutomator2'` | `npm run appium:setup` |
| Element not found | Check the selector in Appium Inspector; the screen may not be loaded — add a `waitForIsShown()` |
| BrowserStack `Parallel limit reached` | Lower `maxInstances` or remove a device from the list |

## Docs
- WebdriverIO mobile: https://webdriver.io/docs/api/mobile
- Appium: https://appium.io/docs/en/latest/
- UiAutomator2 capabilities: https://github.com/appium/appium-uiautomator2-driver
- Chai `expect`: https://www.chaijs.com/api/bdd/
- BrowserStack + WebdriverIO: https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio
