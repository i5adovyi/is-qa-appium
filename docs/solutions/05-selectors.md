# 05 · Model answers: selectors

## 05-A · Selector inventory

These are the repository's expected locators; compare them with your installed app rather than claiming inspection you did not perform.

| Element | Selector | Strategy | Potential break |
|---|---|---|---|
| Forms input | `~text-input` | Accessibility ID | ID renamed or duplicated |
| Forms result | `~input-text-result` | Accessibility ID | Result control replaced without retaining ID |
| Login email | `~input-email` | Accessibility ID | Test on Sign up or another screen with unexpected structure |
| Login submit | `~button-LOGIN` | Accessibility ID | Changed submit control or app version |
| Email validation | `android=new UiSelector().text("Please enter a valid email address")` | Android UiSelector, exact text | Copy/localization changes |

For every row, add the screen or hierarchy context that makes the match meaningful. Identifiers alone do not explain intent.

The validation selector is Android-specific. The accessibility-ID strategy is available across mobile platforms, but you still need to inspect each platform's app and verify its identifiers.

**Common pitfalls:** Including the `~` in the app's actual accessibility identifier; recording visible text as if it were a resource ID; marking the inventory “verified” by reading only source code.

## 05-B · Uniqueness

A complete test inside the practice suite:

```ts
it('should identify exactly one Forms input', async () => {
    await TabBar.openForms()
    await FormsScreen.waitForIsShown()
    await FormsScreen.input.waitForDisplayed()

    const matches = await $$('~text-input')
    expect(matches.length).to.equal(1)
})
```

- **Zero:** no match in the queried hierarchy. Check current screen, load state, selector, and app version.
- **One:** exactly one matching node was found. Confirm it is the intended input.
- **Two:** ambiguous identity. A single-element lookup may choose one without capturing your intended context; improve the locator or request unique IDs.

This is a diagnostic exercise. Keeping dozens of count tests can create maintenance work without improving coverage of user behavior. Use uniqueness checks when ambiguity is a real risk.

The snippet inherits the imports and restart hook from your navigation-practice file. If you keep this check after the exercise, move a reused selector into the screen object rather than maintaining several copies. The immediate count is meaningful here because the scenario has already waited for its intended input.

**Common pitfalls:** Checking before navigation finishes; using `$` and assuming there can only be one match; solving ambiguity by choosing `[0]` without explaining why that index is stable.

## 05-C · A constructive review

One model review:

> The text locator is a practical Android fallback because this demo does not expose a stable ID for that message. Finding it proves that the required wording exists in the current hierarchy; the assertion makes the expected copy visible in the spec. If the wording changes, however, the lookup fails before we can compare the new text with the expected text. Please expose an accessibility ID or resource ID specific to the email validation message. Then we can locate by identity and independently assert its wording.

The desired separation is:

```text
Locator: identifies the email error area.
Assertion: checks the required text within that area.
```

Do not invent the requested ID in the existing tests. It is a proposal for an application change, and the current demo must continue using identifiers that actually exist.

A larger timeout cannot make an obsolete exact-text locator match new wording. It only delays the same failure. After confirming a deliberate product-copy change, update the expected requirement and locator together until a stable identifier is available.

**Common pitfalls:** Rejecting every text locator as forbidden; declaring an exact-text assertion entirely useless; pretending a hypothetical developer-provided ID exists today.

## Checkpoint answers

- A selector can be syntactically valid yet too broad, duplicated, or used on the wrong screen.
- The `android=...` UiSelector expressions and Android resource IDs are specific to Android.
- A screen object centralizes locator knowledge, reducing duplicated edits and keeping scenario code readable.

[Back to lesson](../lessons/05-selectors.md) · [Next lesson](../lessons/06-forms.md)
