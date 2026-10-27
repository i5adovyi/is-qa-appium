# BS-02 · Prepare a project for cloud execution

**Stage:** Get ready · **Time:** 30–60 minutes

## Prerequisites

Git access to this repository, Node 24 and [BS-01](01-account.md) for live access.
Use the [new-machine guide](../../README.md#setup-on-a-new-machine) for installing
Git/Node and cloning. Commands below run at the repository root, where
`package.json` exists. They do not require Android Studio, Java or an emulator.

## Step by step

1. Open the **existing project folder** in your editor, then its terminal.
   This is the folder containing `package.json`, `README.md`, `course/` and
   `test/`. If you only have the course website, first follow the linked
   new-machine guide to clone the repository. Check Node, then npm:

   ```bash
   node --version
   ```

   ```bash
   npm --version
   ```

   Check the terminal's folder and project name:

   ```bash
   node -p "process.cwd()"
   ```

   ```bash
   node -p "require('./package.json').name"
   ```

   Install the locked packages, then check project types:

   ```bash
   npm ci
   ```

   ```bash
   npm run typecheck
   ```

   Node must report `v24...`. `npm ci` installs the lockfile's packages; it does
   not create a cloud account. Do not replace the lockfile with a provider sample.
   The package-name command should print **`is-qa-appium`**. A missing
   `package.json` means the terminal is in the wrong folder; open a terminal in
   the clone before installing. If Node/npm is not found or any command fails,
   fix that step before continuing. Typecheck may print no errors and simply
   return to the prompt; that is expected, and it runs no device tests.
2. Create `.env` only if absent. In macOS/Linux:

   ```bash
   test -f .env || cp .env.example .env
   ```

   In PowerShell:

   ```powershell
   if (!(Test-Path .env)) { Copy-Item .env.example .env }
   ```

   Use only the block for your shell. These copy commands normally produce no
   output. Open `.env` in your editor's file list/quick-open: the leading dot
   is part of the name, and some file managers hide dotfiles. Its exact name is
   **`.env`**, not `.env.txt`; keep it beside `package.json`, not inside `config/`.

3. Verify the file is ignored **before adding credentials**, without printing
   its contents:

   ```bash
   git check-ignore .env
   ```

   Expected: `.env`. If it is already tracked or the result is unexpected, stop
   and inspect the Git state before adding credentials. Never use `git add -f`.
4. Edit `.env` locally, replacing only the relevant values and preserving any
   other settings you already have. Copy the username/key from your own account. These
   example values are placeholders and deliberately fail validation:

   ```dotenv
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_access_key
   BROWSERSTACK_DEVICE_NAME=Samsung Galaxy S24
   BROWSERSTACK_PLATFORM_VERSION=14.0
   BROWSERSTACK_BUILD_NAME=bs-first-login-2026-10-27-01
   ```

   Verify the device/OS in your account; change the example if necessary. Choose
   a fresh build label for each intended run so you can find its sessions.
   Omitting the build label makes the wrapper generate one once per invocation.
   The `dotenv` block is **file content, not a terminal command**. Save the file
   with Ctrl+S (Windows/Linux) or Cmd+S (macOS). A value in an unsaved editor tab
   is not available to the next command. Do not edit `.env.example` to store keys.
5. Download the pinned app and check cloud inputs:

   ```bash
   npm run app:download
   ```

   After download finishes, verify the local APK:

   ```bash
   npm run app:verify
   ```

   If verification succeeds, check cloud inputs:

   ```bash
   npm run preflight -- --cloud
   ```

   A failed checksum must be resolved before upload. Do not edit the expected
   checksum to accept unexplained bytes. A green preflight checks local input
   readiness; it cannot check provider entitlement, capacity or real behavior.
   Expect `Demo APK SHA-256 and size verified.` from the app check and
   `All preflight checks passed.` from a successful cloud preflight. If it
   instead says `check(s) need attention`, resolve those checks before BS-03.
   These preparation commands do not create a cloud session. Without account
   credentials, the cloud preflight is expected to remain blocked; save that fact.

## What the project already does

Read [the launcher](../../scripts/run-browserstack.mjs),
[upload helper](../../config/browserstack-api.ts) and
[remote configuration](../../config/wdio.browserstack.conf.ts). The launcher
verifies the APK, uploads it, receives a `bs://...` app identifier and passes
that identifier and one build label to WebdriverIO. The remote configuration
uses the provider hub and no local Appium service. Do not start `appium` manually,
set `BROWSERSTACK_APP_URL` yourself, or run `appium:doctor` for cloud-only setup.

Existing shell/CI environment variables take precedence over `.env` values in
Node's environment loader. If an edited value seems ignored, inspect where it
is configured without printing it; use a fresh terminal or correct that source.

## Exercises

### BS-02-A · Trace an app upload

**Task:** annotate the three files above: credential lookup, checksum verification,
upload, app identifier, child environment and remote destination.
**Acceptance:** explain why a path on your laptop cannot be the remote APK and
why successful upload alone is not a test pass. No cloud request is needed.

<details><summary>Hint and review</summary>
`BROWSERSTACK_APP_URL` is set by the wrapper after upload. Calling `npx wdio`
directly with the cloud config bypasses that preparation and is not this route.
</details>

### BS-02-B · An old key wins

**Task:** supplied scenario: a new key is saved in `.env`, yet the runner uses an
old key configured in the terminal environment. Write a diagnosis and repair
plan; do not intentionally break real credentials or print them.
**Acceptance:** name both sources, their precedence and a safe verification
step. Distinguish a missing/placeholder key from an HTTP authentication rejection.

<details><summary>Hint and review</summary>
Changing one file cannot override every parent process environment. After
correcting the source, use cloud preflight, then one deliberate test attempt.
</details>

## Checkpoint

Typecheck, APK verification and cloud preflight should pass before BS-03. If
blocked, save the exact check and proceed with offline incident exercises.

[Previous](01-account.md) · [Path](README.md) · [Next: first real run](03-first-run.md)
