/**
 * ATAFI LUXURY - REFERRAL JS
 */

// Mock referral data
const mockReferrals = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', date: '2026-03-04', status: 'successful', commission: 290 },
    { name: 'Mike Peters', email: 'mike@example.com', date: '2026-03-03', status: 'successful', commission: 290 },
    { name: 'Lisa Anderson', email: 'lisa@example.com', date: '2026-03-02', status: 'pending', commission: 0 },
    { name: 'Tom Williams', email: 'tom@example.com', date: '2026-03-01', status: 'successful', commission: 290 },
    { name: 'Emma Davis', email: 'emma@example.com', date: '2026-02-28', status: 'pending', commission: 0 },
    { name: 'Chris Brown', email: 'chris@example.com', date: '2026-02-27', status: 'successful', commission: 290 }
];

document.addEventListener('DOMContentLoaded', function() {
    loadReferralStats();
    populateReferralTable();
    
    // Set referral link
    const userId = localStorage.getItem('userId') || 'USER123';
    const baseUrl = window.location.origin;
    document.getElementById('referralLink').value = `${baseUrl}/?ref=${userId}`;
});

function loadReferralStats() {
    const total = mockReferrals.length;
    const successful = mockReferrals.filter(r => r.status === 'successful').length;
    const pending = mockReferrals.filter(r => r.status === 'pending').length;
    const commission = mockReferrals.reduce((sum, r) => sum + r.commission, 0);
    
    document.getElementById('totalRef').textContent = total;
    document.getElementById('successfulRef').textContent = successful;
    document.getElementById('pendingRef').textContent = pending;
    document.getElementById('commissionTotal').textContent = '₦' + commission.toLocaleString();
}

function populateReferralTable(filter = 'all') {
    const tbody = document.getElementById('referralTableBody');
    
    let filtered = mockReferrals;
    if (filter !== 'all') {
        filtered = mockReferrals.filter(r => r.status === filter);
    }
    
    tbody.innerHTML = filtered.map(ref => `
        <tr>
            <td>
                <strong>${ref.name}</strong><br>
                <small>${ref.email}</small>
            </td>
            <td>${ref.date}</td>
            <td><span class="status-badge status-${ref.status}">${ref.status}</span></td>
            <td>${ref.commission > 0 ? '₦' + ref.commission : '-'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="remindFriend('${ref.email}')">
                    <i class="fas fa-bell"></i> Remind
                </button>
            </td>
        </tr>
    `).join('');
}

function filterReferrals(filter) {
    populateReferralTable(filter);
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    
    UI.showNotification('Referral link copied!', 'success');
}

function shareReferral() {
    const link = document.getElementById('referralLink').value;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join Atafi Luxury',
            text: 'Join me on Atafi Luxury business growth platform!',
            url: link
        });
    } else {
        copyReferralLink();
        UI.showNotification('Link copied! Share it with friends.', 'info');
    }
}

function sendInvite(event) {
    event.preventDefault();
    
    const email = document.getElementById('inviteEmail').value;
    const message = document.getElementById('inviteMessage').value;
    
    // In production, send to your backend
    console.log('Sending invite to:', email, message);
    
    UI.showNotification(`Invitation sent to ${email}!`, 'success');
    document.getElementById('inviteForm').reset();
}

function remindFriend(email) {
    UI.showNotification(`Reminder sent to ${email}`, 'info');
}