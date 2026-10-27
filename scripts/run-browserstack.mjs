#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { credential, uploadApp } from '../config/browserstack-api.ts'
import { appPath } from './lib/demo-app.ts'

export async function runBrowserStack(args, upload = uploadApp, launch = spawnSync) {
    const user = credential('BROWSERSTACK_USERNAME')
    const key = credential('BROWSERSTACK_ACCESS_KEY')
    const appUrl = await upload(appPath, user, key)
    // Resolve once in the parent so all worker/spec imports share one build.
    const buildName = process.env.BROWSERSTACK_BUILD_NAME?.trim()
        || `training-${new Date().toISOString()}-${randomUUID().slice(0, 8)}`
    console.log('Verified demo APK uploaded. Starting BrowserStack tests.')
    const result = launch(process.execPath, [
        fileURLToPath(new URL('../node_modules/@wdio/cli/bin/wdio.js', import.meta.url)),
        'run', 'config/wdio.browserstack.conf.ts', ...args,
    ], {
        cwd: fileURLToPath(new URL('..', import.meta.url)),
        stdio: 'inherit',
        env: { ...process.env, BROWSERSTACK_APP_URL: appUrl, BROWSERSTACK_BUILD_NAME: buildName },
    })
    return result.status ?? 1
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
    try {
        try { process.loadEnvFile() } catch (error) { if (error.code !== 'ENOENT') throw error }
        process.exitCode = await runBrowserStack(process.argv.slice(2))
    } catch (error) {
        console.error(error.message)
        process.exitCode = 1
    }
}
