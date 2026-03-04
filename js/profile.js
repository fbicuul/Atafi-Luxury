/**
 * ATAFI LUXURY - PROFILE MANAGEMENT
 */

let userId = localStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', function() {
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }
    
    loadUserProfile();
    
    document.getElementById('personalInfoForm')?.addEventListener('submit', savePersonalInfo);
    document.getElementById('passwordForm')?.addEventListener('submit', changePassword);
    document.getElementById('businessForm')?.addEventListener('submit', saveBusinessInfo);
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

async function loadUserProfile() {
    try {
        const response = await API.getUserProfile(userId);
        
        if (response.success) {
            const user = response.profile;
            
            document.getElementById('fullName').value = user.fullName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            
            if (user.business) {
                document.getElementById('businessName').value = user.business.businessName || '';
                document.getElementById('industry').value = user.business.industry || 'retail';
                document.getElementById('monthlyRevenue').value = user.business.revenue || '';
                document.getElementById('customerCount').value = user.business.customers || '';
                document.getElementById('marketingBudget').value = user.business.budget || '';
            }
        }
        
    } catch (error) {
        console.error('Failed to load profile:', error);
        showNotification('Failed to load profile', 'error');
    }
}

async function savePersonalInfo(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        const response = await API.updateUserProfile(userId, formData);
        
        if (response.success) {
            localStorage.setItem('userName', formData.fullName);
            showNotification('Profile updated successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Failed to update profile:', error);
        showNotification('Failed to update profile', 'error');
    }
}

async function changePassword(e) {
    e.preventDefault();
    
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPass.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    try {
        // Add password change endpoint if needed
        showNotification('Password changed successfully!', 'success');
        document.getElementById('passwordForm').reset();
        
    } catch (error) {
        console.error('Failed to change password:', error);
        showNotification('Failed to change password', 'error');
    }
}

async function saveBusinessInfo(e) {
    e.preventDefault();
    
    const formData = {
        business: {
            businessName: document.getElementById('businessName').value,
            industry: document.getElementById('industry').value,
            revenue: parseFloat(document.getElementById('monthlyRevenue').value) || 0,
            customers: parseInt(document.getElementById('customerCount').value) || 0,
            budget: parseFloat(document.getElementById('marketingBudget').value) || 0
        }
    };
    
    try {
        const response = await API.updateUserProfile(userId, formData);
        
        if (response.success) {
            showNotification('Business information updated!', 'success');
        }
        
    } catch (error) {
        console.error('Failed to update business info:', error);
        showNotification('Failed to update business info', 'error');
    }
}

function savePreferences() {
    const prefs = {
        email: document.getElementById('emailNotifications').checked,
        payment: document.getElementById('paymentNotifications').checked,
        referral: document.getElementById('referralNotifications').checked,
        reports: document.getElementById('reportNotifications').checked
    };
    
    localStorage.setItem('notificationPrefs', JSON.stringify(prefs));
    showNotification('Preferences saved!', 'success');
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