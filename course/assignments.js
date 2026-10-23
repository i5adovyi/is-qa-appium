// Assignment discovery does not read or mutate the learner's progress record.
export function findAssignments(catalog, { query = '', topic = 'all', level = 'all', environment = 'all' } = {}) {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const labels = (collection, id) => collection?.find(item => item.id === id)?.title ?? ''
    return (catalog.assignments ?? []).filter(item => {
        if (topic !== 'all' && item.topic !== topic) return false
        if (level !== 'all' && item.level !== level) return false
        if (environment !== 'all' && item.environment !== environment) return false
        const text = [item.id, item.title, item.summary, item.topic, item.level,
            item.environment, item.app, item.duration, ...(item.prerequisites ?? []), item.deliverable,
            labels(catalog.assignmentTopics, item.topic),
            labels(catalog.assignmentLevels, item.level),
            labels(catalog.assignmentEnvironments, item.environment)].join(' ').toLowerCase()
        return words.every(word => text.includes(word))
    })
}
