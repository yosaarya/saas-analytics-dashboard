// ========== HELPERS ==========
const Helpers = {
    formatCurrency: function(amount, currency) {
        currency = currency || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatPercent: function(value) {
        return (value > 0 ? '+' : '') + value.toFixed(1) + '%';
    },

    randomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction() {
            const args = arguments;
            const later = function() {
                clearTimeout(timeout);
                func.apply(this, args);
            }.bind(this);
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ========== THEME MANAGER ==========
function ThemeManager() {
    this.themeToggle = document.getElementById('themeToggle');
    if (this.themeToggle) {
        this.themeIcon = this.themeToggle.querySelector('i');
        this.init();
    }
}

ThemeManager.prototype.init = function() {
    this.updateThemeIcon();
    var self = this;
    this.themeToggle.addEventListener('click', function() {
        self.toggleTheme();
    });
};

ThemeManager.prototype.toggleTheme = function() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
};

ThemeManager.prototype.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
};

ThemeManager.prototype.updateThemeIcon = function() {
    if (!this.themeIcon) return;
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        this.themeIcon.className = 'fas fa-sun';
    } else {
        this.themeIcon.className = 'fas fa-moon';
    }
};

// ========== CHART MANAGER ==========
function ChartManager() {
    this.charts = {};
    this.init();
}

ChartManager.prototype.init = function() {
    this.createRevenueChart();
    this.createGrowthChart();
};

ChartManager.prototype.createRevenueChart = function() {
    var ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    ctx = ctx.getContext('2d');
    var labels = [];
    var data = [];
    var current = 10000;
    
    for (var i = 30; i >= 0; i--) {
        var date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        current += Helpers.randomNumber(-500, 800);
        data.push(Math.max(current, 5000));
    }

    var chart = new Chart(ctx, {
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
                        callback: function(value) {
                            return Helpers.formatCurrency(value);
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });

    this.charts.revenue = chart;
};

ChartManager.prototype.createGrowthChart = function() {
    var ctx = document.getElementById('growthChart');
    if (!ctx) return;
    
    ctx = ctx.getContext('2d');
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['New Users', 'Returning', 'Churned'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#8b5cf6', '#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'right' } }
        }
    });

    this.charts.growth = chart;
};

// ========== API SERVICE ==========
function ApiService() {
    this.mockData = {
        activities: [
            { user: 'John Doe', action: 'Purchased Premium', time: '2m ago' },
            { user: 'Jane Smith', action: 'Updated Profile', time: '15m ago' },
            { user: 'Bob Wilson', action: 'Canceled Subscription', time: '1h ago' }
        ],
        products: [
            { name: 'Premium Plan', sales: 245, revenue: 24500 },
            { name: 'Business Plan', sales: 189, revenue: 18900 },
            { name: 'Basic Plan', sales: 156, revenue: 15600 }
        ]
    };
}

ApiService.prototype.getActivities = function() {
    var self = this;
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(self.mockData.activities);
        }, 300);
    });
};

ApiService.prototype.getProducts = function() {
    var self = this;
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(self.mockData.products);
        }, 300);
    });
};

// ========== MAIN DASHBOARD ==========
function AnalyticsDashboard() {
    this.themeManager = null;
    this.chartManager = null;
    this.apiService = null;
    this.init();
}

