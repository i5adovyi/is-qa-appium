import { test } from 'node:test'
import { expect } from 'chai'
const { validateInput } = await import(process.env.PRACTICE_SOLUTIONS === '1' ? './solution.ts' : './starter.ts')

test('empty fields report both problems', () => {
    expect(validateInput('', '')).to.deep.equal({
        emailError: 'Please enter a valid email address', passwordError: 'Please enter at least 8 characters',
    })
})
test('seven characters fail and eight pass', () => {
    expect(validateInput('learner@example.com', '1234567').passwordError).not.to.equal(null)
    expect(validateInput('learner@example.com', '12345678').passwordError).to.equal(null)
})
test('longer passwords remain valid', () => {
    expect(validateInput('learner@example.com', '123456789')).to.deep.equal({ emailError: null, passwordError: null })
})
test('rejects missing domain, whitespace and multiple at signs', () => {
    for (const email of ['learner', 'learner@host', 'learner @host.com', 'a@@b.com']) {
        expect(validateInput(email, '12345678').emailError, email).to.equal('Please enter a valid email address')
    }
})
test('reports errors independently', () => {
    expect(validateInput('bad', '12345678').passwordError).to.equal(null)
    expect(validateInput('learner@example.com', 'short').emailError).to.equal(null)
})
