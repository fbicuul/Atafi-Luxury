/**
 * ATAFI LUXURY - PAYSTACK PAYMENT INTEGRATION
 * PRODUCTION VERSION
 */

const Payment = {
    initialize(amount, email, userId, metadata = {}) {
        return new Promise((resolve, reject) => {
            if (!window.ENV?.PAYSTACK_PUBLIC_KEY) {
                UI.showNotification('Payment system unavailable', 'error');
                reject(new Error('Paystack key not found'));
                return;
            }

            const amountInKobo = Math.round(amount * 100);
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

            try {
                const handler = PaystackPop.setup({
                    key: window.ENV.PAYSTACK_PUBLIC_KEY,
                    email: email,
                    amount: amountInKobo,
                    currency: 'NGN',
                    ref: reference,
                    metadata: {
                        userId: userId,
                        ...metadata
                    },
                    callback: function(response) {
                        UI.showNotification('Payment successful!', 'success');
                        resolve({
                            success: true,
                            reference: response.reference,
                            userId: userId
                        });
                    },
                    onClose: function() {
                        UI.showNotification('Payment cancelled', 'info');
                        reject(new Error('Payment cancelled'));
                    }
                });
                
                handler.openIframe();
                
            } catch (error) {
                console.error('Payment error:', error);
                UI.showNotification('Failed to initialize payment', 'error');
                reject(error);
            }
        });
    },

    async processSignupPayment(userData) {
        UI.showLoading(true);
        
        try {
            await API.registerUser(userData);
            
            const tempUserId = 'user_' + Date.now();
            
            const result = await this.initialize(
                2900,
                userData.email,
                tempUserId,
                {
                    full_name: userData.fullName,
                    business_name: userData.businessName
                }
            );
            
            if (result?.success) {
                sessionStorage.setItem('pendingUser', JSON.stringify({
                    ...userData,
                    paymentReference: result.reference
                }));
                
                setTimeout(() => {
                    window.location.href = '/payment-success.html?reference=' + result.reference;
                }, 2000);
            }
            
        } catch (error) {
            console.error('Payment process error:', error);
            UI.showNotification('Error processing payment', 'error');
        } finally {
            UI.showLoading(false);
        }
    }
};