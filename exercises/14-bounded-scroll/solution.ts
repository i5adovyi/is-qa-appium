import { validateSearch } from './contract.ts'
import type { ListView, Row } from './contract.ts'

export async function findVisibleRow(view: ListView, targetId: string, maxScrolls: number): Promise<Row> {
    validateSearch(targetId, maxScrolls)
    let previous: string | undefined
    for (let scrolls = 0; scrolls <= maxScrolls; scrolls++) {
        const snapshot = await view.read()
        const visible = snapshot.rows.filter(row => row.visible)
        const matches = visible.filter(row => row.id === targetId)
        if (matches.length > 1) throw new Error(`Target ${JSON.stringify(targetId)} is ambiguous`)
        if (matches.length === 1) return matches[0]!
        if (snapshot.atEnd) throw new Error(`Target ${JSON.stringify(targetId)} not found: end reached`)
        const fingerprint = JSON.stringify(visible.map(row => row.id))
        if (fingerprint === previous) throw new Error(`Target ${JSON.stringify(targetId)} not found: no progress`)
        if (scrolls === maxScrolls) throw new Error(`Target ${JSON.stringify(targetId)} not found: scroll limit reached`)
        previous = fingerprint
        await view.scrollForward()
    }
    throw new Error('Unreachable search state')
}
