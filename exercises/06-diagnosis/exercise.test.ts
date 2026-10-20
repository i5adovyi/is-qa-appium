import { test } from 'node:test'
import { expect } from 'chai'
const { classifyFailure } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('device failures have priority when wrapped in another error', () => {
    expect(classifyFailure('AssertionError caused by adb: DEVICE OFFLINE')).to.equal('device')
    expect(classifyFailure('No devices/emulators found')).to.equal('device')
})
test('connection and lookup evidence get different categories', () => {
    expect(classifyFailure('connect ECONNREFUSED 127.0.0.1:4723')).to.equal('connection')
    expect(classifyFailure('element still not displayed after 15000ms')).to.equal('locator-or-state')
    expect(classifyFailure('no such element: Login')).to.equal('locator-or-state')
})
test('assertion mismatch is distinct from transport failures', () => {
    expect(classifyFailure("AssertionError: expected 'OFF' to equal 'ON'")).to.equal('assertion')
})
test('locator evidence takes priority over a wrapping assertion, regardless of case', () => {
    expect(classifyFailure('AssertionError: NO SUCH ELEMENT: Login')).to.equal('locator-or-state')
})
test('unknown messages remain unknown', () => {
    expect(classifyFailure('something surprising')).to.equal('unknown')
    expect(classifyFailure('')).to.equal('unknown')
})
