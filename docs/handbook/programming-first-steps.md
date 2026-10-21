# Programming one small step at a time

**Prerequisites:** B1–B2 of [computer basics](computer-basics.md); Node 24 and
installed dependencies. **Device:** none. These are local programs, not Appium
tests. Take several sessions if needed, then return to lesson 02.

Create a file you own: `test/learning-foundations.ts`. If it already exists,
keep it and choose another `test/learning-*.ts` filename. Each P section below
is a separate program: replace only your practice file's previous example, or
save separate files. Do not concatenate them: repeated `const` names in the
same file cause errors. Keep `export {}` at the top of each practice file.

For each program: predict, save, then run these commands **separately**:

```bash
npm run typecheck
node test/learning-foundations.ts
```

Adjust the filename if needed. Typecheck covers all files in `test/`; an error
in another practice file can fail that check. Repair your earlier experiment
after recording it. Node 24 can execute the type annotations used here, but
execution alone does not typecheck them. Do not use `npm test` for this workbook:
that command starts the Android smoke suite.

## P1 · Give a value a name

```ts
export {}
const message: string = 'Hello'
console.log(message)
```

`const` introduces a name that cannot be reassigned. `: string` describes its
type; it is not text that will print. `=` assigns the value on its right.
Quotes delimit text; they are not part of the stored value. Parentheses pass
`message` to `console.log`, which prints it. `//` starts a comment.

**Task:** predict the output, run it, then change the text to your own fictional
message. Temporarily replace the quoted text with the number `42` and run
typecheck. Restore a string afterward.

**Acceptance:** you explain the difference between `message` and `'message'`,
observe a type error and repair it without `any` or a cast.

<details><summary>Hint / review</summary>

The name refers to its value. The quoted word is literal text. `42` is a number;
`'42'` is a string, even though its characters look like digits.
</details>

## P2 · See invisible differences

```ts
export {}
const input = ' '
console.log(JSON.stringify(input))
console.log(input.length)
console.log(input.length === 0)
```

`.length` reads a string property. `===` compares values and produces `true` or
`false`; it does not assign. `JSON.stringify` makes the surrounding quotes and
escaped characters visible in this simple diagnostic output.

**Task:** run this with `''`, `' '`, `'0'` and `'Hi'`, one at a time. Predict
length and the comparison first. Then compare `false` with the string `'false'`
by printing `typeof false` and `typeof 'false'`.

**Acceptance:** distinguish zero characters, one space, a digit as text and a
boolean. Use ordinary ASCII here; emoji lengths need later Unicode discussion.

<details><summary>Hint / review</summary>

The lengths are 0, 1, 1 and 2. Only the first input equals `''`. The two
`typeof` results are `boolean` and `string`. Never log real passwords this way.
</details>

## P3 · Model a change with let

```ts
export {}
let input: string = 'Before'
console.log(input)
input = ''
console.log(input.length)
```

`let` allows reassignment. Lines run in order in this synchronous example.
This models a value changing in memory; it does not clear a real app field.

**Task:** predict both outputs. Change the first word and repeat. Explain why
the second assignment does not use `let` again. Try `const` instead of `let`,
observe the typecheck error, then restore it.

**Acceptance:** explain reassignment versus declaring a name, and why this
program cannot prove that an Android control clears.

<details><summary>Hint / review</summary>

It prints `Before`, then `0`. `input = ''` changes an existing binding. Use
`const` by default when a value does not need reassignment.
</details>

## P4 · A function returns one answer

```ts
export {}
function describeInput(input: string): string {
    if (input === '') {
        return 'empty'
    }
    return 'has characters'
}
console.log(describeInput('Hi'))
console.log(describeInput(''))
```

The function declaration defines a reusable operation. Its **parameter** is
named `input`; `'Hi'` is an **argument** supplied by a call. Braces group its
body and the `if` branch. `return` ends the current call and supplies its
result. Defining the function alone does not call it. A local parameter is
available inside that function; it is not a global name.

**Task:** predict what a call with one space returns. Add a second condition,
after exact emptiness, so whitespace-only input returns `spaces only`.
`input.trim()` returns text without surrounding whitespace; it does not mutate
the original string. Keep nonempty input behavior unchanged.

**Acceptance:** `''`, `' '`, `'Hi'`, `' Hi '` give four explained results; you
return values instead of only printing inside the function.

<details><summary>Hint / review</summary>

First distinguish the actual empty string. Then ask whether `input.trim()` is
empty. Reversing the order would classify an empty string as whitespace-only.
After adding that branch, the results are `empty`, `spaces only`, and twice
`has characters`.
</details>

