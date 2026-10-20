# 05 · Find the right element on purpose

**Stage:** First device tests · **Estimated time:** 75–110 minutes · **Device needed:** Android emulator; Appium Inspector for the inspection lab

**Prerequisites:** [Lesson 04](04-first-test.md). You can run one spec and understand a screen object getter.

**By the end you will be able to:**

- Connect a selector string to an inspected native element.
- Distinguish accessibility ID, resource ID, text, and structural XPath.
- Explain a selector's uniqueness, platform limits, and maintenance risks.

## A selector is a claim about identity

This getter from [FormsScreen.ts](../../test/screens/FormsScreen.ts) is more than convenient shorthand:

```ts
get input() { return $('~text-input') }
```

It claims that an element with accessibility ID `text-input` identifies the input your test intends to use. A typo, duplicate identifier, wrong screen, or changed app can violate that claim.

The `~` is WebdriverIO's accessibility-ID selector prefix. It is not part of the actual ID. Platform support for a strategy does not guarantee that two app builds expose the same identifier. [WebdriverIO selector reference](https://webdriver.io/docs/selectors/).

Here are selectors **already present in this Android project**:

| Selector | Meaning | Main limitation |
|---|---|---|
| `~Forms` | Bottom Forms tab by accessibility ID | Correct only if that ID remains assigned to that tab |
| `~text-input` | Forms input by accessibility ID | Must be on the intended screen |
| `~input-email` | Login email by accessibility ID | Same strategy does not prove iOS parity |
| `android=new UiSelector().text("Please enter a valid email address")` | Validation text by exact Android text | Changes with wording/localization |
| `android=new UiSelector().resourceId("android:id/button1")` | Positive button in the native alert | Android-specific; meaningful in the alert context |

An XPath that embeds positions, such as selecting the third child of several nested containers, ties identity to layout. Use it only when necessary and document why a more direct identifier is unavailable.

## Guided lab: inspect the actual app

Use the official [Appium Inspector](https://github.com/appium/appium-inspector) desktop application. Install it from its official releases if it is not already available. This lesson does not assume it was installed with Android Studio.

1. Stop any running test suite. Keep the emulator running.
2. Start a standalone Appium server in a separate terminal:

   ```bash
   npx appium --address 127.0.0.1 --port 4723
   ```

3. In the project terminal, run `pwd` and form the absolute APK path by appending `/apps/wdio-demo.apk`.
4. In Inspector, set host `127.0.0.1`, port `4723`, and path `/`. Use capabilities:

   ```json
   {
     "platformName": "Android",
     "appium:automationName": "UiAutomator2",
     "appium:deviceName": "Android Emulator",
     "appium:app": "/REPLACE/WITH/YOUR/PROJECT/apps/wdio-demo.apk"
   }
   ```

5. Replace the placeholder path before starting the session. Navigate to Forms and inspect the input, echoed result, switch, and switch label. Refresh the source after navigation if the tree is stale.
6. Record each element's accessibility identifier and one relevant property. For the input, distinguish its current text from its identifier.
7. End the Inspector session and stop its standalone Appium server with Ctrl+C before returning to npm tests.

Inspector and the test runner should not compete to control the same device or bind the same server port.

If Inspector is unavailable, complete the code-reading exercises now and mark the inspection evidence as pending. Reading a selector in code is not evidence that it matches the currently installed app.

## Screen objects keep selector decisions in one place

Specs should express intent:

```ts
await FormsScreen.input.setValue('Practice')
```

Screen objects hold the locator:

```ts
get input() { return $('~text-input') }
```

If the app changes that ID, you update one getter and rerun affected tests. Do not conceal assertion expectations inside a generic click helper; readers still need to see what the scenario claims.

## Exercises

### 05-A · Produce a selector inventory

Inspect these five elements: Forms input, Forms result, Login email, Login submit button, and email validation message. For each, record the screen, exact selector, strategy, why it identifies the target, and one reason it could stop working.

To reveal the validation message, submit invalid input manually in the demo.

<details><summary>Hint</summary>

The Login navigation tab is `~Login`; the submit button is `~button-LOGIN`. The validation message is currently selected by text rather than an accessibility ID.
</details>

**Acceptance:** Five inspected entries with exact strings and realistic limitations. Identify at least one Android-only locator.

### 05-B · Check uniqueness

Add a temporary diagnostic test to your own navigation-practice spec. Open Forms, wait for the screen, then check the count:

```ts
const matches = await $$('~text-input')
expect(matches.length).to.equal(1)
```

Explain what counts of zero, one, and two mean. Keep or remove this diagnostic after learning from it; the product behavior remains the primary test concern.

Run:

```bash
npm run typecheck
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.navigation-practice.spec.ts
```

<details><summary>Hint</summary>

`$` returns a single-element lookup; `$$` obtains a collection. One matching element does not prove it is the correct business control—inspect its context too.
</details>

**Acceptance:** Count equals one in the intended state; your explanation distinguishes missing, unique, and ambiguous matches.

### 05-C · Write a selector review

A teammate proposes locating the email validation message by its exact wording and then asserting that its text equals that same wording. Explain the useful evidence this gives, the diagnostic limitation, and what identifier you would request from the app developer.

Then explain why increasing the timeout is not a fix if the app changed that wording.

<details><summary>Hint</summary>

When text is both locator and expected value, changed text may produce “element not found” before the assertion can report actual versus expected.
</details>

**Acceptance:** A short review that acknowledges the current fallback, requests a stable message identifier, and preserves a separate exact-text assertion.

## Checkpoint

- Why can a technically valid selector find the wrong element?
- Which selectors in the table are explicitly Android-only?
- Why does a screen object help when identifiers change?

**Extra deliberate practice:** [Selector planning lab](../../exercises/04-selectors/README.md), `npm run practice -- 04`.

[Model answers](../solutions/05-selectors.md) · [Next: 06 · Forms](06-forms.md)
