export type WorkerPlan = {
    udid: string
    systemPort: number
    namespace: string
}

export function planWorkers(runId: string, udids: readonly string[], firstPort: number): WorkerPlan[] {
    throw new Error('Exercise 07: implement planWorkers')
}
