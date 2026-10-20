import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export function verifyDriver() {
    const root = fileURLToPath(new URL('../..', import.meta.url))
    const expectedPath = path.join(root, 'node_modules/appium-uiautomator2-driver')
    const expected = JSON.parse(fs.readFileSync(path.join(expectedPath, 'package.json'), 'utf8'))
    const result = spawnSync(process.execPath, [path.join(root, 'node_modules/appium/index.js'),
        'driver', 'list', '--installed', '--json'], { cwd: root, encoding: 'utf8', timeout: 20_000 })
    const driver = result.status === 0 ? JSON.parse(result.stdout).uiautomator2 : undefined
    if (!driver?.installed || driver.version !== expected.version
        || path.resolve(driver.installPath || '') !== expectedPath) {
        throw new Error('Appium must use the project UiAutomator2 driver. Run npm ci from this repository, then npm run appium:setup.')
    }
    return driver
}
