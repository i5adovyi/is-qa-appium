import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expect } from 'chai'
import type { Row, Viewport } from './contract.ts'
const { findVisibleRow } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

const row = (id: string, visible = true, label = 'Same title'): Row => Object.freeze({ id, label, visible })
const page = (rows: Row[], atEnd = false): Viewport => Object.freeze({ rows: Object.freeze(rows), atEnd })
function fakeView(pages: Viewport[]) {
    let index = 0
    const events: string[] = []
    return {
        events,
        read: async () => { events.push(`read:${index}`); return pages[Math.min(index, pages.length - 1)]! },
        scrollForward: async () => { events.push('scroll'); index++ },
    }
}
test('finds an initial visible identity without scrolling even at the end', async () => {
    const target = row('order-B')
    const view = fakeView([page([row('order-A'), target], true)])
    expect(await findVisibleRow(view, 'order-B', 0)).to.equal(target)
    expect(view.events).to.deep.equal(['read:0'])
})
test('reads a new viewport after each scroll and uses ID rather than label or old position', async () => {
    const target = row('order-B')
    const view = fakeView([page([row('order-A')]), page([target])])
    expect(await findVisibleRow(view, 'order-B', 2)).to.equal(target)
    expect(view.events).to.deep.equal(['read:0', 'scroll', 'read:1'])
})
test('an off-screen target does not count until a fresh snapshot shows it visible', async () => {
    const target = row('target')
    const view = fakeView([page([row('first'), row('target', false)]), page([target])])
    expect(await findVisibleRow(view, 'target', 1)).to.equal(target)
    expect(view.events).to.deep.equal(['read:0', 'scroll', 'read:1'])
})
test('duplicate visible target IDs fail rather than selecting the first', async () => {
    const view = fakeView([page([row('target'), row('target')])])
    await assert.rejects(findVisibleRow(view, 'target', 2), /Target "target" is ambiguous/)
    expect(view.events).to.deep.equal(['read:0'])
})
test('a hidden duplicate does not make the one visible target ambiguous', async () => {
    const target = row('target')
    const view = fakeView([page([row('target', false), target])])
    expect(await findVisibleRow(view, 'target', 0)).to.equal(target)
})
test('stops before scrolling when the target is absent at the end', async () => {
    const view = fakeView([page([row('other')], true)])
    await assert.rejects(findVisibleRow(view, 'missing', 4), /Target "missing" not found: end reached/)
    expect(view.events).to.deep.equal(['read:0'])
})
test('unchanged visible identities stop the search even when labels change', async () => {
    const view = fakeView([page([row('same', true, 'Before')]), page([row('same', true, 'After')])])
    await assert.rejects(findVisibleRow(view, 'missing', 5), /no progress/)
    expect(view.events).to.deep.equal(['read:0', 'scroll', 'read:1'])
})
test('missing targets stop at the scroll budget with one final fresh read', async () => {
    const view = fakeView([page([row('A')]), page([row('B')]), page([row('C')]), page([row('target')])])
    await assert.rejects(findVisibleRow(view, 'target', 2), /Target "target" not found: scroll limit reached/)
    expect(view.events).to.deep.equal(['read:0', 'scroll', 'read:1', 'scroll', 'read:2'])
})
test('a zero-scroll budget still reads once and cannot perform a gesture', async () => {
    const view = fakeView([page([])])
    await assert.rejects(findVisibleRow(view, 'target', 0), /scroll limit reached/)
    expect(view.events).to.deep.equal(['read:0'])
})
test('validates target and budget before any interaction', async () => {
    const view = fakeView([page([])])
    for (const id of ['', ' target', 'target\n']) {
        await assert.rejects(findVisibleRow(view, id, 2), /Invalid target ID/)
    }
    for (const budget of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        await assert.rejects(findVisibleRow(view, 'target', budget), /nonnegative safe integer/)
    }
    expect(view.events).to.deep.equal([])
})
test('read and gesture failures escape unchanged without another interaction', async () => {
    const readError = new Error('session lost')
    let reads = 0
    let scrolls = 0
    await assert.rejects(findVisibleRow({
        read: async () => { reads++; throw readError },
        scrollForward: async () => { scrolls++ },
    }, 'target', 3), actual => actual === readError)
    expect([reads, scrolls]).to.deep.equal([1, 0])
    const gestureError = new Error('unsupported gesture')
    reads = 0
    await assert.rejects(findVisibleRow({
        read: async () => { reads++; return page([row('other')]) },
        scrollForward: async () => { scrolls++; throw gestureError },
    }, 'target', 3), actual => actual === gestureError)
    expect([reads, scrolls]).to.deep.equal([1, 1])
})
