import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCourse } from './build-course.mjs'
import { courseAssets, loadCatalog, loadPage } from './course-content.mjs'
import { createPreviewServer } from './course-preview.mjs'
import { createCourseClient } from '../course/data.js'

const root = fileURLToPath(new URL('../', import.meta.url))
let temporary, destination, origin, server, result
before(async () => {
    temporary = await mkdtemp(path.join(tmpdir(), 'course-static-test-'))
    destination = path.join(temporary, 'dist')
    result = await buildCourse({ root, destination })
    server = createPreviewServer(destination)
    await new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(0, '127.0.0.1', resolve)
    })
    origin = `http://127.0.0.1:${server.address().port}/`
})
after(async () => {
    if (server) await new Promise(resolve => server.close(resolve))
    if (temporary) await rm(temporary, { recursive: true, force: true })
})

test('static client loads every exported page over HTTP with the same content as localhost', async () => {
    const requests = []
    const client = createCourseClient({
        mode: 'static', baseUrl: origin,
        fetcher: url => { requests.push(url.pathname); return fetch(url) },
    })
    const catalog = await client.getCatalog()
    const local = await loadCatalog(root)
    const { pageFiles, ...exported } = catalog
    assert.deepEqual(exported, local)
    assert.equal(result.lessons, 16)
    assert.equal(result.practice, 100)
    for (const name of Object.keys(pageFiles)) {
        assert.deepEqual(await client.getPage(name), await loadPage(root, name), name)
    }
    for (const item of [...catalog.lessons, ...catalog.challenges, ...catalog.library, ...catalog.practice]) {
        assert.ok(Object.hasOwn(pageFiles, item.path), item.path)
    }
    assert.equal(requests.filter(name => name === '/data/catalog.json').length, 1)
    assert.ok(requests.every(name => name.startsWith('/data/')), 'Static hosting must not need Node API routes')
})

test('static preview serves browser modules and denies writes, private files, traversal and unknown routes', async () => {
    const index = await (await fetch(origin)).text()
    assert.match(index, /name="course-data-mode" content="static"/)
    assert.match(index, /src="\.\/app\.js"/)
    for (const asset of courseAssets.filter(name => name.endsWith('.js'))) {
        const response = await fetch(new URL(asset, origin))
        assert.equal(response.status, 200)
        assert.match(response.headers.get('content-type'), /text\/javascript/)
    }
    for (const name of ['.env', '.git/config', '.course-build.json', 'api/catalog', 'unknown.json', '%2e%2e%2fpackage.json']) {
        assert.equal((await fetch(new URL(name, origin))).status, 404, name)
    }
    assert.equal((await fetch(origin, { method: 'POST', body: 'overwrite' })).status, 405)
})

test('static client rejects unpublished files and identity mismatches without falling back to an API', async () => {
    const client = createCourseClient({ mode: 'static', baseUrl: origin })
    for (const name of ['.env', '.env.example', 'toString', '__proto__', '../README.md', 'docs/not-published.md']) {
        await assert.rejects(client.getPage(name), /not included/)
    }
    const asset = `data/pages/${'a'.repeat(64)}.json`
    const mismatch = createCourseClient({
        mode: 'static', baseUrl: origin,
        fetcher: async url => Response.json(url.pathname.endsWith('catalog.json')
            ? { pageFiles: { 'README.md': asset } } : { path: 'another.md', html: 'wrong page' }),
    })
    await assert.rejects(mismatch.getPage('README.md'), /identity/)
    const unsafe = createCourseClient({
        mode: 'static', baseUrl: origin,
        fetcher: async () => Response.json({ pageFiles: { 'README.md': 'https://example.org/private' } }),
    })
    await assert.rejects(unsafe.getPage('README.md'), /Invalid course page asset/)
})

test('reader requests remain relative under a hosting prefix and a failed catalog request can be retried', async () => {
    const requests = []
    let attempt = 0
    const client = createCourseClient({
        mode: 'static', baseUrl: 'https://example.org/academy/',
        fetcher: async url => {
            requests.push(url.href)
            return ++attempt === 1 ? new Response('Unavailable', { status: 503 }) : Response.json({ lessons: [] })
        },
    })
    await assert.rejects(client.getCatalog(), /503/)
    await client.getCatalog()
    assert.deepEqual(requests, ['https://example.org/academy/data/catalog.json', 'https://example.org/academy/data/catalog.json'])
    const local = createCourseClient({
        mode: 'local', baseUrl: 'http://127.0.0.1:4173/',
        fetcher: async url => { requests.push(url.href); return Response.json({}) },
    })
    await local.getPage('docs/lessons/00-orientation.md')
    assert.equal(new URL(requests.at(-1)).searchParams.get('path'), 'docs/lessons/00-orientation.md')
})

