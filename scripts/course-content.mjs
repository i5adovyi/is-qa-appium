import path from 'node:path'
import { readFile, realpath, stat } from 'node:fs/promises'
import { marked } from 'marked'
import { indexCollection } from './course-index.mjs'

export const courseAssets = ['index.html', 'app.js', 'data.js', 'progress.js', 'progress-storage.js', 'practice.js', 'style.css']
const rootFiles = new Set(['README.md', 'AGENTS.md', 'CLAUDE.md', 'package.json', 'tsconfig.json', 'tsconfig.practice.json', 'vendor/README.md'])
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function allowedPage(name) {
    if (rootFiles.has(name)) return true
    if (/^(docs|exercises)\//.test(name)) return /\.(md|ts)$/.test(name)
    return /^(test|config|scripts|\.github\/workflows)\//.test(name) && /\.(ts|mjs|ya?ml)$/.test(name)
}

export async function readWithinRoot(root, name) {
    if (name.includes('\\') || name.split('/').includes('..') || path.isAbsolute(name)) throw new Error('Invalid path')
    const base = await realpath(root)
    const expected = path.resolve(base, name)
    const resolved = await realpath(expected)
    if (!resolved.startsWith(`${base}${path.sep}`) || resolved !== expected) throw new Error('Symlinked or outside files are not served')
    if (!(await stat(resolved)).isFile()) throw new Error('Not a file')
    return readFile(resolved, 'utf8')
}

export async function loadCatalog(root) {
    const catalog = JSON.parse(await readWithinRoot(root, 'course/catalog.json'))
    const groups = await Promise.all(catalog.practiceCollections.map(async collection => {
        if (!allowedPage(collection.path)) throw new Error('Invalid practice collection')
        return indexCollection(collection, await readWithinRoot(root, collection.path))
    }))
    return { ...catalog, practice: groups.flat() }
}

export async function loadPage(root, name) {
    if (!allowedPage(name)) throw new Error('This file is outside the course library.')
    const source = await readWithinRoot(root, name)
    const html = name.endsWith('.md')
        ? marked.parse(source, { gfm: true })
        : `<h1>${escape(path.basename(name))}</h1><pre><code>${escape(source)}</code></pre>`
    return { path: name, html }
}
