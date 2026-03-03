/**
 * ATAFI LUXURY - GOOGLE APPS SCRIPT API HANDLER
 */

const API = {
    async request(action, data = {}) {
        try {
            if (!window.ENV || !window.ENV.APPS_SCRIPT_URL) {
                throw new Error('Apps Script URL not configured');
            }

            const response = await fetch(window.ENV.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action,
                    ...data,
                    businessId: 'atafi_luxury',
                    timestamp: new Date().toISOString()
                })
            });

            return { success: true };
            
        } catch (error) {
            console.error(`API Error (${action}):`, error);
            throw new Error(`Failed to ${action}: ${error.message}`);
        }
    },

    async registerUser(userData) {
        return this.request('register', {
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            businessName: userData.businessName,
            industry: userData.industry,
            monthlyRevenue: parseFloat(userData.monthlyRevenue),
            customerCount: parseInt(userData.customerCount),
            marketingBudget: parseFloat(userData.marketingBudget)
        });
    },

    async createReferral(referrerId, referredEmail) {
        return this.request('createReferral', {
            referrerId: referrerId,
            referredEmail: referredEmail
        });
    },

    async getReferralStats(userId) {
        return this.request('getReferralStats', { userId });
    },

    async verifyPayment(reference, userId) {
        return this.request('verifyPaystackPayment', {
            reference: reference,
            userId: userId
        });
    }
};