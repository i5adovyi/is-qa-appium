/**
 * Bottom navigation bar. In the app each tab has an accessibility label equal to its title,
 * so the "~" (accessibility id) selector finds it on both Android and iOS.
 */
class TabBar {
    get home() { return $('~Home') }
    get login() { return $('~Login') }
    get forms() { return $('~Forms') }

    async waitForTabBarShown() {
        await this.home.waitForDisplayed({ timeout: 30000 })
    }

    async openLogin() {
        await this.login.click()
    }

    async openForms() {
        await this.forms.click()
    }
}

export default new TabBar()
