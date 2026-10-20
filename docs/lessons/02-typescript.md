# 02 · Enough TypeScript to write useful tests

**Stage:** Foundation · **Estimated time:** 75–110 minutes · **Device needed:** No

**Prerequisites:** The Node and dependency steps of [lesson 01](01-toolchain.md). You can do this lesson while an Android setup problem is still being investigated.

**By the end you will be able to:**

- Read variables, function arguments, objects, arrays, and imports in a spec.
- Model test cases with a type instead of disconnected strings.
- Use the compiler to catch mistakes before paying the cost of a device session.

## Start with the data your test actually needs

In the Forms test:

```ts
const text = 'Hello Appium'
```

`const` creates a binding that you cannot reassign. `'Hello Appium'` is a string. The name `text` lets the action and assertion share the same intended input.

These values are different:

```ts
const empty = ''       // zero characters
const space = ' '      // one character
const digits = '123'   // a string
const count = 123      // a number
const visible = true  // a boolean
```

A password is test input, not arithmetic. Keeping it as a string preserves leading zeroes and makes its intent clear.

Here is a small original data model for a future login test:

```ts
type LoginCase = {
    name: string
    email: string
    password: string
    expectsError: boolean
}

const cases: LoginCase[] = [
    { name: 'empty', email: '', password: '', expectsError: true },
    { name: 'short password', email: 'learner@example.com', password: '123', expectsError: true },
]
```

`LoginCase` is a description of an object's shape. `LoginCase[]` is an array of those objects. It does not enforce that the email is a valid email address; that is application/test logic. Read the [TypeScript handbook on everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) after trying the lab.

## Functions: give repeated intent a name

```ts
function describeCase(testCase: LoginCase): string {
    return `${testCase.name}: ${testCase.email === '' ? 'empty email' : 'email supplied'}`
}
```

Read it left to right:

1. `describeCase` names the function.
2. `testCase` is its parameter; `LoginCase` says what shape it accepts.
3. `: string` says the function returns text.
4. Backticks create a template string; `${...}` inserts an expression.
5. `condition ? first : second` chooses one result.

You call it with `describeCase(cases[0])`. Passing an argument supplies data; calling the function executes its body.

Arrays start at index zero, so `cases[0]` is the first record. A dot accesses a member, as in `testCase.name` or `input.length`. `===` asks whether two values are strictly equal and returns a boolean; `=` assigns a value. These are different operations.

The tests also use arrow functions:

```ts
const label = (input: string): string => {
    return `Input: ${input}`
}
```

`(input: string) => { ... }` defines a function. Calling `label('hello')` executes it. Passing a function to Mocha lets Mocha run its body later. An empty parameter list, `() => { ... }`, means the function takes no arguments. The next lesson introduces `async` functions and `await`.

Do not put real passwords into diagnostic strings. Even in practice, design output that names a scenario without exposing its password.

## Imports and screen objects

The real specs contain:

```ts
import { expect } from 'chai'
import LoginScreen from '../screens/LoginScreen.js'
```

The braces select a named export from Chai. `LoginScreen` is the default export of a local module. The source file is TypeScript; the `.js` import style is intentional for this project's runner and module configuration. Preserve it in device specs.

In a screen object:

```ts
get email() { return $('~input-email') }
```

This is a **getter**: accessing `LoginScreen.email` calls it. You do not write `LoginScreen.email()`. Compare that with an action method, called with parentheses: `LoginScreen.login(email, password)`.

You will also see a `class`, `this`, `extends`, and `new` in that file. A class groups related members. `this.email` refers to the current screen object's email getter. `extends BaseScreen` reuses the base screen's readiness method; the constructor passes this screen's identifying selector to it with `super(...)`. `export default new LoginScreen()` creates and exports one object for specs to use. You do not need to design a class hierarchy yet—trace these concrete members first.

## Guided lab: write a tiny program before touching the device

Create **a new file you own**, `test/learning-types.ts`. This file is for this lab and is not a `.spec.ts`, so the mobile runner will not discover it as a mobile spec.

```ts
export {}

type PracticeCase = {
    name: string
    input: string
    expected: string
}

const cases: PracticeCase[] = [
    { name: 'plain text', input: 'Learning Appium', expected: 'Learning Appium' },
    { name: 'empty text', input: '', expected: '' },
]

function describeCase(testCase: PracticeCase): string {
    return `${testCase.name}: ${testCase.input.length} characters`
}

for (const testCase of cases) {
    console.log(describeCase(testCase))
}
```

`export {}` makes this standalone practice file a module, so its names do not accidentally share a global scope with another practice file. The `for...of` loop visits the array records one at a time. `console.log` prints a value; it does **not** fail when an expected result is wrong. Assertions in the next lesson will add that behavior.

Run:

```bash
npm run typecheck
node test/learning-types.ts
```

Expected output:

```text
plain text: 15 characters
empty text: 0 characters
```

Node 24 can execute this file's erasable TypeScript syntax, but execution does **not** typecheck it. That is why the first command remains important. Device specs still run through WebdriverIO; do not execute them with `node`. [Node 24 TypeScript support](https://nodejs.org/docs/latest-v24.x/api/typescript.html).

This particular practice file uses supported type annotations and has no local imports. Native Node execution does not use the project's WebdriverIO module loader or turn every `.js` import into a `.ts` file. Keep the direct-Node lab separate from the mobile runner commands.

## Exercises

### 02-A · Let the compiler catch a real mistake

In your lab file, temporarily change the first `input` from a string to the number `123`. Run typecheck and record the diagnostic. Repair the input without weakening the type. Then add a whitespace case with input `' '` and explain its length.

<details><summary>Hint</summary>

`any`, removing `input: string`, or casting the number to pretend it is a string avoids the lesson. Choose a real string.
</details>

**Acceptance:** You observed a type error, repaired it, and the program reports one character for a single space.

### 02-B · Build a small test-data table

Replace or extend the lab data with four named cases: empty, one character, a phrase, and a phrase containing punctuation. Add `expectedLength: number` to the type and to every case. Print both the actual length and expected length.

Choose expected values yourself before running the program. A derived expected value such as `expectedLength: input.length` does not independently check your prediction.

<details><summary>Hint</summary>

Use simple ASCII text here. Emoji may occupy more than one JavaScript UTF-16 code unit, so “visible symbols” and `.length` are not always the same measurement.
</details>

**Acceptance:** Four unique scenario names, correctly typed records, manually chosen expectations, and outputs you can explain.

### 02-C · Write a pure helper

Write `labelForInput(input: string): string` with these requirements:

| Input | Required output |
|---|---|
| `''` | `empty` |
| `' '` | `whitespace only` |
| `'hello'` | `text supplied` |
| `' hello '` | `text supplied` |

Print each result. Preserve the original input; classify it rather than silently modifying the test data.

<details><summary>Hint</summary>

Check exact emptiness first, then whether `input.trim()` is empty. `return` ends the current function call.
</details>

**Acceptance:** All four results match the table, typecheck passes, and the function does not depend on a device or global state.

## Checkpoint

- What is the difference between a type annotation and runtime validation?
- Why do `LoginScreen.email` and `LoginScreen.login(...)` use different syntax?
- Why should test data have descriptive names?

**Extra deliberate practice:** Open [offline lab 01](../../exercises/01-typed-data/README.md), then run `npm run practice -- 01`. Its starter intentionally fails until you implement it.

[Model answers](../solutions/02-typescript.md) · [Next: 03 · Async and assertions](03-async-and-assertions.md)
