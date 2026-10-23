import { expect } from 'chai'
import { captureTrainingEvidence } from '../../reference-evidence.js'

const appPackage = 'com.saucelabs.mydemoapp.android'
const id = (name: string) => `id=${appPackage}:id/${name}`
const backpackImage = `//*[@resource-id="${appPackage}:id/titleTV" and @text="Sauce Labs Backpack"]/../*[@resource-id="${appPackage}:id/productIV"]`

async function expectText(selector: string, expected: string) {
    await driver.waitUntil(async () => (await $(selector).getText()) === expected, {
        timeoutMsg: `${selector} should show ${JSON.stringify(expected)}`,
    })
    expect(await $(selector).getText()).to.equal(expected)
}

async function openBackpack() {
    await expectText(id('productTV'), 'Products')
    expect(await $$(backpackImage)).to.have.length(1)
    await $(backpackImage).click()
    await expectText(id('productTV'), 'Sauce Labs Backpack')
    await expectText(id('priceTV'), '$ 29.99')
    await expectText(id('noTV'), '1')
}

// Maintainer compatibility checks, not assignment attempts or learner grades.
// reloadSession is deliberately expensive: these checks verify the configured reset boundary.
// Use only a dedicated test device; noReset:false can clear this app's local data.
describe('My Demo App compatibility', () => {
    beforeEach(async () => {
        await driver.reloadSession()
        expect(await driver.getCurrentPackage()).to.equal(appPackage)
        await expectText(id('productTV'), 'Products')
    })

    it('updates quantity and total for the identified product, then removes it', async () => {
        await $('~View cart').click()
        await expectText(id('noItemTitleTV'), 'No Items')
        await $(id('shoppingBt')).click()
        await openBackpack()
        await $('~Increase item quantity').click()
        await expectText(id('noTV'), '2')
        await $('~Tap to add product to cart').click()
        await $('~View cart').click()
        await expectText(id('productTV'), 'My Cart')
        await expectText(id('titleTV'), 'Sauce Labs Backpack')
        await expectText(id('priceTV'), '$ 29.99') // Row displays unit price, not line total.
        await expectText(id('noTV'), '2')
        await expectText(id('itemsTV'), '2 Items')
        await expectText(id('totalPriceTV'), '$ 59.98')
        await captureTrainingEvidence('saucelabs', 'two-unit-cart')

        await $('~Decrease item quantity').click()
        await expectText(id('noTV'), '1')
        await expectText(id('totalPriceTV'), '$ 29.99')
        await $('~Removes product from cart').click()
        await expectText(id('noItemTitleTV'), 'No Items')
        expect(await $(id('titleTV')).isExisting()).to.equal(false)
        await captureTrainingEvidence('saucelabs', 'removed-product')
    })

    it('starts a new session with an empty cart after a populated session', async () => {
        await openBackpack()
        await $('~Tap to add product to cart').click()
        await $('~View cart').click()
        await expectText(id('titleTV'), 'Sauce Labs Backpack')
        await expectText(id('noTV'), '1')
        await captureTrainingEvidence('saucelabs', 'before-session-reset')

        await driver.reloadSession()
        await expectText(id('productTV'), 'Products')
        await $('~View cart').click()
        await expectText(id('noItemTitleTV'), 'No Items')
        expect(await $(id('titleTV')).isExisting()).to.equal(false)
        await captureTrainingEvidence('saucelabs', 'after-session-reset')
    })
})
