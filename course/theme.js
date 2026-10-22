// Runs before the stylesheet/body so a saved dark preference avoids a light flash.
// Theme is a browser preference, separate from lesson notes and their database.
(() => {
    const key = 'mobile-automation-lab-theme'
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const normalize = value => ['light', 'dark'].includes(value) ? value : 'system'
    const read = () => {
        try { return normalize(localStorage.getItem(key)) } catch { return 'system' }
    }
    let preference = read()
    function apply() {
        document.documentElement.dataset.theme = preference === 'system'
            ? system.matches ? 'dark' : 'light'
            : preference
        const control = document.getElementById('theme-select')
        if (control) control.value = preference
    }
    apply()
    system.addEventListener('change', apply)
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) { preference = read(); apply() }
    })
    document.addEventListener('DOMContentLoaded', () => {
        const control = document.getElementById('theme-select')
        if (!control) return
        document.getElementById('theme-control').hidden = false
        apply()
        control.addEventListener('change', () => {
            preference = normalize(control.value)
            apply()
            try {
                localStorage.setItem(key, preference)
                control.title = 'Theme saved in this browser'
            } catch {
                control.title = 'Theme applies for this visit; browser storage is unavailable'
            }
        })
    }, { once: true })
})()
