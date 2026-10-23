# Assignment bank: practise by topic and difficulty

These **24 work assignments** give you repeated practice with a topic at three
levels. They supplement the [12-ticket challenge path](../challenges/README.md),
which introduces the project in sequence. Choose an assignment when you want to
practise a particular skill again with different data, constraints or an app.
The situations and supplied evidence packets are fictional. Your implementation,
observations and explanation are your work.

## Pick one manageable task

| Level | How to work | What you hand over |
|---|---|---|
| L1 · Guided | Follow a concrete contract and a small data set | One focused result with a meaningful counterexample |
| L2 · Independent | Choose the test structure and justify the boundary | Code or experiment, regression evidence and tradeoffs |
| L3 · Investigation | Reconcile incomplete or conflicting evidence | A defensible decision, limits and a reproducible next action |

Difficulty describes independence and judgment, not a qualification. L3 does
not automatically need a phone; an offline investigation can be harder than a
guided device test. Estimates assume the prerequisites already work. It is fine
to use several sessions. Start with L1 in one topic, review it, then return for
L2; there is no requirement to finish all 24 in order.

| Topic | L1 · Guided | L2 · Independent | L3 · Investigation |
|---|---|---|---|
| Test design and oracles | [AS-01 · Delivery examples](01-test-design.md#as-01-turn-a-delivery-rule-into-examples) | [AS-02 · Challenge a weak oracle](01-test-design.md#as-02-challenge-a-weak-oracle) | [AS-03 · Negotiate coverage](01-test-design.md#as-03-negotiate-a-small-release-scope) |
| Locators and screen contracts | [AS-04 · Repeated labels](02-locators.md#as-04-identify-a-row-with-repeated-labels) | [AS-05 · Native widgets](02-locators.md#as-05-own-a-native-widget-test) | [AS-06 · Testability request](02-locators.md#as-06-hand-over-a-testability-request) |
| Synchronization and timing | [AS-07 · Old response](03-synchronization.md#as-07-ignore-an-outdated-search-response) | [AS-08 · Loading is not success](03-synchronization.md#as-08-observe-a-business-outcome) | [AS-09 · Trace a slow failure](03-synchronization.md#as-09-explain-where-the-time-went) |
| Data and contracts | [AS-10 · Price feed](04-data-contracts.md#as-10-validate-a-price-feed) | [AS-11 · Safe cleanup plan](04-data-contracts.md#as-11-plan-cleanup-without-deleting-data) | [AS-12 · Schema rollout](04-data-contracts.md#as-12-support-a-schema-rollout) |
| Commerce across another app | [AS-13 · Cart identity](05-commerce.md#as-13-add-and-remove-the-intended-product) | [AS-14 · Quantity and totals](05-commerce.md#as-14-check-cart-arithmetic-and-isolation) | [AS-15 · Checkout recovery](05-commerce.md#as-15-investigate-an-interrupted-checkout) |
| Android state and usability | [AS-16 · Back and a modal](06-device-state.md#as-16-dismiss-a-modal-without-losing-the-screen) | [AS-17 · Larger text](06-device-state.md#as-17-test-a-screen-with-larger-text) | [AS-18 · State boundary](06-device-state.md#as-18-map-what-a-restart-really-resets) |
| Hybrid and integration boundaries | [AS-19 · Context diagnosis](07-hybrid-boundaries.md#as-19-classify-three-webview-failures) | [AS-20 · Cleanup failures](07-hybrid-boundaries.md#as-20-preserve-the-original-context-failure) | [AS-21 · Real WebView handover](07-hybrid-boundaries.md#as-21-investigate-a-real-webview-boundary) |
| Delivery and team evidence | [AS-22 · Test selection](08-delivery.md#as-22-make-test-selection-a-contract) | [AS-23 · Shard evidence](08-delivery.md#as-23-merge-evidence-without-hiding-a-missing-shard) | [AS-24 · Release conversation](08-delivery.md#as-24-hand-over-a-decision-under-uncertainty) |

**No Android yet?** AS-01 → AS-04 → AS-07 → AS-10 is a small guided route.
AS-02, 08, 11, 12, 20, 22 and 23 then give you executable Node practice.
AS-03, 09, 19 and 24 develop investigation and team communication without a
device. Check each prerequisite; these are suggested routes, not a new syllabus
you must complete before touching a phone.

**Ready for another app?** The [training-app guide](../handbook/training-apps.md)
adds opt-in Sauce Labs My Demo App and ApiDemos. Use AS-13 for a shopping flow or
AS-05 for native widgets. The existing WebdriverIO demo remains the lesson
baseline. Additional app source/download inspection is not a validated device
run, and a demo checkout is not a real payment or order-system test.

## Make an attempt you can keep

Before editing, inspect `git status --short`. Keep completed labs, reference
solutions and existing specs. Each ticket names a new learner-owned file.
Create it only if it does not already exist; resume your own previous attempt
instead of overwriting it.

Use `.local-data/assignments/AS-07/` (replace the ID) for personal evidence,
offline attempt files and notes. This directory is ignored by Git. **Back it up
separately** if you need it on another computer; a reader progress export or Git
push does not include it. Never store the only copy of valuable work in a
temporary folder. Sanitized code can later be copied deliberately into a
portfolio location after reviewing what it contains.

For an offline coding ticket, create `attempt.ts` with the requested exported
function and `attempt.test.ts` with your tests. Use the existing Node 24 and
locked project dependencies. A test file can import `test` from `node:test`,
`expect` from `chai`, and your function from `./attempt.ts`. Write a test for each
contract category before implementing; do not just reproduce a reference answer.

```bash
node --test .local-data/assignments/AS-07/attempt.test.ts
```

Node 24 can run this simple, erasable TypeScript syntax, but execution does not
typecheck it. These personal files are outside the project's normal TypeScript
include lists. To typecheck the selected attempt explicitly:

```bash
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --types node .local-data/assignments/AS-07/attempt.ts .local-data/assignments/AS-07/attempt.test.ts
```

The bank has **contracts and review prompts, not prewritten graders**. You own
the tests too. A passing self-authored suite needs the changed-condition check
and a review of its assertions. The original `npm run practice -- NN` commands
still grade their existing labs only; `AS-07` is not an argument to that runner.

For Android, use the exact isolated spec path and runner given in the ticket.
`test/training/` is outside the default `test/specs/` collection but within the
project's TypeScript checks. Inspect selectors on your actual app build. Supply
your own test, setup and meaningful assertions; the app launcher does not
complete the assignment. Stop Inspector before starting the runner.

## Use evidence, then an interview explanation

Save this in your own `AS-NN/evidence.md` and fill it gradually:

```text
Assignment / date / revision:
Requirement and source (fictional contract or observed app behavior):
Prediction before running:
Environment and exact selected command:
My files and decision:
Observed baseline and result:
Changed condition / predicted failure / actual result / restoration:
Evidence location (sanitized):
Design: complete / partial
Implementation: complete / partial / not required
Required execution: passed / failed / blocked / not run
What the evidence proves and what it cannot prove:
One thing I can now explain without notes:
Next smallest action:
```

Assignment IDs organize your journal; they **do not add completion boxes or
notes to the reader's progress database**. Lesson IDs 00–15 and challenge IDs
CH-01–CH-12 keep their existing meanings. Reading a ticket or selecting a filter
does not mark anything complete.

A useful review asks: did the original result match a written requirement, did
the changed condition expose a meaningful weakness, and can someone reproduce
the result? A blocked device task can have excellent design work while required
execution remains pending. Open the collapsed hint only after an attempt, or ask
for a full solution if that is what you need. Finish with the ticket's 90-second
spoken explanation: problem, choice, evidence, limitation, next action.

[Choose today's session](../handbook/study-session.md) · [Course map](../README.md)
