/**
 * Cloud run on real devices in BrowserStack App Automate.
 * npm run test:bs verifies/uploads the APK before starting WebdriverIO.
 *
 *   npm run test:bs   (credentials from .env — see .env.example)
 */
import { config as shared } from './wdio.shared.conf.js'
import fs from 'node:fs'
import path from 'node:path'
import { credential, sessionStatusCommand } from './browserstack-api.ts'

const user = credential('BROWSERSTACK_USERNAME')
const key = credential('BROWSERSTACK_ACCESS_KEY')
const app = path.resolve('apps/wdio-demo.apk')
if (!fs.existsSync(app)) throw new Error('Demo APK is missing. Run npm run app:download.')
const appUrl = process.env.BROWSERSTACK_APP_URL
if (!appUrl || !/^bs:\/\/[a-f0-9]+$/i.test(appUrl)) {
    throw new Error('Run npm run test:bs so the verified APK is uploaded before session creation.')
}
const buildName = process.env.BROWSERSTACK_BUILD_NAME || `training-${new Date().toISOString()}`

// Real devices to run on — pick names from https://www.browserstack.com/list-of-browsers-and-platforms/app_automate
const devices = [
    {
        deviceName: process.env.BROWSERSTACK_DEVICE_NAME || 'Samsung Galaxy S24',
        platformVersion: process.env.BROWSERSTACK_PLATFORM_VERSION || '14.0',
    },
]

export const config: WebdriverIO.Config = {
    ...shared,

    user,
    key,
    hostname: 'hub.browserstack.com',
    protocol: 'https',
    port: 443,
    path: '/wd/hub',

    services: [],

    after: async function (result) {
        try {
            await driver.execute(sessionStatusCommand(result))
        } catch {
            console.warn('[BrowserStack] Could not report session status; inspect the runner result and cloud dashboard.')
        }
    },

    // Start with one device and one session at a time; cloud tests use account minutes.
    maxInstances: 1,
    capabilities: devices.map((device) => ({
        platformName: 'Android',
        'appium:app': appUrl,
        'appium:automationName': 'UiAutomator2',
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
        'bstack:options': {
            ...device,
            projectName: 'is-qa-appium',
            buildName,
            debug: true, // screenshot for every command in the dashboard
            networkLogs: false, // enable intentionally when investigating network behavior
        },
    })),
}
