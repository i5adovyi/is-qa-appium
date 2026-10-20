export type Steps = {
    open: () => Promise<void>
    fill: () => Promise<void>
    submit: () => Promise<void>
}

export async function runLogin(steps: Steps): Promise<void> {
    throw new Error('Exercise 03: implement runLogin')
}
