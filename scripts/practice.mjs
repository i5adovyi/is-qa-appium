import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const lessons = [
    ['01', 'typed-data', 'Typed data: normalise an email without altering a password'],
    ['02', 'validation', 'Boundaries: turn written requirements into validation rules'],
    ['03', 'async-order', 'Async: make device-like actions run in order'],
    ['04', 'selectors', 'Selectors: choose a stable locator and escape its value'],
    ['05', 'polling', 'Polling: retry observations with a strict limit'],
    ['06', 'diagnosis', 'Diagnosis: classify evidence without overclaiming'],
]
const args = process.argv.slice(2)
const solutions = args.includes('--solutions')
const selection = args.find(arg => arg !== '--solutions') ?? (solutions ? 'all' : 'help')
if (selection === 'help' || selection === '--help') {
    console.log('Offline TypeScript practice — no emulator or account needed.\n')
    lessons.forEach(([id, , title]) => console.log(`${id}  ${title}`))
    console.log('\nRun: npm run practice -- 01\nEdit the selected starter.ts, read its README, and rerun.')
    console.log('Starter exercises intentionally fail until implemented. Reference tests: npm run practice:solutions')
    process.exit(0)
}
const chosen = selection === 'all' ? lessons : lessons.filter(([id]) => id === selection.padStart(2, '0'))
if (!chosen.length || args.filter(arg => arg !== '--solutions').length > 1) {
    console.error('Choose 01–06 or all. Example: npm run practice -- 03')
    process.exit(2)
}
const testFiles = chosen.map(([id, name]) => path.join(root, 'exercises', `${id}-${name}`, 'exercise.test.ts'))
const result = spawnSync(process.execPath, ['--test', ...testFiles], {
    cwd: root,
    stdio: 'inherit',
    timeout: 30000,
    killSignal: 'SIGKILL',
    env: { ...process.env, PRACTICE_SOLUTIONS: solutions ? '1' : '0' },
})
if (result.error) console.error(result.error.code === 'ETIMEDOUT'
    ? 'Practice stopped after 30 seconds. These labs should finish quickly: check for an infinite loop or an unresolved promise.'
    : result.error.message)
process.exit(result.status ?? 1)
