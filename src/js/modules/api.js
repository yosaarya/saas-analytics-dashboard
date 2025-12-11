// Mock API Calls
import { Helpers } from '../utils/helpers.js';

export class ApiService {
    constructor() {
        this.baseUrl = 'https://api.example.com'; // Mock URL
        this.mockData = this.generateMockData();
    }

    generateMockData() {
        const activities = [
            { id: 1, user: 'John Doe', action: 'Purchased Premium Plan', time: '2m ago', type: 'purchase' },
            { id: 2, user: 'Jane Smith', action: 'Updated Profile Picture', time: '15m ago', type: 'update' },
            { id: 3, user: 'Robert Johnson', action: 'Submitted Support Ticket', time: '1h ago', type: 'support' },
            { id: 4, user: 'Sarah Williams', action: 'Cancelled Subscription', time: '2h ago', type: 'cancel' },
            { id: 5, user: 'Michael Brown', action: 'Upgraded to Enterprise', time: '4h ago', type: 'upgrade' }
        ];

        const products = [
            { id: 1, name: 'Premium SaaS Plan', sales: 245, revenue: 24500, growth: 12.5 },
            { id: 2, name: 'Business Analytics', sales: 189, revenue: 18900, growth: 8.2 },
            { id: 3, name: 'Marketing Toolkit', sales: 156, revenue: 15600, growth: -2.3 },
            { id: 4, name: 'Developer API', sales: 98, revenue: 9800, growth: 15.7 }
        ];

        const metrics = {
            revenue: 24580.90,
            users: 1842,
            growth: 24.8,
            conversion: 3.24
        };

        return { activities, products, metrics };
    }

    // Simulate API delay
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getActivities() {
        await this.delay(300); // Simulate network delay
        return this.mockData.activities;
    }

    async getProducts() {
        await this.delay(300);
        return this.mockData.products;
    }

    async getMetrics() {
        await this.delay(200);
        return this.mockData.metrics;
    }

    async updateMetric(metric, value) {
        await this.delay(100);
        this.mockData.metrics[metric] = value;
        return { success: true, newValue: value };
    }

    // Real API call example (commented out)
    /*
    async fetchRealData(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to mock data
            return this.getMockData(endpoint);
        }
    }
    */
}
