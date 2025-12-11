// Theme Management
export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.init();
    }

    init() {
        // Set initial theme
        this.updateThemeIcon();
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
        this.dispatchThemeChange(theme);
    }

    updateThemeIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    dispatchThemeChange(theme) {
        const event = new CustomEvent('themechange', { detail: { theme } });
        window.dispatchEvent(event);
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme');
    }
}
