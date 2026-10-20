import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { bindSiteProfile, getSiteProfile, initializeSiteProfile, validateProfileName } from './site-profile.mjs'
import { parsePrepareArgs, prepareSite } from './prepare-site.mjs'

const marker = '{"format":"mobile-automation-course-v1"}\n'
const profile = 'second-account'
const projectId = 'appgprj_testaccount'

async function fixture(t) {
    const root = await mkdtemp(path.join(os.tmpdir(), 'course-site-profile-'))
    t.after(() => rm(root, { recursive: true, force: true }))
    return root
}

async function build(root) {
    await mkdir(path.join(root, 'dist'))
    await writeFile(path.join(root, 'dist/.course-build.json'), marker)
    await writeFile(path.join(root, 'dist/index.html'), 'course')
}

test('new account profile never inherits a root Site identity', async t => {
    const root = await fixture(t)
    await mkdir(path.join(root, '.openai'))
    await writeFile(path.join(root, '.openai/hosting.json'), '{"project_id":"appgprj_original","static":{"directory":"dist"}}')
    const result = await initializeSiteProfile({ root, profile })
    assert.deepEqual(result.manifest, { static: { directory: 'dist' } })
    assert.match(await readFile(path.join(root, '.openai/hosting.json'), 'utf8'), /appgprj_original/)
})

test('binding is idempotent and cannot replace another Site identity', async t => {
    const root = await fixture(t)
    const initialized = await initializeSiteProfile({ root, profile })
    const customized = { ...initialized.manifest, custom: { preserve: true } }
    await writeFile(initialized.manifestPath, JSON.stringify(customized))
    await bindSiteProfile({ root, profile, projectId })
    const bytes = await readFile(initialized.manifestPath, 'utf8')
    await bindSiteProfile({ root, profile, projectId })
    await initializeSiteProfile({ root, profile })
    assert.equal(await readFile(initialized.manifestPath, 'utf8'), bytes)
    assert.deepEqual((await getSiteProfile({ root, profile })).manifest.custom, { preserve: true })
    await assert.rejects(bindSiteProfile({ root, profile, projectId: 'appgprj_other' }), /different Site/)
    assert.equal(await readFile(initialized.manifestPath, 'utf8'), bytes)
})

test('invalid profile paths and ambiguous command arguments are rejected', () => {
    for (const name of ['', '../escape', '/tmp/escape', 'a/b', 'a\\b', '.hidden', 'UPPER', 'a--b', 'con', 'lpt1', 'a'.repeat(65)]) {
        assert.throws(() => validateProfileName(name), /profile name/)
    }
    for (const args of [[], ['second-account'], ['--profile'], ['--profile', profile, '--other']]) {
        assert.throws(() => parsePrepareArgs(args), /Choose a Site/)
    }
    assert.equal(parsePrepareArgs(['--profile', profile]), profile)
})

test('invalid IDs and absent registration fail without preparing output', async t => {
    const root = await fixture(t)
    await initializeSiteProfile({ root, profile })
    await build(root)
    await assert.rejects(bindSiteProfile({ root, profile, projectId: '../another' }), /exact appgprj_/)
    await assert.rejects(prepareSite({ root, profile }), /not registered/)
    assert.equal((await getSiteProfile({ root, profile })).manifest.project_id, undefined)
})

test('profiles isolate Site identity and generated content while preserving Git history', async t => {
    const root = await fixture(t)
    await initializeSiteProfile({ root, profile })
    await bindSiteProfile({ root, profile, projectId })
    const original = await initializeSiteProfile({ root, profile: 'original-account' })
    await bindSiteProfile({ root, profile: 'original-account', projectId: 'appgprj_original' })
    await build(root)
    await prepareSite({ root, profile })
    const directory = path.join(root, '.sites', profile)
    await mkdir(path.join(directory, '.git'))
    await writeFile(path.join(directory, '.git/HEAD'), 'retain history')
    await writeFile(path.join(root, 'dist/index.html'), 'updated course')
    await prepareSite({ root, profile })
    assert.equal(await readFile(path.join(directory, 'dist/index.html'), 'utf8'), 'updated course')
    assert.equal(await readFile(path.join(directory, '.git/HEAD'), 'utf8'), 'retain history')
    assert.equal((await getSiteProfile({ root, profile: 'original-account' })).manifest.project_id, 'appgprj_original')
    await assert.rejects(readFile(path.join(original.directory, 'dist/index.html')), { code: 'ENOENT' })
})

test('preparation refuses unrelated existing output and preserves its contents', async t => {
    const root = await fixture(t)
    const result = await initializeSiteProfile({ root, profile })
    await bindSiteProfile({ root, profile, projectId })
    await build(root)
    await mkdir(path.join(result.directory, 'dist'))
    await writeFile(path.join(result.directory, 'dist/keep.txt'), 'important')
    await assert.rejects(prepareSite({ root, profile }))
    assert.equal(await readFile(path.join(result.directory, 'dist/keep.txt'), 'utf8'), 'important')
})

test('a missing or invalid build cannot replace a prepared Site', async t => {
    const root = await fixture(t)
    const result = await initializeSiteProfile({ root, profile })
    await bindSiteProfile({ root, profile, projectId })
    await build(root)
    await prepareSite({ root, profile })
    await writeFile(path.join(root, 'dist/.course-build.json'), 'not a course')
    await assert.rejects(prepareSite({ root, profile }), /course builder/)
    assert.equal(await readFile(path.join(result.directory, 'dist/index.html'), 'utf8'), 'course')
})

test('profile parent symlinks cannot redirect initialization', async t => {
    const root = await fixture(t)
    const outside = await fixture(t)
    await symlink(outside, path.join(root, '.sites'), 'junction')
    await assert.rejects(initializeSiteProfile({ root, profile }), /real directory/)
    await assert.rejects(readFile(path.join(outside, profile, '.openai/hosting.json')), { code: 'ENOENT' })
})

test('manifest symlinks cannot redirect binding', async t => {
    const root = await fixture(t)
    const result = await initializeSiteProfile({ root, profile })
    const other = path.join(root, 'important.json')
    await writeFile(other, '{"static":{"directory":"dist"}}')
    await rm(result.manifestPath)
    await symlink(other, result.manifestPath)
    await assert.rejects(bindSiteProfile({ root, profile, projectId }), /regular file/)
    assert.equal(await readFile(other, 'utf8'), '{"static":{"directory":"dist"}}')
})

test('static build symlinks cannot copy local private files', async t => {
    const root = await fixture(t)
    await initializeSiteProfile({ root, profile })
    await bindSiteProfile({ root, profile, projectId })
    await build(root)
    await writeFile(path.join(root, 'private.txt'), 'private local data')
    await symlink(path.join(root, 'private.txt'), path.join(root, 'dist/private.txt'))
    await assert.rejects(prepareSite({ root, profile }), /regular files/)
})

test('invalid existing manifest is preserved for recovery', async t => {
    const root = await fixture(t)
    const result = await initializeSiteProfile({ root, profile })
    await writeFile(result.manifestPath, '{invalid')
    await assert.rejects(initializeSiteProfile({ root, profile }), /valid JSON/)
    assert.equal(await readFile(result.manifestPath, 'utf8'), '{invalid')
})
