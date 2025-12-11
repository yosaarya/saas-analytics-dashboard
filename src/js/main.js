// Main Application
import { ThemeManager } from './modules/theme.js';
import { ChartManager } from './modules/charts.js';
import { ApiService } from './modules/api.js';
import { Helpers } from './utils/helpers.js';

class AnalyticsDashboard {
    constructor() {
        this.themeManager = null;
        this.chartManager = null;
        this.apiService = null;
        this.init();
    }

    async init() {
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Initialize modules
        this.themeManager = new ThemeManager();
        this.chartManager = new ChartManager();
        this.apiService = new ApiService();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load data
        await this.loadData();
        
        // Update metrics periodically
        this.startDataUpdates();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }

    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Chart filter
        const chartFilter = document.querySelector('.chart-filter');
        if (chartFilter) {
            chartFilter.addEventListener('change', (e) => {
                this.handleChartFilterChange(e.target.value);
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (Helpers.isMobile() && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Window resize
        window.addEventListener('resize', Helpers.throttle(() => {
            this.handleResize();
        }, 200));
    }

    async loadData() {
        try {
            // Load activities
            const activities = await this.apiService.getActivities();
            this.renderActivities(activities);
            
            // Load products
            const products = await this.apiService.getProducts();
            this.renderProducts(products);
            
            // Load metrics
            const metrics = await this.apiService.getMetrics();
            this.updateMetrics(metrics);
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showErrorMessage('Failed to load data. Please refresh the page.');
        }
    }

    renderActivities(activities) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item slide-in">
                <div class="activity-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-user">${activity.user}</div>
                    <div class="activity-action">${activity.action}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    renderProducts(products) {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;

        productsList.innerHTML = products.map(product => `
            <div class="product-item slide-in">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-stats">
                        <span>${product.sales} sales</span>
                        <span>•</span>
                        <span class="${product.growth > 0 ? 'positive' : 'negative'}">
                            ${Helpers.formatPercent(product.growth)}
                        </span>
                    </div>
                </div>
                <div class="product-revenue">
                    ${Helpers.formatCurrency(product.revenue)}
                </div>
            </div>
        `).join('');
    }

    updateMetrics(metrics) {
        // Update metric cards
        const metricElements = {
            revenue: document.querySelector('.metric-card:nth-child(1) .metric-value'),
            users: document.querySelector('.metric-card:nth-child(2) .metric-value'),
            growth: document.querySelector('.metric-card:nth-child(3) .metric-value'),
            conversion: document.querySelector('.metric-card:nth-child(4) .metric-value')
        };

        if (metricElements.revenue) {
            metricElements.revenue.textContent = Helpers.formatCurrency(metrics.revenue);
        }
        if (metricElements.users) {
            metricElements.users.textContent = metrics.users.toLocaleString();
        }
        if (metricElements.growth) {
            metricElements.growth.textContent = Helpers.formatPercent(metrics.growth);
        }
        if (metricElements.conversion) {
            metricElements.conversion.textContent = Helpers.formatPercent(metrics.conversion);
        }
    }

    handleChartFilterChange(filter) {
        console.log('Filter changed to:', filter);
        // In a real app, this would update the chart data
        // For now, we'll just show a notification
        this.showNotification(`Showing data for: ${filter}`);
    }

    handleResize() {
        // Handle any resize-specific logic
        if (!Helpers.isMobile()) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('active');
        }
    }

    startDataUpdates() {
        // Update data every 30 seconds
        setInterval(async () => {
            const metrics = await this.apiService.getMetrics();
            this.updateMetrics(metrics);
        }, 30000);

        // Simulate real-time activity updates
        setInterval(() => {
            this.simulateNewActivity();
        }, 45000);
    }

    simulateNewActivity() {
        const activities = [
            'logged in', 'made a purchase', 'updated settings', 
            'started a trial', 'contacted support'
        ];
        
        const users = ['Alex Johnson', 'Maria Garcia', 'David Chen', 'Lisa Taylor'];
        const times = ['just now', '1m ago', '2m ago'];
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        
        const activityList = document.getElementById('activityList');
        if (activityList) {
            const newActivity = `
                <div class="activity-item slide-in">
                    <div class="activity-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-user">${randomUser}</div>
                        <div class="activity-action">${randomActivity}</div>
                    </div>
                    <div class="activity-time">${randomTime}</div>
                </div>
            `;
            
            // Add to top and remove last if too many
            activityList.insertAdjacentHTML('afterbegin', newActivity);
            if (activityList.children.length > 5) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast slide-in';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--neutral-50);
            border: 1px solid var(--neutral-200);
            border-radius: var(--radius-md);
            padding: var(--space-3) var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-3);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => notification.remove());
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--error);
            color: white;
            padding: var(--space-3) var(--space-4);
            border-radius: var(--radius-md);
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsDashboard = new AnalyticsDashboard();
});
