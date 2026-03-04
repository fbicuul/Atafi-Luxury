/**
 * ATAFI LUXURY - GOOGLE APPS SCRIPT API HANDLER
 * PRODUCTION VERSION
 */

const API = {
    async request(action, data = {}) {
        try {
            if (!window.ENV?.APPS_SCRIPT_URL) {
                throw new Error('Apps Script URL not configured');
            }

            await fetch(window.ENV.APPS_SCRIPT_URL, {
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
            console.error(`API Error:`, error);
            throw error;
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
            monthlyRevenue: userData.monthlyRevenue,
            customerCount: userData.customerCount,
            marketingBudget: userData.marketingBudget
        });
    }
};