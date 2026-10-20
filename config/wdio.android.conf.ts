/**
 * Local run: Appium server (started automatically by @wdio/appium-service)
 * + Android emulator running on your Mac.
 *
 *   npm run test:android
 */
import path from 'node:path'
import fs from 'node:fs'
import { config as shared } from './wdio.shared.conf.js'

const app = path.resolve('apps/wdio-demo.apk')
const udid = process.env.ANDROID_UDID?.trim()
if (!fs.existsSync(app)) {
    throw new Error('Demo APK is missing. Run npm run app:download before mobile tests.')
}

export const config: WebdriverIO.Config = {
    ...shared,

    port: 4723,
    // Starts the Appium from node_modules before the run; server log goes to ./logs/wdio-appium.log
    services: [['appium', { logPath: './logs', args: { address: '127.0.0.1', port: 4723 } }]],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            // With a single emulator running, the name is informational.
            'appium:deviceName': 'Android Emulator',
            ...(udid ? { 'appium:udid': udid } : {}),
            'appium:app': app,
            'appium:noReset': false,
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 240,
        },
    ],
}