AnalyticsDashboard.prototype.init = function() {
    // Hide loading screen
    setTimeout(function() {
        var loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1000);
    
    // Initialize
    this.themeManager = new ThemeManager();
    this.chartManager = new ChartManager();
    this.apiService = new ApiService();
    
    // Setup events
    this.setupEventListeners();
    
    // Load data
    this.loadData();
    
    // Auto-update
    this.startUpdates();
};

AnalyticsDashboard.prototype.setupEventListeners = function() {
    // Menu toggle
    var menuToggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        var self = this;
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
};

AnalyticsDashboard.prototype.loadData = function() {
    var self = this;
    
    self.apiService.getActivities()
        .then(function(activities) {
            self.renderActivities(activities);
        })
        .catch(function(error) {
            console.error('Error loading activities:', error);
        });
    
    self.apiService.getProducts()
        .then(function(products) {
            self.renderProducts(products);
        })
        .catch(function(error) {
            console.error('Error loading products:', error);
        });
};

AnalyticsDashboard.prototype.renderActivities = function(activities) {
    var container = document.getElementById('activityList');
    if (!container) return;
    
    var html = '';
    for (var i = 0; i < activities.length; i++) {
        var item = activities[i];
        html += '<div class="activity-item">' +
                '<div class="activity-avatar"><i class="fas fa-user-circle"></i></div>' +
                '<div class="activity-details">' +
                '<div class="activity-user">' + item.user + '</div>' +
                '<div class="activity-action">' + item.action + '</div>' +
                '</div>' +
                '<div class="activity-time">' + item.time + '</div>' +
                '</div>';
    }
    
    container.innerHTML = html;
};

AnalyticsDashboard.prototype.renderProducts = function(products) {
    var container = document.getElementById('productsList');
    if (!container) return;
    
    var html = '';
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        html += '<div class="product-item">' +
                '<div class="product-name">' + product.name + '</div>' +
                '<div class="product-sales">' + product.sales + ' sales</div>' +
                '<div class="product-revenue">' + Helpers.formatCurrency(product.revenue) + '</div>' +
                '</div>';
    }
    
    container.innerHTML = html;
};

AnalyticsDashboard.prototype.startUpdates = function() {
    var self = this;
    // Update activities every 30 seconds
    setInterval(function() {
        self.simulateNewActivity();
    }, 30000);
};

AnalyticsDashboard.prototype.simulateNewActivity = function() {
    var users = ['Alex Johnson', 'Maria Garcia', 'David Chen'];
    var actions = ['logged in', 'made purchase', 'updated settings'];
    
    var container = document.getElementById('activityList');
    if (!container) return;
    
    var newItem = {
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        time: 'just now'
    };
    
    var newActivity = '<div class="activity-item slide-in">' +
        '<div class="activity-avatar"><i class="fas fa-user-circle"></i></div>' +
        '<div class="activity-details">' +
        '<div class="activity-user">' + newItem.user + '</div>' +
        '<div class="activity-action">' + newItem.action + '</div>' +
        '</div>' +
        '<div class="activity-time">' + newItem.time + '</div>' +
        '</div>';
    
    container.insertAdjacentHTML('afterbegin', newActivity);
    if (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
};

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new AnalyticsDashboard();
});

// ========== CSS VARIABLES ==========
var style = document.createElement('style');
style.textContent = '' +
':root {' +
'    --primary: #0ea5e9;' +
'    --bg-primary: #f8fafc;' +
'    --text-primary: #1e293b;' +
'    --neutral-200: #e2e8f0;' +
'    --neutral-100: #f1f5f9;' +
'    --neutral-50: #f8fafc;' +
'    --neutral-800: #1e293b;' +
'    --neutral-600: #475569;' +
'    --neutral-500: #64748b;' +
'    --radius-lg: 0.75rem;' +
'    --radius-md: 0.5rem;' +
'    --space-1: 0.25rem;' +
'    --space-2: 0.5rem;' +
'    --space-3: 0.75rem;' +
'    --space-4: 1rem;' +
'    --space-6: 1.5rem;' +
'    --space-8: 2rem;' +
'    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);' +
'}' +
'' +
'[data-theme="dark"] {' +
'    --bg-primary: #0f172a;' +
'    --text-primary: #f1f5f9;' +
'    --neutral-200: #334155;' +
'    --neutral-100: #1e293b;' +
'    --neutral-50: #0f172a;' +
'}' +
'' +
'body {' +
'    font-family: \'Inter\', sans-serif;' +
'    background: var(--bg-primary);' +
'    color: var(--text-primary);' +
'    margin: 0;' +
'    padding: 0;' +
'    transition: background 0.3s;' +
'}';

document.head.appendChild(style);
