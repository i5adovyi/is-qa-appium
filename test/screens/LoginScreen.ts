import BaseScreen from './BaseScreen.js'

class LoginScreen extends BaseScreen {
    constructor() {
        super('~Login-screen')
    }

    // --- elements ---------------------------------------------------------
    get loginTab() { return $('~button-login-container') }
    get signUpTab() { return $('~button-sign-up-container') }
    get email() { return $('~input-email') }
    get password() { return $('~input-password') }
    get loginButton() { return $('~button-LOGIN') }

    // Validation messages have no id, so we find them by text with an Android UiSelector.
    get emailError() { return $('android=new UiSelector().text("Please enter a valid email address")') }
    get passwordError() { return $('android=new UiSelector().text("Please enter at least 8 characters")') }

    // --- actions ----------------------------------------------------------
    async login(email: string, password: string) {
        await this.loginTab.click()
        await this.email.setValue(email)
        await this.password.setValue(password)

        // The on-screen keyboard can cover the button — hide it first.
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard()
        }
        await this.loginButton.click()
    }
}

export default new LoginScreen()
