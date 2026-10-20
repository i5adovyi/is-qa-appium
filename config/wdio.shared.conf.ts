import fs from 'node:fs'

/**
 * Settings shared by every environment (local emulator, BrowserStack).
 * Environment-specific configs import this and add capabilities + services.
 */

// Load .env (BrowserStack credentials etc.) if it exists — built into Node, no dotenv needed.
try {
    process.loadEnvFile()
} catch {
    // no .env file — fine for local runs
}

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['../test/specs/**/*.spec.ts'],
    maxInstances: 1,

    // Overwritten by each environment config.
    capabilities: [],

    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 15000, // how long $().waitFor*() waits by default
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 3 * 60 * 1000, // mobile sessions are slow — give each test room
    },
    reporters: ['spec'],

    /**
     * Hook: take a screenshot when a test fails (saved to ./logs).
     */
    afterTest: async function (test, _context, { passed }) {
        if (!passed) {
            const name = test.title.replace(/[^a-z0-9]+/gi, '_')
            fs.mkdirSync('./logs', { recursive: true })
            await driver.saveScreenshot(`./logs/FAILED_${name}.png`)
        }
    },
}
