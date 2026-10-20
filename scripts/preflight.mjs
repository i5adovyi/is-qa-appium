#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { verifyApp } from './lib/demo-app.ts'
import { verifyDriver } from './lib/driver.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
if (args.includes('--help')) {
    console.log('Usage: npm run preflight [-- --cloud]\nLocal checks require a running Android device. --cloud checks credentials and APK without starting a cloud session.')
    process.exit(0)
}
if (args.some((arg) => arg !== '--cloud')) {
    console.error('Unknown option. Run npm run preflight -- --help.')
    process.exit(2)
}
const cloud = args.includes('--cloud')
let failures = 0
function check(ok, label, fix) {
    console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`)
    if (!ok) {
        failures++
        console.log(`     ${fix}`)
    }
}
function run(command, args = []) {
    return spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 20_000 })
}
function isDirectory(name) {
    try { return Boolean(name && fs.statSync(name).isDirectory()) } catch { return false }
}
const executable = (name) => `${name}${process.platform === 'win32' ? '.exe' : ''}`

console.log(`\nMobile automation preflight — ${cloud ? 'BrowserStack' : 'local Android'}\n`)
try {
    process.loadEnvFile(path.join(root, '.env'))
} catch (error) {
    if (error.code !== 'ENOENT') {
        check(false, '.env readable', 'Check .env permissions and formatting; do not paste credentials into chat.')
    }
}

check(Number(process.versions.node.split('.')[0]) === 24, `Node ${process.versions.node}`, 'Install/use Node 24. With nvm: nvm install && nvm use.')
const appium = path.join(root, 'node_modules/appium/index.js')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })
const missing = dependencies.filter(name => !fs.existsSync(path.join(root, 'node_modules', name, 'package.json')))
check(!missing.length && fs.existsSync(appium), 'Declared project dependencies installed',
    `Run npm ci (or npm install after changing package.json).${missing.length ? ` Missing: ${missing.join(', ')}.` : ''}`)
const apk = path.join(root, 'apps/wdio-demo.apk')
let validApk = false
try {
    await verifyApp(apk)
    validApk = true
} catch {}
check(validApk, 'Demo APK matches the pinned SHA-256 and size', 'Run npm run app:download. Do not bypass a checksum mismatch.')

if (cloud) {
    for (const name of ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']) {
        const value = process.env[name]?.trim()
        check(Boolean(value && !/^(your[_ -]|paste[_ -]|replace[_ -]|changeme|<)/i.test(value)), `${name} configured (value hidden)`, 'Copy .env.example to .env and fill your account value, or use CI secrets.')
    }
    console.log('Credential validity, device availability, and cloud execution require an actual authorized run; no session was created.')
} else {
    const sdk = process.env.ANDROID_HOME
    const javaHome = process.env.JAVA_HOME
    check(isDirectory(sdk), 'ANDROID_HOME points to an SDK directory', 'Export ANDROID_HOME in your shell and reopen it. See README setup.')
    check(isDirectory(javaHome), 'JAVA_HOME points to a JDK directory', 'Use Android Studio’s bundled JDK; see README setup and reopen your shell.')
    const java = run(javaHome ? path.join(javaHome, 'bin', executable('java')) : executable('java'), ['-version'])
    check(java.status === 0, 'Java can execute', 'Check JAVA_HOME/bin/java and your Android Studio installation.')
    const javac = run(javaHome ? path.join(javaHome, 'bin', executable('javac')) : executable('javac'), ['-version'])
    check(javac.status === 0, 'Java compiler is available (JDK, not only JRE)', 'Point JAVA_HOME at the bundled Android Studio JDK, which includes bin/javac.')

    let buildTools = false
    if (isDirectory(sdk)) {
        try {
            buildTools = fs.readdirSync(path.join(sdk, 'build-tools')).some(version => {
                const directory = path.join(sdk, 'build-tools', version)
                return fs.existsSync(path.join(directory, executable('aapt')))
                    || fs.existsSync(path.join(directory, executable('aapt2')))
            })
        } catch {}
    }
    check(buildTools, 'Android SDK Build-Tools includes aapt/aapt2', 'Install Android SDK Build-Tools in Android Studio → SDK Manager → SDK Tools.')

    const adbPath = sdk ? path.join(sdk, 'platform-tools', executable('adb')) : executable('adb')
    const adb = run(adbPath, ['devices'])
    check(adb.status === 0, 'adb is available', 'Install Android SDK Platform-Tools. If sandbox restrictions block adb, run preflight from your normal terminal.')
    if (adb.status === 0) {
        const entries = adb.stdout.split(/\r?\n/).map((line) => line.trim().split(/\s+/))
            .filter((entry) => entry.length >= 2 && entry[0] !== 'List' && !entry[0].startsWith('*'))
        const ready = entries.filter(([, state]) => state === 'device')
        const udid = process.env.ANDROID_UDID?.trim()
        const selected = udid ? ready.find(([id]) => id === udid) : ready.length === 1 && ready[0]
        check(Boolean(selected), 'Exactly one target device selected and online',
            udid
                ? 'ANDROID_UDID does not match an online device. Compare its value with adb devices; correct it in .env, or reconnect/authorize that device.'
                : ready.length > 1
                ? 'Set ANDROID_UDID in .env to a serial from adb devices.'
                : 'Start your Android emulator in Android Studio Device Manager; wait for Android to boot. For a phone, authorize USB debugging.')
        if (entries.some(([, state]) => state === 'offline' || state === 'unauthorized')) {
            console.log('NOTE adb also sees an offline or unauthorized device. Check its screen/USB connection.')
        }
        if (selected) {
            const boot = run(adbPath, ['-s', selected[0], 'shell', 'getprop', 'sys.boot_completed'])
            check(boot.status === 0 && boot.stdout.trim() === '1', 'Android has finished booting', 'Wait for the Android home screen, then run preflight again.')
        }
    }
    if (fs.existsSync(appium)) {
        let driverInstalled = false
        try {
            verifyDriver()
            driverInstalled = true
        } catch {}
        check(driverInstalled, 'Appium uses the locked project UiAutomator2 driver', 'Run npm ci, npm run appium:setup, then npm run appium:doctor from this repository.')
    }
    console.log('For Appium’s full environment checks, also run npm run appium:doctor.')
}
console.log(`\n${failures ? `${failures} check(s) need attention.` : 'All preflight checks passed.'}`)
process.exitCode = failures ? 1 : 0
