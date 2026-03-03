/**
 * ATAFI LUXURY - MAIN APPLICATION LOGIC
 * Handles UI interactions and form submissions
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

document.addEventListener('DOMContentLoaded', function() {
    // Verify environment variables are loaded
    if (!window.ENV || !window.ENV.PAYSTACK_PUBLIC_KEY) {
        console.error('❌ Environment variables not loaded!');
        UI.showNotification('Site configuration error. Please refresh.', 'error');
    } else {
        console.log('✅ Environment variables verified');
    }
    
    initializeApp();
});

function initializeApp() {
    // Get form element
    const predictionForm = document.getElementById('predictionForm');
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    
    // Add form submit handler
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePredictionSubmit);
    }
    
    // Add start journey button handler
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', handleStartJourney);
    }
    
    // Load initial data
    loadCommunityStats();
    loadSuccessStories();
}

/**
 * Handle prediction form submission
 */
async function handlePredictionSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    UI.showLoading(true);
    
    try {
        // Get form data
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
        
        // Calculate prediction locally for immediate feedback
        const prediction = calculatePrediction(formData);
        
        // Display prediction results
        displayPredictionResults(prediction);
        
        // Store form data for later use
        sessionStorage.setItem('pendingPrediction', JSON.stringify({
            formData: formData,
            prediction: prediction
        }));
        
        UI.showNotification('Prediction calculated! Scroll down to see results.', 'success');
        
    } catch (error) {
        console.error('Prediction error:', error);
        UI.showNotification('Error calculating prediction. Please try again.', 'error');
    } finally {
        UI.showLoading(false);
    }
}

/**
 * Handle start journey button click
 */
async function handleStartJourney() {
    // Get stored prediction data
    const pendingData = sessionStorage.getItem('pendingPrediction');
    
    if (!pendingData) {
        UI.showNotification('Please get a prediction first', 'info');
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    try {
        const { formData } = JSON.parse(pendingData);
        
        // Process payment and signup
        await Payment.processSignupPayment(formData);
        
    } catch (error) {
        console.error('Journey start error:', error);
        UI.showNotification('Error starting your journey. Please try again.', 'error');
    }
}

/**
 * Calculate business growth prediction
 */
function calculatePrediction(data) {
    // Intelligent prediction algorithm
    const revenue = data.monthlyRevenue || 0;
    const customers = data.customerCount || 0;
    const marketing = data.marketingBudget || 0;
    
    // Base growth percentage
    let baseGrowth = 15; // 15% base increase
    
    // Industry factors
    const industryMultipliers = {
        'retail': 1.3,
        'services': 1.2,
        'technology': 1.4,
        'manufacturing': 1.1,
        'hospitality': 1.25,
        'other': 1.0
    };
    
    const industryMultiplier = industryMultipliers[data.industry] || 1.0;
    
    // Size factor
    const sizeMultiplier = customers > 100 ? 1.2 : customers > 50 ? 1.1 : 1.0;
    
    // Calculate projections
    const growthPercentage = Math.round((baseGrowth * industryMultiplier * sizeMultiplier) * 100) / 100;
    const projectedRevenue = Math.round(revenue * (1 + growthPercentage / 100));
    const projectedCustomers = Math.round(customers * (1 + (growthPercentage - 5) / 100));
    const projectedROI = Math.round((marketing > 0 ? (projectedRevenue - revenue) / marketing * 100 : 0));
    
    return {
        growthPercentage: growthPercentage,
        projectedRevenue: projectedRevenue,
        projectedCustomers: projectedCustomers,
        projectedROI: projectedROI
    };
}

/**
 * Display prediction results
 */
function displayPredictionResults(prediction) {
    const resultsDiv = document.getElementById('predictionResults');
    const growthElement = document.getElementById('growthPercentage');
    const revenueElement = document.getElementById('projectedRevenue');
    const customersElement = document.getElementById('projectedCustomers');
    const roiElement = document.getElementById('projectedROI');
    
    // Animate the growth percentage
    animateValue(growthElement, 0, prediction.growthPercentage, 1000);
    
    // Update other values
    revenueElement.textContent = prediction.projectedRevenue.toLocaleString();
    customersElement.textContent = prediction.projectedCustomers;
    roiElement.textContent = prediction.projectedROI;
    
    // Show results
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Animate number counting
 */
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 10);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current * 100) / 100 + '%';
    }, 10);
}

/**
 * Validate form inputs
 */
function validateForm() {
    let isValid = true;
    const requiredFields = ['fullName', 'businessName', 'email', 'phone', 'industry', 'monthlyRevenue', 'customerCount', 'marketingBudget', 'password'];
    
    // Clear previous validation messages
    document.querySelectorAll('.validation-message').forEach(el => el.remove());
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            markInvalid(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        markInvalid(email, 'Please enter a valid email');
        isValid = false;
    }
    
    // Phone validation (simple)
    const phone = document.getElementById('phone');
    if (phone.value && phone.value.length < 10) {
        markInvalid(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Password validation
    const password = document.getElementById('password');
    if (password.value && password.value.length < 8) {
        markInvalid(password, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Revenue validation
    const revenue = document.getElementById('monthlyRevenue');
    if (revenue.value && parseFloat(revenue.value) < 0) {
        markInvalid(revenue, 'Revenue cannot be negative');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Mark field as invalid and show message
 */
function markInvalid(field, message) {
    field.classList.add('invalid');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'validation-message';
    messageDiv.textContent = message;
    field.parentNode.appendChild(messageDiv);
}

/**
 * Load community statistics
 */
async function loadCommunityStats() {
    // Simulate loading stats
    // In production, you'd fetch from your backend
    setTimeout(() => {
        document.getElementById('memberCount').textContent = '547';
        document.getElementById('referralCount').textContent = '1,234';
    }, 1000);
}

/**
 * Load success stories
 */
async function loadSuccessStories() {
    const storiesContainer = document.getElementById('successStories');
    
    // Sample stories - in production, fetch from backend
    const stories = [
        {
            name: "Blessing's Fashion House",
            story: "Atafi Luxury helped us rebrand and our revenue doubled in 3 months!",
            growth: "+120%"
        },
        {
            name: "Chidi's Tech Solutions",
            story: "The prediction was spot on! We grew exactly as projected.",
            growth: "+85%"
        },
        {
            name: "Amara Beauty",
            story: "Best decision for our business. The community support is amazing!",
            growth: "+200%"
        }
    ];
    
    let storiesHTML = '';
    stories.forEach(story => {
        storiesHTML += `
            <div class="story-card">
                <h4>${story.name}</h4>
                <p>"${story.story}"</p>
                <span class="growth-badge">${story.growth}</span>
            </div>
        `;
    });
    
    storiesContainer.innerHTML = storiesHTML;
}

/**
 * UI Helper Functions
 */
const UI = {
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    },
    
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        if (toast) {
            toast.textContent = message;
            toast.className = `notification-toast ${type}`;
            toast.style.display = 'block';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 5000);
        }
    }
};