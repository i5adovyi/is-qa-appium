# Incident shifts: practise work with incomplete evidence

Six fictional shifts model a difficult workday without needing an employer's
systems. They combine existing cases with new evidence and two repair labs.
These are original simulations, not reports of actual customer incidents.

**Start:** after lessons 08–10. Shifts S4–S6 also use delivery lessons 12–14.
**Time:** one shift per 60–90-minute session; coding may need another session.
Do not rush six shifts in a day. A smaller, well-supported conclusion beats a
large list of guesses.

For each shift:

1. Read only the opening packet. Write two hypotheses and one observation that
   would distinguish them. Record what you would do **before** opening a reveal.
2. Open the additional evidence and revise your hypothesis. Record what changed
   your mind; do not rewrite your original prediction to look correct.
3. Perform the permitted local task or produce a design artifact as specified.
4. Write a five-line handover: known fact, uncertainty, user impact, next action
   and owner. Use the [decision log](templates.md).
5. Open the review guide last. Score the reasoning, not agreement with every word.

Never report a supplied synthetic trace as a device test you performed.
Run commands only in this training checkout; no production mutations are required.

## S1 · The requirement changes after you wrote the test

**Practice:** RW-29; lesson 07. **Mode:** design and communication.

Opening packet:

```text
Ticket v1: Email is optional during registration.
Acceptance table: Empty email must show "Email required".
Mock: No required marker.
Current test: every empty email produces "Email required".
Developer: "The old app lets it through, so please approve this."
```

Write a 100-word clarification message and a provisional test table. Identify
which checks can proceed. Predict the effect if the rule differs by account type.

<details><summary>Additional evidence — open after your provisional table</summary>

Product decision v2: guest checkout may omit email; creating a registered account
requires email. Whitespace-only counts as missing. The registered flow's exact
validation text is still with localization; the release needs English and Polish.

</details>

Revise your table without changing the supplied demo's simulated Login contract.
Include flow identity, missing/whitespace input and what remains unresolved about
copy. Write an update explaining why you changed the expected result.

<details><summary>Review guide and acceptance</summary>

The decision splits two flows; one blanket empty-email assertion is wrong.
Test the agreed blocking/continuation behavior in the appropriate flow.
Exact text checks need agreed localized copy. No source justified silently choosing
the old implementation as the contract. A useful handover identifies the copy owner
and unsettled checks, without calling all registration testing blocked.
Accept when the table reflects v2 and every expected result has a source.

</details>

## S2 · The failure follows another test, not a device

**Practice:** RW-30; lab 11. **Mode:** executable offline repair.

Opening packet:

```text
Commit c-42, same APK and device:
checkout-without-coupon alone: pass
coupon → checkout-without-coupon: fail (expected null, got SAVE10)
checkout-without-coupon → coupon: pass
App restarted before each case. Account IDs differ.
A teammate proposes adding three retries.
```

List state layers the restart can and cannot reset. Run
`npm run practice -- 11`, identify the first **causal** failure and inspect the
factory. Do not edit the reference file.

<details><summary>Additional evidence — open after inspecting the factory</summary>

Both fixtures have different outer object identities. Their `cart` property
points to the same object. No API request is needed to reproduce the failure.
An unrelated device-disconnect warning came from yesterday's run.

</details>

Repair the starter, add one regression case and run it again. Explain why the
old disconnect warning is not evidence for this run and why a nested copy matters.

<details><summary>Review guide and acceptance</summary>

The order experiment and shared reference support fixture-memory contamination.
A backend conflict was a reasonable initial hypothesis but is not needed to
reproduce this failure. The repair must isolate nested values in both directions.
Accept a red-to-green lab run, a new edge case and a clear ownership explanation.
If you only read the solution, record reviewed rather than implemented.

</details>

## S3 · The success screen hides two server writes

**Practice:** RW-04/RW-36; lab 12. **Mode:** executable offline repair.

Opening packet:

```text
10:00:00.000 create intent-7
10:00:00.020 order-1 committed
10:00:02.000 client timeout; helper retries
10:00:02.020 order-2 committed
10:00:02.030 success screen; UI test passes
```

State the missing assertion and classify what the first timeout proves.
Run `npm run practice -- 12`. Investigate the stateful fake instead of accepting
the helper's returned confirmation as the only oracle.

<details><summary>Additional evidence — open after the initial failure</summary>

The key is logged for correlation; creation does not enforce uniqueness.
The read model can be delayed. A lookup returning nothing immediately after
the timeout is possible even if the order exists.

</details>

Repair the starter and write a caller policy for the unknown outcome. Include
what must be agreed with the backend before automatic write retries are safe.

<details><summary>Review guide and acceptance</summary>

Reconcile the original intent. A match can confirm; an empty read cannot prove
absence at the write boundary. Do not change the key or resubmit in this helper.
Accept only if the ledger test catches duplicate writes, unknown is preserved,
and the handover acknowledges that another invocation could still replay the intent.
No “exactly once” guarantee is established by this exercise.

