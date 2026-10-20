export type Steps = {
    open: () => Promise<void>
    fill: () => Promise<void>
    submit: () => Promise<void>
}

export async function runLogin(steps: Steps): Promise<void> {
    await steps.open()
    await steps.fill()
    await steps.submit()
}
