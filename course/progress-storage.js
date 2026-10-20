import { parseProgress } from './progress.js'

export const legacyProgressKey = 'mobile-automation-lab-v1'
export const draftProgressKey = 'mobile-automation-lab-db-draft-v1'
export const migrationKey = 'mobile-automation-lab-db-migration-v1'
const empty = () => ({ completed: [], notes: {} })
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right)

// SQLite is authoritative. Each window owns a separate recovery slot, so one
// window's successful save cannot erase another window's unsaved draft.
export function createProgressStorage({
    mode, baseUrl, lessonIds, storage, fetcher = globalThis.fetch,
    onStatus = () => {}, delay = 350,
}) {
    const ownKey = `${draftProgressKey}:${crypto.randomUUID()}`
    let current = empty(), database, dirty = false, blocked = false, inFlight, timer
    let migration, loaded = false, generation = 0
    const parse = value => parseProgress(value, lessonIds)
    const copy = value => structuredClone(value)
    const status = (state, message) => onStatus({ state, message, pending: dirty })
    function raw(key) { try { return storage.getItem(key) } catch { return null } }
    function read(key) {
        const value = raw(key)
        return value ? JSON.parse(value) : null
    }
    function put(key, value) {
        try { storage.setItem(key, JSON.stringify(value)); return true } catch { return false }
    }
    function remove(key) {
        try { storage.removeItem(key) } catch { /* Saved drafts can safely remain as recovery copies. */ }
    }
    function draft() {
        return put(ownKey, { databaseId: database?.databaseId, revision: database?.revision,
            progress: current, updatedAt: new Date().toISOString() })
    }
    function getRecoveries() {
        const keys = new Set([draftProgressKey])
        try {
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i)
                if (key?.startsWith(`${draftProgressKey}:`) && key !== ownKey) keys.add(key)
            }
        } catch { /* SQLite still works without browser storage. */ }
        const entries = []
        for (const key of keys) {
            if (!raw(key)) continue
            try {
                const value = read(key)
                const progress = parse(value.progress)
                if (!same(progress, database?.progress)) entries.push({ key, updatedAt: value.updatedAt, invalid: false })
            } catch { entries.push({ key, invalid: true }) }
        }
        return entries
    }
    function snapshot(value) {
        if (!value || typeof value.databaseId !== 'string' || !value.databaseId
            || !Number.isSafeInteger(value.revision) || value.revision < 0
            || typeof value.writeToken !== 'string' || !value.writeToken) {
            throw new Error('The local progress server returned an invalid response. Restart npm run course.')
        }
        return { ...value, progress: parse(value.progress) }
    }
    async function request(method = 'GET', body) {
        const response = await fetcher(new URL('./api/progress', baseUrl), {
            method,
            headers: body ? { 'Content-Type': 'application/json', 'X-Course-Token': database.writeToken } : {},
            ...(body ? { body: JSON.stringify(body) } : {}),
        })
        if (!response.ok) {
            const error = new Error(response.status === 409
                ? 'Another window changed your progress. Export this draft before loading the saved version.'
                : `Local database request failed (${response.status}). Your draft has not been saved to the database.`)
            error.status = response.status
            throw error
        }
        return response.json()
    }
    function acknowledge(value, sent) {
        database = value
        dirty = !same(current, sent)
        if (dirty) draft()
        else {
            remove(ownKey)
            if (migration && raw(legacyProgressKey) === migration) remove(legacyProgressKey)
            migration = undefined
        }
    }
    async function flush() {
        clearTimeout(timer)
        if (mode === 'static') return !dirty
        if (!loaded || blocked) return false
        if (inFlight) return inFlight
        inFlight = (async () => {
            while (dirty && !blocked) {
                const sent = copy(current)
                status('saving', 'Saving to local database…')
                try {
                    const value = snapshot({ ...await request('PUT', {
                        databaseId: database.databaseId, revision: database.revision, progress: sent,
                    }), writeToken: database.writeToken })
                    if (value.databaseId !== database.databaseId || value.revision !== database.revision + 1
                        || !same(value.progress, sent)) throw new Error('Save could not be confirmed. Your browser draft was kept; retry the save.')
                    acknowledge(value, sent)
                } catch (error) {
                    blocked = true
                    status(error.status === 409 ? 'conflict' : 'error', error.message)
                }
            }
            if (!dirty) status('saved', 'Saved to local database')
            return !dirty
        })().finally(() => {
            inFlight = undefined
            if (!dirty || blocked) clearTimeout(timer)
        })
        return inFlight
    }
    function update(value) {
        if (!loaded) throw new Error('Progress has not finished loading')
        current = parse(value)
        generation++
        dirty = true
        if (mode === 'static') {
            dirty = !put(legacyProgressKey, current)
            status(dirty ? 'error' : 'saved', dirty
                ? 'Browser storage is unavailable. Export progress before leaving.'
                : 'Saved in this browser · export to move devices')
            return
        }
        const cached = draft()
        if (!blocked) {
            status('saving', cached ? 'Changes queued for the local database…'
                : 'Saving… browser draft storage is unavailable. Keep this page open until saved.')
            clearTimeout(timer)
            timer = setTimeout(() => { void flush() }, delay)
        }
    }
    async function load() {
        status('loading', mode === 'static' ? 'Loading browser progress…' : 'Loading local database…')
        if (mode === 'static') {
            const saved = read(legacyProgressKey)
            current = saved ? parse(saved) : empty()
            loaded = true
            status('saved', 'Browser storage · export to move devices')
            return copy(current)
        }
        database = snapshot(await request())
        current = database.progress
        loaded = true
        // Mark the migration attempt durably BEFORE writing: a lost response must
        // not import this stale cache into another empty database in the future.
        if (database.revision === 0 && !raw(migrationKey) && raw(legacyProgressKey)) {
            try {
                const legacy = parse(read(legacyProgressKey))
                if (put(migrationKey, { attemptedAt: new Date().toISOString() })) {
                    migration = raw(legacyProgressKey)
                    update(legacy)
                    await flush()
                    return copy(current)
                }
            } catch {
                status('error', 'Old browser progress could not be imported. Its original record was kept. The database is unchanged.')
                return copy(current)
            }
        }
        status('saved', 'Saved to local database')
        return copy(current)
    }
    async function retry() {
        if (mode === 'static') { update(current); return copy(current) }
        if (inFlight) await inFlight
        const latest = snapshot(await request())
        if (same(latest.progress, current)) {
            acknowledge(latest, current)
            blocked = false
            status('saved', 'Saved to local database')
        } else if (latest.databaseId === database.databaseId && latest.revision === database.revision) {
            database = latest
            blocked = false
            await flush()
        } else {
            blocked = true
            status('conflict', 'The database changed while this draft was unsaved. Export it before loading the saved version.')
        }
        return copy(current)
    }
    // Explicit recovery only: another slot might belong to a still-open window.
    async function recover(key) {
        if (!loaded || mode !== 'local') throw new Error('Open the local reader before recovering a draft.')
        if (!getRecoveries().some(entry => entry.key === key)) throw new Error('This draft is no longer available or is already saved.')
        const value = read(key)
        const recovered = parse(value.progress)
        const prior = generation
        clearTimeout(timer)
        if (inFlight) await inFlight
        if (generation !== prior) throw new Error('New edits arrived while recovering. Export your latest changes and try again.')
        blocked = value.databaseId !== database.databaseId || value.revision !== database.revision
        update(recovered)
        if (blocked) status('conflict', 'Recovered draft needs review because the database changed. Export it before loading saved progress.')
        else await flush()
        return copy(current)
    }
    // Called only by the explicit "Export draft & load saved" UI action.
    async function useSaved() {
        const prior = generation
        clearTimeout(timer)
        if (inFlight) await inFlight
        const latest = snapshot(await request())
        if (generation !== prior) throw new Error('New edits arrived while loading. Export the latest draft and try again.')
        database = latest
        current = latest.progress
        dirty = false
        blocked = false
        migration = undefined
        remove(ownKey)
        status('saved', 'Loaded saved progress from the local database')
        return copy(current)
    }
    return { load, update, flush, retry, useSaved, recover, getRecoveries,
        hasPending: () => dirty, getProgress: () => copy(current) }
}
