// config.placeholder.js - THIS FILE IS SAFE TO COMMIT
// It shows the structure but uses environment variables

const CONFIG = {
    APPS_SCRIPT: {
        WEB_APP_URL: window.ENV?.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/your-url/exec'
    },
    
    PAYSTACK: {
        PUBLIC_KEY: window.ENV?.PAYSTACK_PUBLIC_KEY || 'pk_test_yourkey'
    },
    
    BUSINESS: {
        ID: 'atafi_luxury',
        NAME: 'Atafi Luxury',
        CURRENCY: 'NGN',
        PRICE: 2900
    }
};

window.CONFIG = CONFIG;
console.log('✅ Config loaded from environment');