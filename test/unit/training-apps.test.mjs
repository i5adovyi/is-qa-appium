import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { trainingApps, getTrainingApp, parseTrainingRun, trainingSpecPath, trainingRoot } from '../../scripts/lib/training-apps.ts'

async function workspace(t) {
    const root = realpathSync(await mkdtemp(path.join(tmpdir(), 'training-spec-test-')))
    t.after(() => rm(root, { recursive: true, force: true }))
    for (const id of Object.keys(trainingApps)) await mkdir(path.join(root, 'test', 'training', id), { recursive: true })
    await writeFile(path.join(root, 'test/training/saucelabs/cart.spec.ts'), '// learner work')
    await writeFile(path.join(root, 'test/training/apidemos/widget.spec.ts'), '// learner work')
    await writeFile(path.join(root, 'reference.spec.ts'), '// default reference')
    return root
}

test('explicit spec accepts only the chosen app learner directory', async t => {
    const root = await workspace(t)
    assert.deepEqual(parseTrainingRun(['saucelabs', '--spec', 'test/training/saucelabs/cart.spec.ts'], root), {
        id: 'saucelabs', spec: path.join(root, 'test/training/saucelabs/cart.spec.ts'),
    })
    assert.throws(() => parseTrainingRun(['saucelabs'], root), /Usage/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'test/training/saucelabs/cart.spec.ts', '--spec', 'reference.spec.ts'], root), /Usage/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'reference.spec.ts'], root), /inside/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'test/training/apidemos/widget.spec.ts'], root), /inside/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'test/training/saucelabs/../../../reference.spec.ts'], root), /inside/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'test/training/saucelabs/*.spec.ts'], root), /glob characters/)
    assert.throws(() => parseTrainingRun(['saucelabs', '--spec', 'test/training/assignment.template.ts'], root), /\.spec\.ts/)
})

test('even an existing literal wildcard filename cannot become a runner glob', async t => {
    const root = await workspace(t)
    for (const name of ['cart[12].spec.ts', 'cart{one,two}.spec.ts', 'cart*.spec.ts']) {
        // Windows forbids * in filenames, but brackets/braces still exercise the rule.
        if (process.platform === 'win32' && name.includes('*')) continue
        const spec = `test/training/saucelabs/${name}`
        await writeFile(path.join(root, spec), '// literal filename; must never reach glob expansion')
        assert.throws(() => parseTrainingRun(['saucelabs', '--spec', spec], root), /glob characters/)
    }
})

test('a symlink cannot run another app or reference spec through the learner directory', async t => {
    const root = await workspace(t)
    const link = path.join(root, 'test/training/saucelabs/escape')
    if (process.platform === 'win32') {
        await symlink(root, link, 'junction')
        assert.throws(() => trainingSpecPath('saucelabs', path.join(link, 'reference.spec.ts'), root), /existing regular/)
    } else {
        await symlink(path.join(root, 'reference.spec.ts'), `${link}.spec.ts`)
        assert.throws(() => trainingSpecPath('saucelabs', `${link}.spec.ts`, root), /existing regular/)
    }
    await mkdir(path.join(root, 'test/training/saucelabs/directory.spec.ts'))
    assert.throws(() => trainingSpecPath('saucelabs', 'test/training/saucelabs/directory.spec.ts', root), /existing regular/)
})

test('missing and unknown apps fail before selecting any APK', () => {
    for (const id of [undefined, '', '../demo-app', 'toString', '__proto__', 'not-an-app']) {
        assert.throws(() => getTrainingApp(id), /Choose a training app/)
    }
})

test('CLI refuses unspecified runs and malformed download requests without starting a runner', () => {
    for (const [script, args, message] of [
        ['run-training.mjs', [], /Usage/],
        ['run-training.mjs', ['saucelabs', '--spec', 'test/specs/app.smoke.spec.ts'], /inside/],
        ['training-apps.mjs', ['download', 'saucelabs', '--skip-verification'], /Usage/],
        ['training-apps.mjs', ['download', '../demo-app'], /Choose a training app/],
    ]) {
        const result = spawnSync(process.execPath, [path.join(trainingRoot, 'scripts', script), ...args], { encoding: 'utf8' })
        assert.equal(result.status, 1)
        assert.match(result.stderr, message)
    }
    const listing = spawnSync(process.execPath, [path.join(trainingRoot, 'scripts/training-apps.mjs'), 'list'], { encoding: 'utf8' })
    assert.equal(listing.status, 0)
    assert.match(listing.stdout, /saucelabs:.*2\.3\.0/)
    assert.match(listing.stdout, /apidemos:.*6\.1\.2/)
})
