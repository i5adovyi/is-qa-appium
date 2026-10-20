#!/usr/bin/env node
import { downloadApp, verifyApp, appPath } from './lib/demo-app.ts'

try {
    const args = process.argv.slice(2)
    if (args.length && !(args.length === 1 && args[0] === '--verify')) {
        throw new Error('Usage: npm run app:download or npm run app:verify')
    }
    if (args[0] === '--verify') await verifyApp(appPath)
    else {
        console.log('Downloading demo APK; the existing file is kept until SHA-256 verification passes.')
        await downloadApp()
    }
    console.log('Demo APK SHA-256 and size verified.')
} catch (error) {
    console.error(`Demo APK: ${error.message}`)
    process.exitCode = 1
}
