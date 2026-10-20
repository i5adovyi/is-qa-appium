/**
 * Cloud run on real devices in BrowserStack App Automate.
 * The service uploads apps/wdio-demo.apk automatically and points the session at it.
 *
 *   npm run test:bs   (credentials from .env — see .env.example)
 */
import { config as shared } from './wdio.shared.conf.js'
import fs from 'node:fs'
import path from 'node:path'

function credential(name: string) {
    const value = process.env[name]?.trim()
    if (!value || /^(your[_ -]|paste[_ -]|replace[_ -]|changeme|<)/i.test(value)) {
        throw new Error(`Set a real ${name} in .env or your CI secrets (see .env.example).`)
    }
    return value
}

const user = credential('BROWSERSTACK_USERNAME')
const key = credential('BROWSERSTACK_ACCESS_KEY')
const app = path.resolve('apps/wdio-demo.apk')
if (!fs.existsSync(app)) throw new Error('Demo APK is missing. Run npm run app:download.')
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

    services: [
        [
            'browserstack',
            {
                app,
                browserstackLocal: false,
                testObservability: false,
                percy: false,
            },
        ],
    ],

    // Start with one device and one session at a time; cloud tests use account minutes.
    maxInstances: 1,
    capabilities: devices.map((device) => ({
        platformName: 'Android',
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
