/**
 * ATAFI LUXURY - API CLIENT
 * With graceful error handling
 */

const API = {
    async request(action, data = {}) {
        try {
            // Check if Apps Script URL is configured
            if (!window.ENV || !window.ENV.APPS_SCRIPT_URL) {
                console.warn('⚠️ Apps Script URL not configured - skipping API call');
                return { success: false, offline: true };
            }

            const response = await fetch(window.ENV.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    ...data,
                    businessId: 'atafi_luxury',
                    timestamp: new Date().toISOString()
                })
            });

            return { success: true };
            
        } catch (error) {
            console.warn(`API offline (${action}):`, error.message);
            return { success: false, offline: true };
        }
    },

    async trackAnalytics(event, eventData = {}) {
        // Skip analytics if not configured
        if (!window.ENV || !window.ENV.APPS_SCRIPT_URL) {
            return { success: false, offline: true };
        }
        return this.request('trackAnalytics', { event, eventData });
    }
};