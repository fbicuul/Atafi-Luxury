/**
 * ATAFI LUXURY - API CLIENT
 */

const API = {
    async request(action, data = {}) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwhEvFKIhP7U6DiDyfI2i8x9cPgKP8ktaKk9SgFmH_ZDDXNEHHjEwyrL-aaPutldX8u/exec', { // Replace with your Apps Script URL
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

    async registerUser(userData) {
        return this.request('register', userData);
    },

    async getUserProfile(userId) {
        return this.request('getUserProfile', { userId });
    },

    async updateUserProfile(userId, profileData) {
        return this.request('updateUserProfile', { userId, ...profileData });
    },

    async trackAnalytics(event, eventData = {}) {
        return this.request('trackAnalytics', { event, eventData });
    }
};