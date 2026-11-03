# Start from zero: your first small wins

**For:** someone who has never programmed or used a terminal. **Device/account
needed:** none for reading; Node 24 and project dependencies for coding.
Android and BrowserStack come later. This preparation route supplements all
16 lessons; it does not replace or remove any existing material.

You do not need to understand the whole dashboard today. Start with one small
task and stop when you can repeat it and explain the result. The “first hour”,
four-week plan and lesson timings elsewhere are optional pacing guides, not
deadlines for a person learning programming for the first time.

## Choose the situation that matches you

| Your situation | Start here | What to leave until later |
|---|---|---|
| I only have this hosted website | Read this route and the examples; write predictions in personal notes | Running commands needs a local project; the website has no exercise terminal |
| I have no tools or project folder yet | Read [computer and terminal basics](computer-basics.md), then [new-machine setup, steps 1–4](../../README.md#setup-on-a-new-machine) | Android downloads and cloud accounts |
| The project is already on my computer | Find its root, check Node 24, and open the reader as described in computer basics | Reinstalling dependencies that already work |
| I can run commands but code feels unreadable | Work through [programming in small steps](programming-first-steps.md) | Classes, screen objects and asynchronous device commands |
| I can code but have never tested software | Start with [your first test workbook](first-test-workbook.md) | Framework design and interview memorisation |

You can open the GitHub Pages reader or clone the public repository without
signing in. The separate private OpenAI Site requires its owner's account.
Local lessons and coding need no OpenAI API key or BrowserStack account.

## A gentle preparation route

Use roughly 20–40 minutes per session, or split a row across several days.
Setup downloads can take longer. Repeat a row when recall is difficult.

| Session | One core task | Evidence before you continue |
|---|---|---|
| A · Find your workspace | Computer basics, B1 | Show the root folder and `package.json`; distinguish editor, terminal and browser |
| B · Make one saved change | Computer basics, B2–B3 | Save a file, run it, change the output, stop and reopen the reader |
| C · Understand values | Programming P1–P3 | Predict text, whitespace and variable changes before running |
| D · Read control flow | Programming P4–P6 | Explain function input/output, an object and a loop using your own examples |
| E · Make failure useful | Programming P7–P8 | Observe an assertion failure and repair it without changing its requirement |
| F · Design a check | First test workbook T1–T3 | Write a test with a starting state and an independent expected value |
| G · Own a small implementation | [First lab coach](first-lab-coach.md) | Attempt lab 01, read its feedback and explain your code |
| H · Return to the course | Lesson 00, then device-free parts of 02–03 | Trace a test at a high level and explain `await`; record device work as pending |

After H, use lesson 01 and the setup manual to prepare Android, then lesson 04
and the Forms/Login lessons. Do T4 of the test workbook once the device works.
Start BrowserStack at lesson 12 when you have the relevant account. The advanced
case bank remains available whenever you need it; it is not today's checklist.

## A repeatable study loop

1. Write one prediction: “This program will print … because …”.
2. Run one command in the project root. Read its last result and first useful error.
3. Compare the result with your prediction, including spaces and capital letters.
4. Change one thing. Save, rerun, and explain why the output changed.
5. Close the example and repeat a small part without copying.

Reading a solution is allowed. After reading one, return later with different
inputs and reconstruct the idea. Copying successfully is a starting point;
independently explaining a changed example is the next goal.

## What “done” means at this stage

- You can create and find a file, save it, and run the intended command twice.
- You can distinguish `''`, `' '`, `'0'`, `0`, `false` and a missing value.
- You can explain where a function gets its inputs and how its result is used.
- You can identify expected/actual values in a failed assertion.
- You can say whether a check used a local function, a mock or a real device.

If you cannot yet do one of these, use its small exercise again. It does not
mean you need to reinstall the project or jump to harder material.

These preparation pages do not add completion boxes to the existing 16-lesson
tracker. Record exercise IDs and questions in lesson 00's notes or your own
private notebook. Wait for the reader's save confirmation. Local notes use
SQLite; hosted notes stay in that browser. Export before moving environments.

## Get useful help when stuck

After about 15 minutes without new evidence, ask for a smaller explanation:

> I am doing P4. I predicted ____. I ran ____. The actual output / first error
> was ____. Here are the few lines I changed. Explain the next smallest step
> and give me one hint; let me try before showing the whole answer.

Share the exact command and relevant error, with secrets removed. Avoid whole
environment files or personal data. If the error says a tool is missing, use
[computer basics](computer-basics.md#read-the-first-useful-error). If the command
runs but gives the wrong value, use the programming example's prediction table.

[Start session A](computer-basics.md) · [Course map](../README.md) · [Study plans](study-plans.md)
