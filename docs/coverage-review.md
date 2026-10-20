# Real-world and interview coverage review

**Review date:** 20 October 2026.
**Scope:** sixteen lessons and their exercise/solution structure, six original
offline labs, seven Android reference tests, configuration, handbooks, reader and
CI guidance. This review adds extensions; it does not claim new device coverage.

## Finding

The core course is strong at the first independent test: typed data, awaited
actions, meaningful assertions, selectors, setup, diagnosis and truthful evidence.
It was **not yet a complete preparation path for broader mobile automation work
or interviews**. Many production risks were mentioned as exclusions, with no
concrete exercise, answer criteria or route to practise them.

The highest-priority gaps were API/test-data ownership, parallel isolation,
authentication beyond UI validation, recovery from mobile state changes, result
reporting, practical SQL/Git review and spoken reasoning. The new workbench pages
address these without pretending the demo has a backend, payments or iOS build.

## How this was checked

Technical expectations were compared with current primary references:
[Appium capabilities](https://appium.io/docs/en/latest/guides/caps/),
[UiAutomator2 parallel testing](https://github.com/appium/appium-uiautomator2-driver#parallel-tests),
[Android core quality](https://developer.android.com/docs/quality-guidelines/core-app-quality),
[Android process lifecycle](https://developer.android.com/guide/components/activities/process-lifecycle),
[accessibility testing](https://developer.android.com/guide/topics/ui/accessibility/testing),
and [OWASP MASVS](https://mas.owasp.org/MASVS/). Detailed sources are next to the
relevant cases and in the reading library.

Two employer-owned descriptions provided examples of workplace expectations:

| Source checked | Skills explicitly requested | Course response |
|---|---|---|
| [Qapitol: QA Automation Engineer, Web + API + Mobile](https://qapitol.ai/careers/qa-automation-engineer-web-api-mobile-jd097) | Appium, API payload/status/auth/error checks, SQL, Git/CI, reusable components, failure analysis and code review | API/fixture case, SQL and PR drills, framework and diagnosis questions |
| [ShyftLabs: Lead QA Automation Engineer](https://jobs.lever.co/shyftlabs/702d2781-b67f-4350-8b79-4ea638599e84) | Appium, programming, CI, database validation, strategy, metrics, triage and communication | Optional framework-owner mock, honest reporting lab, release and engineering-story drills |

These are a small sample, including experienced roles and broader web/API work.
They support the relevance of the topics, **not their frequency in interviews**.
The forty-eight interview prompts are original practice questions, not leaked questions,
an employer question bank or a guarantee of hiring readiness. A specific job
description should still guide your final preparation.

## Coverage matrix

“Added” means learning material or a helper lab, not a passing end-to-end test.
RW identifiers refer to the [workplace workbook](handbook/workplace-scenarios.md);
Q identifiers to [interview practice](handbook/interview-practice.md);
D identifiers to [practical drills](handbook/interview-drills.md).

| Area | Before review | Now practise here | Execution boundary |
|---|---|---|---|
| Architecture, drivers, W3C capabilities | Explained in foundations | Q01–Q04 | Explain actual configs; no new platform run |
| Selectors, stale elements, virtual lists | Strong selector basics; stale/recycling reasoning thin | RW-01/RW-13, Q05–Q08 | Inspect actual demo or feature screen |
| Async TypeScript, assertions, data structures | Six small labs; no workplace helper lifecycle | Labs 07–09, D1/D2, Q09–Q12/Q38 | Executable offline contracts |
| Screen objects, hooks, setup ownership | Strong introductory coverage | Q13–Q16, D5 | Use existing reference framework |
| Boundaries, decision tables, state models | Present in lessons 08/14 | Q17/Q18, RW-04/RW-05 | Product rules must be explicit |
| Real authentication, expiry, logout, authorization | Correctly excluded; no detailed practice | RW-05/RW-06, Q17/Q19 | Design or a staging backend |
| API fixtures, eventual consistency, cleanup failure | Mostly absent | RW-04/RW-16, lab 08, Q16/Q19/Q37 | Fakes execute; live API needs a test environment |
| SQL and backend correlation | Absent | D3, Q20 | Supplied disposable SQL data; not the demo schema |
| Permissions, interruptions, process death | Field guide; limited case detail | RW-02/RW-03/RW-07, Q23 | Feature/OS-specific investigation |
| Offline, timeout and duplicate submission | Mentioned as future scope | RW-04/RW-20 | Controlled app/server/network environment |
| Deep links, notification entry, external callbacks | Mentioned or absent | RW-06/RW-07/RW-20 | App configuration and service required |
| Install/upgrade/migration/storage | Mentioned only | RW-08, Q15 | Two compatible app builds and preserved data |
| Locale, large text, RTL, device shape | Text-data coverage only | RW-09 | Inspect supported app behavior |
| Accessibility, performance, security | Brief boundaries | RW-10–RW-12, Q29 | Specialized evidence beyond UI checks |
| Gestures and hybrid contexts | Exploratory lesson | RW-13/RW-14, Q21/Q22 | Remain exploratory until run |
| Parallel sessions and shared data | Sequential execution only | RW-15, lab 07, Q25 | Planner runs offline; no automatic parallel sessions |
| CI selection, retry metrics, quarantine | Good CI introduction; metrics exercise missing | RW-17, lab 09, Q27/Q28 | Offline reporting plus workflow inspection |
| Device selection and release decisions | General risk selection | RW-18, Q30, D5 | Fictional constraints; real timing needed |
| iOS migration | Explicitly out of core scope | RW-19, Q24 | Requires own build/toolchain/provider setup |
| Hardware, biometrics, payment, OTP, SSO | Absent | RW-20 | Sandbox/test seam or dedicated device |
| Git, code review and team communication | Git assumed; report templates present | D4/D6, Q31/Q34/Q35/Q39 | Review exercises; no shared history rewritten |
| QA vocabulary, BDD, test layers and AI review | Spread across lessons or missing | Q33–Q40 | Reasoning and review, no new frameworks required |
| Out-of-order results, cache ownership and conflicts | No supplied incident evidence | RW-21/RW-22, Q42 | Synthetic trace or controlled feature environment |
| Private staging connectivity, DNS and TLS | Public cloud session setup only | RW-23, Q43 | Supplied trace; actual tunnel requires staging access |
| Flags, schema compatibility and rollback | No concrete exercise | RW-24, Q45, lab 10 | Offline payload checks; rollout remains a design task |
| Analytics consent, duplicate events and interrupted uploads | Absent | RW-25/RW-26 | Synthetic events and explicit fictional contracts |
| Artifact identity, installation errors and system focus | Setup checks, but no incident drill | RW-27, D7, Q44 | Supplied timeline, read-only evidence plan |
| Inherited flaky suites and team handover | General diagnosis only | RW-28, D10, Q48 | Synthetic results; no invented employment story |
| HTTP status versus schema and business success | Callback-only fixture exercise | Lab 10, D8, Q41 | Executable local HTTP and malformed-payload checks |
| Concrete checkout test-design exercise | Techniques explained abstractly | D9, Q47 | Written requirements and answer table |

## Second-pass findings

The first pass supplied twenty scenarios and forty questions, but most advanced
tasks still required learners to invent their own evidence. The dashboard could
only search lesson titles. A beginner could therefore miss a relevant workbench
case or have nothing concrete to investigate.

This pass adds eight workplace cases, eight questions, four practical drills and
one executable API lab. Supplied timelines, event traces, HTTP responses and small
requirements make several investigations possible without an employer's app.
The reader now searches the full text of **all 86 cases, questions and drills**
and opens the matching exercise directly. Counts and heading targets are checked
automatically, rather than relying on a manually maintained navigation list.

An additional employer-owned example,
[Goods & Services: Senior QA Engineer](https://job-boards.greenhouse.io/goodsservices/jobs/8008856003),
asks for mobile/device testing, API validation, exploration, failure diagnosis and
clear collaboration. It reinforces the need to practise investigation and
communication alongside coding; it is not evidence of specific interview questions.
Technical details were checked against
[Android offline-first architecture](https://developer.android.com/topic/architecture/data-layer/offline-first),
[Android network security](https://developer.android.com/privacy-and-security/security-config),
[BrowserStack Local](https://www.browserstack.com/docs/local-testing),
[Fetch behavior](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
and [Mocha callback context](https://mochajs.org/features/arrow-functions/).

## What was added

- **28 workplace exercises**, each with a situation, task, evidence requirements
  and review guide. Execution modes prevent design work being confused with a pass.
- **48 interview questions**, with answer criteria, follow-ups and common mistakes;
  three timed mock interviews and a reusable scoring rubric.
- **Ten practical drills:** test review, TypeScript, SQL, PR review, framework
  design, an investigation story, log diagnosis, API contracts, checkout design
  and a work handover.
- **Four new offline labs** across both review passes, with unfinished starters,
  reference implementations and contract tests. The project contains **ten** labs.
- Links from relevant lessons, study plans, course map and reader workbench.
  The original sixteen-lesson sequence and its saved progress IDs stay intact.

## Recommended order

1. **First independent test:** finish lessons 00–09 and labs 01–06. Explain the
   existing Forms/Login tests and demonstrate a deliberate assertion failure.
2. **Junior interview foundation:** answer Q01–Q16 and Q33–Q39, attempt D1/D3/D4/D6,
   then complete the junior mock. Revisit weak concepts using project evidence.
3. **Workplace reliability:** complete labs 07–10 and RW-01–RW-06, RW-15–RW-17.
   Keep API/authentication tasks designed only until a suitable environment exists.
4. **Broader mobile work:** choose remaining cases by the app and job requirements;
   complete a risk-based device plan and one automation-engineer mock.
5. **Incident practice:** investigate D7/D8 and RW-21–RW-28 using the supplied
   evidence; defend D9 and write the D10 handover.
6. **Framework ownership:** defend D5 and the release scenarios. This is stretch
   work, not a requirement for writing your first tests.

## What remains outside demonstrated coverage

No finite list proves “nothing is missed.” This revision gives a practical map
for the stated stack; product domains may add regulated workflows, ads,
media/DRM, detailed wearable/foldable behavior, device management or specialized hardware.
Add those when the target app or role calls for them.

BrowserStack still requires an account and a real session. iOS, backend
authentication, upgrades, network recovery and hardware scenarios need their own
feature environments. Existing emulator evidence does not verify them.
Performance/security/accessibility assessment needs the appropriate tools and
expertise; answer guides are not execution evidence.

See the [validation record](validation.md) for what actually ran.

[Course map](README.md) · [Workplace exercises](handbook/workplace-scenarios.md) · [Interview practice](handbook/interview-practice.md)
