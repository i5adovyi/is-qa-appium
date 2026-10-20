#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

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
try {
    process.loadEnvFile(path.join(root, '.env'))
} catch (error) {
    check(error.code === 'ENOENT', '.env readable (optional locally)', 'Check .env permissions and formatting; do not paste credentials into chat.')
}

console.log(`\nMobile automation preflight — ${cloud ? 'BrowserStack' : 'local Android'}\n`)
check(Number(process.versions.node.split('.')[0]) === 24, `Node ${process.versions.node}`, 'Install/use Node 24. With nvm: nvm install && nvm use.')
const appium = path.join(root, 'node_modules/appium/index.js')
check(fs.existsSync(appium), 'Project dependencies installed', 'Run npm ci (or npm install after changing package.json).')
const apk = path.join(root, 'apps/wdio-demo.apk')
let validApk = false
try {
    const fd = fs.openSync(apk, 'r')
    try {
        const magic = Buffer.alloc(4)
        fs.readSync(fd, magic, 0, 4, 0)
        validApk = fs.fstatSync(fd).size > 1_000_000 && magic.equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
    } finally {
        fs.closeSync(fd)
    }
} catch {}
check(validApk, 'Demo APK present and looks like an APK/ZIP', 'Run npm run app:download. This quick check is not a signature or checksum verification.')

if (cloud) {
    for (const name of ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']) {
        const value = process.env[name]?.trim()
        check(Boolean(value && !/^(your[_ -]|paste[_ -]|replace[_ -]|changeme|<)/i.test(value)), `${name} configured (value hidden)`, 'Copy .env.example to .env and fill your account value, or use CI secrets.')
    }
    console.log('Credential validity, device availability, and cloud execution require an actual authorized run; no session was created.')
} else {
    const sdk = process.env.ANDROID_HOME
    const javaHome = process.env.JAVA_HOME
    check(Boolean(sdk && fs.existsSync(sdk)), 'ANDROID_HOME points to an existing SDK', 'Export ANDROID_HOME in your shell, then source ~/.zshrc. See README setup.')
    check(Boolean(javaHome && fs.existsSync(javaHome)), 'JAVA_HOME points to an existing JDK', 'Use Android Studio’s bundled JDK; see README setup, then source ~/.zshrc.')
    const java = run(javaHome ? path.join(javaHome, 'bin/java') : 'java', ['-version'])
    check(java.status === 0, 'Java can execute', 'Check JAVA_HOME/bin/java and your Android Studio installation.')

    const adbPath = sdk ? path.join(sdk, 'platform-tools/adb') : 'adb'
    const adb = run(adbPath, ['devices'])
    check(adb.status === 0, 'adb is available', 'Install Android SDK Platform-Tools. If sandbox restrictions block adb, run preflight from your normal terminal.')
    if (adb.status === 0) {
        const entries = adb.stdout.split(/\r?\n/).map((line) => line.trim().split(/\s+/))
            .filter((entry) => entry.length >= 2 && entry[0] !== 'List' && !entry[0].startsWith('*'))
        const ready = entries.filter(([, state]) => state === 'device')
        const udid = process.env.ANDROID_UDID
        const selected = udid ? ready.find(([id]) => id === udid) : ready.length === 1 && ready[0]
        check(Boolean(selected), 'Exactly one target device selected and online',
            ready.length > 1
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
        const installed = run(process.execPath, [appium, 'driver', 'list', '--installed', '--json'])
        let driverInstalled = false
        try {
            driverInstalled = JSON.parse(installed.stdout).uiautomator2?.installed === true
        } catch {}
        check(installed.status === 0 && driverInstalled, 'Appium can discover the UiAutomator2 driver', 'Run npm run appium:setup, then npm run appium:doctor. The driver is also a project dependency.')
    }
    console.log('For Appium’s full environment checks, also run npm run appium:doctor.')
}
console.log(`\n${failures ? `${failures} check(s) need attention.` : 'All preflight checks passed.'}`)
process.exitCode = failures ? 1 : 0
