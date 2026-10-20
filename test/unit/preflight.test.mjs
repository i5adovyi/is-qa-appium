import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const preflightSource = fs.readFileSync(new URL('../../scripts/preflight.mjs', import.meta.url), 'utf8')

// Execute the actual script in a temporary project. All device/Java/Appium commands
// are mocked in a child Node process; these checks never contact an emulator.
function preflight(options = {}) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mobile-preflight-'))
    try {
        fs.mkdirSync(path.join(root, 'scripts'))
        fs.writeFileSync(path.join(root, 'scripts/preflight.mjs'), preflightSource)
        fs.cpSync(new URL('../../scripts/lib', import.meta.url), path.join(root, 'scripts/lib'), { recursive: true })
        fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({
            type: 'module', devDependencies: { appium: '3.8.0', chai: '5.3.3', 'appium-uiautomator2-driver': '8.7.0' },
        }))
        for (const name of ['appium', 'appium-uiautomator2-driver', ...(options.missingDependency ? [] : ['chai'])]) {
            fs.mkdirSync(path.join(root, 'node_modules', name), { recursive: true })
            fs.writeFileSync(path.join(root, 'node_modules', name, 'package.json'), '{"version":"8.7.0"}')
        }
        fs.writeFileSync(path.join(root, 'node_modules/appium/index.js'), '')
        fs.mkdirSync(path.join(root, 'apps'))
        const apk = Buffer.alloc(1_000_001)
        apk.set([0x50, 0x4b, 0x03, 0x04])
        fs.writeFileSync(path.join(root, 'apps/wdio-demo.apk'), apk)
        fs.writeFileSync(path.join(root, 'apps/demo-app.json'), JSON.stringify({
            url: 'https://example.invalid/demo.apk', size: apk.length,
            sha256: options.corruptApk ? '0'.repeat(64) : createHash('sha256').update(apk).digest('hex'),
        }))
        fs.mkdirSync(path.join(root, 'jdk'))
        fs.mkdirSync(path.join(root, 'sdk'))
        if (!options.missingBuildTools) {
            fs.mkdirSync(path.join(root, 'sdk/build-tools/35.0.0'), { recursive: true })
            fs.writeFileSync(path.join(root, `sdk/build-tools/35.0.0/aapt2${process.platform === 'win32' ? '.exe' : ''}`), '')
        }
        fs.writeFileSync(path.join(root, 'run.mjs'), `
            import cp from 'node:child_process'
            import { syncBuiltinESMExports } from 'node:module'
            const options = JSON.parse(process.env.FIXTURE_OPTIONS)
            cp.spawnSync = (command, args = []) => {
                if (/javac(?:\\.exe)?$/.test(command)) return {status: options.missingCompiler ? 1 : 0, stdout:'javac 21', stderr:''}
                if (/java(?:\\.exe)?$/.test(command)) return {status:0, stdout:'', stderr:'openjdk version "21"'}
                if (args[0] === 'devices') return {status:0, stdout:options.devices ?? 'List of devices attached\\nemulator-5554\\tdevice\\n', stderr:''}
                if (args.includes('getprop')) return {status:0, stdout:options.booted === false ? '0' : '1', stderr:''}
                if (args.includes('driver')) return {status:0, stdout:JSON.stringify({uiautomator2:{
                    installed:true, version:'8.7.0',
                    installPath:options.globalDriver ? '/some/global/driver' : process.cwd() + '/node_modules/appium-uiautomator2-driver'
                }}), stderr:''}
                throw Error('Unexpected command: ' + command)
            }
            syncBuiltinESMExports()
            process.argv = ['node', 'preflight.mjs', ...(options.cloud ? ['--cloud'] : [])]
            await import('./scripts/preflight.mjs')
        `)
        return spawnSync(process.execPath, [path.join(root, 'run.mjs')], {
            cwd: root, encoding: 'utf8', timeout: 10_000,
            env: {
                ...process.env,
                ANDROID_HOME: path.join(root, 'sdk'),
                JAVA_HOME: path.join(root, 'jdk'),
                ANDROID_UDID: options.udid ?? '',
                BROWSERSTACK_USERNAME: 'YOUR_USERNAME',
                BROWSERSTACK_ACCESS_KEY: 'YOUR_ACCESS_KEY',
                FIXTURE_OPTIONS: JSON.stringify(options),
            },
        })
    } finally {
        fs.rmSync(root, { recursive: true, force: true })
    }
}

test('a complete mocked local environment passes', () => {
    const result = preflight()
    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.match(result.stdout, /All preflight checks passed/)
})

test('partial dependency installation cannot pass preflight', () => {
    const result = preflight({ missingDependency: true })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL Declared project dependencies installed/)
    assert.match(result.stdout, /Missing: chai/)
})

test('a ZIP-shaped APK with the wrong checksum fails preflight', () => {
    const result = preflight({ corruptApk: true })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL Demo APK matches the pinned SHA-256/)
})

test('JRE-only and missing build-tools installations produce actionable failures', () => {
    const result = preflight({ missingCompiler: true, missingBuildTools: true })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL Java compiler/)
    assert.match(result.stdout, /FAIL Android SDK Build-Tools/)
})

test('a stale device selection explains how to correct ANDROID_UDID', () => {
    const result = preflight({ udid: 'emulator-9999' })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /ANDROID_UDID does not match an online device/)
})

test('multiple online devices need a selection, which tolerates surrounding whitespace', () => {
    const devices = 'List of devices attached\nemulator-5554\tdevice\nemulator-5556\tdevice\n'
    const ambiguous = preflight({ devices })
    assert.equal(ambiguous.status, 1)
    assert.match(ambiguous.stdout, /Set ANDROID_UDID/)
    const selected = preflight({ devices, udid: ' emulator-5556 ' })
    assert.equal(selected.status, 0, selected.stdout)
})

test('a connected but unbooted device is not ready', () => {
    const result = preflight({ booted: false })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL Android has finished booting/)
})

test('an unrelated global driver cannot silently replace the audited project driver', () => {
    const result = preflight({ globalDriver: true })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL Appium uses the locked project UiAutomator2 driver/)
})

test('cloud placeholders fail without values or device commands in output', () => {
    const result = preflight({ cloud: true })
    assert.equal(result.status, 1)
    assert.match(result.stdout, /FAIL BROWSERSTACK_USERNAME configured/)
    assert.match(result.stdout, /FAIL BROWSERSTACK_ACCESS_KEY configured/)
    assert.doesNotMatch(result.stdout, /YOUR_USERNAME|YOUR_ACCESS_KEY|adb is available/)
})
