/**
 * ATAFI LUXURY - ENHANCED DASHBOARD
 */

let userId = localStorage.getItem('userId');
let userEmail = localStorage.getItem('userEmail');
let userName = localStorage.getItem('userName');

document.addEventListener('DOMContentLoaded', function() {
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }
    
    loadDashboardData();
    loadPaymentHistory();
    loadReferralStats();
    initializeCharts();
});

async function loadDashboardData() {
    try {
        // Get user profile
        const profileResponse = await API.getUserProfile(userId);
        
        if (profileResponse.success) {
            const user = profileResponse.profile;
            
            // Update user info
            document.getElementById('userName').textContent = user.fullName || 'User';
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userInitials').textContent = 
                (user.fullName || 'AL').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            
            const joinDate = new Date(user.createdAt);
            document.getElementById('memberSince').textContent = joinDate.getFullYear();
            
            // Update plan and status
            document.getElementById('currentPlan').textContent = user.plan || 'Basic';
            document.getElementById('accountStatus').textContent = user.status || 'Active';
        }
        
        // Get dashboard stats
        const statsResponse = await API.request('atafi_getDashboardStats', { userId });
        
        if (statsResponse.success) {
            const stats = statsResponse.stats;
            
            document.getElementById('totalPredictions').textContent = stats.totalPredictions || 0;
            document.getElementById('avgGrowth').textContent = (stats.averageGrowth || 0) + '%';
            document.getElementById('totalPayments').textContent = stats.totalPayments || 0;
            document.getElementById('totalSpent').textContent = '₦' + (stats.totalRevenue || 0).toLocaleString();
            document.getElementById('activeReferrals').textContent = stats.activeReferrals || 0;
            document.getElementById('commissionEarned').textContent = '₦' + (stats.referralCommission || 0).toLocaleString();
            
            // Display recent activity
            displayRecentActivity(stats.recentActivity || []);
        }
        
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function displayRecentActivity(activities) {
    const container = document.getElementById('activityList');
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="text-center">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => {
        const date = new Date(activity.date).toLocaleDateString();
        const icon = activity.type === 'prediction' ? '📊' : activity.type === 'payment' ? '💰' : '🎁';
        
        return `
            <div class="activity-item">
                <span class="activity-icon">${icon}</span>
                <div class="activity-details">
                    <p>${activity.data}</p>
                    <small>${date}</small>
                </div>
            </div>
        `;
    }).join('');
}

async function loadPaymentHistory() {
    try {
        const response = await API.request('atafi_getPaymentHistory', { userId });
        
        if (response.success) {
            const payments = response.history || [];
            const tbody = document.getElementById('paymentTableBody');
            
            if (payments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No payment history</td></tr>';
                return;
            }
            
            // Show last 5 payments
            const recentPayments = payments.slice(0, 5);
            
            tbody.innerHTML = recentPayments.map(payment => `
                <tr>
                    <td>${new Date(payment.date).toLocaleDateString()}</td>
                    <td><small>${payment.reference}</small></td>
                    <td>₦${parseFloat(payment.amount).toLocaleString()}</td>
                    <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
                </tr>
            `).join('');
        }
        
    } catch (error) {
        console.error('Failed to load payments:', error);
    }
}

async function loadReferralStats() {
    try {
        const response = await API.request('atafi_getReferralStats', { referrerId: userId });
        
        if (response.success) {
            document.getElementById('pendingReferrals').textContent = response.stats.pending || 0;
            document.getElementById('convertedReferrals').textContent = response.stats.converted || 0;
            document.getElementById('pendingEarnings').textContent = '₦' + (response.stats.pendingCommission || 0).toLocaleString();
            document.getElementById('referralLink').value = response.referralLink || 'https://atafi-lux.onrender.com/?ref=' + userId;
        }
        
    } catch (error) {
        console.error('Failed to load referral stats:', error);
    }
}

function initializeCharts() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // Sample data - in production, fetch from API
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Growth %',
                data: [15, 18, 22, 25, 28, 32],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    
    showNotification('Referral link copied!', 'success');
}

function refreshActivity() {
    loadDashboardData();
}

function viewAllPayments() {
    window.location.href = '/subscription.html';
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/index.html';
});

function showNotification(message, type) {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'notification-toast ' + type;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}