import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { allowedPage, courseAssets, loadCatalog, loadPage, readWithinRoot } from './course-content.mjs'
import { defaultProgressDirectory, openProgressStore } from './progress-store.mjs'
import { createProgressApi } from './progress-api.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const port = Number(process.env.COURSE_PORT ?? 4173)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('COURSE_PORT must be an integer from 1 to 65535')
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }
const catalog = await loadCatalog(root)
const progressStore = openProgressStore({ directory: defaultProgressDirectory(root), lessonIds: catalog.lessons.map(lesson => lesson.id) })
const progressApi = createProgressApi({ store: progressStore, origin: `http://127.0.0.1:${port}` })
let storeClosed = false
function closeStore() {
    if (!storeClosed) { storeClosed = true; progressStore.close() }
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
        if (await progressApi(req, res)) return
        if (req.method !== 'GET') return send(res, 405, '{"error":"Read-only server"}')
        const url = new URL(req.url, `http://127.0.0.1:${port}`)
        if (url.pathname === '/api/catalog') {
            return send(res, 200, JSON.stringify(await loadCatalog(root)))
        }
        if (url.pathname === '/api/page') {
            const name = url.searchParams.get('path') ?? ''
            if (!allowedPage(name)) return send(res, 403, '{"error":"This file is outside the course library."}')
            return send(res, 200, JSON.stringify(await loadPage(root, name)))
        }
        const assets = Object.fromEntries(courseAssets.map(name => [`/${name}`, name]))
        assets['/'] = 'index.html'
        const asset = assets[url.pathname]
        if (!asset) return send(res, 404, '{"error":"Not found"}')
        return send(res, 200, await readWithinRoot(root, `course/${asset}`), mime[path.extname(asset)])
    } catch {
        send(res, 404, '{"error":"The requested course file could not be read. Check its path."}')
    }
})
server.on('error', error => {
    console.error(error.code === 'EADDRINUSE'
        ? `Port ${port} is already in use. Open the existing course or set COURSE_PORT to a different port.`
        : error.message)
    process.exitCode = 1
    closeStore()
})
server.on('close', closeStore)
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { server.close(); server.closeIdleConnections() })
server.listen(port, '127.0.0.1', () => {
    console.log(`\nMobile Automation Lab → http://127.0.0.1:${port}\nRead-only course files. Progress and notes save to ${progressStore.filePath}.\nCtrl+C stops the reader; saved progress remains on this computer.\n`)
})
