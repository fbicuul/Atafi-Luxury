/**
 * ATAFI LUXURY - DASHBOARD JS
 */

// Simulate user data (replace with actual API calls later)
const mockUserData = {
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
    memberSince: '2026-01-15',
    stats: {
        totalRevenue: 145000,
        growthRate: 18.5,
        totalReferrals: 7,
        commissionEarned: 2900
    },
    recentActivity: [
        { date: '2026-03-04', activity: 'Payment Received', status: 'success', amount: 2900 },
        { date: '2026-03-03', activity: 'Referred a Friend', status: 'pending', amount: 0 },
        { date: '2026-03-02', activity: 'Growth Prediction', status: 'completed', amount: 0 },
        { date: '2026-03-01', activity: 'Commission Earned', status: 'success', amount: 290 }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeChart();
});

function loadDashboardData() {
    // Update user info
    document.getElementById('userName').textContent = mockUserData.name;
    document.getElementById('userEmail').textContent = mockUserData.email;
    document.getElementById('userInitials').textContent = mockUserData.name.split(' ').map(n => n[0]).join('');
    document.getElementById('memberSince').textContent = new Date(mockUserData.memberSince).getFullYear();
    
    // Update stats
    document.getElementById('totalRevenue').textContent = '₦' + mockUserData.stats.totalRevenue.toLocaleString();
    document.getElementById('growthRate').textContent = mockUserData.stats.growthRate + '%';
    document.getElementById('totalReferrals').textContent = mockUserData.stats.totalReferrals;
    document.getElementById('commissionEarned').textContent = '₦' + mockUserData.stats.commissionEarned.toLocaleString();
    
    // Update recent activity
    const tbody = document.getElementById('activityTableBody');
    tbody.innerHTML = mockUserData.recentActivity.map(activity => `
        <tr>
            <td>${activity.date}</td>
            <td>${activity.activity}</td>
            <td><span class="status-badge status-${activity.status}">${activity.status}</span></td>
            <td>${activity.amount > 0 ? '₦' + activity.amount : '-'}</td>
        </tr>
    `).join('');
    
    // Set referral link
    const baseUrl = window.location.origin;
    const referralCode = btoa(mockUserData.email); // Simple encoding (use proper encryption in production)
    document.getElementById('referralLink').value = `${baseUrl}/?ref=${referralCode}`;
}

function initializeChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // Get stored prediction from sessionStorage
    const pendingPrediction = sessionStorage.getItem('pendingPrediction');
    let chartData = [15, 18, 22, 25, 28, 32, 35, 38, 42, 45];
    
    if (pendingPrediction) {
        const { prediction } = JSON.parse(pendingPrediction);
        // Generate 30-day projection based on prediction
        chartData = Array.from({ length: 30 }, (_, i) => {
            return Math.round(prediction.growthPercentage * (1 + i/100) * 100) / 100;
        });
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i+1}`),
            datasets: [{
                label: 'Projected Growth %',
                data: chartData,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }
    });
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    
    // Show notification
    const toast = document.createElement('div');
    toast.className = 'notification-toast success';
    toast.textContent = 'Referral link copied!';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function refreshData() {
    // Simulate refresh
    const btn = document.querySelector('.btn-primary');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        UI.showNotification('Data refreshed!', 'success');
    }, 1500);
}