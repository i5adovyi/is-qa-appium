import { test } from 'node:test'
import { expect } from 'chai'
const { chooseLocator } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('prefers accessibility ID when all clues exist', () => {
    expect(chooseLocator({ accessibilityId: 'Login', resourceId: 'demo:id/login', text: 'Login' }))
        .to.deep.equal({ using: 'accessibility id', value: 'Login' })
})
test('uses resource ID before text and ignores empty accessibility IDs', () => {
    expect(chooseLocator({ accessibilityId: '', resourceId: 'demo:id/login', text: 'Login' }))
        .to.deep.equal({ using: 'id', value: 'demo:id/login' })
})
test('escapes quotes in the fallback text selector', () => {
    expect(chooseLocator({ text: 'Tap "Login"' })).to.deep.equal({
        using: '-android uiautomator', value: 'new UiSelector().text("Tap \\"Login\\"")',
    })
})
test('fails rather than returning a broad catch-all selector', () => {
    expect(() => chooseLocator({})).to.throw('No usable selector')
    expect(() => chooseLocator({ accessibilityId: '', resourceId: '', text: '' })).to.throw('No usable selector')
})
test('preserves a supplied clue exactly rather than trimming it', () => {
    expect(chooseLocator({ accessibilityId: ' Login ', text: 'Login' }))
        .to.deep.equal({ using: 'accessibility id', value: ' Login ' })
})
test('falls back to text when both identifier clues are empty', () => {
    expect(chooseLocator({ accessibilityId: '', resourceId: '', text: 'Login' }))
        .to.deep.equal({ using: '-android uiautomator', value: 'new UiSelector().text("Login")' })
})
