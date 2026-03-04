/**
 * ATAFI LUXURY - REFERRAL SYSTEM
 */

let userId = localStorage.getItem('userId');
let userEmail = localStorage.getItem('userEmail');
let userName = localStorage.getItem('userName');

document.addEventListener('DOMContentLoaded', function() {
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }
    
    loadReferralStats();
    loadReferrals();
});

async function loadReferralStats() {
    try {
        const response = await API.request('atafi_getReferralStats', { referrerId: userId });
        
        if (response.success) {
            document.getElementById('totalReferrals').textContent = response.stats.total || 0;
            document.getElementById('pendingReferrals').textContent = response.stats.pending || 0;
            document.getElementById('convertedReferrals').textContent = response.stats.converted || 0;
            document.getElementById('totalCommission').textContent = '₦' + (response.stats.totalCommission || 0).toLocaleString();
            document.getElementById('referralLink').value = response.referralLink || 'https://atafi-lux.onrender.com/?ref=' + userId;
        }
        
    } catch (error) {
        console.error('Failed to load referral stats:', error);
        showNotification('Failed to load referral stats', 'error');
    }
}

async function loadReferrals(filter = 'all') {
    try {
        const response = await API.request('atafi_getReferrals', { referrerId: userId });
        
        if (response.success) {
            displayReferrals(response.referrals, filter);
        }
        
    } catch (error) {
        console.error('Failed to load referrals:', error);
        document.getElementById('referralTableBody').innerHTML = 
            '<tr><td colspan="5" class="text-center">Failed to load referrals</td></tr>';
    }
}

function displayReferrals(referrals, filter) {
    const tbody = document.getElementById('referralTableBody');
    
    let filtered = referrals;
    if (filter !== 'all') {
        filtered = referrals.filter(r => r.status === filter);
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No referrals found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(ref => `
        <tr>
            <td><strong>${ref.referredEmail}</strong></td>
            <td>${new Date(ref.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${ref.status}">${ref.status}</span></td>
            <td>${ref.commission > 0 ? '₦' + ref.commission : '-'}</td>
            <td>
                ${ref.status === 'pending' ? 
                    `<button class="btn btn-sm btn-secondary" onclick="remindFriend('${ref.referredEmail}')">
                        <i class="fas fa-bell"></i> Remind
                    </button>` : 
                    '-'}
            </td>
        </tr>
    `).join('');
}

function filterReferrals(filter) {
    loadReferrals(filter);
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    showNotification('Referral link copied!', 'success');
}

function shareReferral() {
    const link = document.getElementById('referralLink').value;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join Atafi Luxury',
            text: 'Join me on Atafi Luxury business growth platform!',
            url: link
        }).catch(() => copyReferralLink());
    } else {
        copyReferralLink();
    }
}

async function sendInvite(event) {
    event.preventDefault();
    
    const email = document.getElementById('inviteEmail').value;
    const message = document.getElementById('inviteMessage').value;
    
    try {
        const response = await API.request('atafi_createReferral', {
            referrerId: userId,
            referrerEmail: userEmail,
            referrerName: userName,
            referredEmail: email,
            message: message
        });
        
        if (response.success) {
            showNotification(`Invitation sent to ${email}!`, 'success');
            document.getElementById('inviteForm').reset();
            loadReferrals();
            loadReferralStats();
        } else {
            showNotification(response.error || 'Failed to send invite', 'error');
        }
        
    } catch (error) {
        console.error('Failed to send invite:', error);
        showNotification('Failed to send invite', 'error');
    }
}

async function remindFriend(email) {
    try {
        await API.request('atafi_queueEmail', {
            to: email,
            template: 'referral_reminder',
            data: {
                referrerName: userName,
                referralLink: `https://atafi-lux.onrender.com/?ref=${userId}`
            }
        });
        
        showNotification(`Reminder sent to ${email}`, 'success');
    } catch (error) {
        console.error('Failed to send reminder:', error);
        showNotification('Failed to send reminder', 'error');
    }
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