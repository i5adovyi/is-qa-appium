export type Credentials = { email: string; password: string }

export function makeCredentials(email: string, password: string): Credentials {
    return { email: email.trim(), password }
}
