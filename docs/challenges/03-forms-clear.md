# CH-03 · Clear a field that really contained text

**Ticket:** “Users can clear the Forms input. We need a test that proves the
displayed result becomes empty.” A test that starts empty and checks empty would
pass without exercising clear.

## Prerequisites

Compatible running Android device/emulator, verified demo APK and local Appium
setup. Follow [setup](../handbook/setup.md), then
[Forms lesson](../lessons/06-forms.md). This is a real UI assignment; no device
means blocked execution, not a simulated pass. Allow 45–90 minutes.

## Assignment

Read [the Forms reference](../../test/specs/app.forms.spec.ts) and
[FormsScreen](../../test/screens/FormsScreen.ts).
Create your own `test/specs/challenge.forms.spec.ts`; preserve the reference.
Imports from this file use the same relative paths as the reference. Reuse
screen objects and the existing restart/navigation approach.

1. Write the arrange/action/assert outline in words.
2. Begin from a known state, open Forms and wait until it is shown.
3. Enter a distinctive value such as `Practice 42!`. Wait for and assert that
   the result label shows that exact value.
4. Clear the input. Wait for the result label to be exactly the empty string,
   then assert its exact value. Explain why checking the input alone would
   miss a stale result label.
5. Run only your file:

```bash
npm run preflight
npm run test:android -- --spec test/specs/challenge.forms.spec.ts
```

Temporarily omit the clear action in your own test. Predict what fails and run
again. Restore the action and obtain a final pass. Do not add arbitrary sleeps
or weaken the assertion to make the deliberate failure green.

## Acceptance criteria

The test proves populated → empty, is independent of a preceding test and fails
when clear is omitted. It passes when run alone again. Record device/OS, app
version, selected spec and the assertion or wait that caught the defect.

## Evidence and review

Keep a sanitized failure excerpt and final result. A screenshot of an empty
screen without the preceding populated assertion is insufficient evidence.

<details><summary>Hint / reviewer questions — after your attempt</summary>

Inspect the existing condition-wait helper and use a callback that reads the
current result. Empty string is a valid expected value. The deliberate failure
may be a timeout from the wait before the final assertion; explain that signal.
Restarting the app is not a universal reset of backend or persistent app data.

</details>

**Change request:** try spaces and punctuation; first observe the app and write
down the intended expectation. Do not invent product behavior.
Next: [CH-04](04-login-validation.md).
