# 09 · Solutions and reasoning

[Return to exercises](../lessons/09-waits-and-state.md).

## 09-A · Idempotent switch state

An Android-specific implementation inside `FormsScreen` can be:

```ts
async setSwitch(enabled: boolean) {
    const initial = await this.switch.getAttribute('checked')
    if (initial !== 'true' && initial !== 'false') {
        throw new Error(`Unexpected switch checked attribute: ${initial}`)
    }

    const expected = String(enabled)
    if (initial !== expected) {
        await this.switch.click()
    }

    await driver.waitUntil(
        async () => (await this.switch.getAttribute('checked')) === expected,
        {
            timeout: 5000,
            timeoutMsg: `Forms switch did not become ${enabled ? 'on' : 'off'}`,
        },
    )
}
```

Do not append a second method if the supplied screen already contains one; compare and improve it. The check before tapping makes this idempotent: repeated calls request the same state. This implementation deliberately documents Android's state representation. Reusing it on iOS requires inspecting that platform's attributes.

## 09-B · Two transitions, two observations

```ts
const text = 'Before clearing'
await FormsScreen.input.setValue(text)
await driver.waitUntil(
    async () => (await FormsScreen.inputResult.getText()) === text,
    { timeoutMsg: 'Expected a populated result before clearing' },
)
expect(await FormsScreen.inputResult.getText()).to.equal(text)

await FormsScreen.input.clearValue()
await driver.waitUntil(
    async () => (await FormsScreen.inputResult.getText()) === '',
    { timeoutMsg: 'Expected the result to become empty after clearing' },
)
expect(await FormsScreen.inputResult.getText()).to.equal('')
```

The deliberate “remove clear” mutation should fail on the second condition because the first proved that text had appeared. Record this observation rather than assuming the test would fail. Restore the action, rerun narrowly, then run the Forms file.

## 09-C · Order dependence

The dependency demonstration requires suppressing any automatic per-test restart/reset **only for the temporary experiment**, otherwise that reset correctly prevents the failure. Preserve the working original setup before editing. In a shared session:

```ts
it('leaves the switch on', async () => {
    await FormsScreen.setSwitch(true)
})

it('expects an off switch', async () => {
    expect(await FormsScreen.switch.getAttribute('checked')).to.equal('false')
})
```

The repair is to establish the condition with `await FormsScreen.setSwitch(false)` in the relevant setup, then verify the behavior the case actually intends to test. Restore the baseline restart policy after the experiment. Run both case orders and remove the temporary scenarios.

A loop with `click()` inside a wait changes state on every poll; an observational predicate reads only. Existence, display, enabled state, and correct text are different conditions. Retries can hide the initial failure without repairing the state contract.

[Next lesson](../lessons/10-debugging.md)
