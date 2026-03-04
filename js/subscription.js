/**
 * ATAFI LUXURY - SUBSCRIPTION MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', function() {
    loadSubscriptionData();
    loadBillingHistory();
    loadPaymentMethods();
    loadChangePlanOptions();
});

// Load subscription data
async function loadSubscriptionData() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await API.getSubscription(userId);
        const sub = response.data;
        
        // Update UI with subscription data
        document.getElementById('currentPlanBadge').textContent = sub.planName || 'Professional';
        document.getElementById('currentPlanPrice').innerHTML = `₦${sub.price || 4900}<span>/month</span>`;
        
        const statusEl = document.getElementById('planStatus');
        statusEl.textContent = sub.status || 'Active';
        statusEl.className = `plan-status ${sub.status || 'active'}`;
        
        document.getElementById('planStartDate').textContent = formatDate(sub.startDate);
        document.getElementById('nextBillingDate').textContent = formatDate(sub.nextBilling);
        document.getElementById('paymentMethod').textContent = sub.paymentMethod || 'Card (ending in 4242)';
        
        // Load plan features
        const featuresList = document.getElementById('planFeaturesList');
        featuresList.innerHTML = sub.features?.map(f => 
            `<li><i class="fas fa-check"></i> ${f}</li>`
        ).join('') || '';
        
        console.log('✅ Subscription loaded');
        
    } catch (error) {
        console.error('Failed to load subscription:', error);
        UI.showNotification('Failed to load subscription data', 'error');
    }
}

// Load billing history
async function loadBillingHistory() {
    try {
        const response = await API.getBillingHistory();
        const invoices = response.data || [];
        
        const tbody = document.getElementById('billingHistoryBody');
        
        if (invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No billing history found</td></tr>';
            return;
        }
        
        tbody.innerHTML = invoices.map(inv => `
            <tr>
                <td>${formatDate(inv.date)}</td>
                <td>${inv.description}</td>
                <td>₦${inv.amount.toLocaleString()}</td>
                <td><span class="status-badge status-${inv.status}">${inv.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="downloadInvoice('${inv.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load billing history:', error);
    }
}

// Load payment methods
async function loadPaymentMethods() {
    try {
        const response = await API.getPaymentMethods();
        const methods = response.data || [];
        
        const container = document.getElementById('paymentMethodsList');
        
        if (methods.length === 0) {
            container.innerHTML = '<p class="text-center">No payment methods saved</p>';
            return;
        }
        
        container.innerHTML = methods.map(method => `
            <div class="payment-method-item">
                <div>
                    <i class="fas fa-${method.type === 'card' ? 'credit-card' : 'university'}"></i>
                    <strong>${method.type === 'card' ? 'Card' : 'Bank Transfer'}</strong>
                    <span>${method.details}</span>
                    ${method.default ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="method-actions">
                    <button class="btn-icon" onclick="setDefaultPayment('${method.id}')">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="btn-icon" onclick="removePaymentMethod('${method.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load payment methods:', error);
    }
}

// Load change plan options
function loadChangePlanOptions() {
    const plans = window.ENV?.PLANS || {
        BASIC: { name: 'Basic', price: 2900 },
        PRO: { name: 'Professional', price: 4900 },
        ENTERPRISE: { name: 'Enterprise', price: 9900 }
    };
    
    const container = document.getElementById('changePlanContainer');
    
    container.innerHTML = Object.entries(plans).map(([key, plan]) => `
        <div class="plan-card-compact ${key === 'PRO' ? 'popular' : ''}">
            <h4>${plan.name}</h4>
            <div class="price">₦${plan.price}<span>/mo</span></div>
            <button class="btn-${key === 'PRO' ? 'primary' : 'secondary'} btn-sm" onclick="changePlan('${key}')">
                ${key === 'PRO' ? 'Current Plan' : 'Switch'}
            </button>
        </div>
    `).join('');
}

// Change plan
async function changePlan(planKey) {
    if (planKey === 'PRO') {
        UI.showNotification('This is your current plan', 'info');
        return;
    }
    
    if (!confirm(`Are you sure you want to change to ${window.ENV.PLANS[planKey].name} plan?`)) {
        return;
    }
    
    try {
        UI.showLoading(true);
        
        await API.changeSubscriptionPlan({ plan: planKey });
        
        UI.showNotification('Plan changed successfully!', 'success');
        
        // Reload subscription data
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('Failed to change plan:', error);
        UI.showNotification('Failed to change plan', 'error');
    } finally {
        UI.showLoading(false);
    }
}

// Cancel subscription
async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
        return;
    }
    
    try {
        UI.showLoading(true);
        
        await API.cancelSubscription();
        
        UI.showNotification('Subscription cancelled', 'success');
        
        // Send cancellation email
        await EmailService.sendEmail({
            template: 'subscription-cancelled',
            data: { date: new Date().toLocaleDateString() }
        });
        
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        UI.showNotification('Failed to cancel subscription', 'error');
    } finally {
        UI.showLoading(false);
    }
}

// Add payment method
function addPaymentMethod() {
    // Implement payment method addition
    UI.showNotification('Payment method addition coming soon!', 'info');
}

// Set default payment method
async function setDefaultPayment(methodId) {
    try {
        await API.setDefaultPaymentMethod(methodId);
        UI.showNotification('Default payment method updated', 'success');
        loadPaymentMethods(); // Reload
    } catch (error) {
        console.error('Failed to set default:', error);
        UI.showNotification('Failed to update default payment method', 'error');
    }
}

// Remove payment method
async function removePaymentMethod(methodId) {
    if (!confirm('Remove this payment method?')) return;
    
    try {
        await API.removePaymentMethod(methodId);
        UI.showNotification('Payment method removed', 'success');
        loadPaymentMethods(); // Reload
    } catch (error) {
        console.error('Failed to remove payment method:', error);
        UI.showNotification('Failed to remove payment method', 'error');
    }
}

// Download invoice
async function downloadInvoice(invoiceId) {
    try {
        const response = await API.getInvoice(invoiceId);
        // Implement PDF download
        window.open(response.data.url, '_blank');
    } catch (error) {
        console.error('Failed to download invoice:', error);
        UI.showNotification('Failed to download invoice', 'error');
    }
}

// Download all invoices
async function downloadInvoices() {
    UI.showNotification('Preparing invoice download...', 'info');
    // Implement bulk download
}

// Delete account
function deleteAccount() {
    if (!confirm('⚠️ WARNING: This will permanently delete all your data. This action cannot be undone.')) {
        return;
    }
    
    if (!confirm('Type "DELETE" to confirm:')) {
        return;
    }
    
    UI.showNotification('Account deletion requested', 'info');
    // Implement account deletion
}

// Helper: Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}