import { expect } from 'chai'
import TabBar from '../screens/TabBar.js'
import FormsScreen from '../screens/FormsScreen.js'
import { restartDemoApp } from '../helpers/restartApp.js'
import { waitForText } from '../helpers/waitForText.js'

describe('Forms screen', () => {
    beforeEach(async () => {
        await restartDemoApp()
        await TabBar.openForms()
        await FormsScreen.waitForIsShown()
    })

    it('should echo typed text in the result field', async () => {
        const text = 'Hello Appium'
        await FormsScreen.input.setValue(text)

        await waitForText(FormsScreen.inputResult, text)
        expect(await FormsScreen.inputResult.getText()).to.equal(text)
    })

    it('should toggle the switch', async () => {
        await waitForText(FormsScreen.switchText, 'Click to turn the switch ON')
        expect(await FormsScreen.switchText.getText()).to.equal('Click to turn the switch ON')

        await FormsScreen.switch.click()

        await waitForText(FormsScreen.switchText, 'Click to turn the switch OFF')
        expect(await FormsScreen.switchText.getText()).to.equal('Click to turn the switch OFF')
    })

    it('should clear the result when the input is cleared', async () => {
        const text = 'My first mobile test'

        await FormsScreen.input.setValue(text)
        await waitForText(FormsScreen.inputResult, text)
        expect(await FormsScreen.inputResult.getText()).to.equal(text)

        await FormsScreen.input.clearValue()
        await waitForText(FormsScreen.inputResult, '')
        expect(await FormsScreen.inputResult.getText()).to.equal('')
    })
})
