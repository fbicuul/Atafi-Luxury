/**
 * ATAFI LUXURY - COMPLETE PAYMENT INTEGRATION
 */

const Payment = {
    // Initialize payment with selected plan
    initialize(plan, userData) {
        return new Promise((resolve, reject) => {
            if (!window.PAYSTACK_PUBLIC_KEY) {
                UI.showNotification('Payment system unavailable', 'error');
                reject(new Error('Paystack key not found'));
                return;
            }

            const amount = plan.price * 100; // Convert to kobo
            const reference = 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();

            try {
                const handler = PaystackPop.setup({
                    key: window.PAYSTACK_PUBLIC_KEY,
                    email: userData.email,
                    amount: amount,
                    currency: 'NGN',
                    ref: reference,
                    metadata: {
                        userId: userData.userId || 'new',
                        full_name: userData.fullName,
                        phone_number: userData.phone,
                        plan: plan.id,
                        plan_name: plan.name,
                        referredBy: userData.referredBy || null
                    },
                    callback: function(response) {
                        // Track successful payment
                        Analytics.trackEvent('payment_complete', {
                            plan: plan.id,
                            amount: plan.price,
                            reference: response.reference
                        });
                        
                        UI.showNotification('Payment successful!', 'success');
                        resolve({
                            success: true,
                            reference: response.reference,
                            plan: plan.id
                        });
                    },
                    onClose: function() {
                        Analytics.trackEvent('payment_cancelled', { plan: plan.id });
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

    // Process signup with selected plan
    async processSignup(userData, selectedPlan) {
        UI.showLoading(true);
        
        try {
            // Track signup attempt
            Analytics.trackEvent('signup_attempt', { plan: selectedPlan.id });
            
            // Register user
            await API.registerUser(userData);
            
            // Process payment
            const result = await this.initialize(selectedPlan, userData);
            
            if (result?.success) {
                // Store user data
                sessionStorage.setItem('pendingUser', JSON.stringify({
                    ...userData,
                    paymentReference: result.reference,
                    plan: selectedPlan.id
                }));
                
                // Track successful signup
                Analytics.trackEvent('signup_complete', {
                    plan: selectedPlan.id,
                    reference: result.reference
                });
                
                // Redirect to success page
                setTimeout(() => {
                    window.location.href = '/payment-success.html?reference=' + result.reference + '&plan=' + selectedPlan.id;
                }, 2000);
            }
            
        } catch (error) {
            console.error('Signup error:', error);
            Analytics.trackEvent('signup_failed', { 
                plan: selectedPlan.id,
                error: error.message 
            });
            UI.showNotification('Error processing signup', 'error');
        } finally {
            UI.showLoading(false);
        }
    },

    // Upgrade existing user's plan
    async upgradePlan(userId, currentPlan, newPlan) {
        UI.showLoading(true);
        
        try {
            const userData = await API.getUserProfile(userId);
            
            const result = await this.initialize(newPlan, userData.data);
            
            if (result?.success) {
                await API.changePlan(userId, newPlan.id);
                
                Analytics.trackEvent('plan_upgraded', {
                    from: currentPlan,
                    to: newPlan.id
                });
                
                UI.showNotification('Plan upgraded successfully!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            
        } catch (error) {
            console.error('Upgrade error:', error);
            UI.showNotification('Failed to upgrade plan', 'error');
        } finally {
            UI.showLoading(false);
        }
    }
};