// js/config.js - Use your actual working keys
const CONFIG = {
    APPS_SCRIPT: {
        WEB_APP_URL: 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec' // Replace with your real URL
    },
    
    PAYSTACK: {
        PUBLIC_KEY: 'pk_test_key' // Your test key that worked locally
    },
    
    BUSINESS: {
        ID: 'atafi_luxury',
        NAME: 'Atafi Luxury',
        CURRENCY: 'NGN',
        PRICE: 2900
    }
};

window.CONFIG = CONFIG;
console.log('✅ Config loaded with key:', CONFIG.PAYSTACK.PUBLIC_KEY);