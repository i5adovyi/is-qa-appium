import path from 'node:path'
import { cp, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const target = path.join(root, '.sites/mobile-automation-lab')

try {
    const manifest = JSON.parse(await readFile(path.join(root, '.openai/hosting.json'), 'utf8'))
    if (!manifest.project_id || manifest.static?.directory !== 'dist') throw new Error('A registered static Site manifest is required')
    if (await readFile(path.join(root, 'dist/.course-build.json'), 'utf8') !== '{"format":"mobile-automation-course-v1"}\n') {
        throw new Error('Build the static course before preparing the Site')
    }
    for (const directory of [path.join(root, '.sites'), target, path.join(target, '.openai'), path.join(target, 'dist')]) {
        const entry = await lstat(directory).catch(error => { if (error.code !== 'ENOENT') throw error })
        if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) throw new Error('Site output must use real directories')
    }
    await mkdir(path.join(target, '.openai'), { recursive: true })
    const prior = await readFile(path.join(target, '.openai/hosting.json'), 'utf8').catch(error => {
        if (error.code !== 'ENOENT') throw error
    })
    if (prior && JSON.parse(prior).project_id !== manifest.project_id) throw new Error('Prepared checkout belongs to another Site')
    await writeFile(path.join(target, '.openai/hosting.json'), `${JSON.stringify(manifest, null, 2)}\n`)
    await rm(path.join(target, 'dist'), { recursive: true, force: true })
    await cp(path.join(root, 'dist'), path.join(target, 'dist'), { recursive: true })
    console.log(`Site source prepared at ${target}\nThis does not publish. Use the Sites publishing workflow with this checkout and its existing project_id.`)
} catch (error) {
    console.error(`Site preparation failed: ${error.message}`)
    process.exitCode = 1
}
