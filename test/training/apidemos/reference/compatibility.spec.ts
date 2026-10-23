import { expect } from 'chai'
import { captureTrainingEvidence } from '../../reference-evidence.js'

const appPackage = 'io.appium.android.apis'
// The hierarchy has three checkbox IDs. Scope by the exact preference title.
const checkboxRow = '//*[@resource-id="android:id/title" and @text="Checkbox preference"]/../..'
const checkbox = `${checkboxRow}//*[@resource-id="android:id/checkbox"]`

async function openPreferences() {
    await $('~Preference').waitForDisplayed()
    await $('~Preference').click()
    await $('~1. Preferences from XML').click()
    await $(checkbox).waitForDisplayed()
    expect(await $$(checkbox)).to.have.length(1)
}

async function expectChecked(expected: boolean) {
    await driver.waitUntil(async () => (await $(checkbox).getAttribute('checked')) === String(expected), {
        timeoutMsg: `Checkbox preference should be checked=${expected}`,
    })
    expect(await $(checkbox).getAttribute('checked')).to.equal(String(expected))
}

// Maintainer compatibility checks, separate from learner assignment files.
// Every case gets a new session so it can run independently on the pinned app.
// noReset:false can clear this app's local data; use a dedicated test device.
describe('ApiDemos compatibility', () => {
    beforeEach(async () => {
        await driver.reloadSession()
        expect(await driver.getCurrentPackage()).to.equal(appPackage)
        await $('~App').waitForDisplayed()
    })

    it('changes the scoped checkbox in both directions', async () => {
        await openPreferences()
        await expectChecked(false)
        await $(checkboxRow).click()
        await expectChecked(true)
        await captureTrainingEvidence('apidemos', 'checked-preference')
        await $(checkboxRow).click()
        await expectChecked(false)
    })

    it('preserves a saved preference across process restart and clears it at a new session', async () => {
        await openPreferences()
        await expectChecked(false)
        await $(checkboxRow).click()
        await expectChecked(true)
        await driver.terminateApp(appPackage)
        await driver.activateApp(appPackage)
        await openPreferences()
        await expectChecked(true)
        await captureTrainingEvidence('apidemos', 'preference-after-process-restart')

        await driver.reloadSession()
        await openPreferences()
        await expectChecked(false)
        await captureTrainingEvidence('apidemos', 'preference-after-session-reset')
    })

    it('dismisses an observed modal with Back while keeping its underlying screen', async () => {
        await $('~App').click()
        await $('~Alert Dialogs').click()
        const trigger = '~OK Cancel dialog with a message'
        await $(trigger).waitForDisplayed()
        expect(await $('id=android:id/alertTitle').isExisting()).to.equal(false)
        await $(trigger).click()
        await $('id=android:id/alertTitle').waitForDisplayed()
        expect(await $('id=android:id/button2').getText()).to.equal('Cancel')
        await captureTrainingEvidence('apidemos', 'open-native-dialog')
        await driver.back()
        await $('id=android:id/alertTitle').waitForExist({ reverse: true })
        expect(await $(trigger).isDisplayed()).to.equal(true)
        expect(await driver.getCurrentPackage()).to.equal(appPackage)
        await captureTrainingEvidence('apidemos', 'dialog-dismissed')
    })
})
