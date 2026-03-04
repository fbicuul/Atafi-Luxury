/**
 * ATAFI LUXURY - COMPLETE API CLIENT
 * Handles all communication with Apps Script backend
 */

const API = {
    // Base request method
    async request(action, data = {}) {
        try {
            if (!window.ENV?.APPS_SCRIPT_URL) {
                throw new Error('Apps Script URL not configured');
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
            console.error(`API Error (${action}):`, error);
            throw error;
        }
    },

    // ============================================
    // USER MANAGEMENT
    // ============================================
    
    async registerUser(userData) {
        return this.request('register', {
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName,
            phone: userData.phone,
            businessName: userData.businessName,
            industry: userData.industry,
            monthlyRevenue: userData.monthlyRevenue,
            customerCount: userData.customerCount,
            marketingBudget: userData.marketingBudget
        });
    },

    async login(email, password) {
        return this.request('login', { email, password });
    },

    async getUserProfile(userId) {
        return this.request('getUserProfile', { userId });
    },

    async updateUserProfile(userId, profileData) {
        return this.request('updateUserProfile', { userId, ...profileData });
    },

    async changePassword(userId, currentPassword, newPassword) {
        return this.request('changePassword', { userId, currentPassword, newPassword });
    },

    // ============================================
    // SUBSCRIPTION MANAGEMENT
    // ============================================

    async getSubscription(userId) {
        return this.request('getSubscription', { userId });
    },

    async changePlan(userId, plan) {
        return this.request('changePlan', { userId, plan });
    },

    async cancelSubscription(userId) {
        return this.request('cancelSubscription', { userId });
    },

    async getBillingHistory(email) {
        return this.request('getBillingHistory', { email });
    },

    // ============================================
    // REFERRAL SYSTEM
    // ============================================

    async createReferral(referrerId, referredEmail) {
        return this.request('createReferral', { referrerId, referredEmail });
    },

    async getReferrals(referrerId) {
        return this.request('getReferrals', { referrerId });
    },

    async getReferralStats(referrerId) {
        return this.request('getReferralStats', { referrerId });
    },

    // ============================================
    // ANALYTICS
    // ============================================

    async trackAnalytics(event, eventData = {}) {
        return this.request('trackAnalytics', { event, eventData });
    },

    async getAnalytics(timeframe = 30) {
        return this.request('getAnalytics', { timeframe });
    },

    async getUserGrowth(userId) {
        return this.request('getUserGrowth', { userId });
    },

    // ============================================
    // EMAIL
    // ============================================

    async sendEmail(to, template, data = {}) {
        return this.request('sendEmail', { to, template, data });
    },

    // ============================================
    // PAYMENT VERIFICATION
    // ============================================

    async verifyPayment(reference, userId) {
        return this.request('verifyPaystackPayment', { reference, userId });
    }
};