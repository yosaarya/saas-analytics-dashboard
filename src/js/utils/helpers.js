// Helper Functions
export const Helpers = {
    // Format currency
    formatCurrency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format percentage
    formatPercent: (value) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    },

    // Format date
    formatDate: (date, format = 'short') => {
        const options = format === 'short' 
            ? { month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric' };
        
        return new Date(date).toLocaleDateString('en-US', options);
    },

    // Generate random number between min and max
    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Debounce function
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
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if mobile
    isMobile: () => {
        return window.innerWidth <= 768;
    },

    // Get CSS variable value
    getCSSVariable: (variable) => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variable).trim();
    }
};
