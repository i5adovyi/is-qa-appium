# Mobile automation interview practice

**48 questions, ten practical drills, and three mock interview formats.**
This is preparation for junior-to-mid-level mobile automation roles, with stretch
questions for framework ownership. It is not a measured ranking of question
frequency or a guarantee of what a particular employer will ask.

Attempt an answer aloud for 60–90 seconds before opening its review guide. Use
this structure: **explain the concept → give a project example → name a limitation
→ describe the evidence you would collect**. For experience questions, distinguish
what you personally ran from a design exercise. Never invent a production story.

Start with Q01–Q16 after lessons 00–09; use Q17–Q32 after lessons 10–15.
Q33–Q40 cover wider QA, teamwork and coding discussions alongside the course.
Q41–Q48 add diagnostic and coding follow-ups. Try drills D7–D10 with the supplied
evidence before reading their answers.
The [workplace workbook](workplace-scenarios.md) supplies realistic situations.
The [practical drills](interview-drills.md) require code, SQL, review and reasoning.

## Architecture and capabilities

### Q01 · What happens after `await LoginScreen.login(...)`?

<details><summary>What a strong answer covers</summary>

The screen object issues client commands through WebdriverIO to the Appium
endpoint; the selected driver automates the device and returns responses.
Mocha runs hooks/tests; Chai evaluates assertions. Explain these roles using
[the actual Login spec](../../test/specs/app.login.spec.ts).

**Follow-up:** where does a refused server connection fail versus a missing
element? **Trap:** describing Chai as the tool that taps the phone.

</details>

### Q02 · What are W3C capabilities, and can you change them mid-session?

<details><summary>What a strong answer covers</summary>

Session creation negotiates capabilities. Distinguish standard `platformName`,
Appium-prefixed values and provider-specific options. Supported settings are a
separate mechanism for runtime behavior. Show the local/cloud configs and
explain why an uploaded `bs://` app identifier differs from a local APK path.

