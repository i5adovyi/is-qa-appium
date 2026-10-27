# Your first BrowserStack study session

**Goal:** leave one short record of what you understood, ran or need next.
Pick one route below. You do not have to complete fifteen lessons today.
The times are study timeboxes, not promises about installation or account approval.

## Choose today's route

| Your situation | Do today | Finish with |
| --- | --- | --- |
| Completely new; no account or tools yet | Route A, 20 minutes | One investigated incident and your next prerequisite |
| Node/project ready; no cloud access yet | Route B, 30–45 minutes | Local checks plus a precise access blocker |
| Account and project ready | Route C, 45–60 minutes | One real Login smoke attempt and its evidence |
| First cloud case already ran | Route D, 30–45 minutes | A report you can explain, before optional report software |

If terminals or files are unfamiliar, begin with
[computer basics](../handbook/computer-basics.md). **This website is the reader.**
Your editor changes local files; your terminal runs commands; BrowserStack's
dashboard shows remote sessions. Keep those three places separate in your notes.

## Route A · Learn without an account

1. Read [BS-00](00-start.md), especially the runner/server/phone diagram exercise
   and the distinction between an upload, a session and a passed assertion.
2. Open [BI-01](incidents.md#bi-01-login-fails-before-a-phone-exists). Its evidence
   is fictional. You are investigating it, not trying to make a real account fail.
3. Write five lines: observed facts, last successful stage, what has not run,
   next observation, and the person/tool that could supply it. Use a local note
   or paper if you have not cloned the project yet.
4. Expand the review guidance after your attempt. Improve one weak explanation.
5. Stop and record your next step: installing Node/cloning, or account readiness
   in [BS-01](01-account.md). No paid session is needed to finish this route.

**Done means:** you can explain why an upload authentication error gives no
evidence about the app's Login button. It does not mean you ran a cloud test.

## Route B · Prepare without spending device time

1. Complete [BS-02](02-project.md) steps 1–3: project/Node checks, dependencies,
   typecheck and an ignored `.env`. Run commands individually and stop at an
   unexpected failure. Keep the first useful error.
2. Without an account, leave placeholder credentials in `.env` and defer step 4.
   Use step 5's APK download and verification commands; these need no account.
   Cloud preflight needs real credentials, so its missing-key result is expected
   at this stage. It is a prerequisite result, not an app failure.
3. Read the supplied Login case and predict its alert assertions. Do not call
   `npm run test:bs` merely to find out whether a missing account might work.
4. Fill the [readiness checklist](templates.md#readiness-checklist). Write an
   exact blocker, such as “App Automate not enabled for this organization,”
   rather than “everything is broken.”

**Done means:** you know which inputs are ready and the next missing one. Move
to Route C when account/device readiness exists; do not keep rerunning setup.

## Route C · Execute one supplied test

1. Finish [BS-01 account readiness](01-account.md) and [BS-02 setup](02-project.md).
   Cloud-only study does not need Android Studio or a local emulator.
2. Follow [BS-03](03-first-run.md) line by line. Use its single selected Login
   smoke command. Choose one build label and predict one executed case.
3. Wait for the command to finish, record its exit status immediately and check
   the selected/executed case counts. Do not launch a second attempt while the
   first is still running or queued.
4. Follow [BS-06](06-dashboard.md) to the exact build/session. Reconcile the
   terminal assertion result with the provider status and actual device.
5. Save the [run record](templates.md#run-record), including failure or missing
   evidence. If blocked, classify the last successful stage using BS-08.

**Done means:** one traceable attempt with a known outcome. A successful upload
or an empty green report does not finish the execution goal. A blocker with
useful evidence is still a valid stopping point for today's study session.

## Route D · Explain the result before adding reporters

1. Use the first section of [BS-07](07-reporting.md) with your run record.
2. Write scope, planned/selected/executed cases, pass/fail/skip counts, session
   count and any retries. Keep an earlier failure visible after a green rerun.
3. Add one evidence reference, one limitation and one next action. If you have
   no actual run, use BS-07-A's supplied fictional numbers and label the result.
4. Ask yourself: could someone identify the exact app, device and source from
   this report? If not, find the missing fact before installing a dashboard.

**Done means:** a useful short report. JUnit, Allure and analytics are optional
extensions after this milestone; start with one when you need its output.

## End the session and return tomorrow

Save files in your editor. If a cloud run was interrupted, check that its remote
session ended. Stop any report viewer or optional tunnel that you started.
In your note write: **where I stopped, evidence saved, next smallest action**.

Once cloned, use `.local-data/browserstack/` for personal records; back those
files up separately. The academy has no completion buttons, and reader progress
exports do not contain these files. Reopen the same note when you return.

[Academy map](README.md) · [Incident bank](incidents.md) · [Templates](templates.md)
