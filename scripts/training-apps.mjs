#!/usr/bin/env node
import { trainingApps, getTrainingApp, downloadTrainingApp, verifyTrainingApp } from './lib/training-apps.ts'

try {
    const [command = 'list', id, ...extra] = process.argv.slice(2)
    if (command === 'list' && !id && !extra.length) {
        for (const [key, app] of Object.entries(trainingApps)) {
            console.log(`${key}: ${app.name} ${app.version} (${app.size.toLocaleString('en-US')} bytes)`)
        }
        console.log('Optional downloads only. Usage: npm run training:apps -- download|verify <app>')
        console.log('Read docs/handbook/training-apps.md before starting an app on your test device.')
    } else if (['download', 'verify'].includes(command) && id && !extra.length) {
        const app = getTrainingApp(id)
        if (command === 'download') await downloadTrainingApp(id)
        else await verifyTrainingApp(id)
        console.log(`${app.name} ${app.version}: pinned SHA-256 and byte size verified. No device session was started.`)
    } else {
        throw new Error('Usage: npm run training:apps -- list | download <app> | verify <app>')
    }
} catch (error) {
    console.error(`Training apps: ${error.message}`)
    process.exitCode = 1
}
