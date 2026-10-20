export type ValidationResult = { emailError: string | null; passwordError: string | null }

export function validateInput(email: string, password: string): ValidationResult {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    return {
        emailError: validEmail ? null : 'Please enter a valid email address',
        passwordError: password.length >= 8 ? null : 'Please enter at least 8 characters',
    }
}
