import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const run = `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`

/** Maintainer evidence, separate from learner attempts and progress records. */
export async function captureTrainingEvidence(app: string, step: string) {
    const directory = path.resolve('logs', 'training-validation', app, run)
    await mkdir(directory, { recursive: true })
    const base = path.join(directory, step)
    await driver.saveScreenshot(`${base}.png`)
    await writeFile(`${base}.xml`, await driver.getPageSource())
    console.log(`[training evidence] ${base}`)
}
