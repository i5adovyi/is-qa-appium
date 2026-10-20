import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { chmodSync, closeSync, mkdirSync, openSync, writeFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { parseProgress, mergeProgress } from '../course/progress.js'

// Leave room for export metadata and the HTTP request envelope.
export const MAX_PROGRESS_BYTES = 4 * 1024 * 1024
const MAX_DOCUMENT_BYTES = MAX_PROGRESS_BYTES - 4096
const APPLICATION_ID = 0x4d414c31
const DATABASE_VERSION = 1
const course = 'Mobile Automation Lab'

export class ProgressError extends Error {
    constructor(message, status = 400, latest) {
        super(message)
        this.name = 'ProgressError'
        this.status = status
        if (latest) this.latest = latest
    }
}

export function defaultProgressDirectory(root) {
    return path.resolve(process.env.COURSE_DATA_DIR || path.join(root, '.local-data'))
}

function normalizeProgress(value, lessonIds, requireExport = false) {
    try {
        const serialized = JSON.stringify(value)
        if (!serialized || Buffer.byteLength(serialized) > MAX_PROGRESS_BYTES) {
            throw new ProgressError('Progress exceeds the 4 MiB storage limit.', 413)
        }
        const progress = parseProgress(value, lessonIds, requireExport)
        if (Buffer.byteLength(JSON.stringify(progress)) > MAX_DOCUMENT_BYTES) {
            throw new ProgressError('Progress exceeds the 4 MiB storage limit.', 413)
        }
        return progress
    } catch (error) {
        if (error instanceof ProgressError) throw error
        throw new ProgressError(error instanceof Error && /^(Choose|This progress)/.test(error.message)
            ? error.message : 'Progress must contain completed lesson IDs and text notes.')
    }
}

function snapshot(database, lessonIds) {
    const rows = database.prepare('SELECT database_id, revision, progress FROM course_progress WHERE id = 1').all()
    if (rows.length !== 1) throw new Error('Missing progress record')
    const row = rows[0]
    if (typeof row.database_id !== 'string' || !row.database_id
        || !Number.isSafeInteger(row.revision) || row.revision < 0) throw new Error('Invalid progress record')
    return {
        databaseId: row.database_id,
        revision: row.revision,
        progress: normalizeProgress(JSON.parse(row.progress), lessonIds),
    }
}

function inspectDatabase(database, lessonIds) {
    const version = database.prepare('PRAGMA user_version').get().user_version
    if (version !== DATABASE_VERSION) {
        throw new Error(`Unsupported progress database version ${version}; expected ${DATABASE_VERSION}.`)
    }
    if (database.prepare('PRAGMA application_id').get().application_id !== APPLICATION_ID
        || database.prepare('PRAGMA quick_check').get().quick_check !== 'ok') {
        throw new Error('Invalid progress database')
    }
    return snapshot(database, lessonIds)
}

export function openProgressStore({ directory, lessonIds }) {
    if (!directory || !Array.isArray(lessonIds) || lessonIds.some(id => typeof id !== 'string')) {
        throw new Error('Progress storage requires a directory and lesson IDs.')
    }
    directory = path.resolve(directory)
    mkdirSync(directory, { recursive: true, mode: 0o700 })
    const filePath = path.join(directory, 'progress.sqlite')
    let created = false
    try {
        closeSync(openSync(filePath, 'wx', 0o600))
        created = true
    } catch (error) {
        if (error.code !== 'EEXIST') throw error
    }
    let database
    try {
        if (!created) {
            // Inspect before opening for writes. Never reset a corrupt or future DB.
            const inspection = new DatabaseSync(filePath, { readOnly: true, timeout: 5000 })
            try { inspectDatabase(inspection, lessonIds) } finally { inspection.close() }
        }
        database = new DatabaseSync(filePath, { timeout: 5000 })
        if (created) {
            database.exec(`
                BEGIN IMMEDIATE;
                PRAGMA application_id = ${APPLICATION_ID};
                PRAGMA user_version = ${DATABASE_VERSION};
                CREATE TABLE course_progress (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    database_id TEXT NOT NULL,
                    revision INTEGER NOT NULL CHECK (revision >= 0),
                    progress TEXT NOT NULL
                ) STRICT;
            `)
            database.prepare('INSERT INTO course_progress VALUES (1, ?, 0, ?)').run(
                randomUUID(), JSON.stringify({ completed: [], notes: {} }))
            database.exec('COMMIT')
        }
        inspectDatabase(database, lessonIds)
        // SQLite's rollback journal and FULL sync keep each replacement atomic.
        // Avoid WAL so a stopped database can be copied as one file.
        database.exec('PRAGMA journal_mode = DELETE; PRAGMA synchronous = FULL')
        chmodSync(filePath, 0o600)
    } catch (error) {
        try { database?.close() } catch { /* Preserve the original failure. */ }
        throw new Error('Cannot open the progress database. Its contents were not reset. '
            + 'Keep the file and restore a JSON backup into a different COURSE_DATA_DIR, '
            + 'or use a reader version that supports this database.', { cause: error })
    }
    const databaseId = snapshot(database, lessonIds).databaseId
    const read = () => snapshot(database, lessonIds)
    const write = (value, expectedRevision, expectedDatabaseId = databaseId) => {
        const progress = normalizeProgress(value, lessonIds)
        if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) {
            throw new ProgressError('A non-negative integer revision is required.')
        }
        database.exec('BEGIN IMMEDIATE')
        try {
            const latest = read()
            if (expectedDatabaseId !== latest.databaseId || expectedRevision !== latest.revision) {
                throw new ProgressError('Progress changed in another session. Reload before saving.', 409, latest)
            }
            if (latest.revision >= Number.MAX_SAFE_INTEGER) throw new Error('Progress revision exhausted')
            database.prepare('UPDATE course_progress SET revision = ?, progress = ? WHERE id = 1').run(
                latest.revision + 1, JSON.stringify(progress))
            database.exec('COMMIT')
            return { databaseId, revision: latest.revision + 1, progress }
        } catch (error) {
            if (database.isTransaction) database.exec('ROLLBACK')
            throw error
        }
    }
    const backup = ({ directory: backupDirectory = path.join(directory, 'backups') } = {}) => {
        const current = read()
        mkdirSync(backupDirectory, { recursive: true, mode: 0o700 })
        const exportedAt = new Date().toISOString()
        const backupPath = path.resolve(backupDirectory,
            `mobile-automation-progress-${exportedAt.replaceAll(':', '-')}-${randomUUID()}.json`)
        writeFileSync(backupPath, JSON.stringify({
            schemaVersion: 1, course, exportedAt, ...current.progress,
        }, null, 2), { flag: 'wx', mode: 0o600, flush: true })
        return backupPath
    }
    return {
        filePath, databaseId, read, write, backup,
        merge(value, expectedRevision, expectedDatabaseId = databaseId) {
            const incoming = normalizeProgress(value, lessonIds, true)
            const current = read()
            const merged = mergeProgress(current.progress, incoming, lessonIds)
            return { ...write(merged.progress, expectedRevision, expectedDatabaseId), conflicts: merged.conflicts }
        },
        close() { database.close() },
    }
}
