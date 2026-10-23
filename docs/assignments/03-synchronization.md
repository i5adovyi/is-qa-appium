# Synchronization and timing

These offline contracts use deterministic observations. They let you practise
causality without a slow device; a passing simulation is not a mobile result.

## AS-07 · Ignore an outdated search response

**L1 · Guided · Offline · 35–50 min · App: synthetic search screen.**

### Prerequisites

Arrays, functions and [async ordering](../lessons/03-async-and-assertions.md).
Node 24 only. Own `.local-data/assignments/AS-07/attempt.ts` and
`attempt.test.ts`; use the [attempt commands](README.md#make-an-attempt-you-can-keep).

### Assignment

**Ticket:** “Typing `cat` quickly shows the older results for `ca`.” Implement
`reduceSearch(state, event)` as a pure function. State contains `activeId:
string | null` and `results: string[]`. A `started` event carries `requestId` and
sets that active ID while clearing results. A `received` event carries
`requestId` and `results`; copy those results only when its ID matches the active
ID, otherwise retain the current state. Inputs are correctly typed; request IDs
are unique for different requests. Do not mutate state, event or their arrays.

Replay `started(a) → started(b) → received(b,['cat']) → received(a,['car'])`.
Also test the opposite response order, an empty successful result and a response
before any request. Assert state after each event, not only the last one.

### Acceptance criteria

The newest request owns the displayed result, regardless of response order.
Empty is a valid result. Mutating the received event's array after reduction
does not change the stored state. Run your tests and explicit typecheck.

### Changed condition

The newest request legitimately returns an empty result, then an older request
returns matching items. Add that regression. Temporarily accept every `received`
event and show that your check catches obsolete items replacing the empty result;
then restore. You have not intercepted an actual app's network traffic.

### Evidence and review

Save the event trace, test result and one failed deliberate implementation.
**90-second explanation:** why does awaiting both requests not guarantee that
the UI shows the newest result?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Completion order and user intent are different orders. Correlation identifies
which result is still relevant. An automation retry cannot fix an application
that commits an obsolete response into its displayed state.

</details>

## AS-08 · Observe a business outcome

**L2 · Independent · Offline · 45–70 min · App: synthetic receipt screen.**

### Prerequisites

AS-07, async functions and [bounded polling](../../exercises/05-polling/README.md).
Node 24 only. Own `AS-08/attempt.ts` and `attempt.test.ts` in the private bank
directory. Do not alter a previously solved lab.

### Assignment

**Ticket:** “The spinner disappears, so the test says the order succeeded.”
Implement `observeReceipt(read, wantedId, maxReads)`. Validate `maxReads` as a
positive safe integer before calling `read`; assume `wantedId` is nonempty.
Each awaited `read()` yields `{busy, receiptId, status}`, where status is
`pending`, `confirmed` or `failed`, and receiptId is a string or null.

Return the snapshot only when it is not busy, has the wanted ID and is confirmed.
If that same ID is not busy and failed, throw `order failed`. All other snapshots
consume one observation. On exhaustion throw `outcome not observed`; propagate
read rejections unchanged and immediately. Do not submit, click or sleep.

Author fake sequences for spinner gone but pending; wrong confirmed receipt then
right receipt; busy confirmed then settled confirmed; terminal failure; never
settles; and a disconnected read. Record the number of reads.

### Acceptance criteria

At most `maxReads` observations occur, with no read after success or terminal
failure. A disappeared spinner or another order's success cannot pass. The final
allowed read can succeed. Validate the limit before any fake interaction.

### Changed condition

Make a wrong-ID confirmed receipt the first observation and the intended receipt
appear on the final allowed read. Prove your tests catch a temporary “any
confirmed receipt” implementation, then restore the contract.

### Evidence and review

Deliver call traces for success, exhaustion and rejected transport.
**90-second explanation:** what additional time budget, interval and actual
business identity would a real Appium adapter need?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Observation can be repeated safely here because it has no write action. This
contract deliberately separates successful observation from successful purchase.
The fake max-read budget is not a real elapsed-time guarantee.

</details>

## AS-09 · Explain where the time went

**L3 · Investigation · Design · 40–60 min · App: fictional Android run trace.**

### Prerequisites

[Waiting and state](../lessons/09-waits-and-state.md),
[debugging](../lessons/10-debugging.md) and basic arithmetic. Node is optional
for calculations; no device or account is required. Own `AS-09/evidence.md`.

### Assignment

**Ticket:** “A wait configured for 5 seconds failed after 18 seconds. Increase
every timeout?” Analyse this synthetic single-thread trace; times are seconds
from the start of the test and commands do not overlap:

```text
0.0–0.4  navigation command completes
0.4      outer condition wait begins, nominal budget 5.0
0.4–6.4  first element lookup returns no element
6.4–12.4 second lookup returns no element
12.4–18.4 third lookup returns no element
18.4     wrapper throws "not ready"
18.4–19.2 diagnostic capture
19.2     test finishes
```

Calculate navigation, observation and capture time separately. Produce a
hypothesis table for long inner command timeout, wrapper budget checked too
late, and app slowness. Name the smallest source/config/log observation that
would distinguish them. The trace alone does not reveal the implementation.
Sketch a corrected deadline contract including what happens when one in-flight
driver command outlives the outer budget; do not claim JavaScript can cancel
every WebDriver command on demand.

### Acceptance criteria

Your timeline sums correctly, distinguishes configured from observed duration
and does not treat the final diagnostic time as UI waiting. The proposed repair
has a stopping rule and preserves the first useful error instead of hiding it.

### Changed condition

A second packet shows every lookup finishes within 0.1 seconds, but observations
remain false until 12 seconds. Revise the investigation: what requirement or
performance evidence is now missing before changing the deadline?

### Evidence and review

Deliver timeline, competing causes and revised decision. **90-second explanation:**
why are command timeout, explicit condition timeout and test timeout different
controls, and what can you infer from one slow run?

<details><summary>Hint and reviewer questions — after your attempt</summary>

A nested operation can make a nominal outer timeout misleading. Before blaming
the app, inspect when the wrapper checks its deadline and which operation is
actually blocking. A synthetic trace supports a hypothesis, not a discovered
bug in this project's wait helper.

</details>

[Assignment bank](README.md) · [Next topic: data contracts](04-data-contracts.md)
