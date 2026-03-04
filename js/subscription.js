/**
 * ATAFI LUXURY - SUBSCRIPTION MANAGEMENT
 */

let userId = localStorage.getItem('userId');

const PLANS = {
    BASIC: { name: 'Basic', price: 2900 },
    PRO: { name: 'Professional', price: 4900 },
    ENTERPRISE: { name: 'Enterprise', price: 9900 }
};

document.addEventListener('DOMContentLoaded', function() {
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }
    
    loadSubscriptionData();
    loadBillingHistory();
});

async function loadSubscriptionData() {
    try {
        const response = await API.getUserProfile(userId);
        
        if (response.success) {
            const user = response.profile;
            
            document.getElementById('currentPlanBadge').textContent = user.plan || 'Basic';
            document.getElementById('currentPlanPrice').innerHTML = 
                `₦${PLANS[user.plan]?.price || 4900}<span>/month</span>`;
            
            const statusEl = document.getElementById('planStatus');
            statusEl.textContent = user.status || 'Active';
            statusEl.className = `plan-status ${user.status || 'active'}`;
            
            const startDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            document.getElementById('planStartDate').textContent = startDate;
            
            // Highlight current plan
            document.querySelectorAll('.plan-card').forEach(card => {
                const plan = card.dataset.plan;
                const btn = card.querySelector('.btn-plan');
                
                if (plan === user.plan) {
                    card.classList.add('current');
                    btn.textContent = 'Current Plan';
                    btn.disabled = true;
                }
            });
        }
        
    } catch (error) {
        console.error('Failed to load subscription:', error);
        showNotification('Failed to load subscription data', 'error');
    }
}

async function loadBillingHistory() {
    try {
        const response = await API.request('atafi_getPaymentHistory', { userId });
        
        if (response.success) {
            const payments = response.history || [];
            const tbody = document.getElementById('billingHistoryBody');
            
            if (payments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No billing history</td></tr>';
                return;
            }
            
            tbody.innerHTML = payments.map(payment => `
                <tr>
                    <td>${new Date(payment.date).toLocaleDateString()}</td>
                    <td><small>${payment.reference}</small></td>
                    <td>₦${parseFloat(payment.amount).toLocaleString()}</td>
                    <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="downloadInvoice('${payment.reference}')">
                            <i class="fas fa-download"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
    } catch (error) {
        console.error('Failed to load billing history:', error);
    }
}

async function changePlan(planKey) {
    const currentPlan = document.getElementById('currentPlanBadge').textContent;
    
    if (currentPlan === PLANS[planKey]?.name) {
        showNotification('This is your current plan', 'info');
        return;
    }
    
    if (!confirm(`Are you sure you want to change to ${PLANS[planKey].name} plan?`)) {
        return;
    }
    
    try {
        const response = await API.request('atafi_updateSubscription', {
            userId: userId,
            plan: planKey,
            status: 'active'
        });
        
        if (response.success) {
            showNotification('Plan changed successfully!', 'success');
            
            // Queue email notification
            await API.request('atafi_queueEmail', {
                to: localStorage.getItem('userEmail'),
                template: 'subscription_updated',
                data: {
                    name: localStorage.getItem('userName'),
                    plan: PLANS[planKey].name,
                    status: 'active'
                }
            });
            
            setTimeout(() => location.reload(), 2000);
        }
        
    } catch (error) {
        console.error('Failed to change plan:', error);
        showNotification('Failed to change plan', 'error');
    }
}

async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
        return;
    }
    
    try {
        const response = await API.request('atafi_updateSubscription', {
            userId: userId,
            status: 'cancelled'
        });
        
        if (response.success) {
            showNotification('Subscription cancelled', 'success');
            
            // Queue email notification
            await API.request('atafi_queueEmail', {
                to: localStorage.getItem('userEmail'),
                template: 'subscription_updated',
                data: {
                    name: localStorage.getItem('userName'),
                    status: 'cancelled'
                }
            });
            
            setTimeout(() => location.reload(), 2000);
        }
        
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        showNotification('Failed to cancel subscription', 'error');
    }
}

function downloadInvoice(reference) {
    // In production, generate PDF invoice
    showNotification('Invoice download started', 'success');
}

function downloadInvoices() {
    showNotification('Preparing invoice download...', 'info');
}

function showNotification(message, type) {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'notification-toast ' + type;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/index.html';
});