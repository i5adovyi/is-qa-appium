import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseProgress, mergeProgress, progressIdsForCatalog } from '../course/progress.js'

const ids = ['00', '01', '02']
test('old lesson backups merge with independent challenge notes and completion marks', () => {
    const known = progressIdsForCatalog({ lessons: [{ id: '00' }], challenges: [{ id: 'CH-01' }] })
    assert.deepEqual(known, ['00', 'CH-01'])
    const saved = { completed: ['CH-01'], notes: { 'CH-01': 'Keep evidence' } }
    const legacy = parseProgress({ course: 'Mobile Automation Lab', completed: ['00'], notes: { '00': 'Older lesson' } }, known, true)
    const combined = mergeProgress(saved, legacy, known).progress
    assert.deepEqual(combined, { completed: ['00', 'CH-01'], notes: { 'CH-01': 'Keep evidence', '00': 'Older lesson' } })
    assert.deepEqual(parseProgress({ schemaVersion: 1, course: 'Mobile Automation Lab', ...combined }, known, true), combined)
})
test('reads existing exports and removes duplicate or unknown lesson IDs', () => {
    assert.deepEqual(parseProgress({
        course: 'Mobile Automation Lab',
        completed: ['00', '00', '99'],
        notes: { '00': 'My observation', '99': 'Unknown lesson' },
    }, ids, true), { completed: ['00'], notes: { '00': 'My observation' } })
})
test('keeps existing browser progress compatible without requiring export metadata', () => {
    const saved = { completed: ['01'], notes: { '01': 'Previously saved' } }
    assert.deepEqual(parseProgress(saved, ids), saved)
})
test('rejects malformed backups and unsupported versions before merging', () => {
    for (const value of [null, {}, { completed: '00', notes: {} },
        { completed: [1], notes: {} }, { completed: [], notes: [] },
        { completed: [], notes: { '00': 10 } }]) {
        assert.throws(() => parseProgress(value, ids, true), /progress JSON/)
    }
    assert.throws(() => parseProgress({ completed: [], notes: {} }, ids, true), /different course/)
    assert.throws(() => parseProgress({
        course: 'Mobile Automation Lab', schemaVersion: 2, completed: [], notes: {},
    }, ids, true), /format is not supported/)
})
test('merges completions and missing notes without overwriting a conflicting current note', () => {
    const current = { completed: ['01'], notes: { '00': 'Keep this', '01': '' } }
    const incoming = { completed: ['00'], notes: { '00': 'Older backup', '01': 'Restore this', '02': 'New note' } }
    assert.deepEqual(mergeProgress(current, incoming, ids), {
        progress: { completed: ['00', '01'], notes: { '00': 'Keep this', '01': 'Restore this', '02': 'New note' } },
        conflicts: 1,
    })
    assert.equal(current.notes['01'], '', 'Merging must not mutate the previous object')
})
test('reimporting the same backup is harmless and an empty backup cannot erase notes', () => {
    const current = { completed: ['00'], notes: { '00': 'Evidence' } }
    assert.deepEqual(mergeProgress(current, current, ids), { progress: current, conflicts: 0 })
    assert.deepEqual(mergeProgress(current, { completed: [], notes: { '00': '' } }, ids),
        { progress: current, conflicts: 0 })
})
test('a valid export with long evidence notes can be restored', () => {
    const note = 'x'.repeat(1_100_000)
    const exported = JSON.stringify({
        schemaVersion: 1, course: 'Mobile Automation Lab', completed: ['00'], notes: { '00': note },
    })
    assert.equal(parseProgress(JSON.parse(exported), ids, true).notes['00'], note)
})
