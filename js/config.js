// js/config.js - Use your actual test key
const CONFIG = {
    APPS_SCRIPT: {
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzLOSQnJCJvQoSYck7-wqCLbKkQQq9HKlSEBxxmapm8pEvkMlg16-Ae55-G5gcvin1w-A/exec' // Replace this
    },
    
    PAYSTACK: {
        PUBLIC_KEY: 'pk_test_e26810fb9b2c12f479f3f9ffb21e794964505447' // Your working test key
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