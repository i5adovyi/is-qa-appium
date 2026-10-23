#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { parseTrainingRun, trainingRoot, verifyTrainingApp } from './lib/training-apps.ts'

try {
    const { id, spec } = parseTrainingRun(process.argv.slice(2))
    await verifyTrainingApp(id)
    const result = spawnSync(process.execPath, [
        path.join(trainingRoot, 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js'),
        'run', path.join(trainingRoot, 'config', 'wdio.training.conf.ts'),
    ], {
        cwd: trainingRoot,
        stdio: 'inherit',
        env: { ...process.env, TRAINING_APP_ID: id, TRAINING_SPEC: spec },
    })
    if (result.error) throw result.error
    process.exitCode = result.status ?? 1
} catch (error) {
    console.error(`Training run: ${error.message}`)
    process.exitCode = 1
}
