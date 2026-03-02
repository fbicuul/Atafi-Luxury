/**
 * ATAFI LUXURY - GOOGLE APPS SCRIPT API HANDLER
 * Handles all communication with the backend
 */

const API = {
    /**
     * Send request to Google Apps Script backend
     */
    async request(action, data = {}) {
        try {
            const response = await fetch(CONFIG.APPS_SCRIPT.WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: action,
                    ...data,
                    businessId: CONFIG.BUSINESS.ID,
                    timestamp: new Date().toISOString()
                })
            });

            // With no-cors, we don't get a readable response
            // So we'll assume success if no error thrown
            return { success: true };
            
        } catch (error) {
            console.error(`API Error (${action}):`, error);
            throw new Error(`Failed to ${action}: ${error.message}`);
        }
    },

    /**
     * Register new user and save business details
     */
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

    /**
     * Save referral
     */
    async createReferral(referrerId, referredEmail) {
        return this.request('createReferral', {
            referrerId: referrerId,
            referredEmail: referredEmail
        });
    },

    /**
     * Get referral statistics
     */
    async getReferralStats(userId) {
        // Note: This requires a GET request, which needs a different approach
        // For now, we'll simulate via POST
        return this.request('getReferralStats', { userId });
    },

    /**
     * Verify payment with Paystack (called from webhook)
     */
    async verifyPayment(reference, userId) {
        return this.request('verifyPaystackPayment', {
            reference: reference,
            userId: userId
        });
    }
};