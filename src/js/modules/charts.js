// Chart Management
import { Helpers } from '../utils/helpers.js';

export class ChartManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.createRevenueChart();
        this.createGrowthChart();
        this.setupChartResize();
        
        // Update charts on theme change
        window.addEventListener('themechange', () => {
            this.updateChartColors();
        });
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Generate data for the last 30 days
        const labels = [];
        const data = [];
        let current = 10000;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Add some randomness to data
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
                    borderColor: Helpers.getCSSVariable('--primary-500'),
                    backgroundColor: Helpers.getCSSVariable('--primary-50'),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: Helpers.getCSSVariable('--primary-500'),
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `Revenue: ${Helpers.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: Helpers.getCSSVariable('--neutral-200')
                        },
                        ticks: {
                            color: Helpers.getCSSVariable('--neutral-600'),
                            callback: (value) => Helpers.formatCurrency(value)
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: Helpers.getCSSVariable('--neutral-600'),
                            maxTicksLimit: 8
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });

        this.charts.set('revenue', chart);
    }

    createGrowthChart() {
        const ctx = document.getElementById('growthChart').getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['New Users', 'Returning Users', 'Churned'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        Helpers.getCSSVariable('--chart-1'),
                        Helpers.getCSSVariable('--chart-2'),
                        Helpers.getCSSVariable('--chart-4')
                    ],
                    borderWidth: 0,
                    borderRadius: 8,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: Helpers.getCSSVariable('--neutral-600'),
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('growth', chart);
    }

    updateChartColors() {
        this.charts.forEach(chart => {
            // Update chart colors based on theme
            chart.update('none');
        });
    }

    setupChartResize() {
        const resizeObserver = new ResizeObserver(
            Helpers.debounce(() => {
                this.charts.forEach(chart => chart.resize());
            }, 100)
        );

        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            resizeObserver.observe(container);
        });
    }

    destroy() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}
