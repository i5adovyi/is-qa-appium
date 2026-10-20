/**
 * React Native Alert.alert uses an app-owned title resource in demo app v2.2.0.
 * The message and positive button retain Android framework resource ids.
 */
const SELECTORS = {
    title: 'android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")',
    message: 'android=new UiSelector().resourceId("android:id/message")',
    okButton: 'android=new UiSelector().resourceId("android:id/button1")',
}

class NativeAlert {
    async waitForIsShown(isShown = true) {
        return $(SELECTORS.title).waitForDisplayed({ reverse: !isShown })
    }

    async title() {
        return $(SELECTORS.title).getText()
    }

    async message() {
        return $(SELECTORS.message).getText()
    }

    async tapOk() {
        await $(SELECTORS.okButton).click()
    }
}

export default new NativeAlert()
