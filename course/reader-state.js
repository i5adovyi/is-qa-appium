// A browser reading bookmark, independent of completion marks and evidence notes.
export const readingPlaceKey = 'mobile-automation-lab-reading-place-v1'

export function parseReadingPlace(raw) {
    try {
        const value = JSON.parse(raw)
        if (!value || typeof value !== 'object' || Array.isArray(value)) return null
        const { path, title, section = '' } = value
        if (typeof path !== 'string' || path.length > 500
            || !/^[\w./-]+\.(?:md|ts|mjs|json|ya?ml)$/.test(path)
            || path.startsWith('/') || path.split('/').some(part => !part || part === '.' || part === '..')) return null
        if (typeof title !== 'string' || !title.trim() || title.length > 300) return null
        if (typeof section !== 'string' || section.length > 300 || /[#\u0000-\u001f]/.test(section)) return null
        return { path, title: title.trim(), section }
    } catch { return null }
}

export function createReadingPlaceStore(storage) {
    let current = null
    try { current = parseReadingPlace(storage.getItem(readingPlaceKey)) } catch { /* Storage can be blocked. */ }
    return {
        get: () => current,
        remember(value) {
            const next = parseReadingPlace(JSON.stringify(value))
            if (!next) return false
            current = next
            try { storage.setItem(readingPlaceKey, JSON.stringify(next)); return true }
            catch { return false } // Keep the bookmark for this visit when persistence is unavailable.
        },
    }
}
