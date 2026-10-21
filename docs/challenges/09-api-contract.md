# CH-09 · HTTP 200 returned the wrong customer's order

**Ticket:** “Fixture creation says success, but the UI test opens an unexpected
order. Someone suggests casting the response to Order.” A type assertion does
not validate runtime bytes.

## Prerequisites

Node only, unknown values and type narrowing from
[TypeScript](../lessons/02-typescript.md), async/await and
[lab 10](../../exercises/10-api-contract/README.md). Its tests use a temporary
loopback HTTP server, not an external backend. Allow 45–90 minutes.

## Assignment

Own [lab 10 starter](../../exercises/10-api-contract/starter.ts). Before editing,
classify these fictional responses for request ID `order-7`:

| Response | Classification to explain |
|---|---|
| 200 with id order-8 | Identity mismatch |
| 200 with totalCents "400" | Invalid runtime type |
| 200 with state pending | Valid order data; not confirmation |
| 401 with broken JSON | Status result without parsing the body |
| 200 with invalid JSON | Parsing failure |
| Request rejects before a response | Transport/adapter failure |

Implement the exact lab contract, including one request and no body parsing for
mapped error statuses.

```bash
npm run practice -- 10
npm run typecheck:practice
```

Add a regression with `Number.MAX_SAFE_INTEGER` as a valid total and another
with one greater than that bound as invalid. Check the error does not contain a
sentinel private payload value. Preserve the existing HTTP integration test.

## Acceptance criteria

The contract suite and added boundaries pass. The temporary server closes after
the run. A wrong ID fails even with HTTP 200; pending data is not relabeled as a
confirmed purchase. A malformed response does not leak raw data in the error.

## Evidence and review

Record which check catches each response and separate transport, status, parsing,
schema, identity and business assertions. This ticket does not require adding a
real API or credentials.

<details><summary>Hint / reviewer questions — after your attempt</summary>

Narrow unknown step by step. Non-null object excludes neither arrays nor bad
field types. Use safe integers for the fictional cent amount. Extra allowed
fields need not be returned to callers. Preserve the contract's error mapping
rather than assuming all HTTP clients throw on error statuses.

</details>

**Change request:** the caller wants only confirmed orders. Where should that
business assertion live without breaking this loader's valid pending contract?
Show a proposed assertion and one counterexample.
Next: [CH-08](08-uncertain-write.md) if pending, otherwise [CH-10](10-ci-evidence.md).
