import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

/**
 * Settings shared by every environment (local emulator, BrowserStack).
 * Environment-specific configs import this and add capabilities + services.
 */

// Load .env (BrowserStack credentials etc.) if it exists — built into Node, no dotenv needed.
try {
    process.loadEnvFile()
} catch (error) {
    // A missing file is fine. Permission or parsing errors should stay visible.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}

async function captureFailure(title: string) {
    // A failed session may not be able to take a screenshot. Never replace the test failure.
    try {
        const name = title.replace(/[^a-z0-9]+/gi, '_').slice(0, 90)
        const unique = `${Date.now()}_${process.pid}_${randomUUID().slice(0, 8)}`
        const base = path.resolve('logs', `FAILED_${name}_${unique}`)
        fs.mkdirSync(path.dirname(base), { recursive: true })

        for (const [label, capture] of [
            ['screenshot', () => driver.saveScreenshot(`${base}.png`)],
            ['page source', async () => fs.writeFileSync(`${base}.xml`, await driver.getPageSource())],
        ] as const) {
            try {
                await capture()
            } catch {
                console.warn(`[diagnostics] Could not capture ${label}; original failure is unchanged.`)
            }
        }
    } catch {
        console.warn('[diagnostics] Could not create failure artifacts; original failure is unchanged.')
    }
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
        retries: 0, // learn from the first failure instead of hiding it with retries
    },
    reporters: ['spec'],

    /**
     * Hooks: save a screenshot and UI XML on failure (including setup failure).
     * These files may contain typed data. Review before sharing; logs/ is gitignored.
     */
    afterTest: async function (test, _context, { passed }) {
        if (!passed) await captureFailure(test.title)
    },
    afterHook: async function (test, _context, { error }) {
        if (error) await captureFailure(`hook_${test.title}`)
    },
}
