import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import LoginScreen from '../screens/LoginScreen.js'
import NativeAlert from '../helpers/NativeAlert.js'

describe('Login form', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown()
        await TabBar.openLogin()
        await LoginScreen.waitForIsShown()
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

        expect(await LoginScreen.emailError.isDisplayed()).to.be.true
        expect(await LoginScreen.passwordError.isDisplayed()).to.be.true
    })
})
