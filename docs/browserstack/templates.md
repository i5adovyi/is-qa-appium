# BrowserStack evidence templates

Copy a template into `.local-data/browserstack/` in your editor. Fill it with
your observations; empty fields mean missing evidence. Personal files and
screenshots need a separate backup. Never include keys, auth headers, real
customer inputs or unrestricted video-share tokens. These are templates, not
successful-run records.

## Readiness checklist

```text
Date / exercise:
Route: offline / cloud-only / local then cloud
Node version / dependency install result:
Typecheck:
APK version / verification result:
App Automate organization and access (no credentials):
Available usage / permitted concurrency / observed date:
Selected device / OS and where verified:
Credential source: local ignored .env / CI secrets
Cloud preflight result (not an account/device pass):
Ready or blocked / exact missing prerequisite / next owner and action:
```

## Run record

```text
Exercise / date / timezone:
Purpose and expected behavior:
Source commit / uncommitted changes:
Node / WDIO / remote Appium version (unknown if not exposed):
APK version / checksum / uploaded app identity:
Exact command (without secrets):
Requested and actual device / OS:
Build label / attempt / session ID / private evidence location:
Planned cases / selected cases / executed cases:
Passed / failed / skipped / excluded:
Sessions / retries / cancelled work:
Runner exit status / provider status / any mismatch:
First meaningful error, expected vs actual:
Available artifacts / missing artifacts and reason:
Covered behavior / remaining risk:
Next action and why another run is or is not justified:
```

## Daily or release summary

```text
Decision requested:
Scope: app/build, source, cases and device matrix:
Execution: counts and attempts, linked to run records:
First-attempt failures and rerun outcomes:
Consistent defects / intermittent failures / setup blockers:
Skipped or excluded cases and owners:
Evidence links with reviewed access:
Recommendation / remaining risk / next smallest action:
```

## Bug or infrastructure report

```text
Title: concrete symptom + environment
Observed vs expected:
Smallest reproduction command and setup:
Source / app / device / remote version:
Last successful stage:
Earliest meaningful error and redacted supporting evidence:
Two hypotheses / observation that distinguishes them:
Scope / frequency / first occurrence / impact:
Proposed owner / next action:
Deliberate training fault, real observation or synthetic scenario?
```

## Incident attempt

Use this for an [incident card](incidents.md) before opening its review. The
supplied evidence is enough for an offline attempt. “Unknown” is a useful answer
when the observation is missing; distinguish a proposed command from one you ran.

```text
Incident ID / date / time spent:
Mode: supplied synthetic evidence / authorized live observation
Prerequisites available / missing:
Expected behavior:
Facts from evidence (include times and identities when supplied):
Last successful stage / first meaningful failure:
Unknown information:
Hypothesis 1 / hypothesis 2:
One observation that would distinguish them:
Smallest next action / expected signal / owner:
Stopping rule (time, attempt limit or missing access):
Execution counts and what has NOT been tested:
Outcome: investigation proposed / blocked / observed (describe evidence)
Changed condition: what I would revise and why:
After opening review: one correction to my reasoning:
Next practice step:
```

Stop after a justified next action and honest result. If a live check needs
credentials, paid usage, another team's data or an unavailable app, name the
owner and blocker instead of inventing output. Store any later real run in a
separate [run record](#run-record); completing an incident answer is not a
passing mobile test. Keep keys and private share tokens out of both records.

## Device and concurrency plan

| Device/OS class | User/risk reason | Exact verified candidate | Specs/cases | Potential sessions | Data owner | Report path |
| --- | --- | --- | --- | --- | --- | --- |
| Fill with your plan | | | | | | |

Record account capacity, other active jobs, chosen runner limit, queue policy,
estimated setup/test durations, cleanup ownership and stopping rule separately.

## Personal checklist

| Lesson/exercise | Planned / attempted / blocked / investigated / demonstrated | Evidence location | Next action |
| --- | --- | --- | --- |
| BS-03-A example row | planned | not yet recorded | finish account readiness |

Keep actual results in your personal copy. Reading, uploading an APK or checking
a box does not establish a passing cloud assertion.

[Path](README.md) · [Reporting lesson](07-reporting.md)
