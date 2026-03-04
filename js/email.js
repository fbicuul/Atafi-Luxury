/**
 * ATAFI LUXURY - EMAIL SERVICE
 */

const EmailService = {
    // Send email
    async send(to, template, data = {}) {
        try {
            await API.sendEmail(to, template, data);
            console.log(`📧 Email queued: ${template} to ${to}`);
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    },

    // Welcome email
    async sendWelcome(userData) {
        return this.send(userData.email, 'welcome', {
            name: userData.fullName,
            dashboardLink: 'https://atafi-lux.onrender.com/dashboard.html',
            loginLink: 'https://atafi-lux.onrender.com/login.html'
        });
    },

    // Payment confirmation
    async sendPaymentConfirmation(paymentData) {
        return this.send(paymentData.email, 'payment_success', {
            name: paymentData.fullName,
            amount: paymentData.amount,
            reference: paymentData.reference,
            plan: paymentData.plan,
            date: new Date().toLocaleDateString(),
            invoiceLink: `https://atafi-lux.onrender.com/invoice/${paymentData.reference}`
        });
    },

    // Referral notification
    async sendReferralNotification(referralData) {
        return this.send(referralData.email, 'referral_success', {
            name: referralData.name,
            friendName: referralData.friendName,
            bonus: referralData.bonus,
            dashboardLink: 'https://atafi-lux.onrender.com/referral.html'
        });
    },

    // Subscription expiry warning
    async sendExpiryWarning(userData) {
        return this.send(userData.email, 'expiry_warning', {
            name: userData.fullName,
            expiryDate: userData.expiryDate,
            renewLink: 'https://atafi-lux.onrender.com/subscription.html'
        });
    },

    // Password reset
    async sendPasswordReset(email, resetToken) {
        return this.send(email, 'password_reset', {
            resetLink: `https://atafi-lux.onrender.com/reset-password?token=${resetToken}`,
            expiresIn: '1 hour'
        });
    },

    // Monthly report
    async sendMonthlyReport(userData, reportData) {
        return this.send(userData.email, 'monthly_report', {
            name: userData.fullName,
            growth: reportData.growth,
            revenue: reportData.revenue,
            referrals: reportData.referrals,
            dashboardLink: 'https://atafi-lux.onrender.com/dashboard.html'
        });
    },

    // Plan change confirmation
    async sendPlanChangeNotification(userData, newPlan) {
        return this.send(userData.email, 'plan_changed', {
            name: userData.fullName,
            newPlan: newPlan,
            effectiveDate: new Date().toLocaleDateString(),
            dashboardLink: 'https://atafi-lux.onrender.com/subscription.html'
        });
    },

    // Subscription cancelled
    async sendCancellationConfirmation(userData) {
        return this.send(userData.email, 'subscription_cancelled', {
            name: userData.fullName,
            endDate: userData.expiryDate,
            reactivateLink: 'https://atafi-lux.onrender.com/subscription.html'
        });
    }
};