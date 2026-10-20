import TabBar from '../screens/TabBar.js'

/**
 * Restart this demo before each test to reset its in-memory form state.
 * This does NOT clear storage, permissions, or a real app's server-side data.
 * A real product needs its own reset strategy.
 */
export async function restartDemoApp() {
    await driver.terminateApp('com.wdiodemoapp')
    await driver.activateApp('com.wdiodemoapp')
    await TabBar.waitForTabBarShown()
}
