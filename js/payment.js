/**
 * ATAFI LUXURY - PAYSTACK PAYMENT INTEGRATION
 * Handles all payment-related functionality
 */

const Payment = {
    /**
     * Initialize Paystack payment
     */
    initialize(amount, email, userId, metadata = {}) {
        return new Promise((resolve, reject) => {
            // Amount must be in kobo (multiply by 100)
            const amountInKobo = Math.round(amount * 100);
            
            // Generate unique reference
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            try {
                const handler = PaystackPop.setup({
                    key: CONFIG.PAYSTACK.PUBLIC_KEY,
                    email: email,
                    amount: amountInKobo,
                    currency: CONFIG.BUSINESS.CURRENCY,
                    ref: reference,
                    metadata: {
                        userId: userId,
                        businessId: CONFIG.BUSINESS.ID,
                        businessName: CONFIG.BUSINESS.NAME,
                        ...metadata
                    },
                    callback: function(response) {
                        // Payment successful
                        UI.showNotification('Payment successful! Redirecting...', 'success');
                        resolve({
                            success: true,
                            reference: response.reference,
                            userId: userId
                        });
                    },
                    onClose: function() {
                        // User closed payment window
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

    /**
     * Process subscription payment after signup
     */
    async processSignupPayment(userData) {
        UI.showLoading(true);
        
        try {
            // Step 1: Register user with backend
            await API.registerUser(userData);
            
            // Step 2: Initialize payment (we'll generate a temp userId for now)
            // In production, you'd get the real userId from the registration response
            const tempUserId = 'user_' + Date.now();
            
            const result = await this.initialize(
                CONFIG.BUSINESS.PRICE,
                userData.email,
                tempUserId,
                {
                    plan: 'premium',
                    businessName: userData.businessName
                }
            );
            
            if (result.success) {
                // Store user data in session storage for after payment
                sessionStorage.setItem('pendingUser', JSON.stringify({
                    ...userData,
                    paymentReference: result.reference
                }));
                
                // In a real implementation, you'd redirect to a success page
                // or wait for webhook confirmation
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

    /**
     * Verify payment status (can be called from success page)
     */
    async checkPaymentStatus(reference) {
        UI.showLoading(true);
        try {
            // This would typically call your backend to verify
            // For now, we'll simulate
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get pending user data
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

// Payment success page handler (create payment-success.html separately)
if (window.location.pathname.includes('payment-success')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        
        if (reference) {
            await Payment.checkPaymentStatus(reference);
        }
    });
}