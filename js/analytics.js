/**
 * ATAFI LUXURY - ANALYTICS SYSTEM
 */

const Analytics = {
    // Initialize analytics
    init() {
        this.userId = localStorage.getItem('userId');
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        
        // Track page view
        this.trackEvent('page_view', {
            path: window.location.pathname,
            referrer: document.referrer
        });
        
        // Track time on page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('time_on_page', {
                path: window.location.pathname,
                seconds: timeSpent
            });
        });
    },

    // Track custom event
    trackEvent(eventName, eventData = {}) {
        const event = {
            event: eventName,
            userId: this.userId || 'anonymous',
            sessionId: this.sessionId,
            data: eventData,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Store in memory
        this.queue = this.queue || [];
        this.queue.push(event);
        
        // Send to backend
        this.sendEvent(event);
        
        // Log in development
        if (window.ENV?.ENV !== 'production') {
            console.log('📊 Analytics:', eventName, eventData);
        }
    },

    // Send event to backend
    async sendEvent(event) {
        try {
            await API.trackAnalytics(event.event, {
                ...event.data,
                sessionId: event.sessionId,
                url: event.url
            });
        } catch (error) {
            console.error('Failed to send analytics:', error);
            // Store failed events for retry
            this.storeFailedEvent(event);
        }
    },

    // Store failed events in localStorage
    storeFailedEvent(event) {
        const failed = JSON.parse(localStorage.getItem('analytics_failed') || '[]');
        failed.push(event);
        localStorage.setItem('analytics_failed', JSON.stringify(failed.slice(-50))); // Keep last 50
    },

    // Retry failed events
    async retryFailedEvents() {
        const failed = JSON.parse(localStorage.getItem('analytics_failed') || '[]');
        if (failed.length === 0) return;
        
        const successful = [];
        
        for (const event of failed) {
            try {
                await API.trackAnalytics(event.event, event.data);
                successful.push(event);
            } catch (error) {
                console.error('Retry failed:', event.event);
            }
        }
        
        // Remove successful events
        const remaining = failed.filter(e => !successful.includes(e));
        localStorage.setItem('analytics_failed', JSON.stringify(remaining));
    },

    // Generate session ID
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get analytics summary
    async getSummary(timeframe = 30) {
        try {
            const response = await API.getAnalytics(timeframe);
            return response.data;
        } catch (error) {
            console.error('Failed to get analytics:', error);
            return null;
        }
    },

    // Track user action
    trackAction(action, details = {}) {
        this.trackEvent('user_action', { action, ...details });
    },

    // Track conversion
    trackConversion(type, value = 0) {
        this.trackEvent('conversion', { type, value });
    },

    // Track error
    trackError(error, context = {}) {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            ...context
        });
    }
};

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.ENV?.ANALYTICS?.ENABLED !== false) {
        Analytics.init();
        
        // Retry failed events every 5 minutes
        setInterval(() => {
            Analytics.retryFailedEvents();
        }, 300000);
    }
});