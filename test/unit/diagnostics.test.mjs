import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const { config } = await import('../../config/wdio.shared.conf.ts')

test('failure diagnostics preserve evidence without treating skips as failures', async () => {
    const originalCwd = process.cwd()
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mobile-diagnostics-'))
    const previousDriver = globalThis.driver
    const previousWarn = console.warn
    const warnings = []
    try {
        process.chdir(root)
        console.warn = (message) => warnings.push(message)
        globalThis.driver = {
            saveScreenshot: async file => fs.writeFileSync(file, 'mock screenshot'),
            getPageSource: async () => '<mock-hierarchy/>',
        }
        await config.afterTest({ title: 'pending' }, {}, { passed: false, skipped: true })
        await config.afterTest({ title: 'passed' }, {}, { passed: true })
        assert.equal(fs.existsSync('logs'), false, 'Passing and skipped tests must not create FAILED artifacts')

        await config.afterTest({ title: 'same title' }, {}, { passed: false })
        await config.afterTest({ title: 'same title' }, {}, { passed: false })
        const files = fs.readdirSync('logs')
        assert.equal(files.length, 4, 'Repeated titles need separate screenshot/XML pairs')
        for (const file of files.filter(name => name.endsWith('.png'))) {
            assert.ok(files.includes(file.replace(/\.png$/, '.xml')))
        }

        // One capture fails, but the other is still attempted and the hook resolves.
        globalThis.driver.saveScreenshot = async () => { throw new Error('broken screenshot transport') }
        await config.afterHook({ title: 'beforeEach' }, {}, { error: new Error('setup failed') })
        assert.equal(fs.readdirSync('logs').filter(file => file.endsWith('.xml')).length, 3)
        assert.match(warnings[0], /original failure is unchanged/)

        globalThis.driver.getPageSource = async () => { throw new Error('disconnected') }
        await assert.doesNotReject(config.afterTest({ title: 'disconnected session' }, {}, { passed: false }))
    } finally {
        process.chdir(originalCwd)
        globalThis.driver = previousDriver
        console.warn = previousWarn
        fs.rmSync(root, { recursive: true, force: true })
    }
})
