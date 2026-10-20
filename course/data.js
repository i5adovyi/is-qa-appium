// One reader UI, with live local files or a prebuilt static course snapshot.
export function createCourseClient({ mode = 'local', baseUrl, fetcher = globalThis.fetch } = {}) {
    if (!['local', 'static'].includes(mode)) throw new Error('Unknown course data mode')
    let catalogPromise
    async function json(relative) {
        const response = await fetcher(new URL(relative, baseUrl))
        if (!response.ok) throw new Error(`Course content is unavailable (${response.status}). Rebuild or refresh the reader.`)
        return response.json()
    }
    function getCatalog() {
        if (mode === 'local') return json('./api/catalog')
        catalogPromise ??= json('./data/catalog.json').catch(error => { catalogPromise = undefined; throw error })
        return catalogPromise
    }
    async function getPage(name) {
        if (mode === 'local') return json(`./api/page?path=${encodeURIComponent(name)}`)
        const catalog = await getCatalog()
        if (!catalog.pageFiles || !Object.hasOwn(catalog.pageFiles, name)) {
            throw new Error('This page is not included in the published course. Open it in your local project.')
        }
        const asset = catalog.pageFiles[name]
        if (!/^data\/pages\/[a-f0-9]{64}\.json$/.test(asset)) throw new Error('Invalid course page asset')
        const page = await json(`./${asset}`)
        if (page.path !== name) throw new Error('Course page identity does not match the requested page')
        return page
    }
    return { getCatalog, getPage }
}
