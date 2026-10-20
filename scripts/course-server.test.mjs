import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

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
        ...catalog.library.map(item => item.path)]
    for (const path of pages) {
        const page = await fetch(`${origin}/api/page?path=${encodeURIComponent(path)}`)
        assert.equal(page.status, 200, path)
        assert.match((await page.json()).html, /<h1>/, path)
    }
})
test('serves both reader modules as JavaScript', async () => {
    for (const asset of ['app.js', 'progress.js']) {
        const response = await fetch(`${origin}/${asset}`)
        assert.equal(response.status, 200, asset)
        assert.match(response.headers.get('content-type'), /text\/javascript/)
    }
})
test('reads approved source as escaped code', async () => {
    const response = await fetch(`${origin}/api/page?path=test/screens/FormsScreen.ts`)
    assert.equal(response.status, 200)
    assert.match((await response.json()).html, /<pre><code>/)
})
test('refuses secrets, installed dependencies, traversal, and writes', async () => {
    for (const name of ['.env', '.env.example', 'node_modules/chai/package.json', 'docs/../../.zshrc', '/etc/passwd', 'docs/../.env']) {
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
