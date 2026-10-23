export type Row = Readonly<{ id: string; label: string; visible: boolean }>
export type Viewport = Readonly<{ rows: readonly Row[]; atEnd: boolean }>
export type ListView = {
    read: () => Promise<Viewport>
    scrollForward: () => Promise<void>
}

export function validateSearch(targetId: string, maxScrolls: number): void {
    if (!targetId || targetId.trim() !== targetId) throw new Error('Invalid target ID')
    if (!Number.isSafeInteger(maxScrolls) || maxScrolls < 0) {
        throw new Error('maxScrolls must be a nonnegative safe integer')
    }
}
