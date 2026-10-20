import path from 'node:path'
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseProgress } from '../course/progress.js'
import { defaultProgressDirectory, MAX_PROGRESS_BYTES, openProgressStore } from './progress-store.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const [command, input, ...extra] = process.argv.slice(2)
let store
try {
    if (!['status', 'backup', 'import'].includes(command) || extra.length
        || (command === 'import' ? !input : input !== undefined)) {
        throw new Error('Usage: npm run progress:status | npm run progress:backup | npm run progress:import -- <backup.json>')
    }
    const catalog = JSON.parse(readFileSync(path.join(root, 'course/catalog.json'), 'utf8'))
    const lessonIds = catalog.lessons.map(lesson => lesson.id)
    let incoming
    if (command === 'import') {
        const info = statSync(input)
        if (!info.isFile() || info.size > MAX_PROGRESS_BYTES) throw new Error('Choose a progress JSON file smaller than 4 MiB.')
        incoming = JSON.parse(readFileSync(input, 'utf8'))
        parseProgress(incoming, lessonIds, true)
    }
    store = openProgressStore({ directory: defaultProgressDirectory(root), lessonIds })
    if (command === 'status') {
        const { revision, progress } = store.read()
        console.log(`Local database: ${store.filePath}\nRevision: ${revision}\nCompleted lessons: ${progress.completed.length}\nNotes: ${Object.keys(progress.notes).length}`)
    } else if (command === 'backup') {
        console.log(`Progress backup: ${store.backup()}`)
    } else {
        const { revision, databaseId } = store.read()
        const backupPath = store.backup()
        const result = store.merge(incoming, revision, databaseId)
        console.log(`Progress imported at revision ${result.revision}. Existing conflicting notes kept: ${result.conflicts}.\nPrevious progress backup: ${backupPath}`)
    }
} catch (error) {
    // JSON parser errors may quote personal notes; never echo them.
    console.error(error instanceof SyntaxError ? 'The backup is not valid JSON.'
        : error.code ? 'The progress file could not be accessed. Check the path and local permissions.'
            : error.message)
    process.exitCode = 1
} finally {
    store?.close()
}
