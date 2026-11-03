# BS-00 · Know what runs where

**Stage:** Get ready · **Time:** 25–40 minutes

## Prerequisites

A browser and this guide. For commands, learn to open the project folder and
terminal using [computer basics](../handbook/computer-basics.md). No account or
device is needed for this lesson's exercises.

## Keep four places separate

| Place | What you do there |
| --- | --- |
| This course website | Read instructions, open hints and follow links |
| Your editor, with the project folder open | Create/edit files, including `.env` and your test |
| Your project's terminal | Run commands beginning with `node`, `npm` or `git` |
| BrowserStack's signed-in website | Check access, find the remote session and inspect evidence |

A command shown in a lesson is not a button that runs a test on this website.
You type or paste it into the terminal. A `dotenv` block belongs in `.env`; a
`ts`/TypeScript block belongs in the named source file. Do not paste either into
the terminal. Run command lines one at a time, wait for each to finish, and read
its result before continuing. Do not copy Markdown fences such as ` ```bash `.

If `npm run course` is already running in a terminal, leave it there and open a
second project terminal for the exercises. The hosted reader needs no local
course-server terminal. [VS Code walkthrough](../handbook/vscode.md).

## Step by step

1. Read this chain aloud: **spec → WebdriverIO → BrowserStack's Appium server →
   real Android device → app → assertion → result**. Your TypeScript runs on
   your laptop or CI runner; the app runs on the remote phone. The device's
   observed value returns to your runner, where the Chai assertion compares it.
2. Identify the four credentials/identities people confuse:
   BrowserStack username/key authorizes cloud use; demo email/password is
   fictional test input; a GitHub login is needed to push to your repository;
   an OpenAI account controls the separate private OpenAI Site. The public
   GitHub Pages reader opens without signing in.
3. Choose a route from the table. A local smoke pass is helpful, but it is not
   a technical prerequisite for the cloud-only route.
4. Make a personal evidence folder `.local-data/browserstack/` using your editor.
   Save a copy of the [readiness template](templates.md#readiness-checklist).
   If you have not cloned the project yet, keep an ordinary temporary study note;
   move it into that folder after BS-02. Do not create the folder on the website.
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
| Assertion | A check comparing what the app actually showed with what you expected |
| APK | The Android installation file uploaded to the remote device |
| Clone | A local copy of the Git repository, opened as your project folder |

## Your first small milestone

Do BS-00–03, then jump to BS-06 to find your result. The first goal is **one
supplied Login case and its evidence**, not installing every optional reporter
or running all fifteen lessons at once. BS-04 teaches writing your own case;
BS-07's extra reporters can wait until the baseline result makes sense.

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
