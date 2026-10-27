# 04 · Write a test you can explain

**Stage:** First device tests · **Estimated time:** 75–100 minutes · **Device needed:** Android emulator

**Prerequisites:** [Lessons 00–03](00-orientation.md), a green smoke run, and an understanding of `await` and `expect`.

**By the end you will be able to:**

- Build a spec with a suite, setup hook, action, and assertion.
- Run one file or one named test.
- Prove your assertion can detect a deliberately wrong outcome.

## Read the smallest existing spec

Open [app.smoke.spec.ts](../../test/specs/app.smoke.spec.ts):

```ts
import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import { restartDemoApp } from '../helpers/restartApp.js'

describe('App launch @smoke', () => {
    beforeEach(async () => {
        await restartDemoApp()
    })

    it('should open the app and show the tab bar', async () => {
        await TabBar.waitForTabBarShown()

        expect(await TabBar.home.isDisplayed()).to.be.true
        expect(await TabBar.login.isDisplayed()).to.be.true
    })
})
```

| Construct | Read it as |
|---|---|
| `import` | Use code exported by another module |
| `describe` | Group related scenarios under this report label |
| `it` | Run this one scenario |
| `beforeEach` | Run the named setup function before each scenario |
| `restartDemoApp()` | Restart this demo's process, then wait for navigation |
| `async () => { ... }` | A function whose device operations can be awaited |
| `waitForTabBarShown()` | Wait for this project's navigation-ready signal |
| `isDisplayed()` | Ask whether the element is visible now |
| `.to.be.true` | Require that answer to be the boolean `true` |
| `@smoke` | A name convention selected by this project's grep command |

`@smoke` is text in a test/suite title, not a TypeScript decorator. The npm script filters Mocha's full titles. A tag on a suite therefore affects its contained tests.

## Setup hooks are executable code

Mocha runs `beforeEach` before each test in its scope. It does not reset the app by itself; it runs only the commands you put in that function. [Mocha hooks](https://mochajs.org/features/hooks/).

This course's `restartDemoApp()` terminates and activates the demo package, then waits for the tab bar. That resets this demo's in-memory form state. It does **not** erase storage, reinstall the app, clear permissions, or reset a real server.

You need both ideas: predictable state and an honest description of what your reset does.

## Guided lab: create your first owned spec

Create `test/specs/app.navigation-practice.spec.ts`. This is **new learner work**, separate from the supplied reference specs:

```ts
import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import FormsScreen from '../screens/FormsScreen.js'
import { restartDemoApp } from '../helpers/restartApp.js'

describe('My navigation practice', () => {
    beforeEach(async () => {
        await restartDemoApp()
    })

    it('should open Forms from the tab bar', async () => {
        await TabBar.openForms()
        await FormsScreen.waitForIsShown()
        await FormsScreen.input.waitForDisplayed()

        expect(await FormsScreen.input.isDisplayed()).to.be.true
    })
})
```

Run exactly this file:

```bash
npm run typecheck
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.navigation-practice.spec.ts
```

Expected result: the named navigation test passes, and you can see Forms open. The assertion checks a control on the destination screen, not merely that the tap command returned.

The braces after `describe` contain the suite. The `beforeEach` and `it` calls are siblings inside it; do not put an `it` inside another test or inside the setup hook. A screen-root wait establishes the destination, and the input wait makes this particular assertion's readiness explicit.

Annotate the test in your journal:

- **Arrange:** restart the app and wait for navigation.
- **Act:** open Forms.
- **Synchronize:** wait for the Forms screen.
- **Assert:** the input is displayed.

This is a small test by design. Add complexity only after you can explain its failure modes.

## Exercises

### 04-A · Add a second destination

In your new practice file, add a test that opens Login and checks that both email and password fields are visible. Import the existing `LoginScreen`; reuse the same `beforeEach`.

<details><summary>Hint</summary>

The bottom tab action is `TabBar.openLogin()`. The destination's readiness method is `LoginScreen.waitForIsShown()`. Avoid using the submit button as your navigation action.
</details>

**Acceptance:** Both tests pass together and each passes when selected alone. Run the new test alone with:

```bash
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.navigation-practice.spec.ts --mochaOpts.grep "open Login"
```

Use “open Login” in its title to match this command.

`--spec` selects a file; `--mochaOpts.grep` selects titles within that file using a pattern. Check that the report lists the intended test and a nonzero executed count. A command that runs no matching tests does not verify your new scenario.

### 04-B · Prove your check has teeth

Temporarily change the Forms input expectation to `.to.be.false`, leaving the action untouched. Run only that test, inspect the failure message and available screenshot, then restore `.to.be.true`.

```bash
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.navigation-practice.spec.ts --mochaOpts.grep "open Forms"
```

Write three facts: what you changed, why it should fail, and which evidence showed that failure.

<details><summary>Hint</summary>

This is an intentional bad expectation, not an application bug. Do not change the app, selector, or timeout to make it pass.
</details>

**Acceptance:** One recorded controlled failure followed by a passing corrected run. No `.skip`, `.only`, or swallowed exception remains.

### 04-C · Choose a smoke boundary

Tag just your Forms navigation test with `@smoke`. Explain whether it adds useful coverage beyond the supplied app-launch smoke test, and what it still does not prove. Run your practice file with the smoke filter:

```bash
npx wdio run config/wdio.android.conf.ts --spec test/specs/app.navigation-practice.spec.ts --mochaOpts.grep "@smoke"
```

Then remove the tag if you judge it redundant. This is a design decision, not a rule that every passing test belongs in smoke.

<details><summary>Hint</summary>

A smoke suite should answer a small, important readiness question quickly. “This is an easy test” is not enough justification.
</details>

**Acceptance:** The filter selects only the intended practice test, and your explanation names both the covered risk and a limit.

## Checkpoint

- What runs once per test in your practice file?
- How can a test pass when run alone yet fail in a suite?
- Why deliberately introduce a wrong expectation during learning?

When finished, `npm run test:android` also discovers your new practice spec because its name ends in `.spec.ts`. Keep it passing, or deliberately move abandoned experiments outside `test/specs`; do not hide unexplained failures.

[Model answers](../solutions/04-first-test.md) · [Next: 05 · Selectors](05-selectors.md)
