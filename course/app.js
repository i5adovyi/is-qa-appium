'use strict'
const $ = selector => document.querySelector(selector)
const storageKey = 'mobile-automation-lab-v1'
let catalog, currentLesson, activeStage = 'all', renderId = 0
let progress = { completed: [], notes: {} }
try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    if (saved && Array.isArray(saved.completed) && saved.notes && typeof saved.notes === 'object') progress = saved
} catch {}
function toast(message) {
    $('#toast').textContent = message
    $('#toast').hidden = false
    setTimeout(() => { $('#toast').hidden = true }, 3000)
}
function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)) }
    catch { toast('Browser storage is unavailable. Export your progress before leaving.') }
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
function refresh() {
    const done = catalog.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
    $('#progress-number').textContent = `${done}/16`
    $('#progress-fill').style.width = `${done / 16 * 100}%`
    const next = catalog.lessons.find(lesson => !progress.completed.includes(lesson.id)) ?? catalog.lessons[0]
    $('#continue-link').href = `#${next.path}`
    $('#continue-link').textContent = done === 16 ? 'Revisit the course ↗' : done ? `Continue with lesson ${next.id} ↗` : 'Start learning ↗'
    const nav = $('#lesson-nav')
    nav.replaceChildren()
    for (const stage of catalog.stages) {
        nav.append(node('div', 'nav-stage', stage.title))
        for (const lesson of catalog.lessons.filter(item => item.stage === stage.id)) {
            const item = link('', lesson.path, 'nav-lesson')
            item.append(node('span', 'nav-number', progress.completed.includes(lesson.id) ? '✓' : lesson.id), node('span', '', lesson.title))
            if (lesson.path === decodeURIComponent(location.hash.slice(1))) {
                item.classList.add('active')
                item.setAttribute('aria-current', 'page')
            }
            nav.append(item)
        }
    }
    const query = $('#search').value.toLowerCase().trim()
    const visible = catalog.lessons.filter(lesson => (activeStage === 'all' || lesson.stage === activeStage)
        && `${lesson.title} ${lesson.subtitle}`.toLowerCase().includes(query))
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
        const base = heading.textContent.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-')
        const count = slugs.get(base) ?? 0
        slugs.set(base, count + 1)
        heading.id = count ? `${base}-${count}` : base
    })
    template.content.querySelectorAll('a[href]').forEach(anchor => {
        const href = anchor.getAttribute('href')
        if (href.startsWith('#')) {
            anchor.addEventListener('click', event => {
                event.preventDefault()
                document.getElementById(decodeURIComponent(href.slice(1)))?.scrollIntoView()
            })
            return
        }
        const resolved = new URL(href, `${location.origin}/${page}`)
        if (!['http:', 'https:'].includes(resolved.protocol)) {
            anchor.removeAttribute('href')
        } else if (resolved.origin === location.origin) {
            const target = decodeURIComponent(resolved.pathname.slice(1))
            anchor.href = `#${target}`
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
async function route() {
    const requestId = ++renderId
    const page = decodeURIComponent(location.hash.slice(1)) || 'home'
    $('#error').hidden = true
    $('#dashboard').hidden = page !== 'home'
    $('#reader').hidden = page === 'home'
    currentLesson = catalog.lessons.find(lesson => lesson.path === page)
    refresh()
    if (page === 'home') { document.title = 'Mobile Automation Lab'; window.scrollTo({ top: 0 }); return }
    $('#article').replaceChildren(node('p', '', 'Loading your lesson…'))
    $('#lesson-actions').hidden = true
    try {
        const response = await fetch(`/api/page?path=${encodeURIComponent(page)}`)
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        if (requestId !== renderId) return
        $('#article').replaceChildren(safeContent(data.html, page))
        $('#reader-stage').textContent = currentLesson
            ? catalog.stages.find(stage => stage.id === currentLesson.stage).title
            : page.includes('/solutions/') ? 'WORKED SOLUTION · TRY THE EXERCISE FIRST' : 'THE WORKBENCH'
        document.title = `${$('#article h1')?.textContent ?? 'Course reader'} · Mobile Automation Lab`
        $('#lesson-actions').hidden = !currentLesson
        if (currentLesson) {
            const index = catalog.lessons.indexOf(currentLesson)
            $('#complete-button').textContent = progress.completed.includes(currentLesson.id) ? 'Completed · undo' : 'Mark complete ✓'
            $('#lesson-notes').value = progress.notes[currentLesson.id] ?? ''
            $('#previous-lesson').href = `#${catalog.lessons[index - 1]?.path ?? 'home'}`
            $('#next-lesson').href = `#${catalog.lessons[index + 1]?.path ?? 'home'}`
            $('#next-lesson').textContent = index === 15 ? 'Back to the path →' : 'Next lesson →'
            $('#solution-link').href = `#${page.replace('/lessons/', '/solutions/')}`
        }
        window.scrollTo({ top: 0 })
    } catch (error) {
        if (requestId !== renderId) return
        $('#article').replaceChildren()
        $('#error').hidden = false
        $('#error').textContent = `Could not load this page: ${error.message}`
    }
}
async function init() {
    const response = await fetch('/api/catalog')
    if (!response.ok) throw new Error('Course catalog is unavailable')
    catalog = await response.json()
    $('.skip-link').addEventListener('click', event => {
        event.preventDefault()
        $('#main').focus()
        $('#main').scrollIntoView()
    })
    const knownIds = new Set(catalog.lessons.map(lesson => lesson.id))
    progress.completed = [...new Set(progress.completed)].filter(id => knownIds.has(id))
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
    $('#complete-button').addEventListener('click', () => {
        if (!currentLesson) return
        const id = currentLesson.id
        progress.completed = progress.completed.includes(id) ? progress.completed.filter(value => value !== id) : [...progress.completed, id]
        save()
        $('#complete-button').textContent = progress.completed.includes(id) ? 'Completed · undo' : 'Mark complete ✓'
        refresh()
    })
    $('#lesson-notes').addEventListener('input', event => {
        if (currentLesson) { progress.notes[currentLesson.id] = event.target.value; save() }
    })
    $('#export-progress').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify({ course: catalog.title, exportedAt: new Date().toISOString(), ...progress }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const download = document.createElement('a')
        download.href = url
        download.download = 'mobile-automation-progress.json'
        download.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        toast('Progress exported. Keep this file with your learning journal.')
    })
    window.addEventListener('hashchange', route)
    await route()
}
init().catch(error => { $('#error').hidden = false; $('#error').textContent = error.message })
