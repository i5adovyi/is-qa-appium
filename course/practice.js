export function headingSlug(text) {
    return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-')
}

export function findPractice(entries, query = '', category = 'all') {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    return entries.filter(entry => (category === 'all' || entry.category === category)
        && words.every(word => entry.searchText.includes(word)))
}
