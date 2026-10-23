import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { createReadingPlaceStore, parseReadingPlace, readingPlaceKey } from '../course/reader-state.js'

const bookmark = {
    path: 'docs/challenges/06-waiting-incident.md',
    title: 'The result arrives late',
    section: 'acceptance-criteria',
}

test('reading bookmark resumes a selected section without modifying completion or notes', () => {
    const progress = JSON.stringify({ completed: ['00'], notes: { 'CH-06': 'My own attempt' } })
    const values = new Map([['mobile-automation-lab-progress-v2', progress]])
    const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
    const place = createReadingPlaceStore(storage)
    assert.equal(place.get(), null)
    assert.equal(place.remember(bookmark), true)
    assert.deepEqual(createReadingPlaceStore(storage).get(), bookmark)
    assert.equal(values.get('mobile-automation-lab-progress-v2'), progress)
    assert.deepEqual([...values.keys()].sort(), ['mobile-automation-lab-progress-v2', readingPlaceKey].sort())
})

test('unreadable and unsafe reading bookmarks are ignored, leaving valid memory intact', () => {
    for (const value of ['{bad json', 'null', '[]', '{}']) assert.equal(parseReadingPlace(value), null)
    for (const path of ['https://example.org/page.md', '/etc/file.md', '../README.md', 'docs/../README.md', 'docs//page.md', 'docs/%2e%2e/file.md', 'docs/page.md#outside']) {
        assert.equal(parseReadingPlace(JSON.stringify({ ...bookmark, path })), null, path)
    }
    for (const section of ['a#another-route', '\u0000', ['nested']]) {
        assert.equal(parseReadingPlace(JSON.stringify({ ...bookmark, section })), null)
    }
    const storage = { getItem: () => '{broken', setItem() {} }
    const place = createReadingPlaceStore(storage)
    assert.equal(place.get(), null)
    place.remember(bookmark)
    assert.equal(place.remember({ path: '/unsafe.md', title: 'Bad path' }), false)
    assert.deepEqual(place.get(), bookmark)
})

test('blocked browser storage keeps reading navigation usable for the visit', () => {
    const storage = {
        getItem() { throw new Error('Storage blocked') },
        setItem() { throw new Error('Storage blocked') },
    }
    const place = createReadingPlaceStore(storage)
    assert.equal(place.get(), null)
    assert.equal(place.remember(bookmark), false)
    assert.deepEqual(place.get(), bookmark)
})

const themeScript = await readFile(new URL('../course/theme.js', import.meta.url), 'utf8')
function preferences({ values = new Map(), blocked = false, dark = false } = {}) {
    const controls = new Map(['theme-select', 'theme-control', 'reading-size-select', 'reading-size-control'].map(id => [id, Object.assign(new EventTarget(), { hidden: true, value: '', title: '' })]))
    const document = Object.assign(new EventTarget(), {
        documentElement: { dataset: {} },
        getElementById: id => controls.get(id),
    })
    const media = Object.assign(new EventTarget(), { matches: dark })
    const window = Object.assign(new EventTarget(), { matchMedia: () => media })
    const localStorage = {
        getItem(key) { if (blocked) throw new Error('Blocked'); return values.get(key) ?? null },
        setItem(key, value) { if (blocked) throw new Error('Blocked'); values.set(key, value) },
    }
    vm.runInNewContext(themeScript, { document, window, localStorage })
    return {
        document, window, media, controls, values,
        ready: () => document.dispatchEvent(new Event('DOMContentLoaded')),
        choose(id, value) { controls.get(id).value = value; controls.get(id).dispatchEvent(new Event('change')) },
    }
}

test('saved larger text applies before rendering and controls update only their own preference', () => {
    const values = new Map([['mobile-automation-lab-reading-size', 'larger'], ['mobile-automation-lab-theme', 'dark'], ['progress', 'preserve evidence']])
    const page = preferences({ values })
    assert.equal(page.document.documentElement.dataset.readingSize, 'larger')
    assert.equal(page.document.documentElement.dataset.theme, 'dark')
    page.ready()
    assert.equal(page.controls.get('reading-size-control').hidden, false)
    assert.equal(page.controls.get('reading-size-select').value, 'larger')
    page.choose('reading-size-select', 'standard')
    assert.equal(values.get('mobile-automation-lab-reading-size'), 'standard')
    assert.equal(values.get('mobile-automation-lab-theme'), 'dark')
    assert.equal(values.get('progress'), 'preserve evidence')
    assert.equal(preferences({ values }).document.documentElement.dataset.readingSize, 'standard')
})

test('unknown and blocked preferences fall back safely while text can still change for this visit', () => {
    const unknown = preferences({ values: new Map([['mobile-automation-lab-reading-size', 'giant']]), dark: true })
    assert.equal(unknown.document.documentElement.dataset.readingSize, 'standard')
    assert.equal(unknown.document.documentElement.dataset.theme, 'dark')
    const page = preferences({ blocked: true })
    page.ready()
    page.choose('reading-size-select', 'larger')
    assert.equal(page.document.documentElement.dataset.readingSize, 'larger')
    assert.match(page.controls.get('reading-size-select').title, /this visit/)
    page.choose('theme-select', 'dark')
    assert.equal(page.document.documentElement.dataset.theme, 'dark')
    assert.equal(page.document.documentElement.dataset.readingSize, 'larger')
})

test('cross-tab reading-size changes and system theme changes remain independent', () => {
    const page = preferences()
    page.ready()
    page.values.set('mobile-automation-lab-reading-size', 'larger')
    page.window.dispatchEvent(Object.assign(new Event('storage'), { key: 'mobile-automation-lab-reading-size' }))
    assert.equal(page.document.documentElement.dataset.readingSize, 'larger')
    page.media.matches = true
    page.media.dispatchEvent(new Event('change'))
    assert.equal(page.document.documentElement.dataset.theme, 'dark')
    assert.equal(page.document.documentElement.dataset.readingSize, 'larger')
    page.values.clear()
    page.window.dispatchEvent(Object.assign(new Event('storage'), { key: null }))
    assert.equal(page.document.documentElement.dataset.readingSize, 'standard')
})
