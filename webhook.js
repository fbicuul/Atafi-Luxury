/**
 * ATAFI LUXURY - PAYMENT WEBHOOK HANDLER
 * Processes Paystack webhook events
 */

const WebhookHandler = {
    // Verify webhook signature
    verifySignature(signature, body) {
        // In production, verify using your secret key
        // const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(body)).digest('hex');
        // return hash === signature;
        return true; // Simplified for now
    },

    // Handle successful payment
    async handleChargeSuccess(webhookData) {
        console.log('💰 Processing successful payment:', webhookData.reference);
        
        const { metadata, customer, amount, reference } = webhookData;
        
        // Update user subscription in Google Sheets
        await API.updateSubscription({
            userId: metadata.userId,
            email: customer.email,
            plan: metadata.plan,
            amount: amount / 100,
            reference: reference,
            status: 'active',
            expiresAt: this.calculateExpiryDate()
        });
        
        // Send payment confirmation email
        await EmailService.sendPaymentConfirmation({
            email: customer.email,
            fullName: metadata.full_name,
            amount: amount / 100,
            reference: reference,
            plan: metadata.plan
        });
        
        // Award referral commission if applicable
        if (metadata.referredBy) {
            await this.awardReferralCommission(metadata.referredBy, amount / 100);
        }
        
        // Log to Google Sheets
        await this.logTransaction(webhookData);
        
        console.log('✅ Payment processed successfully');
    },

    // Handle failed payment
    async handleChargeFailed(webhookData) {
        console.log('❌ Payment failed:', webhookData.reference);
        
        const { metadata, customer } = webhookData;
        
        // Update user status
        await API.updateSubscription({
            userId: metadata.userId,
            email: customer.email,
            status: 'payment_failed'
        });
        
        // Send failure notification
        await EmailService.sendEmail({
            to: customer.email,
            subject: 'Payment Failed - Action Required',
            template: 'payment-failed',
            data: {
                name: metadata.full_name,
                retryLink: 'https://atafi-lux.onrender.com/subscription.html'
            }
        });
    },

    // Handle subscription events
    async handleSubscriptionEvent(webhookData) {
        const event = webhookData.event;
        const data = webhookData.data;
        
        switch(event) {
            case 'subscription.create':
                await this.handleSubscriptionCreate(data);
                break;
            case 'subscription.expire':
                await this.handleSubscriptionExpire(data);
                break;
            case 'subscription.cancel':
                await this.handleSubscriptionCancel(data);
                break;
        }
    },

    // Award referral commission
    async awardReferralCommission(referrerId, amount) {
        const commission = amount * (window.ENV?.REFERRAL?.COMMISSION_RATE || 0.10);
        
        await API.addReferralCommission({
            referrerId: referrerId,
            amount: commission,
            status: 'pending'
        });
        
        // Notify referrer
        await EmailService.sendReferralNotification({
            referrerId: referrerId,
            amount: commission
        });
    },

    // Calculate expiry date (30 days from now)
    calculateExpiryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString();
    },

    // Log transaction to Google Sheets
    async logTransaction(data) {
        const transactionData = {
            reference: data.reference,
            email: data.customer.email,
            amount: data.amount / 100,
            plan: data.metadata.plan,
            status: data.event,
            date: new Date().toISOString()
        };
        
        await API.logTransaction(transactionData);
    }
};

// Webhook endpoint (for your server)
async function handleWebhook(req, res) {
    const signature = req.headers['x-paystack-signature'];
    const body = req.body;
    
    // Verify signature
    if (!WebhookHandler.verifySignature(signature, body)) {
        return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Process webhook
    const event = body.event;
    
    try {
        switch(event) {
            case 'charge.success':
                await WebhookHandler.handleChargeSuccess(body.data);
                break;
            case 'charge.failed':
                await WebhookHandler.handleChargeFailed(body.data);
                break;
            case 'subscription.create':
            case 'subscription.expire':
            case 'subscription.cancel':
                await WebhookHandler.handleSubscriptionEvent(body);
                break;
            default:
                console.log('Unhandled event:', event);
        }
        
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}