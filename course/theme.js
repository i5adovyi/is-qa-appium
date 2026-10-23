// Runs before the stylesheet/body so a saved dark preference avoids a light flash.
// Theme is a browser preference, separate from lesson notes and their database.
(() => {
    const key = 'mobile-automation-lab-theme'
    const sizeKey = 'mobile-automation-lab-reading-size'
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const normalize = value => ['light', 'dark'].includes(value) ? value : 'system'
    const normalizeSize = value => value === 'larger' ? 'larger' : 'standard'
    const read = (name, normalizeValue) => {
        try { return normalizeValue(localStorage.getItem(name)) } catch { return normalizeValue(null) }
    }
    let preference = read(key, normalize)
    let readingSize = read(sizeKey, normalizeSize)
    function apply() {
        document.documentElement.dataset.theme = preference === 'system'
            ? system.matches ? 'dark' : 'light'
            : preference
        const control = document.getElementById('theme-select')
        if (control) control.value = preference
        document.documentElement.dataset.readingSize = readingSize
        const sizeControl = document.getElementById('reading-size-select')
        if (sizeControl) sizeControl.value = readingSize
    }
    apply()
    system.addEventListener('change', apply)
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) preference = read(key, normalize)
        if (event.key === sizeKey || event.key === null) readingSize = read(sizeKey, normalizeSize)
        apply()
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
        const sizeControl = document.getElementById('reading-size-select')
        if (!sizeControl) return
        document.getElementById('reading-size-control').hidden = false
        sizeControl.addEventListener('change', () => {
            readingSize = normalizeSize(sizeControl.value)
            apply()
            try {
                localStorage.setItem(sizeKey, readingSize)
                sizeControl.title = 'Reading text size saved in this browser'
            } catch {
                sizeControl.title = 'Text size applies for this visit; browser storage is unavailable'
            }
        })
    }, { once: true })
})()
