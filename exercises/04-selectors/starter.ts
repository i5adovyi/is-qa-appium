export type Clues = { accessibilityId?: string; resourceId?: string; text?: string }
export type Locator = { using: 'accessibility id' | 'id' | '-android uiautomator'; value: string }

export function chooseLocator(clues: Clues): Locator {
    throw new Error('Exercise 04: implement chooseLocator')
}
