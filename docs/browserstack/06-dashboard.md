# BS-06 · Read the dashboard without guessing

**Stage:** Read and report · **Time:** 30–60 minutes

## Prerequisites

One attempted [BS-03 run](03-first-run.md), its terminal output and build label.
If no session exists, use the supplied exercises as offline analysis. The
dashboard is account-dependent; this guide does not pretend to show your account.

Keep two views open: your terminal's completed output and BrowserStack's website.
The course reader itself does not display your cloud sessions. If you have no
account/run yet, start with **BS-06-B** below; BS-06-A remains a plan until you
have your own execution evidence.

## Step by step

1. Open [App Automate](https://app-automate.browserstack.com/) in the correct team.
   BrowserStack is migrating dashboards. In the newer interface, find
   **Overview / Projects**, select `is-qa-appium`, then **Build Runs**. In the
   older interface use the App Automate builds list. Follow the resource names
   if your labels differ. [Official migration guide](https://www.browserstack.com/docs/test-reporting-and-analytics/dashboards/optimize-dashboard).
2. Search/filter by the build label from your run, date and project. Check the
   time zone and attempt. A similarly named run from yesterday is not evidence
   for today's commit. Remove filters if the list is unexpectedly empty.
   If it is still empty, check the terminal's last completed stage: an upload or
   preflight failure may have prevented session creation. Verify the account/team
   before starting another paid attempt merely to populate the list.
3. Open the build, then **Sessions** (or the older session list). Match session
   ID, device/OS and timing to terminal output. A **Tests** view represents
   logical tests only if the integration supplies that data; it is not a synonym
   for Sessions. Our direct connection does not install test-level SDK ingestion.
4. Inspect app metadata and the requested capabilities. Record the actual device,
   OS and remote versions when exposed. Explain missing metadata as missing.
5. Open the session video if available. Find the Login screen, keyboard, button,
   alert and dismissal. Correlate one visible event with the matching command
   in text/Appium logs and the assertion in the spec.
   Chai evaluates assertions in the test runner. You may see the preceding
   element lookup/read in Appium logs, while the actual expected/actual failure
   is in terminal or reporter output. Do not search the video for an assertion.
6. Compare the session status to the terminal assertion result and final counts.
   The project calls `setSessionStatus` once after the worker's result. If this
   call fails, it warns; a finished session alone does not prove passing assertions.
7. Save a private run record with the relevant timestamps and a concise finding.
   Review downloads before sharing: videos, XML, network data and generated
   share links may reveal inputs or grant access.

## Pick the artifact that answers your question

| Evidence | Useful question | Limit |
| --- | --- | --- |
| Terminal spec reporter | Which case/assertion/hook failed? How many ran? | Not a video of the app |
| Video | Which screen, keyboard or dialog was visible? | Timing alone does not establish an assertion |
| Visual logs/screenshots | What appeared near a command boundary? | Not every invisible state |
| Appium/text logs | Which locator/command failed first? | Secondary failures can distract |
| Device/crash logs | Did app or instrumentation stop? | Availability varies |
| Network logs | What requests/responses were captured? | Disabled in this baseline; sensitive and potentially intrusive |
| Local `logs/` PNG/XML | What did the live session expose after failure? | Best effort; unavailable after some setup/session failures |

The config enables `debug` and disables `networkLogs`. Video availability and
retention must be checked in your account. See [debugging options](https://www.browserstack.com/docs/app-automate/appium/set-up-tests/debugging-options).
Do not enable all diagnostics by default: interception can affect pinned TLS
and app behavior. Use an authorized test build and an explicit investigation.

## Exercises

### BS-06-A · Follow one action through three views

**Task:** locate the Login submit in the spec, terminal/session command log and
video or screenshot. Record timestamps/command identifiers without exposing keys.
**Acceptance:** three correlated observations and the final assertion result.
If video is unavailable, state that limit and use the available evidence.

<details><summary>Hint and review</summary>
A button click returning successfully is not proof of a success alert. Find
the subsequent observation/assertion. Without a real run, label this a plan.
</details>

### BS-06-B · One session, three cases

**Task:** synthetic run: Login spec contains three cases; two pass and one fails.
The session list contains one completed session. Explain the case count,
session count and required final status.
**Acceptance:** report 2 passed / 1 failed across 3 executed cases, one session,
and failure for the aggregate. Never write “one test passed” from the list alone.

<details><summary>Hint and review</summary>
The session lifetime contains multiple `it` calls. A later passing case must
not overwrite the earlier failure. [Status executor](https://www.browserstack.com/docs/app-automate/appium/set-name-and-status-of-test).
</details>

## Checkpoint

Can you locate the exact attempt and explain its status without relying on a
green icon? Continue to a report someone else can use.

[Previous](05-devices.md) · [Path](README.md) · [Next: reporting](07-reporting.md)
