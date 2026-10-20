/**
 * Every screen has one element that proves "this screen is open".
 * Child screens pass its selector here and get waitForIsShown() for free.
 */
export default class BaseScreen {
    constructor(private readonly screenSelector: string) {}

    async waitForIsShown(isShown = true): Promise<boolean | void> {
        return $(this.screenSelector).waitForDisplayed({ reverse: !isShown })
    }
}
