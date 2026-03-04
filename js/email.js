/**
 * ATAFI LUXURY - EMAIL NOTIFICATION SYSTEM
 * Handles all email communications
 */

const EmailService = {
    // Send welcome email after signup
    async sendWelcomeEmail(userData) {
        console.log('📧 Sending welcome email to:', userData.email);
        
        const emailData = {
            to: userData.email,
            subject: 'Welcome to Atafi Luxury! 🎉',
            template: 'welcome',
            data: {
                name: userData.fullName,
                business: userData.businessName,
                dashboardLink: 'https://atafi-lux.onrender.com/dashboard.html',
                supportEmail: window.ENV?.EMAIL?.CONTACT || 'support@atafiluxury.com'
            }
        };

        // Send via your backend (Apps Script)
        try {
            await API.sendEmail(emailData);
            console.log('✅ Welcome email sent');
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
        }
    },

    // Send payment confirmation
    async sendPaymentConfirmation(paymentData) {
        console.log('📧 Sending payment confirmation to:', paymentData.email);
        
        const emailData = {
            to: paymentData.email,
            subject: 'Payment Confirmed - Thank You! 💳',
            template: 'payment-success',
            data: {
                name: paymentData.fullName,
                amount: paymentData.amount,
                reference: paymentData.reference,
                plan: paymentData.plan,
                invoiceLink: `https://atafi-lux.onrender.com/invoice/${paymentData.reference}`
            }
        };

        try {
            await API.sendEmail(emailData);
            console.log('✅ Payment confirmation sent');
        } catch (error) {
            console.error('❌ Failed to send payment confirmation:', error);
        }
    },

    // Send referral notification
    async sendReferralNotification(referralData) {
        console.log('📧 Sending referral notification to:', referralData.email);
        
        const emailData = {
            to: referralData.email,
            subject: 'Someone joined using your referral link! 🎁',
            template: 'referral-success',
            data: {
                name: referralData.referrerName,
                friendName: referralData.friendName,
                bonus: window.ENV?.REFERRAL?.BONUS_AMOUNT || 290,
                dashboardLink: 'https://atafi-lux.onrender.com/referral.html'
            }
        };

        try {
            await API.sendEmail(emailData);
            console.log('✅ Referral notification sent');
        } catch (error) {
            console.error('❌ Failed to send referral notification:', error);
        }
    },

    // Send monthly growth report
    async sendMonthlyReport(userId, email) {
        console.log('📧 Sending monthly report to:', email);
        
        // Fetch user's growth data
        const growthData = await API.getUserGrowth(userId);
        
        const emailData = {
            to: email,
            subject: 'Your Monthly Growth Report 📊',
            template: 'monthly-report',
            data: {
                ...growthData,
                dashboardLink: 'https://atafi-lux.onrender.com/dashboard.html'
            }
        };

        try {
            await API.sendEmail(emailData);
            console.log('✅ Monthly report sent');
        } catch (error) {
            console.error('❌ Failed to send monthly report:', error);
        }
    },

    // Send password reset email
    async sendPasswordReset(email, resetToken) {
        console.log('📧 Sending password reset to:', email);
        
        const emailData = {
            to: email,
            subject: 'Password Reset Request 🔐',
            template: 'password-reset',
            data: {
                resetLink: `https://atafi-lux.onrender.com/reset-password?token=${resetToken}`,
                expiresIn: '1 hour'
            }
        };

        try {
            await API.sendEmail(emailData);
            console.log('✅ Password reset email sent');
        } catch (error) {
            console.error('❌ Failed to send password reset:', error);
        }
    },

    // Send subscription expiry warning
    async sendExpiryWarning(userData) {
        console.log('📧 Sending expiry warning to:', userData.email);
        
        const emailData = {
            to: userData.email,
            subject: 'Your Subscription Expires Soon ⏰',
            template: 'expiry-warning',
            data: {
                name: userData.fullName,
                expiryDate: userData.expiryDate,
                renewLink: 'https://atafi-lux.onrender.com/subscription.html'
            }
        };

        try {
            await API.sendEmail(emailData);
            console.log('✅ Expiry warning sent');
        } catch (error) {
            console.error('❌ Failed to send expiry warning:', error);
        }
    }
};