export type Fixture = { id: string }
export type FixtureOperations = {
    create: () => Promise<Fixture>
    use: (fixture: Fixture) => Promise<void>
    remove: (id: string) => Promise<void>
}

export async function withFixture(operations: FixtureOperations): Promise<void> {
    throw new Error('Exercise 08: implement withFixture')
}
