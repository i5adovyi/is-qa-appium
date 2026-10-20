import { test } from 'node:test'
import assert from 'node:assert/strict'
import { indexCollection } from './course-index.mjs'
import { headingSlug, findPractice } from '../course/practice.js'

const collection = { category: 'workplace', label: 'Workplace case', prefix: 'RW-', path: 'docs/cases.md' }
const markdown = `# Cases
## RW-01 · Old results overwrite new ones
Use a synthetic stale response trace.
### Review guide
Compare request identity, not just arrival time.
\`\`\`md
## RW-99 · This is code, not a case
\`\`\`
## RW-02 · A \`401\` response
Inspect refresh token ownership.
## Conclusion
Unrelated conclusion sentinel.
`
const entries = indexCollection(collection, markdown)

test('indexes actual headings and includes nested review guidance in search', () => {
    assert.deepEqual(entries.map(entry => entry.id), ['RW-01', 'RW-02'])
    assert.equal(entries[1].title, 'A 401 response')
    assert.equal(entries[1].anchor, 'rw-02-a-401-response')
    assert.deepEqual(findPractice(entries, 'REQUEST identity').map(entry => entry.id), ['RW-01'])
})
test('search does not leak the following case or unindexed section into an item', () => {
    assert.deepEqual(findPractice(entries, 'refresh').map(entry => entry.id), ['RW-02'])
    assert.deepEqual(findPractice(entries, 'conclusion sentinel'), [])
    assert.deepEqual(findPractice(entries, 'refresh stale'), [])
})
test('search combines terms, IDs and category filters without mutating the index', () => {
    const mixed = [...entries, { ...entries[1], id: 'Q41', category: 'interview' }]
    const before = structuredClone(mixed)
    assert.equal(findPractice(mixed, '  REFRESH   token ', 'interview').length, 1)
    assert.deepEqual(findPractice(mixed, 'RW-01').map(entry => entry.id), ['RW-01'])
    assert.deepEqual(findPractice(mixed, '', 'drill'), [])
    assert.equal(findPractice(mixed, '   ').length, 3)
    assert.deepEqual(mixed, before)
})
test('reader slugs preserve Unicode and remove punctuation from visible heading text', () => {
    assert.equal(headingSlug('Q01 · What happens after await LoginScreen.login(...)?'),
        'q01-what-happens-after-await-loginscreenlogin')
    assert.equal(headingSlug('  Café & RTL — check  '), 'café-rtl-check')
})
test('incident shifts index reveal text but do not mix collection IDs', () => {
    const shifts = indexCollection({ ...collection, prefix: 'S', category: 'shift' },
        '## S1 · Follow the evidence\n\n<details><summary>Reveal</summary>\n\nA stale manifest.\n\n</details>\n\n## RW-01 · Other collection\n')
    assert.deepEqual(shifts.map(entry => entry.id), ['S1'])
    assert.equal(findPractice(shifts, 'manifest', 'shift')[0].anchor, 's1-follow-the-evidence')
})
