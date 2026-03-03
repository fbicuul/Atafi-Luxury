/**
 * ATAFI LUXURY - PAYSTACK PAYMENT INTEGRATION
 */

const Payment = {
    initialize(amount, email, userId, metadata = {}) {
        return new Promise((resolve, reject) => {
            const amountInKobo = Math.round(amount * 100);
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            // Check if environment variables exist
            if (!window.ENV || !window.ENV.PAYSTACK_PUBLIC_KEY) {
                UI.showNotification('Payment configuration error', 'error');
                reject(new Error('Paystack key not found'));
                return;
            }
            
            try {
                // Add this right before const handler = PaystackPop.setup({
                console.log('🔍 Key being sent to Paystack:', window.ENV.PAYSTACK_PUBLIC_KEY);
                console.log('🔍 Key length:', window.ENV.PAYSTACK_PUBLIC_KEY.length);
                console.log('🔍 First 7 chars:', window.ENV.PAYSTACK_PUBLIC_KEY.substring(0, 7));

                const handler = PaystackPop.setup({
                    key: window.ENV.PAYSTACK_PUBLIC_KEY,  // Read from ENV directly
                    email: email,
                    amount: amountInKobo,
                    currency: 'NGN',  // Hardcode or get from BUSINESS object
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
                console.error('Paystack initialization error:', error);
                UI.showNotification('Failed to initialize payment', 'error');
                reject(error);
            }
        });
    },

    async processSignupPayment(userData) {
        UI.showLoading(true);
        
        try {
            // Register user with backend
            await API.registerUser(userData);
            
            const tempUserId = 'user_' + Date.now();
            
            const result = await this.initialize(
                2900,  // Price
                userData.email,
                tempUserId,
                {
                    plan: 'premium',
                    businessName: userData.businessName
                }
            );
            
            if (result.success) {
                sessionStorage.setItem('pendingUser', JSON.stringify({
                    ...userData,
                    paymentReference: result.reference
                }));
                
                setTimeout(() => {
                    window.location.href = '/payment-success.html';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Payment process error:', error);
            UI.showNotification('Error processing payment. Please try again.', 'error');
        } finally {
            UI.showLoading(false);
        }
    },

    async checkPaymentStatus(reference) {
        UI.showLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const pendingUser = sessionStorage.getItem('pendingUser');
            if (pendingUser) {
                const userData = JSON.parse(pendingUser);
                UI.showNotification(`Welcome ${userData.fullName}! Your journey begins!`, 'success');
                sessionStorage.removeItem('pendingUser');
            }
            
            return true;
            
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        } finally {
            UI.showLoading(false);
        }
    }
};