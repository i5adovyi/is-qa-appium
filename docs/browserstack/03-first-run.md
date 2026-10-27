# BS-03 · Run one login test on a real Android device

**Stage:** Run automation · **Time:** 30–45 minutes after setup

## Prerequisites

[BS-02](02-project.md) complete, App Automate access with available capacity,
verified APK and a device/OS your account supports. This is a real cloud exercise;
it consumes account resources. No local emulator is required. Read the selected
[login reference](../../test/specs/app.login.spec.ts) before running.

## Step by step

1. Find `should log in with valid credentials @smoke` in the Login spec.
   Predict its actions and two assertions: alert title `Success`, message
   `You are logged in!`. It then dismisses the alert and waits for it to close.
2. In `.env`, choose a recognizable build label, for example
   `bs-login-2026-10-27-attempt-01`. Use a new label on your next attempt.
3. Record the source version and confirm inputs:

   ```bash
   git rev-parse HEAD
   git status --short
   npm run typecheck
   npm run preflight -- --cloud
   ```

   An uncommitted test change must be noted alongside the commit; a commit ID
   alone would not describe the code you ran.
4. Run exactly the Login smoke selection:

   ```bash
   npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep @smoke
   ```

   The first `--` forwards options through npm. `--spec` chooses the file;
   `--mochaOpts.grep` chooses matching full test titles within it. No fixed sleep
   or separate Appium server is needed.
5. Expect upload, worker/session startup, the named case, then a summary and
   process exit. Wording varies by runner version. Confirm **one intended case
   actually executed**. A successful upload message is only the first milestone.
6. Immediately check the exit status: macOS/Linux `echo $?`; PowerShell
   `$LASTEXITCODE`. Zero is necessary but not sufficient: verify a nonzero
   intended executed-test count and the assertion outcome.
7. Open [App Automate](https://app-automate.browserstack.com/). Find your build
   label and its session, matching time/device. Follow [BS-06](06-dashboard.md)
   for both old and new dashboard navigation.
8. Fill the [run record](templates.md#run-record). Keep the session link private
   unless its sharing permissions and evidence have been reviewed.

## If it fails

Stop at the earliest meaningful failure. No upload? Check APK or credentials.
Upload but no session? Check entitlement/device/capabilities/capacity. Session
but no assertion? Check startup/navigation/keyboard. Failed assertion? Compare
expected and actual UI. Use [BS-08](08-failures.md); changing a selector cannot
repair rejected credentials.

To interrupt a runaway attempt, press Ctrl+C once and check the dashboard until
the remote session ends. A terminated terminal does not prove remote cleanup.
If a session remains running, use the provider's supported stop control for
your session. Record cancellation as incomplete evidence, not a pass.

## Exercises

### BS-03-A · First cloud evidence

**Task:** predict, execute the command above once and correlate its output with
one real session. Save the run record.
**Acceptance:** selected case name, executed count, commit/dirty state, app,
device/OS, build/session ID, runner exit and assertion outcome are recorded.
A blocked attempt has a blocker; only a real passing assertion demonstrates it.

<details><summary>Hint and review</summary>
Check actual session counts too. Grep without file selection can schedule other
files. The dashboard may show a completed session without a verified test pass.
</details>

### BS-03-B · Handover after failure

**Task:** use your failure or the synthetic case “upload succeeded, device/OS
rejected, no session ID.” Write a three-sentence teammate handover.
**Acceptance:** identify the reached stage, unexecuted behavior and one useful
next action; do not invent a screenshot from a session that never existed.

<details><summary>Hint and review</summary>
Report configuration/setup failure and missing behavior evidence. Verify the
requested pair in the account before changing login code. Offline analysis is valid.
</details>

## Checkpoint

Can someone follow your evidence from exact test command to final assertion?
Next, learn to select and write your own scenario; the demo success alert does
not prove a real identity service accepted a password.

[Previous](02-project.md) · [Path](README.md) · [Next: your automation](04-automation.md)
