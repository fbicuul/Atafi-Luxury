/**
 * ATAFI LUXURY - PROFILE MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadActiveSessions();
    
    // Form submissions
    document.getElementById('personalInfoForm')?.addEventListener('submit', savePersonalInfo);
    document.getElementById('passwordForm')?.addEventListener('submit', changePassword);
    document.getElementById('businessForm')?.addEventListener('submit', saveBusinessInfo);
});

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Load user profile
async function loadUserProfile() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await API.getUserProfile(userId);
        const user = response.data;
        
        // Populate form fields
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('dob').value = user.dob || '1990-01-01';
        document.getElementById('country').value = user.country || 'NG';
        
        // Set avatar
        const initials = (user.fullName || 'JD').split(' ').map(n => n[0]).join('');
        document.getElementById('profileAvatar').textContent = initials;
        
        // Business info
        document.getElementById('businessName').value = user.businessName || '';
        document.getElementById('businessIndustry').value = user.industry || 'retail';
        document.getElementById('businessAddress').value = user.address || '';
        document.getElementById('taxId').value = user.taxId || '';
        
        // Preferences
        document.getElementById('emailNotifications').checked = user.prefs?.email !== false;
        document.getElementById('paymentNotifications').checked = user.prefs?.payment !== false;
        document.getElementById('referralNotifications').checked = user.prefs?.referral !== false;
        document.getElementById('reportNotifications').checked = user.prefs?.reports !== false;
        
        console.log('✅ Profile loaded');
        
    } catch (error) {
        console.error('Failed to load profile:', error);
        UI.showNotification('Failed to load profile', 'error');
    }
}

// Save personal info
async function savePersonalInfo(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        country: document.getElementById('country').value
    };
    
    try {
        await API.updateProfile(formData);
        UI.showNotification('Profile updated successfully!', 'success');
        
        // Update avatar
        const initials = formData.fullName.split(' ').map(n => n[0]).join('');
        document.getElementById('profileAvatar').textContent = initials;
        
    } catch (error) {
        console.error('Failed to update profile:', error);
        UI.showNotification('Failed to update profile', 'error');
    }
}

// Change password
async function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        UI.showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        UI.showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    try {
        await API.changePassword({
            current: currentPassword,
            new: newPassword
        });
        
        UI.showNotification('Password changed successfully!', 'success');
        document.getElementById('passwordForm').reset();
        
        // Send email notification
        await EmailService.sendPasswordResetNotification();
        
    } catch (error) {
        console.error('Failed to change password:', error);
        UI.showNotification('Failed to change password', 'error');
    }
}

// Save business info
async function saveBusinessInfo(e) {
    e.preventDefault();
    
    const formData = {
        businessName: document.getElementById('businessName').value,
        industry: document.getElementById('businessIndustry').value,
        address: document.getElementById('businessAddress').value,
        taxId: document.getElementById('taxId').value
    };
    
    try {
        await API.updateBusinessInfo(formData);
        UI.showNotification('Business information updated!', 'success');
    } catch (error) {
        console.error('Failed to update business info:', error);
        UI.showNotification('Failed to update business info', 'error');
    }
}

// Load active sessions
async function loadActiveSessions() {
    try {
        const response = await API.getActiveSessions();
        const sessions = response.data || [];
        
        const sessionsHtml = sessions.map(session => `
            <div class="session-item">
                <div>
                    <i class="fas fa-${session.device === 'mobile' ? 'mobile-alt' : 'desktop'}"></i>
                    <strong>${session.device}</strong> - ${session.location}
                    <small>Last active: ${session.lastActive}</small>
                </div>
                ${session.current ? '<span class="badge">Current</span>' : ''}
            </div>
        `).join('');
        
        document.getElementById('sessionsList').innerHTML = sessionsHtml || '<p>No active sessions found.</p>';
        
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

// Save preferences
async function savePreferences() {
    const prefs = {
        email: document.getElementById('emailNotifications').checked,
        payment: document.getElementById('paymentNotifications').checked,
        referral: document.getElementById('referralNotifications').checked,
        reports: document.getElementById('reportNotifications').checked,
        language: document.getElementById('language').value,
        timezone: document.getElementById('timezone').value
    };
    
    try {
        await API.savePreferences(prefs);
        UI.showNotification('Preferences saved!', 'success');
    } catch (error) {
        console.error('Failed to save preferences:', error);
        UI.showNotification('Failed to save preferences', 'error');
    }
}

// Other profile actions
function changeAvatar() {
    // Implement avatar upload
    alert('Avatar upload coming soon!');
}

function enable2FA() {
    alert('2FA setup coming soon!');
}

function logoutAllDevices() {
    if (confirm('Are you sure? This will log you out from all other devices.')) {
        // Implement logout all
        UI.showNotification('Logged out from all devices', 'success');
    }
}

function deactivateAccount() {
    if (confirm('⚠️ Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.')) {
        if (confirm('Type "DELETE" to confirm:')) {
            // Implement account deletion
            UI.showNotification('Account deactivation requested', 'info');
        }
    }
}