# Lab 10 — HTTP success is not business success

**Time:** 35–50 minutes. **After:** lessons 02, 03 and 08; interview Q11/Q19/Q41.
No external account, emulator or internet connection is required. One test starts
a disposable server on the loopback interface to exercise actual HTTP responses.

A mobile test needs a known order as a fixture. Implement `loadOrder(id, request)`
in [starter.ts](starter.ts). The injected request callback makes exactly one
read-only request; it returns a status plus a `json()` method yielding `unknown`.

## Contract

1. Reject empty/whitespace-only or surrounding-whitespace IDs with
   `Error('Invalid order ID')` **before** requesting. Preserve valid IDs exactly.
2. Await `request(id)` once. If it rejects, propagate the same rejection. Do not
   retry, log or perform another action.
3. Map these statuses without reading the body:

| Status | Return |
|---|---|
| 401 | `{ kind: 'unauthenticated' }` |
| 403 | `{ kind: 'forbidden' }` |
| 404 | `{ kind: 'not-found' }` |
| 429 | `{ kind: 'throttled' }` |
| 503 | `{ kind: 'unavailable' }` |

4. A status other than these or 200 throws
   `Error('Unexpected HTTP status: ' + status)`.
5. For 200, await `json()`. Require a non-null, non-array object whose `id` exactly
   matches the request, `state` is `pending` or `confirmed`, and `totalCents` is a
   nonnegative **safe integer** number. Extra fields are allowed but not returned.
6. A parsing failure or invalid shape/value throws
   `Error('Invalid order response')`; never include the raw payload.
7. Return `{ kind: 'order', order: { id, state, totalCents } }` with a new object
   containing only those fields. Do not mutate the source object.

These statuses and fields are a **fictional exercise API contract**, not a
universal mapping for every service. `pending` is valid data but does not mean a
purchase is confirmed. The caller still needs its business assertion.

## Work

```bash
npm run practice -- 10
npm run typecheck:practice
```

Implement the starter, rerun, and add a valid order with
`totalCents: Number.MAX_SAFE_INTEGER`. Explain why an HTTP 200 with the wrong ID
must fail and why automatically retrying authentication/authorization failures
would conceal a useful signal.

<details><summary>Hint 1</summary>

Inspect status before parsing. `fetch` can resolve with an HTTP error response;
promise resolution is not a success assertion.

</details>
<details><summary>Hint 2</summary>

Narrow `unknown` in steps: object, non-null/non-array, then field types and values.
A type assertion is not a runtime check. Use `Number.isSafeInteger`.

</details>

**Done when:** tests pass, the loopback server closes after the run, and you can
separate transport, HTTP, parsing, schema, identity and business failures.
The request callback owns URL construction, credentials, timeout and redirect
policy; the supplied HTTP test uses a timeout and no credentials.

**Reference:** [solution.ts](solution.ts).
Use this in [drill D8](../../docs/handbook/interview-drills.md) and workplace cases
RW-16/RW-24 in the [scenario workbook](../../docs/handbook/workplace-scenarios.md).
[Fetch reference](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

[All labs](../README.md)
