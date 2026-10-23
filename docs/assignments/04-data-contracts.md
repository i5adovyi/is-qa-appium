# Test data and runtime contracts

These tasks practise data code that mobile tests depend on. All records are
synthetic. No real customer, cloud account or backend is needed.

## AS-10 · Validate a price feed

**L1 · Guided · Offline · 35–55 min · App: synthetic product feed.**

### Prerequisites

[TypeScript narrowing](../lessons/02-typescript.md), arrays and Node 24. Own
`.local-data/assignments/AS-10/attempt.ts` and `attempt.test.ts`; use the
[attempt workflow](README.md#make-an-attempt-you-can-keep).

### Assignment

**Ticket:** “A numeric-looking string reached the cart and broke the total.”
Implement `readProducts(value: unknown)` returning new `{id, priceCents}` objects.
Input must be an array; each entry must be a non-array object with a nonempty,
un-padded string ID and a nonnegative safe-integer price. IDs must be unique.
Extra fields are allowed but excluded from the result. Reject the entire feed
with a generic error if any record is invalid; do not silently drop records.

Test an empty feed, free product, two valid products, `'1299'`, `12.99`, a
negative value, duplicate IDs, padded IDs and a non-array input. Include an extra
`privateNote:'TRAINING_ONLY'` field and prove it is not returned or put in errors.

### Acceptance criteria

Valid records preserve exact identity and price; invalid feeds fail as a whole.
Changing a returned record does not mutate the input record. Tests and explicit
typecheck pass. Explain why parsing a currency display string belongs elsewhere.

### Changed condition

Add a record priced at `Number.MAX_SAFE_INTEGER` and one above it. Predict the
outcomes. Temporarily replace the safe-integer guard with a truthiness check and
show which legitimate value or invalid value your tests catch, then restore.

### Evidence and review

Deliver the boundary cases and narrow results. **90-second explanation:** why
does a declared TypeScript interface not establish a server response's shape?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Zero is a legitimate amount; arrays are objects; duplicate IDs create ambiguous
product identity. Keep validation separate from business rules such as whether
a catalog is allowed to contain free products.

</details>

## AS-11 · Plan cleanup without deleting data

**L2 · Independent · Offline · 50–75 min · App: synthetic fixture service.**

### Prerequisites

AS-10 and [fixture cleanup](../../exercises/08-fixture-cleanup/README.md).
Node 24 only. Own `AS-11/attempt.ts` and `attempt.test.ts` in your private bank
directory. This assignment returns a plan; it has no delete capability.

### Assignment

**Ticket:** “A cancelled test left fixtures. A prefix-based cleanup would remove
another worker's records.” Implement `planCleanup(records, runId, now)`. Correctly
typed records have unique `id`, `ownerRunId`, `state: 'ready' | 'in-use'` and
`expiresAt` as integer epoch milliseconds. Assume valid run ID and finite `now`.
Return `{deleteIds, keepIds}` in input order. A record is eligible only when its
owner exactly equals runId, it is `ready`, and expiresAt is less than or equal
to now. Do not mutate records.

For run `run-7`, now `1000`, use:

| ID | Owner | State | Expires |
|---|---|---|---|
| a | run-7 | ready | 999 |
| b | run-70 | ready | 900 |
| c | run-7 | in-use | 800 |
| d | run-7 | ready | 1000 |
| e | run-7 | ready | 1001 |

Add an empty input case, another run and a repeat call over unchanged records.
Write a short explanation of why the plan is not permission to delete real data.

### Acceptance criteria

Only `a` and `d` are proposed in the first plan. Exact ownership, active use and
expiry are independently tested. The plan is deterministic and every ID appears
in exactly one output list. No network or destructive filesystem action occurs.

### Changed condition

Between planning and execution, `a` becomes `in-use`. Describe the conditional
server-side delete/version check a real executor would need. A second local
filter alone cannot make the remote check and delete atomic.

### Evidence and review

Deliver code, tests and the race note. **90-second explanation:** why does a
unique test-data prefix help organization but not establish ownership or safety?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Keep selection separate from execution. A late cleanup job needs an explicit
ownership and lease contract, plus an atomic protection if state can change.
Do not test this plan on `.local-data`, personal files or a company environment.

</details>

## AS-12 · Support a schema rollout

**L3 · Investigation · Offline · 60–90 min · App: synthetic catalog API.**

### Prerequisites

AS-10, [API contract lab](../../exercises/10-api-contract/README.md) and Node 24.
Own `AS-12/attempt.ts`, `attempt.test.ts` and `evidence.md` in your bank directory.

### Assignment

**Ticket:** “Old and new app versions receive different price payloads during a
rollout. A test adapter treats missing prices as zero.” Implement
`normalizePrice(value: unknown)` returning `{id, currency:'USD', cents}`.
Contract v1 is `{version:1, id, priceCents}`; v2 is
`{version:2, id, price:{currency:'USD', minorUnits}}`. ID follows AS-10's rule;
amounts are nonnegative safe integers. Extra fields are allowed. Require the
declared version's complete shape, reject unknown versions/currencies, and never
fall back to v1 fields when version is 2.

Build a compatibility table and tests for equivalent v1/v2 payloads, missing
version, missing amount, zero, EUR, string amount and v2 with only a v1 amount.
Add a conflicting payload containing both price forms; use the declared version
and document why. Errors must not include raw input.

### Acceptance criteria

The normalized result is consistent for valid equivalent data. Unknown or
incomplete contracts fail visibly. Tests distinguish compatibility from silent
coercion. State which app/server versions would still need real integration
testing; this pure adapter has not exercised a rollout.

### Changed condition

The backend proposes v3 with decimal strings and multiple currencies tomorrow.
Do not silently accept it. Write the missing rounding/currency questions and
the smallest regression packet needed before extending the adapter.

### Evidence and review

Deliver compatibility table, code, results and a proposed rollout comment.
**90-second explanation:** how do you support old clients without making the
adapter accept every malformed payload as success?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Discriminate by version before reading that version's fields. An absent value
must not become a legitimate free product. A version table makes supported
combinations reviewable; it does not prove a server actually deploys them.

</details>

[Assignment bank](README.md) · [Next topic: commerce](05-commerce.md)
