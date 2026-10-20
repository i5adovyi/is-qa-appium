import { readFile, readdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const catalog = JSON.parse(await readFile(path.join(root, 'course/catalog.json'), 'utf8'))
const errors = []
const check = (condition, message) => { if (!condition) errors.push(message) }
async function exists(name) {
    try { await access(path.join(root, name)); return true } catch { return false }
}
async function markdownFiles(dir) {
    const files = []
    for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
        const name = path.posix.join(dir, entry.name)
        if (entry.isDirectory()) files.push(...await markdownFiles(name))
        else if (entry.name.endsWith('.md')) files.push(name)
    }
    return files
}
check(catalog.lessons.length === 16, 'Expected 16 course lessons')
check(new Set(catalog.lessons.map(lesson => lesson.id)).size === 16, 'Lesson IDs must be unique')
check(catalog.stages.length === 4, 'Expected four stages')
for (const lesson of catalog.lessons) {
    check(catalog.stages.some(stage => stage.id === lesson.stage), `${lesson.id}: unknown stage`)
    for (const name of [lesson.path, lesson.path.replace('/lessons/', '/solutions/')]) {
        if (!await exists(name)) { errors.push(`Missing ${name}`); continue }
        const text = await readFile(path.join(root, name), 'utf8')
        for (const letter of ['A', 'B', 'C']) {
            check(new RegExp(`^#{2,4}\\s+${lesson.id}-${letter}\\b`, 'm').test(text),
                `${name}: missing exercise heading ${lesson.id}-${letter}`)
        }
    }
}
for (const item of catalog.library) check(await exists(item.path), `Missing library page ${item.path}`)
const files = ['README.md', ...await markdownFiles('docs'), ...await markdownFiles('exercises')]
let localLinks = 0
for (const file of files) {
    const source = (await readFile(path.join(root, file), 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '')
    for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
        const href = match[1].trim().replace(/^<|>$/g, '').split(/\s+"/)[0]
        if (/^(https?:|mailto:|#)/.test(href)) continue
        const target = decodeURIComponent(href.split('#')[0])
        if (!target) continue
        localLinks++
        const resolved = path.resolve(root, path.dirname(file), target)
        check(resolved.startsWith(root), `${file}: link escapes repository: ${href}`)
        check(await exists(path.relative(root, resolved)), `${file}: broken link ${href}`)
    }
}
for (const id of ['01-typed-data', '02-validation', '03-async-order', '04-selectors', '05-polling', '06-diagnosis']) {
    for (const filename of ['README.md', 'starter.ts', 'solution.ts', 'exercise.test.ts']) {
        check(await exists(`exercises/${id}/${filename}`), `Missing practice file ${id}/${filename}`)
    }
}
if (errors.length) {
    console.error(`Course check failed (${errors.length}):\n${errors.map(error => `- ${error}`).join('\n')}`)
    process.exitCode = 1
} else {
    console.log(`Course check passed: 16 lessons, 48 exercise/solution pairs, 6 offline labs, ${files.length} Markdown files, ${localLinks} local links.`)
    console.log('This checks repository structure and local links, not external site availability or mobile behaviour.')
}
