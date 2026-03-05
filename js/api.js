/**
 * ATAFI LUXURY - API CLIENT (UPDATED FOR MERGED APPS SCRIPT)
 */

const API = {
    async request(action, data = {}) {
        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    ...data,
                    timestamp: new Date().toISOString()
                })
            });

            return { success: true };
            
        } catch (error) {
            console.warn(`API offline (${action}):`, error.message);
            return { success: false, offline: true };
        }
    },

    // Atafi Luxury endpoints
    async registerUser(userData) {
        return this.request('atafi_register', userData);
    },

    async login(email, password) {
        return this.request('atafi_login', { email, password });
    },

    async getUserProfile(userId) {
        return this.request('atafi_getUserProfile', { userId });
    },

    async updateUserProfile(userId, profileData) {
        return this.request('atafi_updateUserProfile', { userId, ...profileData });
    },

    async savePrediction(userId, predictionData) {
        return this.request('atafi_savePrediction', { userId, ...predictionData });
    },

    async getPredictions(userId) {
        return this.request('atafi_getPredictions', { userId });
    },

    async trackAnalytics(event, eventData = {}) {
        return this.request('atafi_trackAnalytics', { event, eventData });
    }
};