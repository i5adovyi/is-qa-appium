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
