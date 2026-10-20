#!/usr/bin/env node
import { verifyDriver } from './lib/driver.mjs'

try {
    const driver = verifyDriver()
    console.log(`Appium discovers the project UiAutomator2 ${driver.version}. Dependencies are installed by npm ci; no separate global driver is needed.`)
} catch {
    console.error('Project driver discovery failed. Run npm ci from this repository, then retry npm run appium:setup. Inspect npx appium driver list --installed if it still fails.')
    process.exitCode = 1
}