**Follow-up:** capabilities request Android but the driver is XCUITest—what
evidence do you inspect? **Trap:** assuming every server accepts every capability.
[Appium capabilities](https://appium.io/docs/en/latest/guides/caps/).

</details>

### Q03 · How do Appium server, drivers, plugins and Inspector differ?

<details><summary>What a strong answer covers</summary>

Drivers provide platform automation; plugins extend server behavior; Inspector
helps inspect a connected session. Their versions and prerequisites are not one
interchangeable number. This project separately locks Appium and UiAutomator2;
its maintenance guide documents why a packaged driver is used.

**Follow-up:** what do you inspect after an upgrade breaks session creation?
**Trap:** copying Appium 1-era installation/endpoint instructions into this
Appium 3 project without checking them.

</details>

### Q04 · When would you choose Appium over Espresso or XCUITest?

<details><summary>What a strong answer covers</summary>

Discuss required platforms, team language, access to app source, integration
boundaries, debugging, execution cost and existing infrastructure. Appium offers
a shared client approach with platform drivers; app-native tests may fit
lower-level integration better. Propose a small proof of concept using a risky
real flow before choosing.

**Follow-up:** what remains platform-specific? **Trap:** “one script works
unchanged on all phones” or “one tool is always fastest.”

</details>

## Locators and synchronization

### Q05 · How do you choose a locator?

<details><summary>What a strong answer covers</summary>

Inspect the actual app build, establish the correct screen, check uniqueness
and stability, and prefer stable semantic/test identifiers when available.
Evaluate resource IDs, text and XPath by context; avoid absolute hierarchy paths
without a reason. On Android, accessibility ID and resource ID are different.

**Follow-up:** the app supports several locales—what changes? **Trap:** calling
every XPath invalid, or claiming an accessibility ID guarantees uniqueness.
Revisit lesson 05 and lab 04.

</details>

### Q06 · How is a stale element different from “not found”?

<details><summary>What a strong answer covers</summary>

A stored reference may no longer identify the current UI element after
recreation; a failed lookup may instead mean a wrong locator, wrong screen or
unready state. Capture the screen/source/context and re-locate after a known
transition. Re-finding must preserve the intended target.

**Follow-up:** a recycled list uses the same row index for a different order.
**Trap:** retrying every exception and tapping whatever now occupies that index.
Use workplace cases RW-01 and RW-13.

</details>

### Q07 · Compare implicit waits, explicit waits and fixed sleeps.

<details><summary>What a strong answer covers</summary>

Implicit waits affect element lookup; explicit waits observe a specific
condition; sleeps delay without checking readiness. Avoid mixing global
implicit waits with explicit polling because lookup waits can distort the
overall timing. Chai equality checks a supplied value once.

**Follow-up:** why is a displayed element not necessarily showing the correct
text? **Trap:** a polling callback that repeatedly submits a form.
See [Selenium's wait semantics](https://www.selenium.dev/documentation/webdriver/waits/)
and this project's lesson 09 for the native test pattern.

</details>

### Q08 · Which timeout or retry would you change?

<details><summary>What a strong answer covers</summary>

Identify whether the limit belongs to a condition wait, test/hook, transport,
session startup or idle session. Name the setting from
[the shared config](../../config/wdio.shared.conf.ts). A timeout increase needs
evidence that a valid state is merely slow; it cannot repair the wrong selector.

**Follow-up:** how do command retries differ from whole-test retries?
**Trap:** treating a rerun pass as proof the original failure was harmless.

</details>

## TypeScript, promises and assertions

### Q09 · What is wrong with `items.forEach(async item => ...)`?

<details><summary>What a strong answer covers</summary>

`forEach` does not await callback promises. The enclosing function can finish
before actions or assertions do. Use `for...of` with `await` for dependent actions.
For independent asynchronous work, collect promises and deliberately await them.

**Follow-up:** what if the callback rejects? **Trap:** adding `await` before
`forEach` and assuming it waits for callbacks. Practise lab 03 and
[WebdriverIO's async migration examples](https://webdriver.io/docs/async-migration).

</details>

### Q10 · When is `Promise.all` appropriate?

<details><summary>What a strong answer covers</summary>

Use it for independent work with an appropriate failure policy. It does not
cancel other operations when one rejects. Device actions such as open screen,
type, submit and assert depend on order and should be sequenced. Independent
sessions are different from racing commands in one session.

**Follow-up:** would you create two independent API fixtures concurrently?
**Trap:** using concurrent taps as a way to make one device test faster.

</details>

### Q11 · Why use `unknown`, union types and readonly input?

<details><summary>What a strong answer covers</summary>

`unknown` requires narrowing before use; `any` disables useful checks. A union
can represent allowed result states; readonly input makes an ownership contract
clear. TypeScript types alone do not validate an HTTP JSON response at runtime.

**Follow-up:** validate an unknown object's `app_url` before using it.
**Trap:** casting an API response and claiming the cast verified its data.
[TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html);
labs 07–09.

</details>

### Q12 · What would make an assertion give false confidence?

<details><summary>What a strong answer covers</summary>

Assertions must check meaningful state after the intended action. Compare
strict versus deep equality, awaited values versus promises, exact expected
messages versus generic truthiness, and Chai versus WebdriverIO matcher APIs.
Prove an assertion fails after removing its critical action.

**Follow-up:** why must the clear-input test first prove populated state?
**Trap:** asserting that a promise or element object is truthy.
Revisit lesson 03 and the Forms reference tests.

</details>

## Framework ownership

### Q13 · What belongs in a screen/page object?

<details><summary>What a strong answer covers</summary>

Keep selectors and cohesive screen actions together; keep scenario intent and
business expectations visible in the test. A helper may enforce a documented
readiness/postcondition contract. Avoid giant inheritance trees, global mutable
test data and methods that hide unrelated actions or swallow errors.

**Follow-up:** how would Android/iOS implementations share an intent while using
different selectors? **Trap:** designing abstractions before inspecting behavior.

</details>

### Q14 · What happens when a setup hook fails?

<details><summary>What a strong answer covers</summary>

Explain hook scope and lifetime, distinguish setup from assertions, and preserve
the earliest failure. Report a failed session/job even if test bodies never ran.
Diagnostics and cleanup must not replace the primary error.

**Follow-up:** the screenshot also fails because the session is dead—what do
you report? **Trap:** counting unexecuted tests as passed. Inspect the shared
config's `afterHook` and complete lab 08.

</details>

### Q15 · Compare restart, `noReset`, `fullReset` and clearing data.

<details><summary>What a strong answer covers</summary>

Separate session-start behavior from per-test setup and persistent device/server
state. `restartDemoApp()` terminates/activates the process; it does not clear
permissions, erase storage or reset a backend. Driver reset behavior needs
version-specific confirmation. Avoid contradictory reset capabilities.

**Follow-up:** which setup invalidates an upgrade or draft-retention test?
**Trap:** assuming `beforeEach` means the device is factory-clean.
Use the [state manual](mobile-state.md).

</details>

### Q16 · How do you create and clean test data?

<details><summary>What a strong answer covers</summary>

Use synthetic fixtures with unique ownership per run/worker/test. Prefer a
controlled API for setup when it does not bypass the feature under test.
Await readiness, delete only owned records and retain cleanup failures.
Plan reconciliation when a create response is lost.

**Follow-up:** two tests share an account and log each other out—how do you
prove the cause? **Trap:** making one test create another test's precondition.
Labs 07 and 08 turn this answer into code.

</details>

## Test design, APIs and data

### Q17 · Design login coverage without listing 100 random strings.

<details><summary>What a strong answer covers</summary>

Use equivalence classes and boundaries; isolate email and password validators.
Add empty input, one invalid field, recovery after errors, keyboard behavior and
meaningful state transitions. Separate demo UI validation from real credential
checks, expiry, rate limits and authorization.

**Follow-up:** which checks belong below the UI? **Trap:** thirty ordinary
email variations presented as thirty distinct risks. Lessons 07, 08 and 14.

</details>

### Q18 · When do you use decision tables and state-transition tests?

<details><summary>What a strong answer covers</summary>

A decision table handles combinations of conditions and outcomes; transition
tests handle history-dependent behavior. Explain both with invalid-input
combinations versus expired-token → refresh → login recovery.

**Follow-up:** what does pairwise selection leave uncovered? **Trap:** asserting
that pairwise combinations prove every higher-order interaction. Justify any
reduction using product risk, not arithmetic alone.

</details>

### Q19 · What do you verify in an API used by a mobile test?

<details><summary>What a strong answer covers</summary>

Check the documented status, required schema, business values, identity and
authorization. Cover failures and bounded eventual consistency. Distinguish
401, 403, validation, throttling and server errors using the API's contract.
Tie UI observations to the same resource.

**Follow-up:** a timeout follows POST—may you retry? **Trap:** a successful HTTP
status used as the only business assertion. Cases RW-04 and RW-16.

</details>

### Q20 · How would SQL help investigate a failing UI test?

<details><summary>What a strong answer covers</summary>

Use a permitted test-data source to trace the relevant resource and state.
Understand joins, grouping, duplicate rows and `NULL`; a database row does not
prove the UI rendered it or the public API authorized it.

**Follow-up:** why can filtering the right-hand table in `WHERE` remove rows
from a left join? **Trap:** writing directly to production to make a test pass.
Complete the supplied SQL drill with its expected output.

</details>

## Mobile-specific reasoning

### Q21 · Native, mobile web and hybrid: how does automation differ?

<details><summary>What a strong answer covers</summary>

Identify the active context and the element model. A native hierarchy differs
from a web DOM. Discover available contexts, select deliberately, wait for content,
then re-locate using the appropriate strategy. Explain how debugging/driver
compatibility can block WebView exposure.

**Follow-up:** why does a successful switch not prove the page is ready?
**Trap:** using a native element reference in a web context. Lesson 11.

</details>

### Q22 · How would you automate scrolling or a gesture reliably?

<details><summary>What a strong answer covers</summary>

Inspect the intended container, account for bounds and orientation, choose a
supported gesture, bound repeated attempts and assert a meaningful result.
Handle missing targets and recycled rows explicitly.

**Follow-up:** the command succeeds but the wrong container scrolls—how would
you detect it? **Trap:** copied absolute coordinates with no postcondition.
Case RW-13.

</details>

### Q23 · Which mobile lifecycle and permission situations matter?

<details><summary>What a strong answer covers</summary>

Choose relevant branches: deny/revoke/recover; background/resume; activity
recreation; process death; interruption; connectivity recovery. Define the
required state after each transition, and avoid reset helpers that destroy it.

**Follow-up:** what does `autoGrantPermissions: true` leave untested?
**Trap:** claiming a restart smoke test covers interruptions. Cases RW-02–RW-04.

</details>

### Q24 · What changes for real iOS devices?

<details><summary>What a strong answer covers</summary>

Discuss XCUITest/WDA, a compatible app artifact and provisioning, local Mac/Xcode
requirements versus a remote provider, bundle identity, selectors and
platform-specific system dialogs/gestures. Real-device capabilities differ from
simulator assumptions.

**Follow-up:** which pieces of this Android framework can remain shared?
**Trap:** claiming an Android APK or Android UI selectors can run on iOS.
Case RW-19.

</details>

## Delivery and diagnosis

### Q25 · What must change before parallel execution?

<details><summary>What a strong answer covers</summary>

Allocate independent devices/sessions, required local driver ports, test data and
artifact identities. Respect resource limits, provider quota and cancellation.
Use a small controlled comparison to reveal shared state before expanding.

**Follow-up:** is a unique port inside each process enough for two CI jobs?
**Trap:** changing only `maxInstances`. Lab 07 and case RW-15.

</details>

### Q26 · What does BrowserStack add, and what does it not fix?

<details><summary>What a strong answer covers</summary>

Explain credential delivery, verified app upload, device/OS selection, remote
session limits, diagnostics and result status. A cloud device can expand coverage
but cannot fix bad assertions or shared test data. Private backend access needs
separately configured connectivity.

**Follow-up:** the app uploads but the session cannot start—what evidence comes
next? **Trap:** saying a mocked upload test proves a real-device run.
This project's first cloud execution still needs account credentials.

</details>

### Q27 · What belongs in CI, and how do you review a change?

<details><summary>What a strong answer covers</summary>

Separate fast static/unit checks from device suites; use a controlled smoke
selection, secrets, reproducible dependencies and bounded artifacts. Inspect the
diff, expected test count, exact commit/run and skipped jobs. Use a branch/PR
review workflow and a deliberate rollback approach.

**Follow-up:** why might a forked PR lack cloud secrets? **Trap:** exposing secrets
or loosening trust boundaries just to make a job green. Lesson 13 and drill D4.

</details>

### Q28 · “Passes locally, fails in CI.” What do you do first?

<details><summary>What a strong answer covers</summary>

Compare exact app/commit/dependency versions, device/OS, settings, fixtures and
first failure. Use screenshot, hierarchy, driver/device logs and server evidence
to test competing hypotheses. Change one thing at a time.

**Follow-up:** how would you track intermittent failures over time?
**Trap:** a sleep or quarantine with no cause, owner or expiry. Cases RW-14–RW-17.

</details>

## Judgment and communication

### Q29 · What is missing from a green functional UI suite?

<details><summary>What a strong answer covers</summary>

Prioritize relevant accessibility, performance, privacy/security, install/upgrade,
localization, hardware and backend risks. Choose the right test method and
explicitly state untested scope. These categories need different evidence.

**Follow-up:** can Appium timings establish frame-rendering performance?
**Trap:** equating stable accessibility locators with an accessibility audit.
Cases RW-08–RW-12 and RW-20.

</details>

### Q30 · Which tests and devices would you run before release?

<details><summary>What a strong answer covers</summary>

Use changed features, business impact, usage/support matrix, defect history,
time and concurrency. Retain high-risk boundaries and an escalation path.
Explain the cost and missing evidence behind a release recommendation.

**Follow-up:** one failure affects only an older supported device—does it block?
**Trap:** newest devices only, or treating test count as coverage. Case RW-18.

</details>

### Q31 · Tell me about a failure you investigated or a disagreement.

<details><summary>What a strong answer covers</summary>

Use a genuine example: situation, responsibility, evidence, competing hypotheses,
your action, result and learning. An injected training failure is valid if
identified honestly. For disagreement, show how you sought requirements and
evidence rather than simply winning an argument.

**Follow-up:** what would you do differently? **Trap:** invented production
experience, blame without evidence, or a team result with no personal contribution.
Use your lesson 10 investigation note.

</details>

### Q32 · Design a maintainable framework for a new team.

<details><summary>What a strong answer covers</summary>

Clarify platform scope, app types, environments, release cadence, team skills and
constraints first. Propose configuration boundaries, screen actions, fixtures,
state ownership, assertions, diagnostic hooks, execution tiers and maintenance.
Demonstrate one vertical slice before adding generic layers.

**Follow-up:** what would you deliberately leave out of the first iteration?
**Trap:** a diagram with every tool but no runnable scenario or failure evidence.
Use the capstone and practical architecture drill.

</details>

## Wider QA and engineering discussions

### Q33 · Smoke, regression and retesting: what changes?

<details><summary>What a strong answer covers</summary>

A smoke selection gives quick evidence that critical paths are usable. Regression
looks for unintended changes in existing behavior. Retesting verifies a particular
fix; it does not replace related regression. Teams use “sanity” differently, so
clarify the intended scope rather than arguing about a label.

**Follow-up:** choose a small regression set after a keyboard fix.
**Trap:** smoke is always positive-only, or every defect requires a full UI suite.

</details>

### Q34 · How do severity, priority and defect triage differ?

<details><summary>What a strong answer covers</summary>

Severity describes impact; priority describes urgency given release context and
exposure. Provide build/environment, minimal reproduction, expected/actual,
evidence and affected users. Discuss triage, ownership, fix verification and
reopening using the team's workflow.

**Follow-up:** a crash affects a rarely used supported flow versus a misleading
price on every purchase screen. **Trap:** one severity-to-priority mapping for
all products, or calling an undocumented preference a defect.

</details>

### Q35 · What does a tester contribute before coding starts?

<details><summary>What a strong answer covers</summary>

Clarify acceptance criteria, missing states, test data, testability, risk and
observability during refinement. Estimate environment/data work as well as
script-writing. Collaborate with developers and product staff on lower-level
checks and an explicit definition of done.

**Follow-up:** requirements change midway through the sprint—what gets
renegotiated? **Trap:** automation starts only after all features are “finished.”

</details>

### Q36 · Is BDD the same as writing Cucumber scenarios?

<details><summary>What a strong answer covers</summary>

BDD uses shared behavioral examples to clarify expectations; Gherkin/Cucumber
are optional ways to express and execute them. TDD uses a failing test to guide
implementation. This course uses Mocha and Chai without requiring Cucumber.
Discuss stakeholder benefit before adding another layer.

**Follow-up:** rewrite a business example without click-by-click implementation
details. **Trap:** installing a tool as proof of team collaboration.

</details>

### Q37 · What should be mocked, and what needs an end-to-end check?

<details><summary>What a strong answer covers</summary>

Use controlled doubles for fast, deterministic branches; verify real contracts
and keep selected end-to-end journeys across important boundaries. Explain what
each double replaces and cannot prove. A stub supplies outcomes; a mock may also
verify interactions, with terminology depending on the library.

**Follow-up:** our mocked upload passes while BrowserStack rejects credentials.
Is that contradictory? **Trap:** treating mocked helper checks as device evidence
or forcing a universal test-pyramid percentage.

</details>

### Q38 · How do language design choices affect test maintainability?

<details><summary>What a strong answer covers</summary>

Explain objects/interfaces, encapsulation, composition versus inheritance,
arrays versus sets/maps, and mutable shared data using a small helper. Know that
`const` prevents rebinding but does not freeze an object's properties. Choose
clear types and control flow before adding abstractions.

**Follow-up:** explain lab 07's duplicate detection and complexity. Why does
TypeScript `readonly` not replace runtime isolation? **Trap:** private fields or
types described as security boundaries.

</details>

### Q39 · How would you resolve a Git conflict or undo a shared change?

<details><summary>What a strong answer covers</summary>

Explain the intent of both edits, inspect the resulting diff and verify the
merged behavior. Distinguish merge from rebase and revert from resetting local
history. A revert preserves a reviewable shared history; team policy governs
rewrites. A cherry-pick brings a particular change, not its entire surrounding
feature automatically.

**Follow-up:** both branches changed a selector for different app builds.
**Trap:** accepting one side blindly, discarding unrelated local work or assuming
removing a secret from HEAD revokes it.

</details>

### Q40 · How would you review an AI-generated test?

<details><summary>What a strong answer covers</summary>

Check the requirement, inspected selectors, supported APIs, setup, waits,
assertions, cleanup and credentials handling. Run it narrowly, prove a deliberate
defect is caught, then verify integration. Treat suggested execution claims as
claims needing evidence. Follow the team's data-sharing policy for prompts/logs.

**Follow-up:** the generated test looks convincing but targets an ID absent from
the APK. **Trap:** counting generated files as tested coverage or accepting a
passing test whose critical assertion was removed.

</details>

## Diagnostic and coding follow-ups

### Q41 · `fetch()` resolved. Does that mean the API call succeeded?

<details><summary>What a strong answer covers</summary>

Check HTTP status and the response contract. Fetch can resolve on an HTTP error;
JSON parsing and business validation are additional failure boundaries. Treat
unknown payloads as untrusted data, verify resource identity and avoid printing
tokens or raw bodies in errors.

**Follow-up:** a 200 response contains another order's ID. **Trap:** a TypeScript
cast used as runtime validation. Complete lab 10 and drill D8.
[Fetch behavior](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

</details>

### Q42 · How do you prove a race instead of adding a delay?

<details><summary>What a strong answer covers</summary>

Identify operations that can overlap and the required ordering/ownership rule.
Use controlled response delays or barriers, correlation IDs and observable state
to reproduce both completion orders. Distinguish a test action race from an app
request race.

**Follow-up:** latest query must win despite an older response arriving last.
**Trap:** a longer sleep that consistently displays the wrong result. RW-21/RW-22.

</details>

### Q43 · Why does staging work locally but fail on a remote device?

<details><summary>What a strong answer covers</summary>

Separate DNS/routing, private-network access, proxy configuration, TLS trust,
certificate pinning, app build configuration and credentials. Confirm evidence
from the app's request path, not only a laptop browser. Use a supported test setup
without broadly disabling transport security.

**Follow-up:** the tunnel is connected but TLS still fails. **Trap:** treating
cloud credentials, backend credentials and app test-account credentials as one
thing. Use RW-23.

</details>

### Q44 · What can logcat and app identity tell you before inspecting selectors?

<details><summary>What a strong answer covers</summary>

Check device connectivity, intended package/build, foreground activity/package,
installation and instrumentation errors. Correlate logs by timestamp/session and
process. Distinguish an app crash, driver failure, system dialog and a later
screenshot failure.

**Follow-up:** show read-only commands with a selected device and bounded output.
**Trap:** clearing logs or reinstalling immediately and destroying evidence.
RW-27 and D7 provide a concrete exercise.

</details>

### Q45 · What changes when flags or backend schemas vary?

<details><summary>What a strong answer covers</summary>

Record app/backend/config versions and cohort. Test supported old/new client
combinations, cached flags, fallback and rollback state. Use focused contract
tests for shape/enum changes plus selected app journeys.

**Follow-up:** a test passes for one account and fails for another on the same APK.
**Trap:** assuming every difference is nondeterminism before checking cohorts.
RW-24.

</details>

### Q46 · Explain `this`, arrow functions and Mocha callbacks.

<details><summary>What a strong answer covers</summary>

Arrow functions use lexical `this`; ordinary functions can receive a call-time
context. Mocha exposes context APIs such as `this.timeout()` through ordinary
function callbacks. The project's arrow callbacks are appropriate when they do
not need that context. Async work still needs to be returned or awaited.

**Follow-up:** how would you write a hook using `this.skip()` without losing
type safety? **Trap:** replacing all callbacks with arrows as a universal cleanup.
Use [Mocha's arrow-function guidance](https://mochajs.org/next/features/arrow-functions/).

</details>

### Q47 · How would you solve a small coding task in an interview?

<details><summary>What a strong answer covers</summary>

Clarify ordering, duplicates, mutation, case sensitivity and invalid input.
Work a small example, choose a readable array/Map/Set approach, test boundaries
and explain time/space costs. A shallow spread does not isolate nested mutable
objects.

**Follow-up:** keep the first failure for each test ID in encounter order, then
explain what changes if the latest failure is required. **Trap:** solving a
different contract because a familiar algorithm was memorized. D2 and lab 09
provide related practice.

</details>

### Q48 · What makes a take-home project or status update credible?

<details><summary>What a strong answer covers</summary>

Include reproducible commands, assumptions, scope, test selection and counts,
evidence, failure handling, limitations and useful next work. Demonstrate your
own reasoning and explain generated code. Distinguish blocked work from a pass.

**Follow-up:** the environment prevents one required check before submission.
**Trap:** claiming success from a screenshot without identifying the build and
run. Complete D10 and the capstone handover.

</details>

## Mock interviews

| Format | Agenda | Evidence to keep |
|---|---|---|
| Junior, 45 min | 5 min project explanation; 10 min Q01/Q05/Q09/Q12; 15 min D1 code review; 10 min one workplace case; 5 min reflection | Explanation, repaired snippet and next practice topic |
| Automation engineer, 60 min | 10 min Q14/Q16/Q25/Q28; 20 min lab 07 or 08; 15 min RW-04 or RW-05; 10 min D3 SQL; 5 min questions | Code/tests, scenario table and query reasoning |
| Framework owner, 75 min | 10 min current framework; 20 min D5 design; 20 min RW-15/RW-17/RW-18; 15 min incident discussion; 10 min tradeoffs | Architecture decisions, metrics and release recommendation |

Score five dimensions 0–4: technical accuracy, concrete application, evidence and
diagnosis, limitations/tradeoffs, clear communication. **0:** absent/incorrect;
**1:** memorized terms; **2:** correct with prompting; **3:** independent concrete
answer; **4:** handles a changed premise and defends the tradeoff. Maximum **20**.
Use the weakest dimension to choose the next exercise; this is not a hiring score.

Ask the interviewer about the team's real flakiness, device coverage, backend test
seams, ownership and release constraints. Those answers reveal what skills the job
actually needs.

[Practical drills](interview-drills.md) · [Workplace scenarios](workplace-scenarios.md) · [Coverage review](../coverage-review.md)
