import { test } from 'node:test'
import { expect } from 'chai'
const { planWorkers } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('plans distinct devices, ports and data namespaces in input order without mutation', () => {
    const devices = Object.freeze(['emulator-5556', 'emulator-5554'])
    expect(planWorkers('ci_42-attempt2', devices, 8200)).to.deep.equal([
        { udid: 'emulator-5556', systemPort: 8200, namespace: 'ci_42-attempt2-w0' },
        { udid: 'emulator-5554', systemPort: 8201, namespace: 'ci_42-attempt2-w1' },
    ])
})
test('zero devices produces an empty plan, never an invented device', () => {
    expect(planWorkers('run', [], 8200)).to.deep.equal([])
})
test('different run IDs produce different namespaces', () => {
    expect(planWorkers('run1', ['phone'], 8200)[0].namespace)
        .not.to.equal(planWorkers('run2', ['phone'], 8200)[0].namespace)
})
test('rejects unsafe or empty run IDs', () => {
    for (const id of ['', ' run', 'run/x', 'run x', 'run\n', 'run\t']) {
        expect(() => planWorkers(id, ['phone'], 8200)).to.throw('Invalid run ID')
    }
})
test('rejects duplicate, empty or padded IDs instead of silently repairing them', () => {
    for (const ids of [['phone', 'phone'], [''], [' phone'], ['phone ']]) {
        expect(() => planWorkers('run', ids, 8200)).to.throw('Invalid device IDs')
    }
})
test('checks the entire port range including its boundaries', () => {
    expect(planWorkers('run', ['a'], 1024)[0].systemPort).to.equal(1024)
    expect(planWorkers('run', ['a', 'b'], 65534)[1].systemPort).to.equal(65535)
    for (const port of [1023, 65536, 8200.5, NaN, Infinity]) {
        expect(() => planWorkers('run', ['a'], port)).to.throw('Invalid port range')
    }
    expect(() => planWorkers('run', ['a', 'b'], 65535)).to.throw('Invalid port range')
    expect(() => planWorkers('run', [], 0)).to.throw('Invalid port range')
})
