import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createProgressStorage, draftProgressKey, legacyProgressKey, migrationKey } from '../course/progress-storage.js'

const progress = note => ({ completed: note ? ['00'] : [], notes: { '00': note } })
function memory(values = {}) {
    const data = new Map(Object.entries(values).map(([key, value]) => [key, JSON.stringify(value)]))
    return {
        getItem: key => data.get(key) ?? null,
        key: index => [...data.keys()][index] ?? null,
        get length() { return data.size },
        setItem: (key, value) => data.set(key, value),
        removeItem: key => data.delete(key),
    }
}
function backend(initial = { completed: [], notes: {} }, revision = 0) {
    let state = { databaseId: 'database-one', revision, progress: initial, writeToken: 'test-token' }
    const requests = []
    const fetcher = async (_url, options = {}) => {
        requests.push(options.method)
        if (options.method !== 'PUT') return Response.json(state)
        const incoming = JSON.parse(options.body)
        if (incoming.revision !== state.revision || incoming.databaseId !== state.databaseId) return new Response('', { status: 409 })
        state = { ...state, progress: incoming.progress, revision: state.revision + 1 }
        const { writeToken, ...saved } = state
        return Response.json(saved)
    }
    return { fetcher, requests, get: () => structuredClone(state), change: value => { state = { ...state, ...value } } }
}
function reader(db, storage = memory(), extra = {}) {
    const statuses = []
    const client = createProgressStorage({
        mode: 'local', baseUrl: 'http://127.0.0.1:4173/', lessonIds: ['00', '01'],
        storage, fetcher: db.fetcher, delay: 10_000, onStatus: value => statuses.push(value), ...extra,
    })
    return { client, storage, statuses }
}

test('legacy browser progress migrates once and a stale cache cannot undo later clears', async () => {
    const db = backend()
    const { client, storage } = reader(db, memory({ [legacyProgressKey]: progress('Old browser note') }))
    assert.deepEqual(await client.load(), progress('Old browser note'))
    assert.equal(storage.getItem(legacyProgressKey), null)
    client.update(progress(''))
    assert.equal(await client.flush(), true)
    storage.setItem(legacyProgressKey, JSON.stringify(progress('Stale browser note')))
    assert.deepEqual(await reader(db, storage).client.load(), progress(''))
    assert.equal(db.get().progress.notes['00'], '')
})

test('a new browser loads database progress without needing browser storage', async () => {
    const db = backend(progress('Shared computer state'), 2)
    const brokenStorage = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') }, removeItem() {} }
    const { client } = reader(db, brokenStorage)
    assert.deepEqual(await client.load(), progress('Shared computer state'))
    client.update(progress('Saved even without a draft cache'))
    assert.equal(await client.flush(), true)
    assert.equal(db.get().progress.notes['00'], 'Saved even without a draft cache')
})

test('initial database failure never uploads an empty state', async () => {
    const requests = []
    const { client } = reader({ fetcher: async (_url, options) => { requests.push(options.method); throw new Error('Offline') } })
    await assert.rejects(client.load(), /Offline/)
    assert.throws(() => client.update(progress('')), /loading/)
    assert.equal(await client.flush(), false)
    assert.deepEqual(requests, ['GET'])
})

test('edits made during a save stay queued and use the acknowledged revision', async () => {
    const db = backend()
    let release, started
    const gate = new Promise(resolve => { release = resolve })
    const firstWrite = new Promise(resolve => { started = resolve })
    let count = 0
    const { client, storage } = reader(db, memory(), {
        fetcher: async (url, options) => {
            if (options.method === 'PUT' && count++ === 0) { started(); await gate }
            return db.fetcher(url, options)
        },
    })
    await client.load()
    client.update(progress('First'))
    const saving = client.flush()
    await firstWrite
    client.update(progress('Second'))
    release()
    assert.equal(await saving, true)
    assert.deepEqual(db.get().progress, progress('Second'))
    assert.equal(db.get().revision, 2)
    assert.equal(storage.getItem(draftProgressKey), null)
    assert.equal(client.hasPending(), false)
})

test('failed writes retain a durable draft and recover after reopening the reader', async () => {
    const db = backend()
    const storage = memory()
    const { client, statuses } = reader(db, storage, {
        fetcher: (url, options) => options.method === 'PUT' ? Promise.reject(new Error('Server stopped')) : db.fetcher(url, options),
    })
    await client.load()
    client.update(progress('Do not lose this'))
    assert.equal(await client.flush(), false)
    assert.equal(statuses.at(-1).state, 'error')
    const reopened = reader(db, storage).client
    assert.deepEqual(await reopened.load(), { completed: [], notes: {} })
    const [draft] = reopened.getRecoveries()
    assert.deepEqual(JSON.parse(storage.getItem(draft.key)).progress, progress('Do not lose this'))
    assert.deepEqual(await reopened.recover(draft.key), progress('Do not lose this'))
    assert.equal(db.get().progress.notes['00'], 'Do not lose this')
})

test('two windows cannot silently overwrite each other and the losing draft can be exported', async () => {
    const db = backend()
    const shared = memory()
    const first = reader(db, shared), second = reader(db, shared)
    await first.client.load()
    await second.client.load()
    first.client.update(progress('First window'))
    await first.client.flush()
    second.client.update(progress('Second window'))
    assert.equal(await second.client.flush(), false)
    assert.equal(second.statuses.at(-1).state, 'conflict')
    assert.deepEqual(second.client.getProgress(), progress('Second window'))
    assert.deepEqual(db.get().progress, progress('First window'))
    assert.deepEqual(await second.client.useSaved(), progress('First window'))
})

