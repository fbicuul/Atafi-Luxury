// CONFIGURATION TEMPLATE
// Copy this file to config.js and add your actual API keys
// NEVER commit config.js to GitHub

const CONFIG = {
    // Google Apps Script URLs
    APPS_SCRIPT: {
        WEB_APP_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
    },
    
    // Paystack Configuration
    PAYSTACK: {
        PUBLIC_KEY: 'YOUR_ATAFI_LUXURY_PAYSTACK_PUBLIC_KEY', // Get from Paystack dashboard
    },
    
    // Business Information
    BUSINESS: {
        ID: 'atafi_luxury',
        NAME: 'Atafi Luxury',
        CURRENCY: 'NGN', // Change to your preferred currency
        PRICE: 2900 // Monthly subscription in your currency
    },
    
    // API Endpoints
    API_ENDPOINTS: {
        BASE_URL: window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : 'https://yourdomain.com',
    }
};

// Don't expose this object globally - we'll use modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}