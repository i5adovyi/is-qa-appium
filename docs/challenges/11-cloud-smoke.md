# CH-11 · Move one login smoke test to a real cloud device

**Ticket:** “Prove that our login smoke can run on a real Android device in the
cloud. Keep the scope small enough to diagnose.” This is an execution ticket:
a configuration review alone does not complete it.

## Prerequisites

Your BrowserStack account with App Automate entitlement, available device/time,
local Node dependencies and verified APK. Put credentials only in local
`.env` using the names in `.env.example`; never paste them into notes or chat.
Follow [BrowserStack lesson](../lessons/12-browserstack.md). Allow a separate
setup session if you do not have an account. Cloud sessions may consume quota.

## Assignment

Read [the cloud runner](../../scripts/run-browserstack.mjs) and
[configuration](../../config/wdio.browserstack.conf.ts).
Predict the selected spec and case before starting. Verify that the configured
device/OS is currently available to your account; use your service dashboard as
the source of truth rather than a remembered catalog.

```bash
npm run app:verify
npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep @smoke
```

If the APK is absent or fails verification, follow `npm run app:download`
and resolve the integrity problem before continuing. The runner uploads the
verified APK before starting a session.

1. Record selected device/OS, app build and exact command.
2. In the resulting session, correlate commands, screenshot/video and the
   login success assertion. Confirm at least one intended test actually ran.
3. Record session identifier, status and the final assertion outcome. Keep
   account-sensitive links and artifacts private.
4. If failure occurs, classify upload/authentication, device allocation,
   session creation, navigation or assertion before changing test logic.
   Record the first actionable signal and next step.
5. Rerun only if you can explain why the change or new observation warrants it.

## Acceptance criteria

A real Android session executes the intended login smoke and reaches a known
result with traceable evidence. For completion, obtain a passing intended smoke;
if blocked or failing, save the investigation but leave this challenge incomplete.
A local mock, config typecheck or successful upload is insufficient.

## Evidence and review

Use the common evidence template and add device/OS, app identity and session ID.
The existing demo's success alert proves its simulated login flow, not real
backend authentication.

<details><summary>Hint / reviewer questions — after your attempt</summary>

The wrapper forwards arguments to WebdriverIO. Selecting both the spec and
@smoke avoids running unrelated cases. Check actual selected tests in the output.
Do not assume a device available to another account is available to yours.

</details>

**No account/quota yet:** mark the note blocked with the missing prerequisite.
Continue offline tickets and make CH-12's cloud scope explicitly not run.
Next: [CH-12](12-release-handover.md).
