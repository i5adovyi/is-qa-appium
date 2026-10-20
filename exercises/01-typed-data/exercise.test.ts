import { test } from 'node:test'
import { expect } from 'chai'
const { makeCredentials } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('trims surrounding email whitespace', () => {
    expect(makeCredentials('  learner@example.com\n', 'secret123')).to.deep.equal({
        email: 'learner@example.com', password: 'secret123',
    })
})
test('preserves password whitespace and email case', () => {
    expect(makeCredentials('Learner@Example.com', '  secret  ')).to.deep.equal({
        email: 'Learner@Example.com', password: '  secret  ',
    })
})
test('empty data stays empty rather than inventing defaults', () => {
    expect(makeCredentials('', '')).to.deep.equal({ email: '', password: '' })
})
test('each invocation produces an independent object', () => {
    const first = makeCredentials('one@example.com', 'a')
    const second = makeCredentials('two@example.com', 'b')
    first.email = 'changed@example.com'
    expect(second.email).to.equal('two@example.com')
})
