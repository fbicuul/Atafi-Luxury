/**
 * ATAFI LUXURY - MAIN APPLICATION
 * Complete version with all features
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize components
    if (window.Analytics) Analytics.init();
    
    // Load user session
    loadUserSession();
    
    // Setup form handlers
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePredictionSubmit);
    }
    
    // Setup payment button
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', handleStartJourney);
    }
    
    // Load community data
    loadCommunityStats();
    loadSuccessStories();
    
    // Track page view
    if (window.Analytics) {
        Analytics.trackEvent('page_load', {
            path: window.location.pathname
        });
    }
}

function loadUserSession() {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId && userEmail) {
        document.body.classList.add('logged-in');
        
        // Update UI for logged in user
        const loginLink = document.querySelector('.btn-login');
        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = 'dashboard.html';
        }
    }
}

async function handlePredictionSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    UI.showLoading(true);
    
    try {
        const formData = {
            fullName: document.getElementById('fullName').value,
            businessName: document.getElementById('businessName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            industry: document.getElementById('industry').value,
            monthlyRevenue: parseFloat(document.getElementById('monthlyRevenue').value),
            customerCount: parseInt(document.getElementById('customerCount').value),
            marketingBudget: parseFloat(document.getElementById('marketingBudget').value),
            password: document.getElementById('password').value
        };
        
        // Track prediction attempt
        if (window.Analytics) {
            Analytics.trackEvent('prediction_request', {
                industry: formData.industry,
                revenue: formData.monthlyRevenue
            });
        }
        
        const prediction = calculatePrediction(formData);
        displayPredictionResults(prediction);
        
        sessionStorage.setItem('pendingPrediction', JSON.stringify({
            formData: formData,
            prediction: prediction
        }));
        
        UI.showNotification('Prediction calculated!', 'success');
        
    } catch (error) {
        console.error('Prediction error:', error);
        if (window.Analytics) Analytics.trackError(error, { action: 'prediction' });
        UI.showNotification('Error calculating prediction', 'error');
    } finally {
        UI.showLoading(false);
    }
}

async function handleStartJourney() {
    const pendingData = sessionStorage.getItem('pendingPrediction');
    
    if (!pendingData) {
        UI.showNotification('Please get a prediction first', 'info');
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    try {
        const { formData } = JSON.parse(pendingData);
        const selectedPlan = document.getElementById('plan')?.value || 'PRO';
        
        // Get plan details
        const plan = window.ENV?.PLANS?.[selectedPlan] || {
            id: selectedPlan,
            name: selectedPlan === 'BASIC' ? 'Basic' : selectedPlan === 'PRO' ? 'Professional' : 'Enterprise',
            price: selectedPlan === 'BASIC' ? 2900 : selectedPlan === 'PRO' ? 4900 : 9900
        };
        
        // Process payment and signup
        if (window.Payment) {
            await Payment.processSignup(formData, plan);
        } else {
            // Fallback direct payment
            handleDirectPayment(formData, plan);
        }
        
    } catch (error) {
        console.error('Journey error:', error);
        if (window.Analytics) Analytics.trackError(error, { action: 'journey' });
        UI.showNotification('Error starting your journey', 'error');
    }
}

// Fallback payment handler
function handleDirectPayment(formData, plan) {
    const email = formData.email;
    
    if (!email) {
        UI.showNotification('Please enter your email', 'error');
        return;
    }
    
    try {
        const handler = PaystackPop.setup({
            key: window.PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: plan.price * 100,
            currency: 'NGN',
            ref: 'ATAFI_' + Date.now(),
            metadata: {
                full_name: formData.fullName,
                phone: formData.phone,
                plan: plan.id
            },
            callback: function(response) {
                UI.showNotification('Payment successful!', 'success');
                setTimeout(() => {
                    window.location.href = '/payment-success.html?reference=' + response.reference + '&plan=' + plan.id;
                }, 2000);
            },
            onClose: function() {
                UI.showNotification('Payment cancelled', 'info');
            }
        });
        handler.openIframe();
    } catch (error) {
        console.error('Payment error:', error);
        UI.showNotification('Error starting payment', 'error');
    }
}

function calculatePrediction(data) {
    const revenue = data.monthlyRevenue || 0;
    const customers = data.customerCount || 0;
    
    let baseGrowth = 15;
    
    const industryMultipliers = {
        'retail': 1.3, 'services': 1.2, 'technology': 1.4,
        'manufacturing': 1.1, 'hospitality': 1.25, 'other': 1.0
    };
    
    const industryMultiplier = industryMultipliers[data.industry] || 1.0;
    const sizeMultiplier = customers > 100 ? 1.2 : customers > 50 ? 1.1 : 1.0;
    
    const growthPercentage = Math.round((baseGrowth * industryMultiplier * sizeMultiplier) * 100) / 100;
    const projectedRevenue = Math.round(revenue * (1 + growthPercentage / 100));
    const projectedCustomers = Math.round(customers * (1 + (growthPercentage - 5) / 100));
    const projectedROI = Math.round((projectedRevenue - revenue) / (data.marketingBudget || 1) * 100);
    
    return { growthPercentage, projectedRevenue, projectedCustomers, projectedROI };
}

function displayPredictionResults(prediction) {
    const resultsDiv = document.getElementById('predictionResults');
    if (!resultsDiv) return;
    
    document.getElementById('growthPercentage').textContent = prediction.growthPercentage + '%';
    document.getElementById('projectedRevenue').textContent = prediction.projectedRevenue.toLocaleString();
    document.getElementById('projectedCustomers').textContent = prediction.projectedCustomers;
    document.getElementById('projectedROI').textContent = prediction.projectedROI;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['fullName', 'businessName', 'email', 'phone', 'industry', 'monthlyRevenue', 'customerCount', 'marketingBudget', 'password'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('invalid');
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email && email.value && !email.value.includes('@')) {
        email.classList.add('invalid');
        isValid = false;
    }
    
    return isValid;
}

function loadCommunityStats() {
    setTimeout(() => {
        const memberCount = document.getElementById('memberCount');
        const referralCount = document.getElementById('referralCount');
        
        if (memberCount) memberCount.textContent = '547';
        if (referralCount) referralCount.textContent = '1,234';
    }, 1000);
}

function loadSuccessStories() {
    const storiesContainer = document.getElementById('successStories');
    if (!storiesContainer) return;
    
    const stories = [
        { name: "Blessing's Fashion House", story: "Revenue doubled in 3 months!", growth: "+120%" },
        { name: "Chidi's Tech Solutions", story: "Grew exactly as projected", growth: "+85%" },
        { name: "Amara Beauty", story: "Community support is amazing!", growth: "+200%" }
    ];
    
    storiesContainer.innerHTML = stories.map(s => `
        <div class="story-card">
            <h4>${s.name}</h4>
            <p>"${s.story}"</p>
            <span class="growth-badge">${s.growth}</span>
        </div>
    `).join('');
}

// UI Helper Functions
const UI = {
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = show ? 'flex' : 'none';
    },
    
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        if (toast) {
            toast.textContent = message;
            toast.className = `notification-toast ${type}`;
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 5000);
        }
    }
};