import { test } from 'node:test'
import { expect } from 'chai'
import type { Result } from './starter.ts'
const { summarize } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('reports all dispositions and distinguishes first passes from recovered retries', () => {
    const results: readonly Result[] = Object.freeze([
        { id: 'login', disposition: 'executed', attempts: Object.freeze(['passed'] as const) },
        { id: 'forms', disposition: 'executed', attempts: Object.freeze(['failed', 'passed'] as const) },
        { id: 'checkout', disposition: 'executed', attempts: Object.freeze(['failed', 'failed'] as const) },
        { id: 'ios', disposition: 'skipped', attempts: [] },
        { id: 'cloud', disposition: 'not-run', attempts: [] },
    ])
    expect(summarize(results)).to.deep.equal({
        planned: 5, executed: 3, passed: 2, failed: 1, skipped: 1,
        notRun: 1, recoveredOnRetry: 1, firstPassRate: 1 / 3,
    })
})
test('no execution has an unknown rate, never a fabricated 100 percent', () => {
    expect(summarize([])).to.deep.equal({
        planned: 0, executed: 0, passed: 0, failed: 0, skipped: 0,
        notRun: 0, recoveredOnRetry: 0, firstPassRate: null,
    })
    expect(summarize([{ id: 'a', disposition: 'not-run', attempts: [] }]).firstPassRate).to.equal(null)
})
test('first-attempt passes and failures have exact rates', () => {
    expect(summarize([{ id: 'a', disposition: 'executed', attempts: ['passed'] }]).firstPassRate).to.equal(1)
    expect(summarize([{ id: 'a', disposition: 'executed', attempts: ['failed'] }]).firstPassRate).to.equal(0)
})
test('multiple failures then a pass count as one recovered test', () => {
    const summary = summarize([{ id: 'a', disposition: 'executed', attempts: ['failed', 'failed', 'passed'] }])
    expect(summary.recoveredOnRetry).to.equal(1)
    expect(summary.executed).to.equal(1)
    expect(summary.firstPassRate).to.equal(0)
})
test('rejects missing or duplicate test identities', () => {
    expect(() => summarize([{ id: ' ', disposition: 'not-run', attempts: [] }])).to.throw('Invalid result')
    expect(() => summarize([
        { id: 'a', disposition: 'executed', attempts: ['passed'] },
        { id: 'a', disposition: 'skipped', attempts: [] },
    ])).to.throw('Invalid result')
})
test('rejects contradictory execution status and impossible retry histories', () => {
    const invalid: Result[] = [
        { id: 'a', disposition: 'executed', attempts: [] },
        { id: 'a', disposition: 'skipped', attempts: ['failed'] },
        { id: 'a', disposition: 'not-run', attempts: ['passed'] },
        { id: 'a', disposition: 'executed', attempts: ['passed', 'failed'] },
        { id: 'a', disposition: 'executed', attempts: ['passed', 'passed'] },
    ]
    for (const result of invalid) expect(() => summarize([result])).to.throw('Invalid result')
})
