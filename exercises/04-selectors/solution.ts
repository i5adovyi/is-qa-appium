export type Clues = { accessibilityId?: string; resourceId?: string; text?: string }
export type Locator = { using: 'accessibility id' | 'id' | '-android uiautomator'; value: string }

export function chooseLocator(clues: Clues): Locator {
    if (clues.accessibilityId) return { using: 'accessibility id', value: clues.accessibilityId }
    if (clues.resourceId) return { using: 'id', value: clues.resourceId }
    if (clues.text) return { using: '-android uiautomator', value: `new UiSelector().text(${JSON.stringify(clues.text)})` }
    throw new Error('No usable selector')
}
