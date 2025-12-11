// src/js/bundle.js

// ========== HELPERS ==========
const Helpers = {
    formatCurrency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatPercent: (value) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    },

    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ========== THEME MANAGER ==========
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('i');
        this.init();
    }

    init() {
        if (!this.themeToggle) return;
        
        this.updateThemeIcon();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
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
    }

    updateThemeIcon() {
        if (!this.themeIcon) return;
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
        } else {
            this.themeIcon.className = 'fas fa-moon';
        }
    }
}

// ========== CHART MANAGER ==========
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.createRevenueChart();
        this.createGrowthChart();
        
        window.addEventListener('themechange', () => {
            this.updateChartColors();
        });
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart')?.getContext('2d');
        if (!ctx) return;

        const labels = [];
        const data = [];
        let current = 10000;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            current += Helpers.randomNumber(-500, 800);
            data.push(Math.max(current, 5000));
        }

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => Helpers.formatCurrency(value)
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });

        this.charts.set('revenue', chart);
    }

    createGrowthChart() {
        const ctx = document.getElementById('growthChart')?.getContext('2d');
        if (!ctx) return;
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['New Users', 'Returning', 'Churned'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['
