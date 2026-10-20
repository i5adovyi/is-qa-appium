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
    const ids = new Set<string>()
    const summary: Summary = {
        planned: results.length, executed: 0, passed: 0, failed: 0,
        skipped: 0, notRun: 0, recoveredOnRetry: 0, firstPassRate: null,
    }
    let firstPasses = 0
    for (const result of results) {
        if (!result.id.trim() || ids.has(result.id)) throw new Error('Invalid result')
        ids.add(result.id)
        if (result.disposition !== 'executed') {
            if (result.attempts.length) throw new Error('Invalid result')
            if (result.disposition === 'skipped') summary.skipped++
            else summary.notRun++
            continue
        }
        if (!result.attempts.length || result.attempts.slice(0, -1).includes('passed')) {
            throw new Error('Invalid result')
        }
        summary.executed++
        if (result.attempts[0] === 'passed') firstPasses++
        if (result.attempts.at(-1) === 'passed') {
            summary.passed++
            if (result.attempts.length > 1) summary.recoveredOnRetry++
        } else summary.failed++
    }
    if (summary.executed) summary.firstPassRate = firstPasses / summary.executed
    return summary
}
