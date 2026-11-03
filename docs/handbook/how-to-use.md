# How to use this project

Use this project to learn one idea, try it in code or on a device, and explain
the result. Choose one small task. Android and a cloud account can wait while
you learn the foundations.

**The browser reader is optional.** You can read the guides, edit code and run
tests entirely from desktop VS Code. Follow [Work with this project in VS Code](vscode.md)
for Markdown preview beside your test files and commands in the integrated
terminal. Use the browser when you want its navigation, notes and progress controls.

## Open the project and reader

Open the existing `is-qa-appium` folder in your editor. Open a terminal in that
folder: you should see `package.json` among its files. If you have not
installed the project yet, follow
[setup on a new machine](../../README.md#setup-on-a-new-machine) first.

Check your Node version:

```bash
node --version
```

It should start with `v24.`. Run `npm ci` after cloning to install the locked
dependencies; you do not need to reinstall them every study session.

If you want the browser reader, start it in **terminal A**:

```bash
npm run course
```

Open the address it prints, normally **http://127.0.0.1:4173**. Keep terminal A
running. Open **terminal B in the same project folder** for exercise commands.
Press **Ctrl+C in terminal A** when you want to stop the reader. Saved progress
survives a restart.

| Where you work | What you do there |
|---|---|
| Browser reader | Read instructions, open hints, navigate tasks, and write lesson/challenge notes |
| Editor | Create or change a test or exercise file, then save it |
| Terminal B | Run the selected command and inspect its output |

The reader displays source files but does not edit or execute them. This also
applies to the hosted/static reader: run code from the local project. In the
reader, use **Theme** and **Text size** for comfort, **On this page** to jump within
a guide, and **Browse course** for navigation on a small screen.

## Choose one route

If you already have an unfinished attempt, resume it. Otherwise choose one row:

| What you want today | Where to go |
|---|---|
| Learn files, the terminal and your first code | [Start from zero](start-from-zero.md) |
| Learn a concept in sequence | [Course map and lessons](../README.md), beginning with lesson 00 |
| Practise TypeScript with supplied checks | [Offline labs](../../exercises/README.md), starting with lab 01 when its prerequisites make sense |
| Take a sequence of workplace tickets | [Challenge path](../challenges/README.md), beginning with CH-01 |
| Repeat a skill at a chosen difficulty | [Assignment bank](../assignments/README.md), selecting one topic and L1 |
| Prepare an interview answer using your own evidence | [Interview practice](interview-practice.md) and [practical drills](interview-drills.md) |

For a 20, 45 or 90 minute plan, use [Choose today's session](study-session.md).
Use [the learning library](../resources.md) when you need a supporting video,
article or book section, then return to the practical task.

**The numbers identify different things.** Lesson `01` is a toolchain lesson;
lab `01` is a TypeScript exercise. Lessons are `00`–`15`, labs are `01`–`14`,
challenges are `CH-01`–`CH-12`, and assignments are `AS-01`–`AS-24`.
`npm run practice -- 01` selects a lab. It cannot run a lesson, `CH-01` or `AS-01`.
Follow the command in the chosen task.

## Complete a useful study session

1. Read the prerequisites and acceptance criteria: what must you be able to
   show at the end? Check whether the task needs Node, Android or BrowserStack.
2. Write a prediction before running anything. For example: “Clearing a field
   containing text should leave an empty value.”
3. Make a small attempt, save the file, and run only the relevant check.
4. Read the first meaningful failure. Compare expected and actual behavior;
   inspect the evidence before changing the code. Open a hint if needed.
5. Change one input or condition to check that your assertion catches a real
   mistake. Restore the intended expectation and explain what the test proves.
6. Save the result and one next action. If execution is blocked, record the
   blocker separately from the design or code you completed.

For lessons and challenges, use **Your evidence & questions**. Choose
**Mark complete ✓** yourself when you can demonstrate the task's criteria.
Running a supplied example is useful setup evidence; independent work and an
explanation show your understanding.

## Try an offline lab

No Android installation or paid account is needed. Start with
[lab 01 instructions](../../exercises/01-typed-data/README.md), then open
[`exercises/01-typed-data/starter.ts`](../../exercises/01-typed-data/starter.ts)
in your editor. Read the requested behavior before implementing it.

In terminal B:

```bash
npm run practice
npm run practice -- 01
```

The first command lists labs; the second checks your saved lab 01 attempt.
Initial failures are expected: labs 01–10 are unfinished and labs 11–14 contain
deliberate bugs. Edit `starter.ts`, save it, and rerun the second command.
Use the lab's `exercise.test.ts` to understand the expected behavior. Keep its
existing assertions intact, and add an extra case there for a behavior you think
is missing. The practice command runs that file; it does not discover other test
files you create.

Keep `solution.ts` separate and compare it after your attempt, or when you want
the full answer. `npm run practice:solutions` checks the supplied answers.
`npm run check` checks the project and references. Neither grades your starters.

## Practise a topic assignment

Open **Assignment bank · topic & level** in the reader. Filter by topic, level
and available tools, then read one ticket. Start with **L1 · Guided**; move to
**L2 · Independent** when you can choose and explain your approach. **L3 ·
Investigation** adds incomplete evidence and team decisions. Higher difficulty
does not always require a device.

Create or resume the learner files named by the ticket. Keep personal notes and
offline attempts in a folder such as `.local-data/assignments/AS-07/`. That
folder is ignored by Git and needs its own backup. For an offline coding ticket,
write both `attempt.ts` and `attempt.test.ts`; once those files exist, run:

```bash
node --test .local-data/assignments/AS-07/attempt.test.ts
```

Replace the ID with your ticket's ID. The bank supplies contracts and review
criteria; you write the tests too. Its [authoring instructions](../assignments/README.md#make-an-attempt-you-can-keep)
explain imports, explicit typechecking and evidence. Running TypeScript through
Node does not typecheck it. Assignments have no reader completion boxes or
automatic grades; save the ticket's evidence template in your own folder.

## Run tests on Android

Complete the [Android setup](setup.md) first: SDK/JDK, a dedicated emulator or
test device, and project dependencies. Start your device and run `adb devices`;
its status must be `device`. When several targets are connected, set
`ANDROID_UDID` to the intended serial as described in setup. Tests may clear
the selected demo app's data, so use a training device.

For the **default WebdriverIO demo**, run these commands one at a time:

```bash
npm run appium:setup
npm run app:download
npm run preflight
npm run test:smoke
```

The first commands verify the driver, obtain the pinned app and diagnose setup.
`test:smoke` performs the device interaction. WebdriverIO starts Appium for you;
finish another Appium run or Inspector session before starting it. After the
smoke works, select `npm run test:forms`, `npm run test:login`, or
`npm run test:android` for all seven default reference tests. These working
examples help you learn the framework; lesson tasks ask you to extend it.

For **My Demo App or ApiDemos**, follow the
[extra training apps guide](training-apps.md). It gives the pinned download,
non-overwriting starter-copy steps, device selection and exact runner commands.
After creating your own `test/training/saucelabs/cart.spec.ts`, for example:

```bash
npm run test:training -- saucelabs --spec test/training/saucelabs/cart.spec.ts
```

That example requires the verified Sauce Labs APK and a running selected device.
The starter deliberately fails until you implement it. The optional apps use
their own runner; `test:android` still selects the default demo. Each optional
app's `reference/` folder contains maintainer compatibility checks, separate
from your assignment attempt. Their commands and tested scope are in the guide.

BrowserStack is optional and needs your App Automate access and credentials.
Follow [lesson 12](../lessons/12-browserstack.md) before `npm run test:bs`, which
uploads the default demo APK and starts real cloud sessions. Optional apps are
not configured for that cloud runner.

## Save your work and return later

Before stopping, save editor files and record the task ID, command, observed
result, evidence location and **next smallest action**. Wait for **Saved to local
database** after editing a lesson/challenge note or completion mark.

| Your work | How it is preserved |
|---|---|
| Local lesson/challenge notes and completion marks | SQLite in `.local-data/progress.sqlite`, or the directory chosen by `COURSE_DATA_DIR`; use the backup command below |
| Hosted/static notes and marks | Browser storage for that address; use **Export progress** before moving browsers/computers or clearing storage |
| Exercise code, assignment attempts and personal evidence | Save the files and back them up separately; progress exports do not include them |
| Reading position, theme and text size | Remembered in this browser/address, separately from progress exports |

From terminal B, back up saved local progress:

```bash
npm run progress:status
npm run progress:backup
```

Keep the printed backup file somewhere safe. These commands read saved database
state; export an unsaved browser draft separately before closing it. Keep secrets,
APKs and raw logs out of commits. Use [local data and recovery](local-data.md)
for imports, conflicting edits or moving computers. There is no automatic sync
between the local reader and a hosted/static reader.

Next time, open the same project and run `npm run course`. **Resume reading**
returns to your bookmark; **First unchecked lesson** follows completion marks.
Your saved next action is the best place to resume the actual work.

## Get unstuck

| Symptom | First useful check |
|---|---|
| npm cannot find `package.json` | Open the terminal in the project root |
| A module is missing or Node is the wrong version | Select Node 24 and finish installation with `npm ci` |
| The reader address will not open | Check terminal A is running and use its printed address; for a port conflict, follow [troubleshooting](troubleshooting.md) |
| A starter or assignment template fails | Read the assertion and task contract; the initial failure may be intentional |
| Android will not start a test | Read `npm run preflight` output and confirm the intended device is online |
| Notes do not show as saved | Export your draft and follow [recovery guidance](local-data.md); preserve the database |

When asking for help, include your task ID, command, first relevant error,
expected result and what you already tried. Remove credentials and personal
data. For tutoring, you can say: “Help me with lab 01. Ask for my prediction,
review my attempt, then give one hint at a time. Keep my files and progress.”

[Course map](../README.md) · [Choose today's session](study-session.md) · [Setup manual](setup.md)
