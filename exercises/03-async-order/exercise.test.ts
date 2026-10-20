import { test } from 'node:test'
import { expect } from 'chai'
import { setImmediate } from 'node:timers/promises'
const { runLogin } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('waits for each action before starting the next', async () => {
    const events: string[] = []
    const step = (name: string) => async () => {
        events.push(`${name}:start`)
        await Promise.resolve()
        events.push(`${name}:end`)
    }
    await runLogin({ open: step('open'), fill: step('fill'), submit: step('submit') })
    expect(events).to.deep.equal(['open:start', 'open:end', 'fill:start', 'fill:end', 'submit:start', 'submit:end'])
})
test('propagates the original error and never submits after a failure', async () => {
    const original = new Error('input unavailable')
    let submitted = false
    let caught: unknown
    try {
        await runLogin({
            open: async () => {},
            fill: async () => { throw original },
            submit: async () => { submitted = true },
        })
    } catch (error) { caught = error }
    expect(caught).to.equal(original)
    expect(submitted).to.equal(false)
})
test('does not fill when opening fails', async () => {
    let filled = false
    let submitted = false
    const original = new Error('screen missing')
    let caught: unknown
    try {
        await runLogin({
            open: async () => { throw original },
            fill: async () => { filled = true },
            submit: async () => { submitted = true },
        })
    } catch (error) { caught = error }
    expect(caught).to.equal(original)
    expect(filled).to.equal(false)
    expect(submitted).to.equal(false)
})
test('does not resolve while submission is still pending', async () => {
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    let submitted = false
    let settled = false
    const result = runLogin({
        open: async () => {},
        fill: async () => {},
        submit: () => { submitted = true; return gate },
    }).then(() => { settled = true })
    await setImmediate()
    try {
        expect(submitted).to.equal(true)
        expect(settled).to.equal(false)
    } finally { release(); await result }
    expect(settled).to.equal(true)
})
test('propagates a submission failure', async () => {
    const original = new Error('submission rejected')
    let caught: unknown
    try {
        await runLogin({
            open: async () => {},
            fill: async () => {},
            submit: async () => { throw original },
        })
    } catch (error) { caught = error }
    expect(caught).to.equal(original)
})
