export type Result = {
    id: string
    attempts: readonly ('passed' | 'failed')[]
    disposition: 'executed' | 'skipped' | 'not-run'
}
export type Summary = {
    planned: number
    executed: number
    passed: number
    failed: number
    skipped: number
    notRun: number
    recoveredOnRetry: number
    firstPassRate: number | null
}

export function summarize(results: readonly Result[]): Summary {
    throw new Error('Exercise 09: implement summarize')
}
