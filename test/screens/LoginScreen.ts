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
    // This driver exposes showing-hint in XML, but rejects direct attribute reads.
    // Narrow XPath is justified here to distinguish an empty input from literal placeholder text.
    get emptyEmail() { return $('//android.widget.EditText[@content-desc="input-email" and @showing-hint="true"]') }
    get emptyPassword() { return $('//android.widget.EditText[@content-desc="input-password" and @showing-hint="true"]') }

    // Validation messages have no id, so we find them by text with an Android UiSelector.
    get emailError() { return $('android=new UiSelector().text("Please enter a valid email address")') }
    get passwordError() { return $('android=new UiSelector().text("Please enter at least 8 characters")') }

    // --- actions ----------------------------------------------------------
    async clearFields() {
        await this.email.clearValue()
        await this.password.clearValue()
    }

    async submit() {
        // The on-screen keyboard can cover the button — hide it first.
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard()
        }
        await this.loginButton.click()
    }

    async login(email: string, password: string) {
        await this.loginTab.click()
        await this.email.setValue(email)
        await this.password.setValue(password)
        await this.submit()
    }
}

export default new LoginScreen()
