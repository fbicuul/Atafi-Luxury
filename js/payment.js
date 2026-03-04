/**
 * ATAFI LUXURY - PAYSTACK PAYMENT INTEGRATION
 * SECURE VERSION - No hardcoded keys
 */

const Payment = {
    initialize(amount, email, userId, metadata = {}) {
        return new Promise((resolve, reject) => {
            // Check if environment variables exist
            if (!window.ENV || !window.ENV.PAYSTACK_PUBLIC_KEY) {
                console.error('❌ Paystack key missing - check Render environment variables');
                UI.showNotification('Payment configuration error. Please contact support.', 'error');
                reject(new Error('Paystack key not found'));
                return;
            }

            if (typeof PaystackPop === 'undefined') {
                console.error('❌ Paystack library not loaded');
                UI.showNotification('Payment system unavailable. Please refresh.', 'error');
                reject(new Error('PaystackPop not loaded'));
                return;
            }

            const amountInKobo = Math.round(amount * 100);
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            console.log('✅ Initializing payment with secure key');

            try {
                const handler = PaystackPop.setup({
                    key: window.ENV.PAYSTACK_PUBLIC_KEY, // From Render environment
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
                        UI.showNotification('Payment successful! Redirecting...', 'success');
                        resolve({
                            success: true,
                            reference: response.reference,
                            userId: userId
                        });
                    },
                    onClose: function() {
                        UI.showNotification('Payment cancelled', 'info');
                        reject(new Error('Payment cancelled by user'));
                    }
                });
                
                handler.openIframe();
                
            } catch (error) {
                console.error('❌ Paystack error:', error);
                UI.showNotification('Failed to initialize payment', 'error');
                reject(error);
            }
        });
    },

    async processSignupPayment(userData) {
        UI.showLoading(true);
        
        try {
            // Register with Apps Script backend
            await API.registerUser(userData);
            
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
            UI.showNotification('Error processing payment. Please try again.', 'error');
        } finally {
            UI.showLoading(false);
        }
    },

    async verifyPayment(reference) {
        try {
            return await API.verifyPayment(reference);
        } catch (error) {
            console.error('❌ Verification error:', error);
            return { success: false };
        }
    }
};