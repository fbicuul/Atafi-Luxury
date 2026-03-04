/**
 * ATAFI LUXURY - PAYSTACK PAYMENT INTEGRATION
 * WITH BETTER ERROR HANDLING
 */

const Payment = {
    initialize(amount, email, userId, metadata = {}) {
        return new Promise((resolve, reject) => {
            // Detailed debugging
            console.log('🔍 Payment initialization started');
            console.log('- Email:', email);
            console.log('- Amount:', amount);
            
            // Check environment
            if (!window.ENV) {
                console.error('❌ window.ENV is undefined');
                UI.showNotification('System configuration error', 'error');
                reject(new Error('Environment not loaded'));
                return;
            }
            
            console.log('- ENV exists, checking PAYSTACK_PUBLIC_KEY...');
            
            if (!window.ENV.PAYSTACK_PUBLIC_KEY) {
                console.error('❌ PAYSTACK_PUBLIC_KEY is missing from window.ENV');
                UI.showNotification('Payment key not configured', 'error');
                reject(new Error('Paystack key missing'));
                return;
            }
            
            if (window.ENV.PAYSTACK_PUBLIC_KEY.includes('{{')) {
                console.error('❌ PAYSTACK_PUBLIC_KEY contains placeholder:', window.ENV.PAYSTACK_PUBLIC_KEY);
                UI.showNotification('Payment system not properly configured', 'error');
                reject(new Error('Key not injected'));
                return;
            }

            if (typeof PaystackPop === 'undefined') {
                console.error('❌ PaystackPop library not loaded');
                UI.showNotification('Payment library unavailable', 'error');
                reject(new Error('PaystackPop not loaded'));
                return;
            }

            const amountInKobo = Math.round(amount * 100);
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            console.log('✅ All checks passed, initializing Paystack with key length:', window.ENV.PAYSTACK_PUBLIC_KEY.length);

            try {
                const handler = PaystackPop.setup({
                    key: window.ENV.PAYSTACK_PUBLIC_KEY,
                    email: email,
                    amount: amountInKobo,
                    currency: 'NGN',
                    ref: reference,
                    metadata: {
                        userId: userId,
                        businessId: 'atafi_luxury',
                        businessName: 'Atafi Luxury',
                        ...metadata
                    },
                    callback: function(response) {
                        console.log('✅ Payment callback received:', response);
                        UI.showNotification('Payment successful!', 'success');
                        resolve({
                            success: true,
                            reference: response.reference,
                            userId: userId
                        });
                    },
                    onClose: function() {
                        console.log('ℹ️ Payment popup closed by user');
                        UI.showNotification('Payment cancelled', 'info');
                        reject(new Error('Payment cancelled'));
                    }
                });
                
                handler.openIframe();
                console.log('✅ Paystack iframe opened');
                
            } catch (error) {
                console.error('❌ Paystack setup error:', error);
                UI.showNotification('Failed to initialize payment', 'error');
                reject(error);
            }
        });
    },

    async processSignupPayment(userData) {
        console.log('🔄 processSignupPayment called with:', userData.email);
        UI.showLoading(true);
        
        try {
            // Register with Apps Script
            console.log('📝 Registering user...');
            await API.registerUser(userData);
            console.log('✅ User registered');
            
            const tempUserId = 'user_' + Date.now();
            
            const result = await this.initialize(
                2900,
                userData.email,
                tempUserId,
                {
                    plan: 'premium',
                    businessName: userData.businessName
                }
            );
            
            if (result && result.success) {
                sessionStorage.setItem('pendingUser', JSON.stringify({
                    ...userData,
                    paymentReference: result.reference,
                    userId: tempUserId
                }));
                
                setTimeout(() => {
                    window.location.href = '/payment-success.html?reference=' + result.reference;
                }, 2000);
            }
            
        } catch (error) {
            console.error('❌ Payment process error:', error);
            UI.showNotification('Error processing payment', 'error');
        } finally {
            UI.showLoading(false);
        }
    }
};