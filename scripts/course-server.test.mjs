import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { headingSlug, findPractice } from '../course/practice.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const port = 24000 + Math.floor(Math.random() * 10000)
const origin = `http://127.0.0.1:${port}`
let server
before(async () => {
    server = spawn(process.execPath, ['scripts/course-server.mjs'], {
        cwd: root, env: { ...process.env, COURSE_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
    })
    await new Promise((resolve, reject) => {
        let output = ''
        const timeout = setTimeout(() => reject(new Error(`Course server did not start: ${output}`)), 8000)
        server.on('error', error => { clearTimeout(timeout); reject(error) })
        server.on('exit', code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${output}`)) })
        server.stderr.on('data', data => { output += data })
        server.stdout.on('data', data => {
            output += data
            if (output.includes(origin)) { clearTimeout(timeout); resolve() }
        })
    })
})
after(() => { server?.kill('SIGTERM') })
test('serves the dashboard, every lesson, matching solutions, and the whole library', async () => {
    const response = await fetch(origin)
    assert.equal(response.status, 200)
    assert.match(await response.text(), /Mobile Automation Lab/)
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/)
    const catalog = await (await fetch(`${origin}/api/catalog`)).json()
    assert.equal(catalog.lessons.length, 16)
    const pages = [...catalog.lessons.map(lesson => lesson.path),
        ...catalog.lessons.map(lesson => lesson.path.replace('/lessons/', '/solutions/')),
        ...catalog.library.map(item => item.path), 'vendor/README.md']
    for (const path of pages) {
        const page = await fetch(`${origin}/api/page?path=${encodeURIComponent(path)}`)
        assert.equal(page.status, 200, path)
        assert.match((await page.json()).html, /<h1>/, path)
    }
})
test('serves every reader module as JavaScript', async () => {
    for (const asset of ['app.js', 'progress.js', 'practice.js']) {
        const response = await fetch(`${origin}/${asset}`)
        assert.equal(response.status, 200, asset)
        assert.match(response.headers.get('content-type'), /text\/javascript/)
    }
})
test('every indexed case has a real page heading and body text is searchable', async () => {
    const catalog = await (await fetch(`${origin}/api/catalog`)).json()
    assert.equal(catalog.practice.length, 86)
    assert.equal(new Set(catalog.practice.map(entry => entry.id)).size, 86)
    for (const collection of catalog.practiceCollections) {
        const entries = catalog.practice.filter(entry => entry.category === collection.category)
        assert.equal(entries.length, collection.count)
        const page = await (await fetch(`${origin}/api/page?path=${collection.path}`)).json()
        const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }
        const headings = [...page.html.matchAll(/<h[1-4]>([\s\S]*?)<\/h[1-4]>/g)].map(match =>
            headingSlug(match[1].replace(/<[^>]*>/g, '').replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => entities[entity])))
        for (const entry of entries) assert.ok(headings.includes(entry.anchor), `${entry.id}: missing anchor`)
    }
    assert.ok(findPractice(catalog.practice, 'refresh', 'workplace').some(entry => entry.id === 'RW-22'))
    assert.ok(findPractice(catalog.practice, 'SQL', 'drill').some(entry => entry.id === 'D3'))
    assert.equal(findPractice(catalog.practice, 'Q48', 'interview')[0].id, 'Q48')
})
test('reads approved source as escaped code', async () => {
    const response = await fetch(`${origin}/api/page?path=test/screens/FormsScreen.ts`)
    assert.equal(response.status, 200)
    assert.match((await response.json()).html, /<pre><code>/)
})
test('refuses secrets, installed dependencies, traversal, and writes', async () => {
    for (const name of ['.env', '.env.example', 'node_modules/chai/package.json', 'docs/../../.zshrc', '/etc/passwd', 'docs/../.env',
        'vendor/appium-uiautomator2-driver-8.7.0-unbundled.tgz']) {
        const response = await fetch(`${origin}/api/page?path=${encodeURIComponent(name)}`)
        assert.ok([403, 404].includes(response.status), name)
    }
    assert.equal((await fetch(`${origin}/api/page?path=README.md`, { method: 'POST', body: 'overwrite' })).status, 405)
})
test('unknown routes and missing course pages return controlled errors', async () => {
    assert.equal((await fetch(`${origin}/private`)).status, 404)
    const response = await fetch(`${origin}/api/page?path=docs/not-a-page.md`)
    assert.equal(response.status, 404)
    assert.ok((await response.json()).error)
})