async function fixture() {
    const directory = await mkdtemp(path.join(temporary, 'source-'))
    await mkdir(path.join(directory, 'course'))
    await mkdir(path.join(directory, 'docs'))
    for (const asset of courseAssets) {
        await writeFile(path.join(directory, 'course', asset), await readFile(path.join(root, 'course', asset)))
    }
    await writeFile(path.join(directory, 'course/catalog.json'), JSON.stringify({
        lessons: [], library: [{ path: 'README.md' }], practiceCollections: [],
    }))
    await writeFile(path.join(directory, 'README.md'), '# Fixture course\n')
    await writeFile(path.join(directory, '.env'), 'CREDENTIAL=never-export-this')
    await writeFile(path.join(directory, 'mobile-automation-progress.json'), '{"notes":"private"}')
    await mkdir(path.join(directory, '.local-data/backups'), { recursive: true })
    await writeFile(path.join(directory, '.local-data/progress.sqlite'), 'PRIVATE DATABASE CONTENT')
    await writeFile(path.join(directory, '.local-data/backups/backup.json'), '{"notes":"private backup"}')
    await writeFile(path.join(directory, 'personal.sqlite'), 'PRIVATE DATABASE COPY')
    execFileSync('git', ['init', '--quiet'], { cwd: directory })
    execFileSync('git', ['add', '.'], { cwd: directory })
    await writeFile(path.join(directory, 'docs/untracked-notes.md'), 'Never publish this personal note')
    return directory
}

test('export excludes even tracked credentials and progress, plus untracked personal notes', async () => {
    const source = await fixture()
    const output = path.join(source, 'dist')
    await buildCourse({ root: source, destination: output })
    const catalog = JSON.parse(await readFile(path.join(output, 'data/catalog.json'), 'utf8'))
    assert.deepEqual(Object.keys(catalog.pageFiles), ['README.md'])
    assert.deepEqual((await readdir(output)).sort(), ['.course-build.json', ...courseAssets, 'data'].sort())
    const html = await readFile(path.join(output, catalog.pageFiles['README.md']), 'utf8')
    assert.doesNotMatch(html, /never-export-this|private|personal note/)
})

test('failed builds preserve the previous export and reject symlinked source or unrelated output', async () => {
    const source = await fixture()
    const output = path.join(source, 'dist')
    await buildCourse({ root: source, destination: output })
    const original = await readFile(path.join(output, 'data/catalog.json'), 'utf8')
    await rm(path.join(source, 'README.md'))
    await symlink(path.join(source, '.env'), path.join(source, 'README.md'))
    await assert.rejects(buildCourse({ root: source, destination: output }), /Symlinked/)
    assert.equal(await readFile(path.join(output, 'data/catalog.json'), 'utf8'), original)
    await mkdir(path.join(source, 'other'))
    await writeFile(path.join(source, 'other/keep.txt'), 'Keep my files')
    await assert.rejects(buildCourse({ root: source, destination: path.join(source, 'other') }), /Refusing to replace/)
    assert.equal(await readFile(path.join(source, 'other/keep.txt'), 'utf8'), 'Keep my files')
})

test('new catalog entries require staged source, and rebuilds remove obsolete generated pages', async () => {
    const source = await fixture()
    const output = path.join(source, 'dist')
    await buildCourse({ root: source, destination: output })
    await writeFile(path.join(output, 'obsolete.json'), '{"old":"content"}')
    await buildCourse({ root: source, destination: output })
    await assert.rejects(readFile(path.join(output, 'obsolete.json')), { code: 'ENOENT' })
    const catalog = JSON.parse(await readFile(path.join(source, 'course/catalog.json'), 'utf8'))
    catalog.library.push({ path: 'docs/untracked-notes.md' })
    await writeFile(path.join(source, 'course/catalog.json'), JSON.stringify(catalog))
    await assert.rejects(buildCourse({ root: source, destination: output }), /Stage the new course file/)
})
