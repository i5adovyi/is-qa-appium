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
3. Choose **one** scope deliberately. Each block below is an alternative cloud
   run, not a sequence to paste together. Run it in your project terminal.

   One successful Login case:

   ```bash
   npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep '@smoke'
   ```

   All three supplied Login cases:

   ```bash
   npm run test:bs -- --spec test/specs/app.login.spec.ts
   ```

   Just the empty-fields case:

   ```bash
   npm run test:bs -- --spec test/specs/app.login.spec.ts --mochaOpts.grep "empty fields are submitted"
   ```

   Just the supplied clear-input case:

   ```bash
   npm run test:bs -- --spec test/specs/app.forms.spec.ts --mochaOpts.grep "should clear the result when the input is cleared"
   ```

   The unfiltered `npm run test:bs` discovers every matching spec, including
   learner additions.
   The original three files contain seven cases; additions can change that count.
   Before each chosen invocation, save a fresh build label in `.env`, or remove
   that optional value to let the launcher generate one. A label saved in BS-03
   persists until you change it; separate attempts should remain identifiable.
4. For your own test, create `test/specs/app.cloud-practice.spec.ts` in the editor.
   If that file already contains your work, preserve it and continue there or
   choose a new name and use that name in the run command too. Use the scaffold
   below if the file structure is unfamiliar.
   Its setup opens Forms; implement BS-04-A yourself inside `it`.
5. Save the file and check types:

   ```bash
   npm run typecheck
   ```

   Stop if typecheck reports an error. Even a successful typecheck cannot prove
   the test does anything useful: implement the actions, waits and assertions
   and remove the scaffold's intentional error **before paying for a cloud run**.
   Then execute only your new file:

   ```bash
   npm run test:bs -- --spec test/specs/app.cloud-practice.spec.ts
   ```

   This file does not exist until you create it. The cloud command is not an
   offline grader. Once present it also joins the default spec glob; keep it
   passing or move unfinished work outside `test/specs/` deliberately.
6. Verify the runner lists the intended case. Inspect the dashboard and save
   evidence, including both failed and successful attempts when applicable.

## A file scaffold, with the exercise left for you

Paste this into your new `.ts` file, not the terminal. The `.js` suffixes in
imports follow this project's TypeScript module convention; the source files
you edit still end in `.ts`.

```typescript
import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import FormsScreen from '../screens/FormsScreen.js'
import { restartDemoApp } from '../helpers/restartApp.js'
import { waitForText } from '../helpers/waitForText.js'

describe('My cloud Forms practice', () => {
    beforeEach(async () => {
        await restartDemoApp()
        await TabBar.openForms()
        await FormsScreen.waitForIsShown()
    })

    it('BS-04-A should clear a populated result', async () => {
        throw new Error('BS-04-A: implement the actions and assertions before a cloud run')
    })
})
```

`describe` names the group; `beforeEach` gives every case the same starting
screen; `it` is the case you implement. The deliberate error prevents an empty
case from appearing green. Removing it alone is not a solution. `waitForText`
waits for an observable UI value; Chai's `expect` compares the value you read.
The supplied Forms spec remains a separate worked reference.

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
Put the Login case in its own `describe` group with setup that opens Login,
not inside the Forms group above. Add the `LoginScreen` import and follow
the existing Login spec's setup. Define a new `it` beside other cases, never
inside another `it`. Filter on its unique title when running it alone.
Do not mistake the demo's email/length rules for real authentication. If you add
an absence assertion, establish that validation has finished before checking.
</details>

## Checkpoint

Can you explain arrange, action, wait and assertion in your own test? To prove
it can fail, use the controlled-defect exercise in BS-08 on your practice file.

[Previous](03-first-run.md) · [Path](README.md) · [Next: devices and versions](05-devices.md)
