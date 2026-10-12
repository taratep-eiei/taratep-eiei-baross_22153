(() => {
    const themeKey = 'siteTheme';
    const root = document.documentElement;
    const controls = document.querySelectorAll('.theme-toggle, .drawer-theme-toggle');

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        root.dataset.theme = isLight ? 'light' : 'dark';
        localStorage.setItem(themeKey, root.dataset.theme);

        controls.forEach((control) => {
            const icon = control.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = isLight ? 'dark_mode' : 'light_mode';
            control.setAttribute('aria-pressed', String(isLight));
            control.setAttribute('aria-label', isLight ? 'เปลี่ยนเป็นธีมมืด' : 'เปลี่ยนเป็นธีมสว่าง');
        });
    };

    applyTheme(localStorage.getItem(themeKey) || 'dark');

    controls.forEach((control) => {
        control.addEventListener('click', () => {
            applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
        });
    });
})();
