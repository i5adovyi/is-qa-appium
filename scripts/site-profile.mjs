import path from 'node:path'
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i

export function validateProfileName(profile) {
    if (typeof profile !== 'string' || profile.length > 64 ||
        !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(profile) || reservedNames.test(profile)) {
        throw new Error('Use a profile name of 1–64 lowercase letters, digits and single hyphens, starting with a letter (for example, second-account)')
    }
    return profile
}

export async function requireRealDirectory(directory, { optional = false } = {}) {
    const entry = await lstat(directory).catch(error => {
        if (optional && error.code === 'ENOENT') return undefined
        throw error
    })
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) {
        throw new Error(`Expected a real directory, without a symbolic link: ${directory}`)
    }
    return entry
}

function validateProjectId(projectId) {
    if (typeof projectId !== 'string' || !/^appgprj_[a-zA-Z0-9_-]{1,128}$/.test(projectId)) {
        throw new Error('Use the exact appgprj_ ID returned by the native Sites registration tool')
    }
}

async function profilePaths(root, profile, { create = false } = {}) {
    validateProfileName(profile)
    root = path.resolve(root)
    const directory = path.join(root, '.sites', profile)
    await requireRealDirectory(root)
    for (const item of [path.join(root, '.sites'), directory, path.join(directory, '.openai')]) {
        const entry = await requireRealDirectory(item, { optional: create })
        if (!entry && create) await mkdir(item)
    }
    return { profile, directory, manifestPath: path.join(directory, '.openai/hosting.json') }
}

async function readManifest(manifestPath, { optional = false } = {}) {
    const entry = await lstat(manifestPath).catch(error => {
        if (optional && error.code === 'ENOENT') return undefined
        throw error
    })
    if (!entry) return undefined
    if (!entry.isFile() || entry.isSymbolicLink()) throw new Error('The Site manifest must be a regular file, not a symbolic link')
    let manifest
    try {
        manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    } catch {
        throw new Error('The Site manifest is not valid JSON; restore it before continuing')
    }
    if (!manifest || Array.isArray(manifest) || typeof manifest !== 'object' || manifest.static?.directory !== 'dist') {
        throw new Error('The profile must describe a static Site with directory "dist"')
    }
    if (manifest.project_id !== undefined) validateProjectId(manifest.project_id)
    return manifest
}

export async function getSiteProfile({ root = projectRoot, profile }) {
    const result = await profilePaths(root, profile)
    return { ...result, manifest: await readManifest(result.manifestPath) }
}

export async function initializeSiteProfile({ root = projectRoot, profile }) {
    const result = await profilePaths(root, profile, { create: true })
    let manifest = await readManifest(result.manifestPath, { optional: true })
    if (!manifest) {
        // Never copy the root identity or another account's profile.
        manifest = { static: { directory: 'dist' } }
        await writeFile(result.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
    }
    return { ...result, manifest }
}

export async function bindSiteProfile({ root = projectRoot, profile, projectId }) {
    validateProjectId(projectId)
    const result = await getSiteProfile({ root, profile })
    const current = result.manifest.project_id
    if (current && current !== projectId) throw new Error('This profile already belongs to a different Site. Create a new profile; never overwrite its identity.')
    if (!current) {
        result.manifest.project_id = projectId
        await writeFile(result.manifestPath, `${JSON.stringify(result.manifest, null, 2)}\n`)
    }
    return result
}

export async function runSiteProfile(args) {
    const [command, profile, projectId, ...extra] = args
    if (!['init', 'status', 'bind'].includes(command) || !profile || extra.length ||
        (command === 'bind' ? !projectId : projectId !== undefined)) {
        throw new Error('Usage: npm run course:site-profile -- init|status <profile>\n       npm run course:site-profile -- bind <profile> <returned-project-id>')
    }
    const result = command === 'init'
        ? await initializeSiteProfile({ profile })
        : command === 'bind'
            ? await bindSiteProfile({ profile, projectId })
            : await getSiteProfile({ profile })
    console.log(`Site profile: ${result.profile}\nCheckout: ${result.directory}\nSite: ${result.manifest.project_id ?? 'not registered'}\nNo account was signed in and no Site was created or published.`)
    return result
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        await runSiteProfile(process.argv.slice(2))
    } catch (error) {
        console.error(`Site profile failed: ${error.message}`)
        process.exitCode = 1
    }
}
