# 06 · Model answers: Forms

All snippets below are new `it` blocks inside the existing `describe('Forms screen', ...)`. The file already imports Chai, `FormsScreen`, and `waitForText`, and its `beforeEach` prepares the screen.

## 06-A · Replacement

```ts
it('should replace the previous input', async () => {
    await FormsScreen.input.setValue('First value')
    await waitForText(FormsScreen.inputResult, 'First value')
    expect(await FormsScreen.inputResult.getText()).to.equal('First value')

    await FormsScreen.input.setValue('Second value')
    await waitForText(FormsScreen.inputResult, 'Second value')
    expect(await FormsScreen.inputResult.getText()).to.equal('Second value')
})
```

The second check rejects a stale `First value`, concatenated `First valueSecond value`, a truncated value, and extra whitespace. The first check proves the field actually contained meaningful previous input.

Using variables for the two strings is also valid and usually useful when the data is longer.

**Common pitfalls:** Using `addValue` when replacement is the requirement; checking only the final value; asserting that the result merely “contains” `Second value`, which would allow unwanted concatenation.

## 06-B · Idempotent clearing and recovery

```ts
it('should accept new input after clearing twice', async () => {
    await FormsScreen.input.setValue('Before clearing')
    await waitForText(FormsScreen.inputResult, 'Before clearing')
    expect(await FormsScreen.inputResult.getText()).to.equal('Before clearing')

    await FormsScreen.input.clearValue()
    await waitForText(FormsScreen.inputResult, '')
    expect(await FormsScreen.inputResult.getText()).to.equal('')

    await FormsScreen.input.clearValue()
    await waitForText(FormsScreen.inputResult, '')
    expect(await FormsScreen.inputResult.getText()).to.equal('')

    await FormsScreen.input.setValue('After clearing')
    await waitForText(FormsScreen.inputResult, 'After clearing')
    expect(await FormsScreen.inputResult.getText()).to.equal('After clearing')
})
```

The reference test covers populated → empty. This adds empty → empty and empty → populated, showing that clearing is harmless when repeated and does not leave the field unusable.

“Idempotent” here means applying the clear action again leaves the same empty state. This word describes a specific property; it is not a guarantee that every action can safely be retried. Repeating a purchase submission is a very different operation.

**Common pitfalls:** Comparing the `FormsScreen.inputResult` element object itself with `''`; treating a placeholder as the echoed result; adding `pause` after each action without a state-based reason.

## 06-C · Switch round trip

```ts
it('should turn the switch on and off', async () => {
    const offInstruction = 'Click to turn the switch ON'
    const onInstruction = 'Click to turn the switch OFF'

    await waitForText(FormsScreen.switchText, offInstruction)
    expect(await FormsScreen.switchText.getText()).to.equal(offInstruction)

    await FormsScreen.switch.click()
    await waitForText(FormsScreen.switchText, onInstruction)
    expect(await FormsScreen.switchText.getText()).to.equal(onInstruction)

    await FormsScreen.switch.click()
    await waitForText(FormsScreen.switchText, offInstruction)
    expect(await FormsScreen.switchText.getText()).to.equal(offInstruction)
})
```

Names such as `offInstruction` describe the current state represented by the label. You could instead name them `turnOnText` and `turnOffText` to emphasize the offered action. Choose names you can explain consistently.

This scenario observes the label changes tied to taps. It does not independently prove the switch's accessibility checked state, persistence, or backend effects. A later test could inspect the appropriate platform attribute after verifying it in Inspector.

**Common pitfalls:** Expecting the word `ON` to mean the switch is already on; depending on the previous test's tap; switching app state from a helper without revealing that setup to the reader.

## Checkpoint answers

- The populated assertion proves a real clearing transition rather than an already-empty false positive.
- The empty string has no characters; one space is input data.
- Process restart does not necessarily erase persistent storage or invalidate a server session.
- Concatenation suggests the operation appended or failed to replace existing text; inspect command intent and application behavior before changing the expectation.

[Back to lesson](../lessons/06-forms.md) · [Next lesson](../lessons/07-login.md)
