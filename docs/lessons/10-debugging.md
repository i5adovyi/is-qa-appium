# 10 · Debugging from evidence

**Stage:** Diagnose and explain\
**Estimated time:** 90–120 minutes\
**Prerequisites:** Lesson 09; a passing local baseline.\
**Outcome:** Classify failures, run a controlled experiment, and write a report another person can reproduce.

## Start with the earliest useful failure

“Test failed” is an outcome. It is not a diagnosis. A screenshot of the launch screen can accompany several very different causes:

| Layer | Typical evidence | First useful check |
|---|---|---|
| Source/configuration | TypeScript or import error before a session | `npm run typecheck` |
| Device/session | No device, missing driver, missing APK | `adb devices`, doctor, APK path |
| Navigation | Expected screen root never appears | Current screenshot and page source |
| Locator | Correct screen visible, target not found | Compare Inspector attributes with selector |
| Synchronization | Target state appears after an early read | Observe a specific readiness condition |
| Expectation/product | Correct element read, actual differs | Requirement and actual displayed value |
| Teardown/diagnostics | Error while saving evidence after a failure | Preserve the original assertion and session error |

Retries are a measurement aid at most. They do not identify which layer is broken.

## Worked example: a deliberate wrong expectation

In your working copy, temporarily change a Forms expectation from the entered text to `'unexpected'`. Run only the Forms file. A useful report says:

> Forms echo assertion failed after typing `Hello Appium`. The result displayed `Hello Appium`; the test expected `unexpected`. The input selector and action completed. Restoring the expected value repaired this test. This was an injected test defect, not an app defect.

Compare that with “Appium is flaky.” The detailed report ties a claim to an observation and avoids blaming infrastructure when it worked.

The failure hook in `config/wdio.shared.conf.ts` writes evidence under `logs/`. Inspect the actual files produced by your run; diagnostic availability depends on a usable session. A dead session may prevent a screenshot even when text logs exist.

### A device disappearing is not an element failure

If you see `invalid session id`, UiAutomator2 instrumentation stopping, or the emulator process exiting, stop interpreting the last screenshot as proof of a product defect. Confirm the device remains connected with `adb devices`, retain the first Appium/instrumentation error, and reproduce only after the session is healthy. A screenshot command failing afterward is a consequence, not necessarily the cause.

For a reproducible app crash on a dedicated test emulator, collect a bounded recent device log without clearing existing evidence:

```bash
adb -s emulator-5554 logcat -d -t 300
```

Replace the serial with your actual `adb devices` value. This reads device-wide output, which can include unrelated apps and entered data; keep only the relevant redacted excerpt when sharing. An `AndroidRuntime` fatal error for the demo process is different evidence from a UiAutomator2 process or emulator failure. If the device is gone, record that the log could not be retrieved. [Android Logcat command-line reference](https://developer.android.com/tools/logcat).

## Guided lab

1. Run `npm run typecheck` and `npm run test:forms`; record a green baseline.
2. Inject exactly one wrong expected string, as above.
3. Run `npm run test:forms`. Note the first failing test, expected value, actual value, and timestamp.
4. Inspect the newly generated files in `logs/`; correlate them with the test name and run time.
5. Fill in [the failure report template](../handbook/templates.md).
6. Restore the original assertion. Run `npm run test:forms` once to confirm the repair.

Do not commit deliberate defects. If unrelated work already exists in your checkout, restore only the line you changed; avoid a broad reset.

## Exercises

### 10-A · Distinguish a selector failure

Temporarily change the Forms input selector to a nonexistent accessibility ID. Predict the failure, run the smallest relevant test, and contrast it with the wrong-expectation failure.

**Acceptance:** one report shows an element lookup/action failure; the other shows actual-versus-expected data; both include evidence; the selector is restored and the test passes.

<details><summary>Hint 1 · Look at where execution stops</summary>
With a missing input, the test cannot complete `setValue`. It should not reach the later equality assertion.
</details>
<details><summary>Hint 2 · The screen can still be right</summary>
A screenshot containing the expected screen narrows the problem, but does not prove the locator is correct.
</details>

### 10-B · Build a hypothesis table

An intermittent run says the result is empty immediately after typing. Write three competing explanations and a discriminating observation for each. Then implement the smallest readiness improvement you can justify.

**Acceptance:** at least one hypothesis concerns test timing, one concerns app/input behavior, and one concerns initial screen/state; the fix waits on a named condition; remaining uncertainty is stated.

<details><summary>Hint 1 · Avoid changing five knobs</summary>
Increasing all timeouts, adding sleeps, and changing selectors simultaneously makes it impossible to know what repaired the test.
</details>
<details><summary>Hint 2 · Observe input and result separately</summary>
A populated input with an empty result differs from both being empty. Check the screen root before either observation.
</details>

### 10-C · Make the failure actionable

Create a one-page investigation note for a failure you injected. Include environment, smallest command, actual/expected, evidence filenames, hypothesis, one experiment, and outcome. Have a peer—or your next-day self—reproduce it from the note.

**Acceptance:** no credentials or personal data; injected defects clearly labeled; someone can reproduce without asking “which file?”; the final state is green.

<details><summary>Hint 1 · Evidence needs an identity</summary>
“See screenshot” is insufficient if the folder contains yesterday's files. Include its filename and run time.
</details>
<details><summary>Hint 2 · Distinguish observation from inference</summary>
“Error message not displayed in the screenshot” is an observation. “The app never validated” is a stronger inference requiring more evidence.
</details>

## A less tidy investigation

After the guided mutations, try one [incident shift](../handbook/incident-shifts.md).
The opening packet is incomplete; record a hypothesis before opening the reveal.
S2 has runnable faulty code. S4 asks you to separate artifacts from different runs.
Use the decision log to keep facts, guesses and changed conclusions distinct.

## Checkpoint

- Why can a screenshot fail to save even though the failure hook ran?
- What evidence distinguishes a bad selector from the wrong screen?
- What makes a hypothesis falsifiable?
- Why does a later passing rerun not erase the failed observation?

[Solutions](../solutions/10-debugging.md) · [Next: gestures and contexts](11-gestures-and-contexts.md) · [Troubleshooting](../handbook/troubleshooting.md)
