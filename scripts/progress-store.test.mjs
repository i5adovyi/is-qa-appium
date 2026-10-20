import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { MAX_PROGRESS_BYTES, openProgressStore } from './progress-store.mjs'
import { parseProgress } from '../course/progress.js'

const lessonIds = ['00', '01', '02']
const root = fileURLToPath(new URL('../', import.meta.url))
const empty = () => ({ completed: [], notes: {} })
function fixture(t) {
    const directory = mkdtempSync(path.join(tmpdir(), 'course-progress-'))
    const stores = []
    t.after(() => {
        for (const store of stores) {
            try { store.close() } catch { /* Tests may close one explicitly. */ }
        }
        rmSync(directory, { recursive: true, force: true })
    })
    return {
        directory,
        open() {
            const store = openProgressStore({ directory, lessonIds })
            stores.push(store)
            return store
        },
    }
}

test('SQLite progress, database identity and revision survive a full close and restart', t => {
    const f = fixture(t)
    const first = f.open()
    assert.deepEqual(first.read(), { databaseId: first.databaseId, revision: 0, progress: empty() })
    const progress = { completed: ['00'], notes: { '00': 'My evidence — not a device pass.' } }
    const written = first.write(progress, 0)
    first.close()
    const reopened = f.open()
    assert.deepEqual(reopened.read(), written)
    if (process.platform !== 'win32') assert.equal(statSync(reopened.filePath).mode & 0o777, 0o600)
})

test('routine saves replace progress, preserving unchecks, blank notes and deleted notes', t => {
    const store = fixture(t).open()
    store.write({ completed: ['00', '01'], notes: { '00': 'Remove', '01': 'Clear' } }, 0)
    const result = store.write({ completed: ['01'], notes: { '01': '' } }, 1)
    assert.deepEqual(result.progress, { completed: ['01'], notes: { '01': '' } })
    assert.deepEqual(store.write(empty(), 2).progress, empty())
})

test('two connections cannot overwrite a revision saved by the other session', t => {
    const f = fixture(t)
    const first = f.open()
    const second = f.open()
    const old = second.read()
    const saved = first.write({ completed: ['00'], notes: { '00': 'Keep this' } }, 0)
    assert.throws(() => second.write(empty(), old.revision), error => {
        assert.equal(error.status, 409)
        assert.deepEqual(error.latest, saved)
        return true
    })
    assert.deepEqual(second.read(), saved)
    assert.equal(second.write({ completed: ['01'], notes: {} }, saved.revision).revision, 2)
})

test('invalid data, future export schemas, oversized notes and stale database identity leave data unchanged', t => {
    const store = fixture(t).open()
    const original = store.read()
    for (const invalid of [null, { completed: '00', notes: {} }, { completed: [], notes: { '00': false } },
        { completed: [], notes: {}, schemaVersion: 2 }, { completed: [], notes: { '00': 'x'.repeat(MAX_PROGRESS_BYTES) } }]) {
        assert.throws(() => store.write(invalid, 0))
        assert.deepEqual(store.read(), original)
    }
    for (const revision of [-1, 0.5, '0', null, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => store.write(empty(), revision), error => error.status === 400)
    }
    assert.throws(() => store.write(empty(), 0, 'another-database'), error => error.status === 409)
    assert.deepEqual(store.read(), original)
})

test('large existing-format notes remain supported, duplicate and unknown lesson IDs are filtered', t => {
    const store = fixture(t).open()
    const note = 'x'.repeat(1_100_000)
    const result = store.write({ completed: ['00', '00', '99'], notes: { '00': note, '99': 'Unknown' } }, 0)
    assert.deepEqual(result.progress, { completed: ['00'], notes: { '00': note } })
})

test('unique private JSON backups round-trip through the existing export format', t => {
    const f = fixture(t)
    const source = f.open()
    const progress = { completed: ['00'], notes: { '00': 'Export me' } }
    source.write(progress, 0)
    const backupOne = source.backup()
    const backupTwo = source.backup()
    assert.notEqual(backupOne, backupTwo)
    if (process.platform !== 'win32') assert.equal(statSync(backupOne).mode & 0o777, 0o600)
    const exported = JSON.parse(readFileSync(backupOne, 'utf8'))
    assert.equal(exported.schemaVersion, 1)
    assert.deepEqual(parseProgress(exported, lessonIds, true), progress)
    const restored = openProgressStore({ directory: path.join(f.directory, 'restored'), lessonIds })
    t.after(() => restored.close())
    assert.deepEqual(restored.merge(exported, 0).progress, progress)
})

