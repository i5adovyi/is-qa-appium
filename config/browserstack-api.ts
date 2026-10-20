import { openAsBlob } from 'node:fs'
import path from 'node:path'
import { verifyApp, demoApp, type AppArtifact } from '../scripts/lib/demo-app.ts'

export function credential(name: string): string {
    const value = process.env[name]?.trim()
    if (!value || /^(your[_ -]|paste[_ -]|replace[_ -]|changeme|<)/i.test(value)) {
        throw new Error(`Set a real ${name} in .env or your CI secrets (see .env.example).`)
    }
    return value
}

export async function uploadApp(
    file: string, user: string, key: string,
    request: typeof fetch = fetch, artifact: AppArtifact = demoApp,
): Promise<string> {
    await verifyApp(file, artifact)
    const form = new FormData()
    form.set('file', await openAsBlob(file, { type: 'application/vnd.android.package-archive' }), path.basename(file))
    let response: Response
    try {
        response = await request('https://api-cloud.browserstack.com/app-automate/upload', {
            method: 'POST',
            headers: { Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}` },
            body: form,
            redirect: 'error',
            signal: AbortSignal.timeout(120_000),
        })
    } catch {
        // Do not expose request objects, provider bodies, or credential-bearing errors.
        throw new Error('BrowserStack upload failed: network, redirect, or timeout error.')
    }
    if (!response.ok) throw new Error(`BrowserStack upload failed (HTTP ${response.status}). Check account access and credentials.`)
    const data = await response.json().catch(() => null) as { app_url?: unknown } | null
    if (!data || typeof data.app_url !== 'string' || !/^bs:\/\/[a-f0-9]+$/i.test(data.app_url)) {
        throw new Error('BrowserStack upload did not return a valid app_url.')
    }
    return data.app_url
}

export function sessionStatusCommand(result: number): string {
    return `browserstack_executor: ${JSON.stringify({
        action: 'setSessionStatus',
        arguments: {
            status: result === 0 ? 'passed' : 'failed',
            reason: result === 0 ? 'All tests in this session passed.' : 'Test or hook failure; inspect the WebdriverIO output.',
        },
    })}`
}
