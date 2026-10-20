/**
 * Local run: Appium server (started automatically by @wdio/appium-service)
 * + Android emulator running on your Mac.
 *
 *   npm run test:android
 */
import path from 'node:path'
import { config as shared } from './wdio.shared.conf.js'

export const config: WebdriverIO.Config = {
    ...shared,

    port: 4723,
    // Starts the Appium from node_modules before the run; server log goes to ./logs/wdio-appium.log
    services: [['appium', { logPath: './logs' }]],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            // With a single emulator running, the name is informational.
            'appium:deviceName': 'Android Emulator',
            'appium:app': path.resolve('apps/wdio-demo.apk'),
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 240,
        },
    ],
}
