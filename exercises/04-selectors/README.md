# Lab 04 — A locator is a decision

**Estimated effort:** 25–40 minutes. **Prerequisite:** optional properties and conditionals.

Implement `chooseLocator(clues)` in [starter.ts](starter.ts).
Return a **WebDriver-style strategy/value descriptor**, not a WebdriverIO `$()` selector string.
This lab exercises selection logic; it never contacts a device.

## Contract

Use the first nonempty clue in this priority order:

1. `accessibilityId` → `{ using: 'accessibility id', value: clue }`.
2. `resourceId` → `{ using: 'id', value: clue }`.
3. `text` → `{ using: '-android uiautomator', value: 'new UiSelector().text("...")' }`.

Escape embedded quotes and backslashes in text. If all clues are absent or empty,
throw `Error('No usable selector')`. Do not trim or rewrite a supplied clue.
Assume IDs are unique and stable for this lab; real locator choice requires inspection.

## Work

1. Predict which clue wins when all three are present.
2. Run `npm run practice -- 04` and implement the function.
3. Add a test whose text includes a backslash.
4. Explain why text matching may break when the app language changes.

<details><summary>Hint 1</summary>

Return as soon as you find the highest-priority usable clue.

</details>
<details><summary>Hint 2</summary>

`JSON.stringify(text)` produces a quoted, escaped string for this selector expression.
Do not wrap its result in another pair of quotes.

</details>

**Done when:** tests pass, invalid clues fail clearly, and you can explain why finding
*an* element is weaker than demonstrating that a selector identifies the intended element.

**Reference:** [solution.ts](solution.ts). The explicit order makes the policy visible.
The Android text fallback is platform-specific; do not reuse it unchanged for iOS.

[All labs](../README.md)
