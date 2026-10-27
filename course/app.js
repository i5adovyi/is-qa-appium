import { parseProgress, mergeProgress, progressIdsForCatalog } from './progress.js'
import { headingSlug, findPractice } from './practice.js'
import { findAssignments } from './assignments.js'
import { createCourseClient } from './data.js'
import { createProgressStorage } from './progress-storage.js'
import { createReadingPlaceStore } from './reader-state.js'

const $ = selector => document.querySelector(selector)
const mode = document.querySelector('meta[name="course-data-mode"]')?.content ?? 'local'
const client = createCourseClient({
    mode,
    baseUrl: new URL('./', location.href),
})
let catalog, currentLesson, currentChallenge, progressStorage, activeStage = 'all', renderId = 0
let progress = { completed: [], notes: {} }
let showAllPractice = false
let renderedPage = null
const readingPlace = createReadingPlaceStore({
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
})
function toast(message) {
    $('#toast').textContent = message
    $('#toast').hidden = false
    setTimeout(() => { $('#toast').hidden = true }, 3000)
}
function save() {
    progressStorage.update(progress)
}
function downloadProgress(value) {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, course: catalog.title, exportedAt: new Date().toISOString(), ...value }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const download = document.createElement('a')
    download.href = url
    download.download = 'mobile-automation-progress.json'
    download.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function node(tag, className, text) {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (text !== undefined) element.textContent = text
    return element
}
function link(text, page, className) {
    const element = node('a', className, text)
    element.href = `#${page}`
    return element
}
function refreshResume() {
    const place = readingPlace.get()
    $('#resume-reading').hidden = !place
    if (!place) return
    $('#resume-link').href = `#${place.path}${place.section ? `#${encodeURIComponent(place.section)}` : ''}`
    $('#resume-link').textContent = `Resume reading: ${place.title} ↗`
}
function focusDestination(target, scrollToSection = false) {
    if (target) {
        if (!target.matches('input,textarea,select,button,a[href]')) target.tabIndex = -1
        // A deep link may target review guidance inside an expandable hint.
        for (let parent = target.parentElement; parent; parent = parent.parentElement) {
            if (parent.tagName === 'DETAILS') parent.open = true
        }
        target.focus({ preventScroll: true })
    }
    if (scrollToSection && target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0 })
}
function showReadingSection(page, section) {
    const heading = [...$('#article').querySelectorAll('h1,h2,h3,h4')].find(item => item.id === section)
    const evidence = section === 'study-evidence' && (currentChallenge || currentLesson) ? $('#lesson-notes') : null
    const target = evidence || heading || $('#article h1')
    focusDestination(target, Boolean(section && (heading || evidence)))
    readingPlace.remember({
        path: page,
        title: $('#article h1')?.textContent ?? 'Course page',
        section: heading || evidence ? section : '',
    })
    refreshResume()
}
function refreshContents(page, hasNotes) {
    const headings = [...$('#article').querySelectorAll('h2,h3')]
    const sections = $('#page-sections')
    sections.replaceChildren()
    for (const heading of headings) {
        const item = node('li', heading.tagName === 'H3' ? 'contents-subsection' : '')
        item.append(link(heading.textContent, `${page}#${encodeURIComponent(heading.id)}`))
        sections.append(item)
    }
    $('#page-contents').hidden = !headings.length
    $('#page-contents').open = false
    $('#evidence-jump').hidden = !hasNotes
    $('#evidence-jump').href = `#${page}#study-evidence`
}
function refresh() {
    const done = catalog.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
    $('#progress-number').textContent = `${done}/16`
    $('#progress-fill').style.width = `${done / 16 * 100}%`
    const next = catalog.lessons.find(lesson => !progress.completed.includes(lesson.id)) ?? catalog.lessons[0]
    $('#continue-link').href = `#${next.path}`
    $('#continue-link').textContent = done === 16 ? 'Revisit the lesson path ↗' : `First unchecked lesson: ${next.id} · ${next.title} ↗`
    refreshResume()
    const nav = $('#lesson-nav')
    const mobileNav = $('#mobile-nav')
    nav.replaceChildren()
    mobileNav.replaceChildren()
    for (const [title, path] of [
        ['Learning dashboard', 'home'],
        ['How to use this project', 'docs/handbook/how-to-use.md'],
        ["Choose today's session", 'docs/handbook/study-session.md'],
        ['Complete beginner? Start here', 'docs/handbook/start-from-zero.md'],
        ['Real-world challenge path', 'challenges'],
        ['Assignment bank · topic & level', 'assignments'],
        ['BrowserStack academy', 'browserstack'],
    ]) mobileNav.append(link(title, path, 'nav-lesson'))
    for (const stage of catalog.stages) {
        nav.append(node('div', 'nav-stage', stage.title))
        mobileNav.append(node('div', 'nav-stage', stage.title))
        for (const lesson of catalog.lessons.filter(item => item.stage === stage.id)) {
            const item = link('', lesson.path, 'nav-lesson')
            item.append(node('span', 'nav-number', progress.completed.includes(lesson.id) ? '✓' : lesson.id), node('span', '', lesson.title))
            if (lesson.path === currentLesson?.path) {
                item.classList.add('active')
                item.setAttribute('aria-current', 'page')
            }
            nav.append(item)
            mobileNav.append(item.cloneNode(true))
        }
    }
    const query = $('#search').value.toLowerCase().trim()
    const visible = catalog.lessons.filter(lesson => (activeStage === 'all' || lesson.stage === activeStage)
        && `${lesson.id} ${lesson.title} ${lesson.subtitle}`.toLowerCase().includes(query))
    const grid = $('#lesson-grid')
    grid.replaceChildren()
    for (const lesson of visible) {
        const card = link('', lesson.path, 'lesson-card')
        const completed = progress.completed.includes(lesson.id)
        card.append(node('span', 'card-number', completed ? `${lesson.id} / COMPLETED ✓` : `${lesson.id} / LESSON`),
            node('h3', '', lesson.title), node('p', '', lesson.subtitle), node('span', 'card-footer', 'Read · practise · explain  ↗'))
        if (completed) card.classList.add('completed')
        grid.append(card)
    }
    if (!visible.length) grid.append(node('p', 'empty-state', 'No matching lessons. Try “login”, “TypeScript”, or “cloud”.'))
}
function refreshChallenges() {
    const challenges = catalog.challenges ?? []
    const done = challenges.filter(item => progress.completed.includes(item.id)).length
    $('#challenge-count').textContent = `${done}/${challenges.length} challenges completed · self-reported`
    const grid = $('#challenge-stages')
    grid.replaceChildren()
    for (const stage of catalog.challengeStages ?? []) {
        const section = node('section', 'challenge-stage')
        section.append(node('h2', '', stage.title), node('p', 'practice-intro', stage.description))
        const cards = node('div', 'lesson-grid')
        for (const item of challenges.filter(item => item.stage === stage.id)) {
            const done = progress.completed.includes(item.id)
            const card = link('', item.path, `lesson-card${done ? ' completed' : ''}`)
            card.append(node('span', 'card-number', `${item.id} · ${done ? 'COMPLETED ✓' : item.requirements}`),
                node('h3', '', item.title), node('p', '', item.subtitle),
                node('span', 'card-footer', `DELIVER: ${item.deliverable} ↗`))
            cards.append(card)
        }
        section.append(cards)
        grid.append(section)
    }
}
function refreshBrowserStack() {
    const grid = $('#browserstack-stages')
    grid.replaceChildren()
    for (const stage of catalog.browserstackStages ?? []) {
        const section = node('section', 'challenge-stage')
        section.append(node('h2', '', stage.title), node('p', 'practice-intro', stage.description))
        const cards = node('div', 'lesson-grid')
        for (const item of (catalog.browserstackLessons ?? []).filter(item => item.stage === stage.id)) {
            const card = link('', item.path, 'lesson-card')
            card.append(node('span', 'card-number', `${item.id} · ${item.requirements}`),
                node('h3', '', item.title), node('p', '', item.subtitle),
                node('span', 'card-footer', 'Steps · exercises · review ↗'))
            cards.append(card)
        }
        section.append(cards)
        grid.append(section)
    }
}
function refreshPractice() {
    const query = $('#practice-search').value
    const category = $('#practice-category').value
    const matches = findPractice(catalog.practice, query, category)
    const visible = showAllPractice || query.trim() || category !== 'all' ? matches : matches.slice(0, 9)
    const grid = $('#practice-grid')
    grid.replaceChildren()
    for (const entry of visible) {
        const card = link('', `${entry.path}#${entry.anchor}`, 'library-card practice-card')
        card.append(node('span', 'practice-meta', `${entry.id} · ${entry.label}`),
            node('strong', '', entry.title), node('span', 'practice-open', 'Open exercise & review guide ↗'))
        grid.append(card)
    }
    $('#practice-count').textContent = visible.length === matches.length
        ? `${matches.length} matching items`
        : `Showing ${visible.length} of ${matches.length} items. Search a topic or browse all.`
    if (!matches.length) grid.append(node('p', 'empty-state', 'No matches. Try “SQL”, “permission”, “401”, or a case ID such as “RW-21”.'))
    $('#practice-show-all').hidden = visible.length === matches.length
}
function refreshAssignments() {
    const matches = findAssignments(catalog, {
        query: $('#assignment-search').value,
        topic: $('#assignment-topic').value,
        level: $('#assignment-level').value,
        environment: $('#assignment-environment').value,
    })
    const groups = $('#assignment-groups')
    groups.replaceChildren()
    const label = (collection, id) => collection.find(item => item.id === id)?.title ?? id
    for (const topic of catalog.assignmentTopics ?? []) {
        const items = matches.filter(item => item.topic === topic.id)
        if (!items.length) continue
        const group = node('section', 'assignment-topic')
        const heading = node('h2', '', topic.title)
        heading.id = `assignment-topic-${topic.id}`
        group.setAttribute('aria-labelledby', heading.id)
        group.append(heading, node('p', 'practice-intro', topic.description))
        const cards = node('div', 'lesson-grid')
        for (const item of items) {
            const card = link('', `${item.path}#${item.anchor}`, 'lesson-card assignment-card')
            card.append(node('span', 'card-number', `${item.id} · ${label(catalog.assignmentLevels, item.level)}`),
                node('h3', '', item.title), node('p', '', item.summary))
            const details = node('dl')
            for (const [term, description] of [
                ['Needs', label(catalog.assignmentEnvironments, item.environment)],
                ['App / fixture', item.app],
                ['Time', item.duration],
                ['Before starting', item.prerequisites.join(' · ')],
                ['Deliver', item.deliverable],
            ]) details.append(node('dt', '', term), node('dd', '', description))
            card.append(details, node('span', 'card-footer', 'Open ticket & review guidance ↗'))
            cards.append(card)
        }
        group.append(cards)
        groups.append(group)
    }
    $('#assignment-count').textContent = `${matches.length} of ${catalog.assignments?.length ?? 0} assignments match your filters`
    if (!matches.length) {
        const empty = node('div', 'assignment-empty')
        empty.append(node('h2', '', 'No assignment matches these filters'),
            node('p', '', 'Try a shorter search, another environment, or Reset filters to see the whole bank.'))
        groups.append(empty)
    }
}
function safeContent(html, page) {
    const template = document.createElement('template')
    template.innerHTML = html
    template.content.querySelectorAll('script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,img,svg,math').forEach(el => el.remove())
    template.content.querySelectorAll('*').forEach(el => {
        for (const attr of [...el.attributes]) {
            if (attr.name.startsWith('on') || ['style', 'srcdoc'].includes(attr.name)) el.removeAttribute(attr.name)
        }
    })
    const slugs = new Map()
    template.content.querySelectorAll('h1,h2,h3,h4').forEach(heading => {
        const base = headingSlug(heading.textContent)
        const count = slugs.get(base) ?? 0
        slugs.set(base, count + 1)
        heading.id = count ? `${base}-${count}` : base
    })
    template.content.querySelectorAll('a[href]').forEach(anchor => {
        const href = anchor.getAttribute('href')
        if (href.startsWith('#')) {
            anchor.href = `#${page}${href}`
            return
        }
        const resolved = new URL(href, `${location.origin}/${page}`)
        if (!['http:', 'https:'].includes(resolved.protocol)) {
            anchor.removeAttribute('href')
        } else if (resolved.origin === location.origin) {
            const target = decodeURIComponent(resolved.pathname.slice(1))
            anchor.href = `#${target}${resolved.hash}`
        } else {
            anchor.href = resolved.href
            anchor.target = '_blank'
            anchor.rel = 'noopener noreferrer'
        }
    })
    template.content.querySelectorAll('pre').forEach(pre => {
        pre.tabIndex = 0
        const copy = node('button', 'copy-code', 'Copy')
        copy.type = 'button'
        copy.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? pre.textContent); toast('Code copied') }
            catch { toast('Select the code and copy it manually in this browser.') }
        })
        pre.append(copy)
    })
    return template.content
}
async function route(force = false) {
    const requestId = ++renderId
    // Imports/recovery can change notes while a dashboard is visible. Never reuse
    // the previously rendered lesson after such a whole-record replacement.
    if (force) renderedPage = null
    let page, section
    $('#error').hidden = true
    try {
        const [rawPage, rawSection = ''] = location.hash.slice(1).split('#')
        page = decodeURIComponent(rawPage) || 'home'
        section = decodeURIComponent(rawSection)
    } catch {
        $('#dashboard').hidden = true
        $('#reader').hidden = true
        $('#challenge-dashboard').hidden = true
        $('#assignment-dashboard').hidden = true
        $('#browserstack-dashboard').hidden = true
        $('#error').hidden = false
        $('#error').textContent = 'This course link is malformed. Use the Learning dashboard link to continue.'
        focusDestination($('#error'))
        return
    }
    $('#dashboard').hidden = page !== 'home'
    $('#reader').hidden = ['home', 'challenges', 'assignments', 'browserstack'].includes(page)
    $('#challenge-dashboard').hidden = page !== 'challenges'
    $('#assignment-dashboard').hidden = page !== 'assignments'
    $('#browserstack-dashboard').hidden = page !== 'browserstack'
    $('#browserstack-navigation').hidden = true
    currentLesson = catalog.lessons.find(lesson => lesson.path === page)
    currentChallenge = (catalog.challenges ?? []).find(item => item.path === page)
    refresh()
    refreshChallenges()
    $('#mobile-course-menu').open = false
    const assignmentPage = page.startsWith('docs/assignments/')
    const browserstackPage = page.startsWith('docs/browserstack/')
    const cloudLesson = (catalog.browserstackLessons ?? []).find(item => item.path === page)
    if (cloudLesson) {
        const sequence = catalog.browserstackLessons
        const index = sequence.indexOf(cloudLesson)
        $('#browserstack-navigation').hidden = false
        $('#browserstack-previous').href = `#${sequence[index - 1]?.path ?? 'browserstack'}`
        $('#browserstack-next').href = `#${sequence[index + 1]?.path ?? 'browserstack'}`
        $('#browserstack-next').textContent = index === sequence.length - 1 ? 'Back to the path →' : 'Next lesson →'
    }
    $('#reader-back').href = browserstackPage ? '#browserstack' : assignmentPage ? '#assignments' : currentChallenge ? '#challenges' : '#home'
    $('#reader-back').textContent = browserstackPage ? '← BrowserStack academy' : assignmentPage ? '← Assignment bank' : currentChallenge ? '← Real-world challenge path' : '← Learning path'
    if (page === 'browserstack') { document.title = 'BrowserStack academy · Mobile Automation Lab'; refreshBrowserStack(); focusDestination($('#browserstack-heading')); return }
    if (page === 'assignments') { document.title = 'Assignment bank · Mobile Automation Lab'; refreshAssignments(); focusDestination($('#assignments-heading')); return }
    if (page === 'challenges') { document.title = 'Real-world challenge path · Mobile Automation Lab'; focusDestination($('#challenges-heading')); return }
    if (page === 'home') { document.title = 'Mobile Automation Lab'; focusDestination($('#dashboard-heading')); return }
    if (!force && renderedPage === page) {
        document.title = `${$('#article h1')?.textContent ?? 'Course reader'} · Mobile Automation Lab`
        showReadingSection(page, section)
        return
    }
    renderedPage = null
    $('#article').replaceChildren(node('p', '', 'Loading your lesson…'))
    $('#page-contents').hidden = true
    $('#evidence-jump').hidden = true
    $('#lesson-actions').hidden = true
    try {
        const data = await client.getPage(page)
        if (requestId !== renderId) return
        $('#article').replaceChildren(safeContent(data.html, page))
        $('#reader-stage').textContent = currentLesson
            ? catalog.stages.find(stage => stage.id === currentLesson.stage).title
            : currentChallenge ? `REAL-WORLD CHALLENGE · ${currentChallenge.id} · ${currentChallenge.requirements}`
            : browserstackPage ? `BROWSERSTACK ACADEMY${cloudLesson ? ` · ${cloudLesson.id}` : ''}`
            : assignmentPage ? 'ASSIGNMENT BANK · KEEP EVIDENCE IN YOUR JOURNAL'
            : page.includes('/solutions/') ? 'WORKED SOLUTION · TRY THE EXERCISE FIRST' : 'THE WORKBENCH'
        document.title = `${$('#article h1')?.textContent ?? 'Course reader'} · Mobile Automation Lab`
        const item = currentChallenge ?? currentLesson
        refreshContents(page, Boolean(item))
        $('#lesson-actions').hidden = !item
        if (item) {
            const sequence = currentChallenge ? catalog.challenges : catalog.lessons
            const index = sequence.indexOf(item)
            const back = currentChallenge ? 'challenges' : 'home'
            $('#completion-help').textContent = currentChallenge
                ? 'Run the assignment and record evidence against its acceptance criteria. Reading alone does not complete a challenge.'
                : 'Finish the exercises and checkpoint before marking this lesson complete.'
            $('#complete-button').textContent = progress.completed.includes(item.id) ? 'Completed · undo' : 'Mark complete ✓'
            $('#lesson-notes').value = progress.notes[item.id] ?? ''
            $('#previous-lesson').href = `#${sequence[index - 1]?.path ?? back}`
            $('#next-lesson').href = `#${sequence[index + 1]?.path ?? back}`
            $('#next-lesson').textContent = index === sequence.length - 1 ? 'Back to the path →' : currentChallenge ? 'Next challenge →' : 'Next lesson →'
            $('#solution-link').hidden = Boolean(currentChallenge)
            $('#solution-link').href = `#${page.replace('/lessons/', '/solutions/')}`
        }
        renderedPage = page
        showReadingSection(page, section)
    } catch (error) {
        if (requestId !== renderId) return
        $('#article').replaceChildren()
        $('#error').hidden = false
        $('#error').textContent = `Could not load this page: ${error.message}`
        focusDestination($('#error'))
    }
}
async function init() {
    catalog = await client.getCatalog()
    const lessonIds = progressIdsForCatalog(catalog)
    let recovering = false
    progressStorage = createProgressStorage({
        mode, baseUrl: new URL('./', location.href), lessonIds,
        // Access can throw in restricted browsers; the adapter reports failures.
        storage: {
            getItem: key => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: key => localStorage.removeItem(key),
            key: index => localStorage.key(index),
            get length() { return localStorage.length },
        },
        onStatus: ({ state, message }) => {
            $('#save-status').textContent = message
            $('#save-status').dataset.state = state
            $('#retry-save').hidden = !['error', 'conflict'].includes(state)
            $('#load-saved').hidden = mode === 'static' || !['error', 'conflict'].includes(state)
            refreshRecoveries()
        },
    })
    function refreshRecoveries() {
        const entries = mode === 'local' ? progressStorage?.getRecoveries() ?? [] : []
        $('#recovery-panel').hidden = !entries.length
        const selected = $('#recovery-draft').value
        $('#recovery-draft').replaceChildren()
        for (const [index, entry] of entries.entries()) {
            const option = node('option', '', entry.invalid
                ? `Draft ${index + 1}: unreadable (original kept in browser storage)`
                : `Draft ${index + 1}${entry.updatedAt ? ` · ${entry.updatedAt}` : ''}`)
            option.value = entry.key
            option.disabled = entry.invalid
            $('#recovery-draft').append(option)
        }
        if (entries.some(entry => entry.key === selected && !entry.invalid)) $('#recovery-draft').value = selected
        $('#recover-draft').disabled = recovering || !entries.some(entry => !entry.invalid)
    }
    progress = await progressStorage.load()
    $('#storage-description').textContent = mode === 'local'
        ? 'Progress saved on this computer.'
        : 'Progress saved in this browser.'
    $('#notes-storage').textContent = mode === 'local' ? 'saved to your local database' : 'saved in this browser'
    async function recoveryAction(action) {
        if (recovering) return
        recovering = true
        // Recovery changes the whole record. Freeze editors until the adapter
        // and the visible record agree; ordinary autosaves leave typing enabled.
        const controls = ['#retry-save', '#load-saved', '#recover-draft',
            '#lesson-notes', '#complete-button', '#import-progress', '#progress-file', '#export-progress'].map($)
        controls.forEach(control => { control.disabled = true })
        try { await action() } catch (error) { toast(error.message) }
        finally {
            recovering = false
            controls.forEach(control => { control.disabled = false })
            refreshRecoveries()
        }
    }
    $('#retry-save').addEventListener('click', () => recoveryAction(() => progressStorage.retry()))
    $('#load-saved').addEventListener('click', () => recoveryAction(async () => {
        // Preserve the exact visible draft before the learner chooses DB state.
        downloadProgress(progress)
        progress = await progressStorage.useSaved()
        await route(true)
    }))
    $('#recover-draft').addEventListener('click', () => recoveryAction(async () => {
        downloadProgress(progress)
        progress = await progressStorage.recover($('#recovery-draft').value)
        await route(true)
    }))
    window.addEventListener('storage', refreshRecoveries)
    refreshRecoveries()
    window.addEventListener('beforeunload', event => {
        if (progressStorage.hasPending()) { event.preventDefault(); event.returnValue = '' }
    })
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') void progressStorage.flush()
    })
    $('.skip-link').addEventListener('click', event => {
        event.preventDefault()
        $('#main').focus()
        $('#main').scrollIntoView()
    })
    const stages = [{ id: 'all', title: 'All stages' }, ...catalog.stages]
    for (const stage of stages) {
        const button = node('button', stage.id === 'all' ? 'tab selected' : 'tab', stage.title)
        button.setAttribute('aria-pressed', String(stage.id === 'all'))
        button.addEventListener('click', () => {
            activeStage = stage.id
            document.querySelectorAll('.tab').forEach(item => { item.classList.remove('selected'); item.setAttribute('aria-pressed', 'false') })
            button.classList.add('selected')
            button.setAttribute('aria-pressed', 'true')
            refresh()
        })
        $('#stage-tabs').append(button)
    }
    catalog.library.forEach(item => $('#library-grid').append(link(`${item.title} ↗`, item.path, 'library-card')))
    $('#search').addEventListener('input', refresh)
    $('#practice-search').addEventListener('input', refreshPractice)
    $('#practice-category').addEventListener('change', refreshPractice)
    $('#practice-show-all').addEventListener('click', () => {
        showAllPractice = true
        refreshPractice()
        // Move focus to the first newly revealed item when the button disappears.
        $('#practice-grid').children[9]?.focus()
    })
    refreshPractice()
    for (const [selector, entries] of [
        ['#assignment-topic', catalog.assignmentTopics ?? []],
        ['#assignment-level', catalog.assignmentLevels ?? []],
        ['#assignment-environment', catalog.assignmentEnvironments ?? []],
    ]) {
        for (const entry of entries) {
            const option = node('option', '', entry.title)
            option.value = entry.id
            $(selector).append(option)
        }
        $(selector).addEventListener('change', refreshAssignments)
    }
    for (const level of catalog.assignmentLevels ?? []) {
        const guide = node('div', 'assignment-level')
        guide.append(node('h2', '', level.title), node('p', '', level.description))
        $('#assignment-level-guide').append(guide)
    }
    $('#assignment-search').addEventListener('input', refreshAssignments)
    $('#assignment-reset').addEventListener('click', () => {
        $('#assignment-search').value = ''
        for (const selector of ['#assignment-topic', '#assignment-level', '#assignment-environment']) $(selector).value = 'all'
        refreshAssignments()
        $('#assignment-search').focus()
    })
    $('#complete-button').addEventListener('click', () => {
        const item = currentChallenge ?? currentLesson
        if (!item || recovering) return
        const id = item.id
        progress.completed = progress.completed.includes(id) ? progress.completed.filter(value => value !== id) : [...progress.completed, id]
        save()
        $('#complete-button').textContent = progress.completed.includes(id) ? 'Completed · undo' : 'Mark complete ✓'
        refresh()
        refreshChallenges()
    })
    $('#lesson-notes').addEventListener('input', event => {
        const item = currentChallenge ?? currentLesson
        if (item && !recovering) { progress.notes[item.id] = event.target.value; save() }
    })
    $('#export-progress').addEventListener('click', () => {
        downloadProgress(progress)
        toast('Progress exported. Keep this file with your learning journal.')
    })
    $('#import-progress').addEventListener('click', () => $('#progress-file').click())
    $('#progress-file').addEventListener('change', async event => {
        const file = event.target.files[0]
        if (!file || recovering) { event.target.value = ''; return }
        await recoveryAction(async () => {
            try {
                const incoming = parseProgress(JSON.parse(await file.text()), lessonIds, true)
                const merged = mergeProgress(progress, incoming, lessonIds)
                progress = merged.progress
                save()
                const saved = await progressStorage.flush()
                await route(true)
                toast(!saved ? 'Imported into this draft. Check the save status and export it before leaving.'
                    : merged.conflicts
                    ? `Progress merged. Kept ${merged.conflicts} existing note(s) that differed from the backup.`
                    : 'Progress imported. Existing notes and completions were kept.')
            } catch (error) {
                toast(`Import failed: ${error.message}`)
            } finally { event.target.value = '' }
        })
    })
    window.addEventListener('hashchange', () => route())
    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        const anchor = event.target.closest?.('a[href]')
        if (anchor?.getAttribute('href').startsWith('#') && anchor.hash === location.hash) {
            // Clicking the selected section again must still move focus/scroll
            // after the reader has scrolled elsewhere; hashchange will not fire.
            event.preventDefault()
            void route()
        }
    })
    await route()
}
init().catch(error => {
    $('#challenge-dashboard').hidden = true
    $('#assignment-dashboard').hidden = true
    $('#dashboard').hidden = true
    $('#reader').hidden = true
    $('#retry-save').hidden = true
    $('#load-saved').hidden = true
    $('#save-status').textContent = 'Progress could not be loaded. No empty progress was uploaded.'
    $('#save-status').dataset.state = 'error'
    $('#error').hidden = false
    const reload = node('button', 'quiet-button', 'Reload reader')
    reload.type = 'button'
    reload.addEventListener('click', () => location.reload())
    $('#error').replaceChildren(node('p', '', `Could not open the reader: ${error.message}`),
        node('p', '', mode === 'local'
            ? 'Start npm run course, use its http://127.0.0.1 address, then reload. Your database and browser recovery drafts are kept.'
            : 'Your saved browser record was kept. If it is unreadable, use another browser and import a valid JSON backup.'), reload)
})
