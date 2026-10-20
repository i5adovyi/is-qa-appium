export type WorkerPlan = {
    udid: string
    systemPort: number
    namespace: string
}

export function planWorkers(runId: string, udids: readonly string[], firstPort: number): WorkerPlan[] {
    if (!runId || /[^A-Za-z0-9_-]/.test(runId)) throw new Error('Invalid run ID')
    if (udids.some(id => !id || id.trim() !== id) || new Set(udids).size !== udids.length) {
        throw new Error('Invalid device IDs')
    }
    if (!Number.isInteger(firstPort) || firstPort < 1024 || firstPort > 65535
        || firstPort + Math.max(udids.length - 1, 0) > 65535) {
        throw new Error('Invalid port range')
    }
    return udids.map((udid, index) => ({
        udid,
        systemPort: firstPort + index,
        namespace: `${runId}-w${index}`,
    }))
}
