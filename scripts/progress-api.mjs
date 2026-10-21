import { randomBytes, timingSafeEqual } from 'node:crypto'
import { MAX_PROGRESS_BYTES, ProgressError } from './progress-store.mjs'

function send(res, status, value) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    })
    res.end(JSON.stringify(value))
}

function readJson(req) {
    if (req.headers['content-length'] !== undefined
        && (!/^\d+$/.test(req.headers['content-length'])
            || Number(req.headers['content-length']) > MAX_PROGRESS_BYTES)) {
        req.resume()
        return Promise.reject(new ProgressError('Progress request exceeds 4 MiB.', 413))
    }
    return new Promise((resolve, reject) => {
        let bytes = 0
        const chunks = []
        const cleanup = () => {
            req.off('data', data)
            req.off('end', end)
            req.off('error', failed)
            req.off('aborted', aborted)
        }
        const failed = () => {
            cleanup()
            reject(new ProgressError('The progress request could not be read.'))
        }
        const aborted = () => failed()
        const data = chunk => {
            bytes += chunk.length
            if (bytes > MAX_PROGRESS_BYTES) {
                cleanup()
                req.resume()
                reject(new ProgressError('Progress request exceeds 4 MiB.', 413))
            } else chunks.push(chunk)
        }
        const end = () => {
            cleanup()
            try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
            catch { reject(new ProgressError('The progress request must contain valid JSON.')) }
        }
        req.on('data', data)
        req.on('end', end)
        req.on('error', failed)
        req.on('aborted', aborted)
    })
}

export function createProgressApi({ store, origin }) {
    const expected = new URL(origin)
    if (expected.origin !== origin || expected.protocol !== 'http:'
        || !['127.0.0.1', 'localhost', '[::1]'].includes(expected.hostname)) {
        throw new Error('Progress API requires an exact loopback HTTP origin.')
    }
    const writeToken = randomBytes(32).toString('hex')
    const tokenBytes = Buffer.from(writeToken)
    return async (req, res) => {
        let pathname
        try { pathname = new URL(req.url, origin).pathname } catch { return false }
        if (pathname !== '/api/progress') return false
        try {
            if (req.headers.host !== expected.host
                || (req.headers.origin !== undefined && req.headers.origin !== origin)
                || (req.headers['sec-fetch-site'] !== undefined
                    && !['same-origin', 'none'].includes(req.headers['sec-fetch-site']))) {
                throw new ProgressError('Progress is available only from this local course address.', 403)
            }
            if (req.method === 'GET') {
                send(res, 200, { ...store.read(), writeToken, progressProtocol: 2 })
            } else if (req.method === 'PUT') {
                const supplied = Buffer.from(typeof req.headers['x-course-token'] === 'string'
                    ? req.headers['x-course-token'] : '')
                if (req.headers.origin !== origin || supplied.length !== tokenBytes.length
                    || !timingSafeEqual(supplied, tokenBytes)) {
                    throw new ProgressError('Open this local course before saving progress.', 403)
                }
                if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] ?? '')
                    || (req.headers['content-encoding'] && req.headers['content-encoding'] !== 'identity')) {
                    throw new ProgressError('Progress updates require an uncompressed application/json body.', 415)
                }
                // Pre-challenge readers filter unknown IDs out of full-record saves.
                // Reject those writers even when they hold the latest revision.
                if (req.headers['x-course-progress-version'] !== '2') {
                    throw new ProgressError('Export your draft and reload the reader before saving challenge progress.', 426)
                }
                const value = await readJson(req)
                if (!value || typeof value !== 'object' || Array.isArray(value)) {
                    throw new ProgressError('A progress object and revision are required.')
                }
                if (value.databaseId !== store.databaseId) {
                    throw new ProgressError('This progress database changed. Reload before saving.', 409, store.read())
                }
                send(res, 200, store.write(value.progress, value.revision, value.databaseId))
            } else {
                send(res, 405, { error: 'Only GET and PUT are supported for progress.' })
            }
        } catch (error) {
            if (error instanceof ProgressError) {
                send(res, error.status, { error: error.message, ...(error.latest ? { latest: error.latest } : {}) })
            } else {
                send(res, 500, { error: 'Progress could not be saved or read. Keep a JSON export and check the local server.' })
            }
        }
        return true
    }
}
