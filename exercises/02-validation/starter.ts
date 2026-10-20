export type ValidationResult = { emailError: string | null; passwordError: string | null }

export function validateInput(email: string, password: string): ValidationResult {
    throw new Error('Exercise 02: implement validateInput')
}
