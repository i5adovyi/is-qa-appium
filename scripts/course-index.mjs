import { marked } from 'marked'
import { headingSlug } from '../course/practice.js'

// Lexer tokens keep headings inside code examples out of the navigation index.
export function indexCollection(collection, markdown) {
    const tokens = marked.lexer(markdown)
    const entries = []
    for (let i = 0; i < tokens.length; i++) {
        const heading = tokens[i]
        if (heading.type !== 'heading') continue
        // Indexed headings use plain text and inline code; keep reader text identical.
        const text = heading.text.replaceAll('`', '')
        const match = /^(RW-\d+|Q\d+|D\d+|S\d+) · (.+)$/.exec(text)
        if (!match || !match[1].startsWith(collection.prefix)) continue
        let end = i + 1
        while (end < tokens.length
            && !(tokens[end].type === 'heading' && tokens[end].depth <= heading.depth)) end++
        entries.push({
            id: match[1],
            title: match[2],
            category: collection.category,
            label: collection.label,
            path: collection.path,
            anchor: headingSlug(text),
            searchText: tokens.slice(i, end).map(token => token.raw).join('').toLowerCase(),
        })
    }
    return entries
}
