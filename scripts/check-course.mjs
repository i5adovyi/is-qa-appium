import { readFile, readdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { indexCollection } from './course-index.mjs'
import { headingSlug } from '../course/practice.js'

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
check(catalog.challenges?.length === 12, 'Expected 12 real-world challenges')
check(catalog.challengeStages?.length === 4, 'Expected four challenge stages')
const allProgressIds = [...catalog.lessons, ...(catalog.challenges ?? [])].map(item => item.id)
check(new Set(allProgressIds).size === allProgressIds.length, 'Lesson and challenge progress IDs must not collide')
for (const [index, challenge] of (catalog.challenges ?? []).entries()) {
    check(challenge.id === `CH-${String(index + 1).padStart(2, '0')}`, 'Challenge IDs must be stable and sequential')
    check(catalog.challengeStages.some(stage => stage.id === challenge.stage), `${challenge.id}: unknown stage`)
    check(Boolean(challenge.requirements && challenge.deliverable), `${challenge.id}: missing prerequisites or deliverable`)
    if (!await exists(challenge.path)) { errors.push(`Missing ${challenge.path}`); continue }
    const source = await readFile(path.join(root, challenge.path), 'utf8')
    for (const heading of ['Prerequisites', 'Assignment', 'Acceptance criteria', 'Evidence and review']) {
        check(source.includes(`## ${heading}`), `${challenge.id}: missing ${heading}`)
    }
}
for (const item of catalog.library) check(await exists(item.path), `Missing library page ${item.path}`)
const assignments = catalog.assignments ?? []
const topics = catalog.assignmentTopics ?? []
const levels = catalog.assignmentLevels ?? []
const environments = catalog.assignmentEnvironments ?? []
check(assignments.length === 24, 'Expected 24 topic assignments')
check(topics.length === 8 && new Set(topics.map(item => item.id)).size === 8, 'Expected eight unique assignment topics')
check(JSON.stringify(levels.map(item => item.id)) === '["L1","L2","L3"]', 'Assignment levels must be L1, L2 and L3')
check(new Set(environments.map(item => item.id)).size === environments.length, 'Assignment environments must be unique')
for (const topic of topics) {
    for (const level of levels) {
        check(assignments.filter(item => item.topic === topic.id && item.level === level.id).length === 1,
            `${topic.id}: expected one ${level.id} assignment`)
    }
}
for (const [index, item] of assignments.entries()) {
    check(item.id === `AS-${String(index + 1).padStart(2, '0')}`, 'Assignment IDs must be unique and sequential')
    check(!allProgressIds.includes(item.id), `${item.id}: assignments must not reuse progress IDs`)
    for (const [collection, key] of [[topics, 'topic'], [levels, 'level'], [environments, 'environment']]) {
        check(collection.some(entry => entry.id === item[key]), `${item.id}: unknown ${key}`)
    }
    for (const key of ['title', 'summary', 'app', 'duration', 'deliverable']) {
        check(typeof item[key] === 'string' && item[key].trim().length > 0, `${item.id}: missing ${key}`)
    }
    check(Array.isArray(item.prerequisites) && item.prerequisites.length > 0 && item.prerequisites.every(value => typeof value === 'string' && value.trim()),
        `${item.id}: missing prerequisites`)
    if (typeof item.path !== 'string' || !/^docs\/assignments\/[^/]+\.md$/.test(item.path) || !await exists(item.path)) {
        errors.push(`${item.id}: missing or invalid assignment page`)
        continue
    }
    const source = await readFile(path.join(root, item.path), 'utf8')
    const heading = `## ${item.id} · ${item.title}`
    check(source.split('\n').includes(heading), `${item.id}: catalog title must match the ticket heading`)
    check(item.anchor === headingSlug(`${item.id} · ${item.title}`), `${item.id}: invalid heading anchor`)
    const block = source.split(heading)[1]?.split(/^## /m)[0] ?? ''
    for (const section of ['Prerequisites', 'Assignment', 'Acceptance criteria', 'Changed condition', 'Evidence and review']) {
        check(block.includes(`### ${section}`), `${item.id}: missing ${section}`)
    }
    check(block.includes('<details>') && block.includes('</details>'), `${item.id}: missing hidden hint/review`)
}
let indexedItems = 0
const practiceIds = new Set()
for (const collection of catalog.practiceCollections) {
    check(catalog.library.some(item => item.path === collection.path), `Practice collection missing from library: ${collection.path}`)
    const entries = indexCollection(collection, await readFile(path.join(root, collection.path), 'utf8'))
    check(entries.length === collection.count, `${collection.path}: expected ${collection.count} indexed items`)
    entries.forEach((entry, index) => {
        check(!practiceIds.has(entry.id), `Duplicate practice ID: ${entry.id}`)
        practiceIds.add(entry.id)
        check(Number(entry.id.slice(collection.prefix.length)) === index + 1, `${collection.path}: nonsequential ID ${entry.id}`)
    })
    indexedItems += entries.length
}
const files = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'vendor/README.md', ...await markdownFiles('docs'), ...await markdownFiles('exercises')]
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
const labs = ['01-typed-data', '02-validation', '03-async-order', '04-selectors', '05-polling',
    '06-diagnosis', '07-session-plan', '08-fixture-cleanup', '09-run-summary', '10-api-contract',
    '11-fixture-isolation', '12-uncertain-submit', '13-stale-observation', '14-bounded-scroll']
for (const id of labs) {
    for (const filename of ['README.md', 'starter.ts', 'solution.ts', 'exercise.test.ts']) {
        check(await exists(`exercises/${id}/${filename}`), `Missing practice file ${id}/${filename}`)
    }
}
if (errors.length) {
    console.error(`Course check failed (${errors.length}):\n${errors.map(error => `- ${error}`).join('\n')}`)
    process.exitCode = 1
} else {
    console.log(`Course check passed: 16 lessons, 48 exercise/solution pairs, ${labs.length} offline labs, ${files.length} Markdown files, ${localLinks} local links.`)
    console.log(`${catalog.challenges.length} real-world challenges; ${indexedItems} workplace/interview items indexed with unique, sequential IDs.`)
    console.log(`${assignments.length} topic assignments across ${topics.length} topics and ${levels.length} difficulty levels; ticket anchors and required sections checked.`)
    console.log('This checks repository structure and local links, not external site availability or mobile behaviour.')
}
