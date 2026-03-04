/**
 * ATAFI LUXURY - MAIN APPLICATION LOGIC
 * SECURE VERSION - With environment verification
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verify environment is properly configured
    if (!window.ENV) {
        console.error('❌ CRITICAL: Environment variables not loaded');
        UI.showNotification('Site configuration error. Please refresh.', 'error');
        return;
    }
    
    if (!window.ENV.PAYSTACK_PUBLIC_KEY || window.ENV.PAYSTACK_PUBLIC_KEY.includes('{{')) {
        console.error('❌ CRITICAL: Paystack key not properly configured in Render');
        UI.showNotification('Payment system configuration error.', 'error');
    } else {
        console.log('✅ Environment verified - system ready');
    }
    
    initializeApp();
});

function initializeApp() {
    const predictionForm = document.getElementById('predictionForm');
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePredictionSubmit);
    }
    
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', handleStartJourney);
    }
    
    loadCommunityStats();
    loadSuccessStories();
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
        
        const prediction = calculatePrediction(formData);
        displayPredictionResults(prediction);
        
        sessionStorage.setItem('pendingPrediction', JSON.stringify({
            formData: formData,
            prediction: prediction
        }));
        
        UI.showNotification('Prediction calculated! Scroll down to see results.', 'success');
        
    } catch (error) {
        console.error('❌ Prediction error:', error);
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
        await Payment.processSignupPayment(formData);
    } catch (error) {
        console.error('❌ Journey error:', error);
        UI.showNotification('Error starting your journey', 'error');
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
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });
    
    return isValid;
}

function loadCommunityStats() {
    setTimeout(() => {
        document.getElementById('memberCount').textContent = '547';
        document.getElementById('referralCount').textContent = '1,234';
    }, 1000);
}

function loadSuccessStories() {
    const stories = [
        { name: "Blessing's Fashion House", story: "Revenue doubled in 3 months!", growth: "+120%" },
        { name: "Chidi's Tech Solutions", story: "Grew exactly as projected", growth: "+85%" },
        { name: "Amara Beauty", story: "Community support is amazing!", growth: "+200%" }
    ];
    
    const storiesHTML = stories.map(story => `
        <div class="story-card">
            <h4>${story.name}</h4>
            <p>"${story.story}"</p>
            <span class="growth-badge">${story.growth}</span>
        </div>
    `).join('');
    
    document.getElementById('successStories').innerHTML = storiesHTML;
}

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