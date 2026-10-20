import http from 'node:http'
import path from 'node:path'
import { readFile, realpath, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const root = fileURLToPath(new URL('../', import.meta.url))
const port = Number(process.env.COURSE_PORT ?? 4173)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('COURSE_PORT must be an integer from 1 to 65535')
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const allowedRootFiles = new Set(['README.md', 'package.json', 'tsconfig.json', 'tsconfig.practice.json', 'vendor/README.md'])
function allowedPage(name) {
    if (allowedRootFiles.has(name)) return true
    if (/^(docs|exercises)\//.test(name)) return /\.(md|ts)$/.test(name)
    return /^(test|config|scripts|\.github\/workflows)\//.test(name) && /\.(ts|mjs|ya?ml)$/.test(name)
}
async function readWithinRoot(name) {
    if (name.includes('\\') || name.split('/').includes('..') || path.isAbsolute(name)) throw new Error('Invalid path')
    const resolved = await realpath(path.join(root, name))
    if (!resolved.startsWith(root)) throw new Error('Invalid path')
    if (resolved !== path.resolve(root, name)) throw new Error('Symlinked files are not served')
    if (!(await stat(resolved)).isFile()) throw new Error('Not a file')
    return readFile(resolved, 'utf8')
}
function send(res, status, body, contentType = 'application/json') {
    res.writeHead(status, {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    })
    res.end(body)
}
const server = http.createServer(async (req, res) => {
    try {
        if (req.method !== 'GET') return send(res, 405, '{"error":"Read-only server"}')
        const url = new URL(req.url, `http://127.0.0.1:${port}`)
        if (url.pathname === '/api/catalog') return send(res, 200, await readWithinRoot('course/catalog.json'))
        if (url.pathname === '/api/page') {
            const name = url.searchParams.get('path') ?? ''
            if (!allowedPage(name)) return send(res, 403, '{"error":"This file is outside the course library."}')
            const source = await readWithinRoot(name)
            const html = name.endsWith('.md')
                ? marked.parse(source, { gfm: true })
                : `<h1>${escape(path.basename(name))}</h1><pre><code>${escape(source)}</code></pre>`
            return send(res, 200, JSON.stringify({ path: name, html }))
        }
        const assets = { '/': 'index.html', '/app.js': 'app.js', '/progress.js': 'progress.js', '/style.css': 'style.css' }
        const asset = assets[url.pathname]
        if (!asset) return send(res, 404, '{"error":"Not found"}')
        return send(res, 200, await readWithinRoot(`course/${asset}`), mime[path.extname(asset)])
    } catch {
        send(res, 404, '{"error":"The requested course file could not be read. Check its path."}')
    }
})
server.on('error', error => {
    console.error(error.code === 'EADDRINUSE'
        ? `Port ${port} is already in use. Open the existing course or set COURSE_PORT to a different port.`
        : error.message)
    process.exitCode = 1
})
server.listen(port, '127.0.0.1', () => {
    console.log(`\nMobile Automation Lab → http://127.0.0.1:${port}\nRead-only local reader. Progress is saved in this browser only.\nCtrl+C stops the reader; Markdown lessons remain available in your editor.\n`)
})