test('import merges completion and empty notes but preserves conflicting current notes', t => {
    const store = fixture(t).open()
    store.write({ completed: ['01'], notes: { '00': 'Current', '01': '' } }, 0)
    const result = store.merge({
        course: 'Mobile Automation Lab', schemaVersion: 1,
        completed: ['00'], notes: { '00': 'Conflicting backup', '01': 'Fill this' },
    }, 1)
    assert.equal(result.conflicts, 1)
    assert.deepEqual(result.progress, {
        completed: ['00', '01'], notes: { '00': 'Current', '01': 'Fill this' },
    })
})

test('a backup remains importable at the maximum accepted progress size', t => {
    const store = fixture(t).open()
    const envelope = { completed: [], notes: { '00': '' } }
    const noteLength = MAX_PROGRESS_BYTES - 4096 - Buffer.byteLength(JSON.stringify(envelope))
    envelope.notes['00'] = 'x'.repeat(noteLength)
    store.write(envelope, 0)
    const filePath = store.backup()
    assert.ok(statSync(filePath).size < MAX_PROGRESS_BYTES)
    const exported = JSON.parse(readFileSync(filePath, 'utf8'))
    assert.equal(store.merge(exported, 1).progress.notes['00'].length, noteLength)
})

test('corrupt files and future database versions are refused without resetting or altering them', t => {
    const f = fixture(t)
    const filePath = path.join(f.directory, 'progress.sqlite')
    writeFileSync(filePath, 'not a sqlite database')
    let before = readFileSync(filePath)
    assert.throws(() => f.open(), /contents were not reset/)
    assert.deepEqual(readFileSync(filePath), before)
    rmSync(filePath)
    f.open().close()
    const database = new DatabaseSync(filePath)
    database.exec('PRAGMA user_version = 2')
    database.close()
    before = readFileSync(filePath)
    assert.throws(() => f.open(), /contents were not reset/)
    assert.deepEqual(readFileSync(filePath), before)
})

test('a damaged stored progress record is not silently replaced by empty progress', t => {
    const f = fixture(t)
    const store = f.open()
    store.close()
    const database = new DatabaseSync(store.filePath)
    database.prepare('UPDATE course_progress SET progress = ?').run('{"notes":{"00":"personal"},"completed":false}')
    database.close()
    const before = readFileSync(store.filePath)
    assert.throws(() => f.open(), /contents were not reset/)
    assert.deepEqual(readFileSync(store.filePath), before)
})

test('CLI status, backup and import use COURSE_DATA_DIR and never print note contents', t => {
    const f = fixture(t)
    const progress = { completed: ['00'], notes: { '00': 'private-note-sentinel' } }
    const store = f.open()
    store.write(progress, 0)
    store.close()
    const run = (args, directory = f.directory) => spawnSync(process.execPath, ['scripts/progress-db.mjs', ...args], {
        cwd: root, env: { ...process.env, COURSE_DATA_DIR: directory }, encoding: 'utf8',
    })
    const status = run(['status'])
    assert.equal(status.status, 0, status.stderr)
    assert.match(status.stdout, /Completed lessons: 1/)
    const backup = run(['backup'])
    assert.equal(backup.status, 0, backup.stderr)
    const backupPath = backup.stdout.trim().replace(/^Progress backup: /, '')
    const destination = path.join(f.directory, 'new-machine')
    const imported = run(['import', backupPath], destination)
    assert.equal(imported.status, 0, imported.stderr)
    assert.match(imported.stdout, /Previous progress backup:/)
    const restored = openProgressStore({ directory: destination, lessonIds })
    assert.deepEqual(restored.read().progress, progress)
    restored.close()
    for (const result of [status, backup, imported]) {
        assert.doesNotMatch(`${result.stdout}${result.stderr}`, /private-note-sentinel/)
    }
    const broken = path.join(f.directory, 'broken.json')
    writeFileSync(broken, '{"private-note-sentinel":')
    const rejected = run(['import', broken])
    assert.equal(rejected.status, 1)
    assert.doesNotMatch(`${rejected.stdout}${rejected.stderr}`, /private-note-sentinel/)
})
