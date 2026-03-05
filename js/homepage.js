/**
 * ATAFI LUXURY - HOMEPAGE FUNCTIONALITY
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    checkUrlParams();
});

function initializeHomepage() {
    // Mobile menu toggle
    setupMobileMenu();
    
    // Smooth scrolling
    setupSmoothScroll();
    
    // Modal functionality
    setupModals();
    
    // Form handlers
    setupForms();
    
    // Pricing toggle
    setupPricingToggle();
    
    // Load dynamic content
    loadCommunityStats();
    loadSuccessStories();
    
    // Animation on scroll
    setupScrollAnimations();
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ==================== SMOOTH SCROLL ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== MODAL SETUP ====================
function setupModals() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    // Open signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
        });
    }
    
    // Switch to signup from login
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }
    
    // Switch to login from signup
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === signupModal) signupModal.style.display = 'none';
    });
}

// ==================== FORM HANDLERS ====================
function setupForms() {
    // Prediction form
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePredictionSubmit);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Start journey button
    const startBtn = document.getElementById('startJourneyBtn');
    if (startBtn) {
        startBtn.addEventListener('click', handleStartJourney);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

// ==================== PREDICTION HANDLER ====================
async function handlePredictionSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            businessName: document.getElementById('businessName').value,
            email: email,
            phone: document.getElementById('phone').value,
            industry: document.getElementById('industry').value,
            monthlyRevenue: parseFloat(document.getElementById('monthlyRevenue').value),
            customerCount: parseInt(document.getElementById('customerCount').value),
            marketingBudget: parseFloat(document.getElementById('marketingBudget').value),
            password: document.getElementById('predictionPassword').value
        };
        
        // Calculate prediction
        const prediction = calculatePrediction(formData);
        
        // Display results
        displayPredictionResults(prediction);
        
        // Store for later
        sessionStorage.setItem('pendingPrediction', JSON.stringify({
            formData: formData,
            prediction: prediction
        }));
        
        showNotification('Prediction calculated! Scroll down to see results.', 'success');
        
    } catch (error) {
        console.error('Prediction error:', error);
        showNotification('Error calculating prediction', 'error');
    } finally {
        showLoading(false);
    }
}

function calculatePrediction(data) {
    const revenue = data.monthlyRevenue || 0;
    const customers = data.customerCount || 0;
    const marketing = data.marketingBudget || 0;
    
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
    const projectedROI = Math.round((projectedRevenue - revenue) / (marketing || 1) * 100);
    
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

// ==================== LOGIN HANDLER ====================
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    
    showLoading(true);
    
    try {
        const response = await API.login(email, password);
        
        if (response.success) {
            // Store user data
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.fullName);
            
            if (remember) {
                localStorage.setItem('remembered', 'true');
            }
            
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } else {
            showNotification(response.error || 'Invalid credentials', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== SIGNUP HANDLER ====================
async function handleSignup(e) {
    e.preventDefault();
    
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!document.getElementById('termsAgree').checked) {
        showNotification('You must agree to the terms', 'error');
        return;
    }
    
    const userData = {
        fullName: document.getElementById('signupFullName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: password
    };
    
    // Add referral code if present
    const referralCode = document.getElementById('referralCode').value;
    if (referralCode) {
        userData.referredBy = referralCode;
    }
    
    showLoading(true);
    
    try {
        const response = await API.registerUser(userData);
        
        if (response.success) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userName', userData.fullName);
            
            showNotification('Account created successfully!', 'success');
            
            // Close modal
            document.getElementById('signupModal').style.display = 'none';
            
            // Pre-fill prediction form if coming from predictor
            const pendingPrediction = sessionStorage.getItem('pendingPrediction');
            if (pendingPrediction) {
                setTimeout(() => {
                    document.getElementById('startJourneyBtn').click();
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            }
        } else {
            showNotification(response.error || 'Registration failed', 'error');
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== START JOURNEY HANDLER ====================
function handleStartJourney() {
    const pendingData = sessionStorage.getItem('pendingPrediction');
    
    if (!pendingData) {
        showNotification('Please get a prediction first', 'error');
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        // User is logged in, process payment directly
        processPayment();
    } else {
        // User not logged in, show signup modal
        document.getElementById('signupModal').style.display = 'flex';
    }
}

// ==================== PAYMENT PROCESSING ====================
function processPayment(plan = 'PRO') {
    const pendingData = JSON.parse(sessionStorage.getItem('pendingPrediction'));
    const userData = pendingData.formData;
    
    const amount = plan === 'BASIC' ? 2900 : plan === 'PRO' ? 4900 : 9900;
    
    try {
        FlutterwaveCheckout({
            public_key: FLW_CONFIG.PUBLIC_KEY,
            tx_ref: 'ATAFI_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
            amount: amount,
            currency: 'NGN',
            subaccounts: [{ id: FLW_CONFIG.SUBACCOUNT_ID }],
            payment_options: 'card, banktransfer, ussd',
            redirect_url: window.location.origin + '/payment-success.html',
            customer: {
                email: userData.email,
                name: userData.fullName,
                phone_number: userData.phone
            },
            customizations: {
                title: 'Atafi Luxury',
                description: 'Business Growth Journey',
                logo: 'https://atafi-lux.onrender.com/logo.png'
            },
            callback: function(response) {
                if (response.status === 'successful') {
                    showNotification('Payment successful!', 'success');
                    
                    // Register user if not already registered
                    if (!localStorage.getItem('userId')) {
                        API.registerUser({
                            ...userData,
                            paymentRef: response.transaction_id
                        });
                    }
                    
                    setTimeout(() => {
                        window.location.href = '/payment-success.html?reference=' + response.transaction_id;
                    }, 2000);
                }
            },
            onclose: function() {
                showNotification('Payment cancelled', 'info');
            }
        });
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment initialization failed', 'error');
    }
}

// ==================== PRICING TOGGLE ====================
function setupPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    if (!toggle) return;
    
    toggle.addEventListener('change', function() {
        const isYearly = this.checked;
        const amounts = document.querySelectorAll('.amount');
        const periods = document.querySelectorAll('.period');
        
        amounts.forEach(amount => {
            const monthly = amount.dataset.monthly;
            const yearly = amount.dataset.yearly;
            amount.textContent = isYearly ? parseInt(yearly).toLocaleString() : parseInt(monthly).toLocaleString();
        });
        
        periods.forEach(period => {
            period.textContent = isYearly ? '/year' : '/month';
        });
    });
}

// ==================== PLAN SELECTION ====================
function selectPlan(plan) {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        // Not logged in, redirect to signup
        document.getElementById('signupModal').style.display = 'flex';
        sessionStorage.setItem('selectedPlan', plan);
        return;
    }
    
    processPayment(plan);
}

// ==================== CONTACT FORM ====================
function handleContact(e) {
    e.preventDefault();
    showNotification('Message sent! We\'ll get back to you soon.', 'success');
    e.target.reset();
}

// ==================== COMMUNITY STATS ====================
function loadCommunityStats() {
    // Animate stats on view
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current) + (element.textContent.includes('%') ? '%' : '+');
        }
    }, 20);
}

// ==================== SUCCESS STORIES ====================
function loadSuccessStories() {
    const container = document.getElementById('successStories');
    if (!container) return;
    
    const stories = [
        {
            name: "Blessing's Fashion House",
            story: "Revenue doubled in 3 months!",
            growth: "+120%",
            image: "https://via.placeholder.com/60"
        },
        {
            name: "Chidi's Tech Solutions",
            story: "Grew exactly as projected",
            growth: "+85%",
            image: "https://via.placeholder.com/60"
        },
        {
            name: "Amara Beauty",
            story: "Community support is amazing!",
            growth: "+200%",
            image: "https://via.placeholder.com/60"
        },
        {
            name: "Mike's Logistics",
            story: "Best business decision ever",
            growth: "+150%",
            image: "https://via.placeholder.com/60"
        }
    ];
    
    container.innerHTML = stories.map(story => `
        <div class="success-story-card">
            <img src="${story.image}" alt="${story.name}" class="story-image">
            <div class="story-content">
                <h4>${story.name}</h4>
                <p>"${story.story}"</p>
                <span class="growth-badge">${story.growth}</span>
            </div>
        </div>
    `).join('');
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ==================== URL PARAMS CHECK ====================
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
        // Store referral code
        sessionStorage.setItem('referralCode', ref);
        
        // Pre-fill in signup form
        const referralInput = document.getElementById('referralCode');
        if (referralInput) {
            referralInput.value = ref;
        }
        
        // Show notification
        showNotification('You were referred by a friend! Get 10% off your first month!', 'info');
    }
}

// ==================== HELPER FUNCTIONS ====================
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'notification-toast ' + type;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 4000);
    }
}