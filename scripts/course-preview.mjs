import http from 'node:http'
import path from 'node:path'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { readWithinRoot } from './course-content.mjs'

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }

export function createPreviewServer(directory) {
    return http.createServer(async (req, res) => {
        const reply = (status, body, type = 'text/plain') => {
            res.writeHead(status, {
                'Content-Type': `${type}; charset=utf-8`,
                'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
            })
            res.end(body)
        }
        if (req.method !== 'GET') return reply(405, 'Read-only course')
        try {
            const name = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname).slice(1) || 'index.html'
            if (name.split('/').some(part => part.startsWith('.')) || !mime[path.extname(name)]) return reply(404, 'Not found')
            reply(200, await readWithinRoot(directory, name), mime[path.extname(name)])
        } catch {
            reply(404, 'Not found')
        }
    })
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const directory = fileURLToPath(new URL('../dist/', import.meta.url))
    try {
        await access(path.join(directory, 'index.html'))
        const port = Number(process.env.COURSE_PORT ?? 4174)
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('COURSE_PORT must be an integer from 1 to 65535')
        const server = createPreviewServer(directory)
        server.on('error', error => {
            console.error(error.code === 'EADDRINUSE'
                ? `Port ${port} is already in use. Set COURSE_PORT to a free port; see docs/handbook/hosting.md.`
                : error.message)
            process.exitCode = 1
        })
        server.listen(port, '127.0.0.1', () => console.log(`Static course preview → http://127.0.0.1:${port}\nRebuild after edits with npm run course:build. Ctrl+C stops this preview.`))
    } catch (error) {
        console.error(error.code === 'ENOENT' ? 'Build the course first: npm run course:build' : error.message)
        process.exitCode = 1
    }
}
