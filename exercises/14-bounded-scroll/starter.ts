import { validateSearch } from './contract.ts'
import type { ListView, Row } from './contract.ts'

// Deliberate repair exercise: a successful gesture is not a fresh observation.
export async function findVisibleRow(view: ListView, targetId: string, maxScrolls: number): Promise<Row> {
    validateSearch(targetId, maxScrolls)
    const snapshot = await view.read()
    for (let scrolls = 0; scrolls <= maxScrolls; scrolls++) {
        const row = snapshot.rows.find(item => item.id === targetId)
        if (row) return row
        if (scrolls < maxScrolls) await view.scrollForward()
    }
    throw new Error(`Target ${JSON.stringify(targetId)} not found: scroll limit reached`)
}
