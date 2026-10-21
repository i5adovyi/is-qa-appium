// Shared by the reader and its offline tests. No browser storage or network access.
export function parseProgress(value, lessonIds, requireExport = false) {
    if (!value || typeof value !== 'object' || Array.isArray(value)
        || !Array.isArray(value.completed) || value.completed.some(id => typeof id !== 'string')
        || !value.notes || typeof value.notes !== 'object' || Array.isArray(value.notes)
        || Object.values(value.notes).some(note => typeof note !== 'string')) {
        throw new Error('Choose a course progress JSON file with completed lessons and text notes.')
    }
    if ((requireExport || value.course !== undefined) && value.course !== 'Mobile Automation Lab') {
        throw new Error('This progress file belongs to a different course.')
    }
    if (value.schemaVersion !== undefined && value.schemaVersion !== 1) {
        throw new Error('This progress format is not supported by this reader.')
    }
    const known = new Set(lessonIds)
    return {
        completed: [...new Set(value.completed)].filter(id => known.has(id)),
        notes: Object.fromEntries(Object.entries(value.notes).filter(([id]) => known.has(id))),
    }
}

export function mergeProgress(current, incoming, lessonIds) {
    const completed = new Set([...current.completed, ...incoming.completed])
    const notes = { ...current.notes }
    let conflicts = 0
    for (const [id, note] of Object.entries(incoming.notes)) {
        if (notes[id] && note && notes[id] !== note) conflicts++
        else if (!notes[id]) notes[id] = note
    }
    return { progress: { completed: lessonIds.filter(id => completed.has(id)), notes }, conflicts }
}

// Lesson and challenge IDs share one portable record, but retain separate UI totals.
export function progressIdsForCatalog(catalog) {
    return [...catalog.lessons, ...(catalog.challenges ?? [])].map(item => item.id)
}
