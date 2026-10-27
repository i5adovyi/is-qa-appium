# BS-04 · Write, select and run your own automation

**Stage:** Run automation · **Time:** 60–90 minutes

## Prerequisites

[BS-03](03-first-run.md) for live execution; [async/assertions](../lessons/03-async-and-assertions.md)
and [first-test lesson](../lessons/04-first-test.md) for writing code. Offline
reading and test design are possible without cloud access. Use fictional inputs.

## Step by step

1. Open [the Login spec](../../test/specs/app.login.spec.ts). `describe` groups
   cases, `beforeEach` prepares each case and `it` defines one behavior. Every
   asynchronous device action needs `await`; Chai compares an observed result
   to an expectation. BrowserStack changes where those actions execute, not
   what a good assertion means.
2. Trace its setup: restart the demo, open Login, wait for it, select the Login
   tab. The restart helper resets this demo's in-memory state; it does not reset
   a real backend or delete persistent storage.
3. Choose a scope deliberately. These commands use the cloud launcher:

   ```bash
   # One successful login case
   npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep @smoke

   # All three supplied Login cases
   npm run test:bs -- --spec test/specs/app.login.spec.ts

   # Just the empty-fields case
   npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "empty fields are submitted"

   # Just the supplied clear-input case
   npm run test:bs -- --spec test/specs/app.forms.spec.ts --mochaOpts.grep "should clear the result when the input is cleared"
   ```

   Run one selected command, not the entire block as a batch. The unfiltered
   `npm run test:bs` discovers every matching spec, including learner additions.
   The original three files contain seven cases; additions can change that count.
4. For your own test, create `test/specs/app.cloud-practice.spec.ts` in the editor.
   Use the structure from lesson 04, importing the existing screen objects and
   restart helper. Write one scenario with a title you can filter exactly.
5. Save, typecheck and execute only your new file:

   ```bash
   npm run typecheck
   npm run test:bs -- --spec test/specs/app.cloud-practice.spec.ts
   ```

   This file does not exist until you create it. The cloud command is not an
   offline grader. Once present it also joins the default spec glob; keep it
   passing or move unfinished work outside `test/specs/` deliberately.
6. Verify the runner lists the intended case. Inspect the dashboard and save
   evidence, including both failed and successful attempts when applicable.

## Exercises

### BS-04-A · Enter, clear, prove empty

**Task:** independently write a Forms case that enters `Night study 42`, verifies
the echoed result, clears the input, waits for the result to become empty and
asserts the empty result. Reuse [FormsScreen](../../test/screens/FormsScreen.ts).
Read the reference only after an attempt or when you want a worked example.
**Acceptance:** meaningful populated and empty observations, awaited actions,
bounded waits, one selected executed case and a saved session record. No arbitrary
sleep, `.skip` or swallowed failure. Without access, save design/code as unexecuted.

<details><summary>Hint and review</summary>
An empty-to-empty check could pass even if typing never worked. The existing
Forms reference demonstrates the distinction; explain it in your own words.
Use the screen object's output to observe the app, not a local string variable.
</details>

### BS-04-B · Check a missing-field boundary

**Task:** add a case with an empty email and a password satisfying the demo's
length rule. Submit and require the email validation message. Decide whether
password-error absence is also required from the demo's documented behavior.
**Acceptance:** isolated setup, an explicit expected message, one-case command,
and evidence from running alone and with your practice file. Explain why the
existing “both empty” test does not cover this boundary by itself.

<details><summary>Hint and review</summary>
Use the Login helpers; inspect actual methods before inventing a selector.
Do not mistake the demo's email/length rules for real authentication. If you add
an absence assertion, establish that validation has finished before checking.
</details>

## Checkpoint

Can you explain arrange, action, wait and assertion in your own test? To prove
it can fail, use the controlled-defect exercise in BS-08 on your practice file.

[Previous](03-first-run.md) · [Path](README.md) · [Next: devices and versions](05-devices.md)
