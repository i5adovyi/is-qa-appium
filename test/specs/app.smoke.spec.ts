import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'

/**
 * Your very first test: does the app start and show its navigation?
 */
describe('App launch @smoke', () => {
    it('should open the app and show the tab bar', async () => {
        await TabBar.waitForTabBarShown()

        expect(await TabBar.home.isDisplayed()).to.be.true
        expect(await TabBar.login.isDisplayed()).to.be.true
    })
})
