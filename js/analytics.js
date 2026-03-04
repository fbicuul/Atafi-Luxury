/**
 * ATAFI LUXURY - ANALYTICS DASHBOARD
 * Tracks user behavior and business metrics
 */

const Analytics = {
    // Initialize analytics
    init() {
        this.events = [];
        this.userId = localStorage.getItem('userId');
        this.sessionId = this.generateSessionId();
        
        // Track page view
        this.trackPageView();
        
        // Track time on page
        this.trackTimeOnPage();
    },

    // Track page view
    trackPageView() {
        const event = {
            type: 'page_view',
            userId: this.userId,
            sessionId: this.sessionId,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        
        this.events.push(event);
        this.sendEvent(event);
    },

    // Track time on page
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            const event = {
                type: 'time_on_page',
                userId: this.userId,
                sessionId: this.sessionId,
                page: window.location.pathname,
                seconds: timeSpent,
                timestamp: new Date().toISOString()
            };
            
            this.sendEvent(event);
        });
    },

    // Track user action
    trackAction(actionName, actionData = {}) {
        const event = {
            type: 'user_action',
            userId: this.userId,
            sessionId: this.sessionId,
            action: actionName,
            data: actionData,
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        this.sendEvent(event);
        
        console.log(`📊 Tracked action: ${actionName}`, actionData);
    },

    // Track conversion
    trackConversion(conversionType, value = 0) {
        const event = {
            type: 'conversion',
            userId: this.userId,
            sessionId: this.sessionId,
            conversionType: conversionType,
            value: value,
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        this.sendEvent(event);
        
        console.log(`💰 Conversion tracked: ${conversionType}`, { value });
    },

    // Send event to backend
    async sendEvent(event) {
        try {
            await API.trackAnalytics(event);
        } catch (error) {
            console.error('Failed to send analytics:', error);
        }
    },

    // Generate session ID
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get analytics for dashboard
    async getAnalytics(timeframe = '30d') {
        try {
            const response = await API.getAnalytics({
                userId: this.userId,
                timeframe: timeframe
            });
            
            return response.data;
        } catch (error) {
            console.error('Failed to get analytics:', error);
            return null;
        }
    },

    // Calculate growth metrics
    calculateMetrics(analyticsData) {
        const metrics = {
            pageViews: analyticsData?.pageViews || 0,
            uniqueVisitors: analyticsData?.uniqueVisitors || 0,
            bounceRate: analyticsData?.bounceRate || 0,
            avgSessionDuration: analyticsData?.avgSessionDuration || 0,
            conversionRate: analyticsData?.conversionRate || 0,
            totalRevenue: analyticsData?.totalRevenue || 0
        };
        
        return metrics;
    },

    // Generate report
    generateReport(metrics) {
        return {
            summary: {
                totalVisits: metrics.pageViews,
                uniqueUsers: metrics.uniqueVisitors,
                revenuePerVisitor: metrics.pageViews > 0 ? metrics.totalRevenue / metrics.pageViews : 0,
                conversionPercentage: metrics.conversionRate + '%'
            },
            trends: {
                weekly: this.calculateTrend(metrics, 'weekly'),
                monthly: this.calculateTrend(metrics, 'monthly')
            },
            recommendations: this.generateRecommendations(metrics)
        };
    },

    // Calculate trend
    calculateTrend(metrics, period) {
        // Implement trend calculation logic
        return {
            direction: 'up',
            percentage: 15
        };
    },

    // Generate recommendations
    generateRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.bounceRate > 60) {
            recommendations.push('High bounce rate detected. Consider improving your landing page.');
        }
        
        if (metrics.conversionRate < 2) {
            recommendations.push('Low conversion rate. Try optimizing your call-to-action.');
        }
        
        if (metrics.avgSessionDuration < 60) {
            recommendations.push('Short session duration. Add more engaging content.');
        }
        
        return recommendations;
    }
};

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.ENV?.ANALYTICS?.ENABLED) {
        Analytics.init();
    }
});