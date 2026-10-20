# 02 · Model answers: TypeScript

## 02-A · A useful type error

With `input: 123`, the `PracticeCase` assignment should report that a `number` is not assignable to `string`. Repair it with actual string data, for example `input: '123'`.

```ts
const whitespace: PracticeCase = {
    name: 'single space',
    input: ' ',
    expected: ' ',
}
```

`whitespace.input.length` is `1`; `''.length` is `0`. An empty-field validation test and a whitespace-input validation test exercise different inputs and may legitimately have different outcomes.

**Common pitfalls:** Using `as string` to suppress a useful error; changing the type to `string | number` without a requirement; equating “looks blank” with “empty.”

## 02-B · A data table with independent predictions

One complete replacement for the lab file:

```ts
export {}

type PracticeCase = {
    name: string
    input: string
    expected: string
    expectedLength: number
}

const cases: PracticeCase[] = [
    { name: 'empty', input: '', expected: '', expectedLength: 0 },
    { name: 'one character', input: 'A', expected: 'A', expectedLength: 1 },
    { name: 'short phrase', input: 'Hello Appium', expected: 'Hello Appium', expectedLength: 12 },
    { name: 'punctuation', input: 'QA, go!', expected: 'QA, go!', expectedLength: 7 },
]

for (const testCase of cases) {
    console.log(
        `${testCase.name}: actual=${testCase.input.length}, expected=${testCase.expectedLength}`,
    )
}
```

You could add a check:

```ts
for (const testCase of cases) {
    if (testCase.input.length !== testCase.expectedLength) {
        throw new Error(`Length mismatch for ${testCase.name}`)
    }
}
```

The expected lengths were specified from the intended examples. Computing both sides from the same expression would test the identity of an expression, not the intended behavior.

**Common pitfalls:** Four cases all named “test”; an expectation copied from observed output without thinking; counting spaces incorrectly; adding Unicode cases without specifying what “length” means.

## 02-C · A pure classifier

```ts
function labelForInput(input: string): string {
    if (input === '') {
        return 'empty'
    }
    if (input.trim() === '') {
        return 'whitespace only'
    }
    return 'text supplied'
}

console.log(labelForInput(''))
console.log(labelForInput(' '))
console.log(labelForInput('hello'))
console.log(labelForInput(' hello '))
```

Expected lines:

```text
empty
whitespace only
text supplied
text supplied
```

The exact-empty check comes first because an empty string also remains empty after trimming. Reversing the checks would incorrectly label `''` as whitespace only.

This helper describes the input for learning purposes. It does not implement or prove the demo app's validation rules. A production test should obtain its expected behavior from the requirement rather than assuming this helper defines it.

**Common pitfalls:** Trimming input before sending it to the app, which prevents you from testing the original input; forgetting `return`; implementing the function so it reads a global variable instead of its argument.

## Checkpoint answers

- A type annotation helps tools check code structure; it does not contact the app or validate an email address at runtime.
- `email` is a getter returning an element lookup; `login(...)` is a method executing an action sequence.
- A descriptive name lets a report identify the failing scenario even when many cases share one implementation.

Keep the lab file if useful; it is included in project type checking. Resolve intentional errors before moving on.

The exercises extend the same file, so edit the existing `PracticeCase` and `cases` declarations rather than pasting a second declaration with the same name. `export {}` keeps that file's names module-local. Printing matching lengths is useful manual feedback; the optional `throw new Error` check makes a mismatch produce an unsuccessful program result.

[Back to lesson](../lessons/02-typescript.md) · [Next lesson](../lessons/03-async-and-assertions.md)
