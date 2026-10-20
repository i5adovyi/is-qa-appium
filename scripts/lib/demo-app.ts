import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream, readFileSync } from 'node:fs'
import { mkdir, mkdtemp, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

export interface AppArtifact {
    url: string
    sha256: string
    size: number
}

export const demoApp: AppArtifact = JSON.parse(readFileSync(new URL('../../apps/demo-app.json', import.meta.url), 'utf8'))
export const appPath = fileURLToPath(new URL('../../apps/wdio-demo.apk', import.meta.url))

export async function verifyApp(file: string, artifact: AppArtifact = demoApp): Promise<void> {
    const hash = createHash('sha256')
    let size = 0
    for await (const chunk of createReadStream(file)) {
        size += chunk.length
        hash.update(chunk)
    }
    if (size !== artifact.size || hash.digest('hex') !== artifact.sha256) {
        throw new Error('APK checksum/size mismatch. Run npm run app:download; do not bypass verification.')
    }
}

// The expected digest is committed, never fetched alongside a download and trusted automatically.
export async function downloadApp(
    destination: string = appPath,
    artifact: AppArtifact = demoApp,
    request: typeof fetch = fetch,
    signal: AbortSignal = AbortSignal.timeout(120_000),
): Promise<void> {
    if (!/^[a-f0-9]{64}$/.test(artifact.sha256) || !Number.isSafeInteger(artifact.size) || artifact.size <= 0) {
        throw new Error('Invalid APK checksum manifest.')
    }
    await mkdir(path.dirname(destination), { recursive: true })
    const staging = await mkdtemp(path.join(path.dirname(destination), '.apk-download-'))
    const temporary = path.join(staging, 'download.apk')
    try {
        let url = new URL(artifact.url)
        let response: Response | undefined
        for (let redirects = 0; redirects <= 5; redirects++) {
            if (url.protocol !== 'https:') throw new Error('APK downloads and redirects must use HTTPS.')
            response = await request(url, { redirect: 'manual', signal })
            if (![301, 302, 303, 307, 308].includes(response.status)) break
            await response.body?.cancel()
            const location = response.headers.get('location')
            if (!location || redirects === 5) throw new Error('Invalid or excessive APK redirects.')
            url = new URL(location, url)
        }
        if (!response?.ok || !response.body) throw new Error(`APK download failed (HTTP ${response?.status}).`)
        let received = 0
        const limit = new Transform({
            transform(chunk, _encoding, done) {
                received += chunk.length
                done(received > artifact.size ? new Error('APK download exceeds expected size.') : null, chunk)
            },
        })
        await pipeline(Readable.fromWeb(response.body), limit, createWriteStream(temporary, { flags: 'wx' }), { signal })
        await verifyApp(temporary, artifact)
        // Same-filesystem rename happens only after verification; failures preserve the existing APK.
        await rename(temporary, destination)
    } finally {
        await rm(staging, { recursive: true, force: true })
    }
}