## P5 · Keep related values in an object

```ts
export {}
type Example = { label: string; input: string }
const example: Example = { label: 'one space', input: ' ' }
console.log(example.label)
console.log(example.input.length)
```

An **object** groups named properties. In the type, `input: string` describes
what is allowed; in the value, `input: ' '` supplies actual data. Dot access
reads a property. Commas separate properties in an object value.

**Task:** add `expectedLength: number` to the type and the object. Write its
expected value yourself. Print actual and expected lengths with clear labels.
Try omitting the new property once, observe typecheck, then restore it.

**Acceptance:** explain why deriving the expectation from `example.input.length`
would simply repeat the calculation you are trying to check.

<details><summary>Hint / review</summary>

Use `1` for the space case. A `const` object can still have its properties
changed; `const` prevents rebinding the variable, not all mutation. Lab 01
will use that distinction to check whether returned objects are independent.
</details>

## P6 · Visit a list one item at a time

```ts
export {}
const inputs: string[] = ['', 'A', 'Hi']
for (const input of inputs) {
    console.log(JSON.stringify(input), input.length)
}
```

Square brackets create an **array**, an ordered list. `string[]` describes a
list of strings. `for...of` runs its body once for each value. `inputs[0]` reads
the first item because indexes start at zero.

**Task:** predict the three lines, add one space as a fourth item, and predict
the new result. Explain `inputs.length` versus `inputs[0].length`.

**Acceptance:** four lines appear in list order; list size and text length are
different measurements. No manual fourfold copy of `console.log` is needed.

<details><summary>Hint / review</summary>

The string lengths are 0, 1, 2, 1. The list length is 4; its first string's
length is 0. An out-of-range index returns `undefined`; avoid accessing
`.length` on that missing value. We investigate a missing value in P8.
</details>

## P7 · Make an incorrect result fail

```ts
export {}
import { expect } from 'chai'
const actual = 'Hi'.length
const expected = 2
expect(actual).to.equal(expected)
console.log('The length check passed')
```

`import` brings a reusable export from another module into this file. Here
braces select Chai's named `expect` export. The dependency was installed by
`npm ci`; you do not download it for each test. The assertion receives an
actual value and checks it against an expected value. Its chained words read
like a sentence. An uncaught failed assertion stops this program before the log.

**Task:** change only the expected value to `3`, predict the result and run.
Locate actual, expected and your file location in the error. Restore `2`.
Then assert `expect({ count: 2 }).to.deep.equal({ count: 2 })` and compare it
with `.to.equal(...)` without `deep`.

**Acceptance:** observe failure and repair; explain that `console.log(false)`
alone would print a value without failing a check.

<details><summary>Hint / review</summary>

For these primitive numbers, `.equal` compares values. Two newly created
objects have different identities even when their fields match; `.deep.equal`
checks their structure/values. This is why the first lab uses deep equality.
Do not generalize every successful program exit to a tested requirement.
</details>

## P8 · A missing value is not an empty string

```ts
export {}
const input: string | undefined = undefined
function lengthIfPresent(value: string | undefined): number {
    if (value === undefined) {
        throw new Error('Expected a supplied string')
    }
    return value.length
}
console.log(lengthIfPresent(input))
```

`undefined` means no value is supplied here. The `|` in the type means either
a string or undefined. `throw` stops the normal path with an error; it does not
return an empty string. After the guard, TypeScript knows `value` is a string.
`null` is a different explicit empty value; this function's type does not accept it.

**Task:** predict the error with undefined. Try `''`, then `'Hi'`, one run at
a time. Finally remove the guard briefly and observe typecheck before restoring
it. Do not hide the type error with `any` or a non-null assertion (`!`).

**Acceptance:** distinguish a missing value, valid empty input and two-character
text. Explain why inventing a default value could hide a missing observation.

<details><summary>Hint / review</summary>

The original program throws the supplied error. With a string it returns 0 or
2. Without the guard the compiler warns that `value` may be undefined. A real
UI lookup can fail for different reasons; this local function does not locate
elements or model every Appium error.
</details>

## Carry these skills into the existing lessons

Lesson 02 combines these pieces into typed fixtures and introduces imports,
getters and screen objects. Lesson 03 introduces Promises and `await`; the
programs above are synchronous. Keep the concepts separate until each is clear.
You are ready for the next step when you can predict a changed input without
copying the example, not simply when all examples have been pasted successfully.

[Next: test workbook](first-test-workbook.md) · [First lab coach](first-lab-coach.md) · [Lesson 02](../lessons/02-typescript.md)
