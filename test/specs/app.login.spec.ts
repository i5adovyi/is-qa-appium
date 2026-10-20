import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import LoginScreen from '../screens/LoginScreen.js'
import NativeAlert from '../helpers/NativeAlert.js'
import { restartDemoApp } from '../helpers/restartApp.js'

describe('Login form', () => {
    beforeEach(async () => {
        await restartDemoApp()
        await TabBar.openLogin()
        await LoginScreen.waitForIsShown()
        await LoginScreen.loginTab.click()
    })

    it('should log in with valid credentials @smoke', async () => {
        await LoginScreen.login('test@webdriver.io', 'Test1234!')

        await NativeAlert.waitForIsShown()
        expect(await NativeAlert.title()).to.equal('Success')
        expect(await NativeAlert.message()).to.equal('You are logged in!')

        await NativeAlert.tapOk()
        await NativeAlert.waitForIsShown(false)
    })

    it('should show validation errors for invalid input', async () => {
        await LoginScreen.login('not-an-email', '123')

        await LoginScreen.emailError.waitForDisplayed()
        await LoginScreen.passwordError.waitForDisplayed()
        expect(await LoginScreen.emailError.getText()).to.equal('Please enter a valid email address')
        expect(await LoginScreen.passwordError.getText()).to.equal('Please enter at least 8 characters')
    })

    it('should show both validation messages when empty fields are submitted', async () => {
        // First prove that clearFields removes actual text, not an already empty value.
        await LoginScreen.email.setValue('learner@example.com')
        await LoginScreen.password.setValue('Practice123!')
        await LoginScreen.emptyEmail.waitForExist({ reverse: true })
        await LoginScreen.emptyPassword.waitForExist({ reverse: true })
        expect(await LoginScreen.emptyEmail.isExisting()).to.be.false
        expect(await LoginScreen.emptyPassword.isExisting()).to.be.false

        await LoginScreen.clearFields()

        // Empty Android fields expose hint text; these selectors check the XML hint flag.
        await LoginScreen.emptyEmail.waitForExist()
        await LoginScreen.emptyPassword.waitForExist()
        expect(await LoginScreen.emptyEmail.isExisting()).to.be.true
        expect(await LoginScreen.emptyPassword.isExisting()).to.be.true
        expect(await LoginScreen.emailError.isExisting()).to.be.false
        expect(await LoginScreen.passwordError.isExisting()).to.be.false

        await LoginScreen.submit()

        await LoginScreen.emailError.waitForDisplayed()
        await LoginScreen.passwordError.waitForDisplayed()
        expect(await LoginScreen.emailError.getText()).to.equal('Please enter a valid email address')
        expect(await LoginScreen.passwordError.getText()).to.equal('Please enter at least 8 characters')
    })
})
