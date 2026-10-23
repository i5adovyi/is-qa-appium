/** Optional local Android assignments. Use npm run test:training with an app and explicit spec. */
import { config as shared } from './wdio.shared.conf.js'
import { getTrainingApp, trainingAppPath, trainingSpecPath, verifyTrainingApp } from '../scripts/lib/training-apps.ts'

const id = process.env.TRAINING_APP_ID ?? ''
const app = getTrainingApp(id)
const spec = trainingSpecPath(id, process.env.TRAINING_SPEC)
await verifyTrainingApp(id)
const udid = process.env.ANDROID_UDID?.trim()

export const config: WebdriverIO.Config = {
    ...shared,
    specs: [spec],
    port: 4723,
    services: [['appium', { logPath: './logs', args: { address: '127.0.0.1', port: 4723 } }]],
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Training Device',
        ...(udid ? { 'appium:udid': udid } : {}),
        'appium:app': trainingAppPath(id),
        'appium:appPackage': app.package,
        'appium:appActivity': app.activity,
        'appium:appWaitActivity': app.waitActivity,
        'appium:noReset': false,
        // Permission prompts are part of device assignments, not silently granted.
        'appium:autoGrantPermissions': false,
        'appium:newCommandTimeout': 240,
    }],
}
