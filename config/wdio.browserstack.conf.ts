/**
 * Cloud run on real devices in BrowserStack App Automate.
 * The service uploads apps/wdio-demo.apk automatically and points the session at it.
 *
 *   npm run test:bs   (credentials from .env — see .env.example)
 */
import { config as shared } from './wdio.shared.conf.js'

const user = process.env.BROWSERSTACK_USERNAME
const key = process.env.BROWSERSTACK_ACCESS_KEY
if (!user || !key) {
    throw new Error('Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY (see .env.example)')
}

const buildName = `training-${new Date().toISOString().slice(0, 10)}`

// Real devices to run on — pick names from https://www.browserstack.com/list-of-browsers-and-platforms/app_automate
const devices = [
    { deviceName: 'Samsung Galaxy S24', platformVersion: '14.0' },
    { deviceName: 'Google Pixel 8', platformVersion: '14.0' },
]

export const config: WebdriverIO.Config = {
    ...shared,

    user,
    key,
    hostname: 'hub.browserstack.com',

    services: [
        [
            'browserstack',
            {
                app: './apps/wdio-demo.apk',
                browserstackLocal: false,
            },
        ],
    ],

    // One session per device, in parallel (the free trial allows few parallels — lower if needed).
    maxInstances: devices.length,
    capabilities: devices.map((device) => ({
        platformName: 'android',
        'bstack:options': {
            ...device,
            projectName: 'is-qa-appium',
            buildName,
            debug: true, // screenshot for every command in the dashboard
            networkLogs: true,
        },
    })),
}
