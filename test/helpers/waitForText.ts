/**
 * Chai checks a value once; it does not retry while the UI updates.
 * Wait for the observable result first, then assert it in the test with Chai.
 */
export async function waitForText(
    element: { getText(): Promise<string> },
    expected: string,
) {
    await driver.waitUntil(async () => (await element.getText()) === expected, {
        timeoutMsg: `Expected element text to become ${JSON.stringify(expected)}`,
    })
}
