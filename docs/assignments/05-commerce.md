# Commerce in a second training app

These tickets use **Sauce Labs My Demo App for Android**, the optional native
app in the [training-app guide](../handbook/training-apps.md). Its source supports
catalog, cart, quantity and checkout practice. These are source-based fixture
capabilities; the assignments below are not pre-validated device tests.

Keep your work in `test/training/saucelabs/`. The opt-in runner selects the
matching app identity; the original WebdriverIO demo helpers are not a reset
strategy for this app. No real account, address or payment details are needed.

## AS-13 · Add and remove the intended product

**L1 · Guided · Android · 45–70 min · App: Sauce Labs My Demo App.**

### Prerequisites

A compatible Android device, [optional app setup](../handbook/training-apps.md),
the first-test and selector lessons. Own
`test/training/saucelabs/as-13-cart.spec.ts` and a private AS-13 evidence note.

### Assignment

**Ticket:** “A cart test checks only its badge. Prove the customer added the
intended product.” Inspect the catalog and choose a product using an observed
identity. Record its displayed name and unit price before adding it. Inspect
the detail, add, cart and remove controls; do not borrow coordinates or selectors
from another app version.

Establish an empty cart through the inspected UI and verify it. Add one unit,
open the cart and assert the product identity and quantity. Remove that item and
assert the empty state. A badge change alone is insufficient.

```bash
npm run training:apps -- download saucelabs
npm run test:training -- saucelabs --spec test/training/saucelabs/as-13-cart.spec.ts
npm run typecheck
```

### Acceptance criteria

The test starts from an observed empty cart, links catalog identity to cart
identity, verifies removal and records build/device/run evidence. It can be
rerun without a previous test preparing its state. Explain how your selector
distinguishes another product with a similar label.

### Changed condition

Temporarily add a different inspected product while retaining the original
expected identity. Predict the failing assertion, run and restore. A test that
still passes has not established the intended product.

### Evidence and review

Deliver the isolated spec, selector notes and controlled failure.
**90-second explanation:** what does this cart test prove beyond “the add button
was clickable,” and what does it still not prove about inventory or a backend?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Keep expected identity outside the cart observation. A cart populated from a
previous run can make a missing add action appear successful. Inspect the empty
state explicitly and preserve unrelated reference specs.

</details>

## AS-14 · Check cart arithmetic and isolation

**L2 · Independent · Android · 60–90 min · App: Sauce Labs My Demo App.**

### Prerequisites

AS-13, [test data](../lessons/08-test-data.md) and integer-cent arithmetic.
Own `test/training/saucelabs/as-14-totals.spec.ts`; use the AS-13 training runner
with this filename. Record private evidence under AS-14.

### Assignment

**Ticket:** “Quantity changes show a plausible total, but nobody checks the
calculation or state left for the next test.” Choose two products with different
observed unit prices. Record those prices independently before entering the
cart. Write one scenario with product A at quantity 2 and B at quantity 1.
Assert each cart row's identity, displayed **unit price** and quantity. Compute
each product's contribution (unit price × quantity) and the expected cart sum
in integer cents, then compare that sum with the cart summary after each change.
The pinned app displays unit price and quantity on each row; do not assume a
separate extended line-total field exists. Distinguish the cart's item subtotal
from any tax/shipping fields displayed later in checkout.

Write a second scenario starting empty with only B at quantity 1. Each scenario
must establish its own state. Run them in both orders in your own spec; record
the selected order and results. Inspect whether any badge counts rows or units
before choosing its expected value.

### Acceptance criteria

Assertions independently check identity, displayed unit prices, quantities and
the cart summary arithmetic. Both orders have the same meaningful results;
no scenario relies on another's cleanup.
The evidence names the exact currency/format observed and how you handled it.
A format you cannot parse safely must fail clearly, not produce zero.

### Changed condition

Temporarily omit one scenario's initial cleanup and run it after the other.
Predict whether state contamination is observable on this build. If isolation
still holds because the app resets, record that evidence and use a deliberate
extra item inside the scenario to prove your empty-state guard can fail.

### Evidence and review

Deliver both-order run evidence, arithmetic examples and restored code.
**90-second explanation:** why is comparing a displayed total with itself a weak
oracle, and why are separate test names not enough to make tests independent?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Use small, representable cent values. Calculate from independently captured unit
prices and intended quantities, not the total under test. Fresh launch and empty
cart are separate claims; inspect how the app stores its state.

</details>

## AS-15 · Investigate an interrupted checkout

**L3 · Investigation · Android · 60–90 min · App: Sauce Labs My Demo App.**

### Prerequisites

AS-14, state and debugging lessons. Own
`test/training/saucelabs/as-15-checkout.spec.ts` plus an AS-15 state map. Use only
fixture-documented demo credentials if the flow requests login.

### Assignment

**Ticket:** “A customer backs out of checkout and returns. Which values and cart
items remain, and could our test mistake stale confirmation for a new order?”
Inspect the actual checkout stages first. Create a small map of screens, Back
or Cancel actions and the cart identity each stage relates to. Use synthetic
contact/address data only; stop before entering payment data or final submission.

Choose one supported interruption before payment: navigate Back from an address
step or use an inspected cancel action. Record the baseline behavior, then write
one characterization test for the observed state on return. Explain which
preservation rule would need product agreement in a real app. If the chosen
action is absent, select an available Back transition and document that choice.

### Acceptance criteria

The state map matches the inspected build, the test proves its starting product
and stage, and the after-state is observed rather than assumed. Explain the
limits of a characterization test and the lack of an authoritative transactional
order/payment oracle. Required device execution remains pending if blocked.

### Changed condition

A fictional developer says, “A confirmation label proves exactly one paid order.”
Write the additional correlation, API/payment-sandbox and repeated-submit
evidence you would need to test that claim. Do not fabricate that evidence or
treat the demo's sample HTTP calls as a real commerce backend.

### Evidence and review

Deliver the state map, narrow result and missing-integration request.
**90-second explanation:** what belongs in a UI test, what belongs in an
integration test, and where does this demo stop being enough?

<details><summary>Hint and reviewer questions — after your attempt</summary>

Do not call a per-test reset between leaving and returning; that destroys the
scenario. A test can document current behavior without declaring it the intended
product requirement. A success-looking screen cannot prove a unique server write.

</details>

[Assignment bank](README.md) · [Next topic: Android state](06-device-state.md)
