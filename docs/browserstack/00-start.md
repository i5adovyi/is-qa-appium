# BS-00 · Know what runs where

**Stage:** Get ready · **Time:** 25–40 minutes

## Prerequisites

A browser and this guide. For commands, learn to open the project folder and
terminal using [computer basics](../handbook/computer-basics.md). No account or
device is needed for this lesson's exercises.

## Step by step

1. Read this chain aloud: **spec → WebdriverIO → BrowserStack's Appium server →
   real Android device → app → assertion → result**. Your TypeScript runs on
   your laptop or CI runner; the app runs on the remote phone.
2. Identify the four credentials/identities people confuse:
   BrowserStack username/key authorizes cloud use; demo email/password is
   fictional test input; GitHub login accesses the private repository; an
   OpenAI account controls this hosted reader. They are different systems.
3. Choose a route from the table. A local smoke pass is helpful, but it is not
   a technical prerequisite for the cloud-only route.
4. Make a personal evidence folder `.local-data/browserstack/` using your editor.
   Save a copy of the [readiness template](templates.md#readiness-checklist).
5. Learn the result vocabulary before running anything.

| Route | Requirements | Start |
| --- | --- | --- |
| Read and reason | Browser; Node 24 for offline labs | This lesson, incident cards, lab 07/09 |
| Cloud-only Android | Node 24, clone, locked dependencies, verified demo APK, authorized App Automate access | BS-01–03; no local emulator/SDK/JDK |
| Local then cloud | Above plus local Android toolchain | Original lesson 01, local smoke, then BS-01–03 |

| Word | Meaning in this course |
| --- | --- |
| Spec | A file containing tests; not a product requirements document here |
| Test case | One Mocha `it(...)` with actions and assertions |
| Worker | A runner process executing scheduled spec work |
| Session | A remote device connection with its own ID; can contain several cases |
| Build | A provider grouping/label for related sessions |
| Capability | Requested device/session setting |
| Artifact | Evidence such as screenshot, video, XML, logs or report |
| Preflight | Checks local prerequisites; does not execute a test |
| Blocked | Required access/environment is missing; no behavioral result yet |

The project uses Appium, TypeScript, Chai, Mocha and WebdriverIO 10. It connects
directly to BrowserStack without the BrowserStack SDK. Provider quickstarts
currently describe WDIO 7–9; that is a compatibility boundary to validate,
not an instruction to replace the project's lockfile. See [sources](sources.md).

## Exercises

### BS-00-A · Draw the journey

**Task:** draw where the runner, APK, server, phone and assertion live. Predict
whether closing the course website stops a terminal test.
**Acceptance:** identify the computer running each part and explain why opening
the website does not run Appium. Keep the drawing in your personal folder.

<details><summary>Hint and review</summary>
The reader displays instructions. A separately running terminal process owns
the test. Browser storage stores reading progress, not device sessions.
</details>

### BS-00-B · Separate five claims

**Task:** label these observations: APK hash matches; upload returns an ID;
session starts; assertion passes; three required device classes pass.
For each, write one thing still unproved.
**Acceptance:** five distinct claims, including the difference between one
successful device and the intended coverage matrix.

<details><summary>Hint and review</summary>
Integrity is not installation, installation is not a correct flow, and a passing
flow on one device does not establish every supported device. No execution is
required for this written exercise.
</details>

## Checkpoint

Can you explain your chosen route and its next missing prerequisite without
saying simply “BrowserStack doesn't work”?

[Path](README.md) · [Next: account and access](01-account.md)
