import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import FormsScreen from '../screens/FormsScreen.js'

describe('Forms screen', () => {
    beforeEach(async () => {
        await TabBar.waitForTabBarShown()
        await TabBar.openForms()
        await FormsScreen.waitForIsShown()
    })

    it('should echo typed text in the result field', async () => {
        const text = 'Hello Appium'
        await FormsScreen.input.setValue(text)

        expect(await FormsScreen.inputResult.getText()).to.equal(text)
    })

    it('should toggle the switch', async () => {
        expect(await FormsScreen.switchText.getText()).to.equal('Click to turn the switch ON')

        await FormsScreen.switch.click()

        expect(await FormsScreen.switchText.getText()).to.equal('Click to turn the switch OFF')
    })

    it('should clear the result when the input is cleared', async () => {
        const text = 'My first mobile test'

        await FormsScreen.input.setValue(text)
        expect(await FormsScreen.inputResult.getText()).to.equal(text)

        await FormsScreen.input.clearValue()
        expect(await FormsScreen.inputResult.getText()).to.equal('')
    })
})