</details>

## S4 · Cancellation, stale artifacts and an orphaned fixture

**Practice:** RW-12/RW-17/RW-31; lab 08. **Mode:** evidence investigation.

Opening packet:

```text
Run r-81 starts at 11:00 UTC.
11:02 fixture created: owner=mobile-qa, run=r-81, environment=staging.
11:03 a developer cancels the CI job.
The report directory contains a green summary and a screenshot of Login.
No "cleanup completed" event appears.
```

Write the questions needed before calling the test passed or the fixture leaked.
Propose how to associate each artifact with a run, test, attempt and timestamp.

<details><summary>Additional evidence — open after your questions</summary>

The green summary is from r-80. The screenshot is from r-81 before submission.
Runner evidence confirms r-81 was force-killed. The fixture lease expires at 11:30.
At 12:00 the run service says terminated. Another team's fixture also looks old.

</details>

Apply RW-31's dry-run policy. Draft a manifest for future evidence and explain
why a `finally` block alone does not solve process loss. No deletion is performed.

<details><summary>Review guide and acceptance</summary>

The canceled run is incomplete, not passed. A screenshot before the assertion
does not establish its result. The owned fixture may be a candidate after expiry
and status checks; another team's record is excluded. Recheck the lease/version
before any permitted future cleanup. Keep source evidence, redact copies for
sharing, and distinguish missing telemetry from proof that an action never ran.
Accept a per-artifact identity table and bounded cleanup proposal.

</details>

## S5 · A green test survives a broken feature

**Practice:** RW-32/RW-33/RW-34; lesson 09-B. **Mode:** design plus optional local demo.

Opening packet:

```ts
await FormsScreen.input.setValue('draft')
// clearValue() was accidentally removed
expect(await FormsScreen.input.isDisplayed()).to.equal(true)
```

Predict the result. Write a stronger sequence of observations without looking
at the reference test. On a working emulator, perform lesson 09-B and restore
only your deliberate edit; otherwise label this a written design.

<details><summary>Additional evidence — open after your prediction</summary>

The input stayed populated and the assertion passed. A separate offer-expiry
test also passes because it calculates expected expiry using the same fixed
24-hour helper as the app. Its actual requirement is next Warsaw midnight.

</details>

Supply an independent expected example for the spring clock change in RW-32.
Explain why a passing assertion may be irrelevant or coupled to the same bug.
As a stretch, inspect the input-length examples in RW-33.

<details><summary>Review guide and acceptance</summary>

Verify populated state before clearing and empty state afterward; a visibility
check alone does not observe clearing. The spring interval is 23 hours under
the supplied contract. A shared erroneous implementation cannot be its own
independent oracle. Accept predictions, concrete expected values and a mutation
that fails on the intended behavior; label any unrun device work accurately.

</details>

## S6 · The release needs a decision before the investigation is complete

**Practice:** RW-18/RW-28/RW-35; D10. **Mode:** incident handover and prioritization.

Opening packet:

```text
45 minutes remain. Eight cases were planned:
3 pass on the staging debug build.
1 fails: duplicate order after a lost response.
2 were blocked by a private-network outage before app interaction.
2 have not started. No release-build run is available.
Support: "We have one similar customer report, but no correlation ID."
```

Write a recommendation to the release owner, choose the next two observations
and explain what you would stop doing. Keep results separated by build and mode.

<details><summary>Additional evidence — open after your recommendation</summary>

The duplicate was reproduced once with a synthetic backend; the debug build's
receipt was redacted before sharing. The release backend's idempotency contract
has not been confirmed. The tunnel outage is now resolved, with 15 minutes left.
A developer asks to rename the failed case "unstable" and rerun until green.

</details>

Revise the recommendation. Specify a small executable check, an owner for the
backend contract and the residual risk. Do not claim the synthetic reproduction
proves the release backend has the same defect.

<details><summary>Review guide and acceptance</summary>

The actionable risk is unresolved duplicate submission in a high-impact flow.
The release owner needs the affected build/environment, evidence limits and options
such as holding the change, reducing rollout or accepting a documented risk.
Three debug passes are not release confidence or an eight-case pass rate.
Do not relabel evidence to obtain green; rerun only to answer a named question.
Accept a concise recommendation that changes with evidence and names decision
ownership. There is no universal release answer without product constraints.

</details>

## Assessment that checks judgment

Score each dimension 0 (missing), 1 (partial), 2 (clear):
evidence versus inference; competing hypotheses; useful next observation;
bounded repair/cleanup; honest handover. Maximum **10**.

An unsupported production claim or destructive unscoped cleanup needs correction
regardless of score. Repeat a shift next day with one premise changed: different
build, missing correlation ID, active lease or delayed read model.
Aim for at least 8/10 with a defensible answer, then tackle a different shift.
This is a self-review gate, not a certification.

[Troubleshooting method](https://sre.google/sre-book/effective-troubleshooting/)
· [Workplace cases](workplace-scenarios.md)
· [Study plan](study-plans.md)
