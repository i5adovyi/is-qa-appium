export type Fixture = { id: string }
export type FixtureOperations = {
    create: () => Promise<Fixture>
    use: (fixture: Fixture) => Promise<void>
    remove: (id: string) => Promise<void>
}

export async function withFixture(operations: FixtureOperations): Promise<void> {
    const fixture = await operations.create()
    let useFailed = false
    let useError: unknown
    try {
        await operations.use(fixture)
    } catch (error) {
        useFailed = true
        useError = error
    }
    try {
        await operations.remove(fixture.id)
    } catch (cleanupError) {
        if (useFailed) throw new AggregateError([useError, cleanupError], 'Test and cleanup failed')
        throw cleanupError
    }
    if (useFailed) throw useError
}
