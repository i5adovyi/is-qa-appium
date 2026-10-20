import BaseScreen from './BaseScreen.js'

class FormsScreen extends BaseScreen {
    constructor() {
        super('~Forms-screen')
    }

    get input() { return $('~text-input') }
    get inputResult() { return $('~input-text-result') }
    get switch() { return $('~switch') }
    get switchText() { return $('~switch-text') }
}

export default new FormsScreen()