test('an interrupted response is recognized without a duplicate write; a replaced DB blocks stale drafts', async () => {
    const db = backend(progress('Already committed'), 4)
    const storage = memory({ [draftProgressKey]: { databaseId: 'database-one', revision: 3, progress: progress('Already committed') } })
    await reader(db, storage).client.load()
    assert.ok(storage.getItem(draftProgressKey), 'Never remove another potentially active window slot')
    assert.deepEqual(db.requests, ['GET'])
    storage.setItem(draftProgressKey, JSON.stringify({ databaseId: 'different-db', revision: 4, progress: progress('Old database draft') }))
    const reopened = reader(db, storage)
    assert.deepEqual(await reopened.client.load(), progress('Already committed'))
    await reopened.client.recover(draftProgressKey)
    assert.equal(reopened.statuses.at(-1).state, 'conflict')
    assert.equal(await reopened.client.flush(), false)
    assert.deepEqual(db.get().progress, progress('Already committed'))
})

test('retry refreshes a restarted server token, and static hosting never calls a local API', async () => {
    const db = backend()
    let offline = false
    const { client } = reader(db, memory(), { fetcher: (url, options) => offline ? Promise.reject(new Error('Offline')) : db.fetcher(url, options) })
    await client.load()
    offline = true
    client.update(progress('Retry me'))
    await client.flush()
    offline = false
    db.change({ writeToken: 'new-process-token' })
    await client.retry()
    assert.deepEqual(db.get().progress, progress('Retry me'))
    const store = memory()
    const hosted = reader({ fetcher() { throw new Error('Static reader must not make API calls') } }, store, { mode: 'static' })
    await hosted.client.load()
    hosted.client.update(progress('Hosted note'))
    assert.equal(await hosted.client.flush(), true)
    assert.deepEqual(await reader(db, store, { mode: 'static' }).client.load(), progress('Hosted note'))
})

test('one window saving never removes a different window draft in shared localStorage', async () => {
    const db = backend(), shared = memory()
    const first = reader(db, shared).client, second = reader(db, shared).client
    await first.load(); await second.load()
    first.update(progress('Window A'))
    second.update(progress('Window B'))
    await first.flush()
    const [draftB] = first.getRecoveries()
    assert.deepEqual(JSON.parse(shared.getItem(draftB.key)).progress, progress('Window B'))
    assert.equal(await second.flush(), false)
    const reopened = reader(db, shared).client
    assert.deepEqual(await reopened.load(), progress('Window A'))
    assert.equal(reopened.getRecoveries().length, 1)
    assert.deepEqual(await reopened.recover(draftB.key), progress('Window B'))
    assert.equal(reopened.hasPending(), true)
    assert.deepEqual(db.get().progress, progress('Window A'))
})

test('corrupt recovery entries are preserved without preventing valid database access', async () => {
    const db = backend(progress('Saved work'), 3), store = memory()
    const key = `${draftProgressKey}:broken`
    store.setItem(key, 'invalid{json')
    const client = reader(db, store).client
    assert.deepEqual(await client.load(), progress('Saved work'))
    assert.deepEqual(client.getRecoveries(), [{ key, invalid: true }])
    await assert.rejects(client.recover(key))
    client.update(progress('More work'))
    await client.flush()
    assert.equal(store.getItem(key), 'invalid{json')
})

test('malformed successful write responses never discard the unsaved draft', async () => {
    for (const bad of [
        { databaseId: 'other-db' }, { revision: 0 }, { revision: '1' }, { progress: progress('Wrong') },
    ]) {
        const db = backend(), store = memory()
        const client = reader(db, store, { fetcher: (url, options) => options.method === 'PUT'
            ? Response.json({ ...db.get(), revision: 1, progress: progress('New'), ...bad })
            : db.fetcher(url, options) }).client
        await client.load()
        client.update(progress('New'))
        assert.equal(await client.flush(), false)
        assert.equal(client.hasPending(), true)
        assert.equal(store.length, 1)
    }
})

test('load saved refuses to discard edit then undo activity while its request is pending', async () => {
    const db = backend(progress('Saved'), 1)
    let release, pending = false
    const gate = new Promise(resolve => { release = resolve })
    const client = reader(db, memory(), { fetcher: async (url, options) => {
        if (pending && options.method === 'GET') await gate
        return db.fetcher(url, options)
    } }).client
    await client.load()
    pending = true
    const loading = client.useSaved()
    client.update(progress('Edited'))
    client.update(progress('Saved'))
    release()
    await assert.rejects(loading, /New edits/)
    await client.flush()
})

test('lost migration response cannot import the legacy cache into a later fresh database', async () => {
    const db = backend(), store = memory({ [legacyProgressKey]: progress('Legacy') })
    const client = reader(db, store, { fetcher: async (url, options) => {
        const result = await db.fetcher(url, options)
        if (options.method === 'PUT') throw new Error('Response lost')
        return result
    } }).client
    await client.load()
    assert.ok(store.getItem(migrationKey))
    assert.deepEqual(db.get().progress, progress('Legacy'))
    const fresh = backend()
    fresh.change({ databaseId: 'fresh-database' })
    assert.deepEqual(await reader(fresh, store).client.load(), { completed: [], notes: {} })
    assert.deepEqual(fresh.requests, ['GET'])
})
