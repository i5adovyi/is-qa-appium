import { readFileSync, realpathSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { downloadApp, verifyApp, type AppArtifact } from './demo-app.ts'

export interface TrainingApp extends AppArtifact {
    name: string
    version: string
    file: string
    package: string
    activity: string
    waitActivity: string
    source: string
    release: string
    license: string
}

export const trainingRoot = fileURLToPath(new URL('../..', import.meta.url))
export const trainingApps: Record<string, TrainingApp> = JSON.parse(
    readFileSync(new URL('../../apps/training-apps.json', import.meta.url), 'utf8'),
)

export function getTrainingApp(id: string | undefined): TrainingApp {
    if (!id || !Object.hasOwn(trainingApps, id)) {
        throw new Error(`Choose a training app: ${Object.keys(trainingApps).join(', ')}. Run npm run training:apps -- list.`)
    }
    const app = trainingApps[id]!
    if (!/^[a-z0-9.-]+\.apk$/.test(app.file)) throw new Error('Invalid training APK filename.')
    return app
}

export function trainingAppPath(id: string): string {
    return path.join(trainingRoot, 'apps', getTrainingApp(id).file)
}

export async function verifyTrainingApp(id: string): Promise<void> {
    const app = getTrainingApp(id)
    try {
        await verifyApp(trainingAppPath(id), app)
    } catch {
        throw new Error(`Training APK ${id} is missing, unreadable or changed. Run npm run training:apps -- download ${id}; do not bypass verification.`)
    }
}

export async function downloadTrainingApp(id: string): Promise<void> {
    await downloadApp(trainingAppPath(id), getTrainingApp(id))
}

// A single explicit learner file prevents accidental execution of reference suites
// against a different app. Resolve symlinks before checking the directory boundary.
export function trainingSpecPath(id: string, spec: string | undefined, root = trainingRoot): string {
    getTrainingApp(id)
    if (!spec || !spec.endsWith('.spec.ts')) {
        throw new Error(`Choose one learner .spec.ts file under test/training/${id}/ using --spec.`)
    }
    const expected = path.join(root, 'test', 'training', id)
    const candidate = path.resolve(root, spec)
    if (/[*?\[\]{}!]/.test(candidate)) {
        throw new Error('Choose a literal spec filename and project path without glob characters (* ? [ ] { } !).')
    }
    const relative = path.relative(expected, candidate)
    if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
        throw new Error(`Training specs must be inside test/training/${id}/.`)
    }
    try {
        const realRoot = realpathSync(expected)
        const realFile = realpathSync(candidate)
        const realRelative = path.relative(realRoot, realFile)
        if (/[*?\[\]{}!]/.test(realFile) || realRoot !== path.join(realpathSync(root), 'test', 'training', id) || !realRelative || realRelative === '..'
            || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)
            || !statSync(realFile).isFile()) {
            throw new Error('File leaves its training app directory.')
        }
        return realFile
    } catch {
        throw new Error(`Choose an existing regular .spec.ts file inside test/training/${id}/. See docs/handbook/training-apps.md.`)
    }
}

export function parseTrainingRun(args: string[], root = trainingRoot): { id: string; spec: string } {
    if (args.length !== 3 || args[1] !== '--spec') {
        throw new Error('Usage: npm run test:training -- <app> --spec test/training/<app>/<name>.spec.ts')
    }
    const id = args[0]!
    return { id, spec: trainingSpecPath(id, args[2], root) }
}
