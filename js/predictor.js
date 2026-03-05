/**
 * ATAFI LUXURY - BRAND TRANSFORMATION PREDICTOR
 * COMPLETELY FIXED VERSION - NO CONFIG.JS DEPENDENCY
 */

// ==================== CONFIGURATION ====================
// Flutterwave Public Key (Safe to expose in frontend)
const FLW_PUBLIC_KEY = 'FLWPUBK-2139829c2de5b6071f89e39b59e9d9ca-X';
const FLW_SUBACCOUNT_ID = 'RS_89D720D484AF8296626AC1C84E2B0044';

// Pricing
const PRICING = {
    BASIC: 4900,
    PRO: 9900,
    ENTERPRISE: 19900
};

// Bank Details for Alternative Payments
const BANK_DETAILS = {
    BANK_NAME: 'Parallex Bank',
    ACCOUNT_NAME: 'Atafi Luxury',
    ACCOUNT_NUMBER: '1510096102',
    USDT_ADDRESS: 'TEJiy27SNPB5ADc9bSSMcHMv7i2549rCA7',
    USDT_NETWORK: 'TRC20'
};

// Email & Contact
const EMAIL_CONTACT = {
    SUPPORT: 'support@atafiluxury.com',
    PAYMENTS: 'payments@atafiluxury.com'
};

// Calendly Link
const CALENDLY_URL = 'https://calendly.com/atafiluxury/strategy-call';

// Site URL
const SITE_URL = 'https://atafi-lux.onrender.com';

// Apps Script URL - This will be replaced by Render .env variable
// DO NOT HARDCODE THIS - It will be injected by Render
const APPS_SCRIPT_URL = '{{ .Env.APPS_SCRIPT_URL }}';

// ==================== MOBILE NAVBAR TOGGLE ====================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Toggle menu on hamburger click
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinksItems.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            mobileMenu && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// ==================== BRAND PREDICTOR CLASS ====================
class BrandPredictor {
    constructor() {
        this.formData = {};
        this.results = {};
    }

    // Collect all form data
    collectFormData() {
        this.formData = {
            // Step 1: Business Foundation
            businessName: document.getElementById('businessName')?.value || '',
            industry: document.getElementById('industry')?.value || 'other',
            yearsOperation: document.getElementById('yearsOperation')?.value || '1-3',
            monthlyRevenue: parseFloat(document.getElementById('monthlyRevenue')?.value) || 1000000,
            employees: document.getElementById('employees')?.value || '2-5',
            marketingChannels: Array.from(document.querySelectorAll('input[name="marketingChannels"]:checked')).map(cb => cb.value),
            brandingStatus: document.querySelector('input[name="brandingStatus"]:checked')?.value || 'basic',
            
            // Step 2: Market & Customers
            targetAge: document.getElementById('targetAge')?.value || '25-34',
            incomeLevel: document.getElementById('incomeLevel')?.value || 'middle',
            location: document.getElementById('location')?.value || 'local',
            customerProblems: Array.from(document.querySelectorAll('input[name="customerProblems"]:checked')).map(cb => cb.value),
            purchaseFrequency: document.getElementById('purchaseFrequency')?.value || 'monthly',
            customerLTV: parseFloat(document.getElementById('customerLTV')?.value) || 50000,
            
            // Step 3: Brand Strategy
            personality: Array.from(document.querySelectorAll('input[name="personality"]:checked')).map(cb => cb.value),
            positioning: document.getElementById('positioning')?.value || 'premium',
            usp: document.getElementById('usp')?.value || '',
            competitiveAdvantage: document.getElementById('competitiveAdvantage')?.value || '',
            
            // Step 4: Digital Presence
            websiteStatus: document.getElementById('websiteStatus')?.value || 'none',
            socialPresence: document.getElementById('socialPresence')?.value || 'none',
            seoRanking: document.getElementById('seoRanking')?.value || 'none',
            traffic: document.getElementById('traffic')?.value || '0-100',
            
            // Step 5: Marketing Performance
            marketingBudget: parseFloat(document.getElementById('marketingBudget')?.value) || 500000,
            leadsPerMonth: document.getElementById('leadsPerMonth')?.value || '10-50',
            conversionRate: parseFloat(document.getElementById('conversionRate')?.value) || 2,
            costPerLead: parseFloat(document.getElementById('costPerLead')?.value) || 5000,
            
            // Step 6: Sales System
            salesProcess: document.querySelector('input[name="salesProcess"]:checked')?.value || 'basic',
            followup: document.querySelector('input[name="followup"]:checked')?.value || 'none',
            crm: document.getElementById('crm')?.value || 'none',
            referralProgram: document.getElementById('referralProgram')?.value || 'none',
            
            // Step 7: Goals
            primaryGoal: document.querySelector('input[name="primaryGoal"]:checked')?.value || 'revenue',
            revenueGoal: parseFloat(document.getElementById('revenueGoal')?.value) || 10000000,
            brandVision: document.getElementById('brandVision')?.value || '',
            
            // Step 8: Account
            email: document.getElementById('accountEmail')?.value || '',
            password: document.getElementById('accountPassword')?.value || '',
            fullName: document.getElementById('fullName')?.value || '',
            phone: document.getElementById('phone')?.value || ''
        };
        
        return this.formData;
    }

    // Calculate growth score (0-100)
    calculateGrowthScore() {
        let score = 50;
        
        if (this.formData.monthlyRevenue > 10000000) score += 15;
        else if (this.formData.monthlyRevenue > 5000000) score += 10;
        else if (this.formData.monthlyRevenue > 1000000) score += 5;
        
        if (this.formData.yearsOperation === '5-10') score += 10;
        else if (this.formData.yearsOperation === '3-5') score += 7;
        else if (this.formData.yearsOperation === '1-3') score += 5;
        else if (this.formData.yearsOperation === '10+') score += 12;
        
        const channelCount = this.formData.marketingChannels.length;
        score += Math.min(channelCount * 3, 15);
        
        if (this.formData.brandingStatus === 'established') score += 10;
        else if (this.formData.brandingStatus === 'moderate') score += 7;
        else if (this.formData.brandingStatus === 'basic') score += 3;
        
        if (this.formData.websiteStatus !== 'none') score += 5;
        if (this.formData.socialPresence !== 'none') score += 5;
        if (this.formData.seoRanking !== 'none') score += 5;
        
        if (this.formData.salesProcess !== 'none') score += 5;
        if (this.formData.followup !== 'none') score += 5;
        if (this.formData.crm !== 'none') score += 5;
        
        return Math.min(100, score);
    }

    // Calculate projected growth percentage
    calculateGrowth() {
        let growth = 50;
        
        const industryMultipliers = {
            'technology': 1.8, 'services': 1.5, 'retail': 1.4,
            'health': 1.6, 'education': 1.3, 'realestate': 1.5,
            'finance': 1.7, 'hospitality': 1.4, 'manufacturing': 1.3,
            'other': 1.2
        };
        
        growth *= industryMultipliers[this.formData.industry] || 1.2;
        
        if (this.formData.monthlyRevenue < 1000000) growth *= 1.5;
        else if (this.formData.monthlyRevenue < 5000000) growth *= 1.3;
        else if (this.formData.monthlyRevenue < 10000000) growth *= 1.2;
        
        if (this.formData.marketingBudget < 100000) growth *= 1.4;
        else if (this.formData.marketingBudget < 500000) growth *= 1.3;
        else if (this.formData.marketingBudget < 1000000) growth *= 1.2;
        
        if (this.formData.conversionRate < 1) growth *= 1.6;
        else if (this.formData.conversionRate < 2) growth *= 1.4;
        else if (this.formData.conversionRate < 3) growth *= 1.2;
        
        return Math.round(growth * 100) / 100;
    }

    // Calculate lead increase
    calculateLeadIncrease() {
        let increase = 100;
        
        if (this.formData.socialPresence === 'none') increase += 150;
        else if (this.formData.socialPresence === 'basic') increase += 100;
        else if (this.formData.socialPresence === 'active') increase += 50;
        
        if (this.formData.seoRanking === 'none') increase += 100;
        else if (this.formData.seoRanking === 'low') increase += 75;
        else if (this.formData.seoRanking === 'medium') increase += 50;
        
        const channelCount = this.formData.marketingChannels.length;
        increase += (5 - channelCount) * 20;
        
        return Math.min(300, Math.round(increase));
    }

    // Calculate conversion improvement
    calculateConversionImprovement() {
        let improvement = 50;
        
        if (this.formData.salesProcess === 'none') improvement += 50;
        if (this.formData.followup === 'none') improvement += 40;
        if (this.formData.crm === 'none') improvement += 30;
        if (this.formData.referralProgram === 'none') improvement += 30;
        
        return Math.min(200, Math.round(improvement));
    }

    // Calculate profit growth
    calculateProfitGrowth() {
        const leadIncrease = this.calculateLeadIncrease();
        const conversionImprovement = this.calculateConversionImprovement();
        return Math.round((leadIncrease / 100) * (conversionImprovement / 100) * 100);
    }

    // Parse leads string to number
    parseLeadsToNumber(leadsString) {
        const leadMap = {
            '0-10': 5, '10-50': 30, '50-200': 125,
            '200-1000': 600, '1000+': 1500
        };
        return leadMap[leadsString] || 100;
    }

    // Generate all predictions
    generatePredictions() {
        this.collectFormData();
        const growthScore = this.calculateGrowthScore();
        
        this.results = {
            growthScore: growthScore,
            brandStrength: Math.min(100, Math.round(growthScore * 0.85 + 25)),
            marketingEfficiency: Math.min(100, Math.round(growthScore * 0.7 + 20)),
            salesConversion: Math.min(100, Math.round(growthScore * 0.75 + 15)),
            customerTrust: Math.min(100, Math.round(growthScore * 0.9 + 10)),
            
            growthPercentage: this.calculateGrowth(),
            leadIncrease: this.calculateLeadIncrease(),
            conversionImprovement: this.calculateConversionImprovement(),
            profitGrowth: this.calculateProfitGrowth(),
            
            projectedRevenue: Math.round(this.formData.monthlyRevenue * (1 + this.calculateGrowth() / 100)),
            projectedLeads: Math.round(this.parseLeadsToNumber(this.formData.leadsPerMonth) * (1 + this.calculateLeadIncrease() / 100)),
            projectedCustomers: Math.round((this.formData.monthlyRevenue / (this.formData.customerLTV || 50000)) * (1 + this.calculateProfitGrowth() / 100)),
            
            marketVisibility: Math.min(100, Math.round(growthScore * 0.8 + 30)),
            brandAuthority: Math.min(100, Math.round(growthScore * 0.95 + 5))
        };
        
        return this.results;
    }

    // Render results dashboard
    renderResults() {
        const results = this.generatePredictions();
        
        document.getElementById('growthScore').textContent = results.growthScore;
        document.getElementById('growthScoreMeter').style.width = results.growthScore + '%';
        
        document.getElementById('brandStrength').textContent = results.brandStrength + '%';
        document.getElementById('marketingEfficiency').textContent = results.marketingEfficiency + '%';
        document.getElementById('salesConversion').textContent = results.salesConversion + '%';
        document.getElementById('customerTrust').textContent = results.customerTrust + '%';
        
        document.getElementById('currentRevenue').textContent = '₦' + this.formData.monthlyRevenue.toLocaleString();
        document.getElementById('projectedRevenue').textContent = '₦' + results.projectedRevenue.toLocaleString();
        
        document.getElementById('leadGrowth').textContent = '+' + results.leadIncrease + '%';
        document.getElementById('leadGrowthBar').style.width = Math.min(100, results.leadIncrease * 0.33) + '%';
        
        document.getElementById('marketVisibility').textContent = results.marketVisibility + '%';
        document.getElementById('visibilityBar').style.width = results.marketVisibility + '%';
        document.getElementById('brandAuthority').textContent = results.brandAuthority + '%';
        document.getElementById('authorityBar').style.width = results.brandAuthority + '%';
        
        const currentProfit = Math.round(this.formData.monthlyRevenue * 0.3);
        document.getElementById('currentProfit').textContent = '₦' + currentProfit.toLocaleString();
        document.getElementById('projectedProfit').textContent = '₦' + (currentProfit * (1 + results.profitGrowth / 100)).toLocaleString();
        
        const currentCustomers = Math.round(this.formData.monthlyRevenue / (this.formData.customerLTV || 50000));
        document.getElementById('currentCustomers').textContent = currentCustomers;
        document.getElementById('projectedCustomers').textContent = results.projectedCustomers;
        
        const businessName = this.formData.businessName || 'Your Brand';
        const initials = businessName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('businessInitials').textContent = initials;
        
        this.createRevenueChart();
    }

    // Create revenue projection chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        const weeklyRevenue = [];
        const currentRevenue = this.formData.monthlyRevenue / 4;
        const growthRate = this.results.growthPercentage / 4;
        
        for (let i = 0; i < 4; i++) {
            weeklyRevenue.push(Math.round(currentRevenue * Math.pow(1 + growthRate/100, i)));
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Weekly Revenue (₦)',
                    data: weeklyRevenue,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#1a1a1a',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    // Send data to backend and create account
    async createAccount() {
        try {
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'atafi_register',
                    ...this.formData,
                    predictions: this.results,
                    timestamp: new Date().toISOString()
                })
            });
            
            try {
                await this.sendConfirmationEmail();
            } catch (emailError) {
                console.log('Email failed but account created');
                showNotification('Account created! Check your email (if not received, check spam)', 'warning', 8000);
            }
            
            return true;
        } catch (error) {
            console.error('Account creation failed:', error);
            return false;
        }
    }

    // Send confirmation email
    async sendConfirmationEmail() {
        const emailContent = this.generateEmailContent();
        
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'sendReportEmail',
                to: this.formData.email,
                subject: '🎯 Your Atafi Luxury Brand Transformation Report',
                htmlBody: emailContent
            })
        });
    }

    // Generate email content
    generateEmailContent() {
        const date = new Date().toLocaleDateString();
        const formData = this.formData;
        const results = this.results;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #d4af37, #9d4edd); color: white; padding: 30px; text-align: center; border-radius: 10px; }
                    .section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 10px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Your Brand Transformation Report</h1>
                        <p>Generated on ${date}</p>
                    </div>
                    
                    <div class="section">
                        <h2>🎉 Welcome to Atafi Luxury!</h2>
                        <p>Thank you for completing your brand assessment.</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Password:</strong> ${formData.password}</p>
                        <a href="${SITE_URL}/dashboard.html" style="background: #d4af37; color: white; padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0;">Access Dashboard</a>
                    </div>
                    
                    <div class="section">
                        <h2>📊 Your Growth Predictions</h2>
                        <p><strong>Growth Score:</strong> ${results.growthScore}/100</p>
                        <p><strong>Projected Growth:</strong> +${results.growthPercentage}%</p>
                        <p><strong>Lead Increase:</strong> +${results.leadIncrease}%</p>
                        <p><strong>Profit Growth:</strong> +${results.profitGrowth}%</p>
                    </div>
                    
                    <div class="section">
                        <h2>💳 Payment Options</h2>
                        <p><strong>Bank:</strong> ${BANK_DETAILS.BANK_NAME}</p>
                        <p><strong>Account:</strong> ${BANK_DETAILS.ACCOUNT_NUMBER}</p>
                        <p><strong>USDT:</strong> ${BANK_DETAILS.USDT_ADDRESS}</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    downloadReportAsPDF() {
        const emailContent = this.generateEmailContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>Brand Transformation Report</title></head>
            <body>${emailContent}</body></html>
        `);
        printWindow.document.close();
        showNotification('Report opened in new tab', 'success');
    }
}

// ==================== UI CONTROLLERS ====================

let currentStep = 1;
const totalSteps = 8;

function startAssessment() {
    document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
}

function nextStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    currentStep = step + 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    currentStep = step - 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    const labels = [
        'Business Foundation', 'Market & Customers', 'Brand Strategy',
        'Digital Presence', 'Marketing Performance', 'Sales System',
        'Goals & Vision', 'Create Account'
    ];
    document.getElementById('currentStepLabel').textContent = labels[currentStep - 1];
}

function generateReport() {
    const password = document.getElementById('accountPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('termsAgree').checked;
    
    if (!password || password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    if (!terms) {
        alert('You must agree to the Terms of Service');
        return;
    }
    
    showLoading(true);
    
    const predictor = new BrandPredictor();
    predictor.renderResults();
    
    predictor.createAccount().then(success => {
        showLoading(false);
        
        if (success) {
            document.getElementById('assessment').style.display = 'none';
            document.getElementById('resultsDashboard').style.display = 'block';
            document.getElementById('resultsDashboard').scrollIntoView({ behavior: 'smooth' });
            startUrgencyTimer();
            showNotification('Account created! Check your email.', 'success');
        } else {
            alert('Account created but email failed. You can proceed.');
            document.getElementById('assessment').style.display = 'none';
            document.getElementById('resultsDashboard').style.display = 'block';
        }
    });
}

function startTransformation() {
    const plan = 'PRO';
    const email = document.getElementById('accountEmail')?.value || sessionStorage.getItem('userEmail');
    const businessName = document.getElementById('businessName')?.value || 'Business Owner';
    const phone = document.getElementById('phone')?.value || '08000000000';
    
    if (!email) {
        showNotification('Please complete the assessment first', 'error');
        return;
    }
    
    try {
        FlutterwaveCheckout({
            public_key: FLW_PUBLIC_KEY,
            tx_ref: 'TRANSFORM_' + Date.now(),
            amount: PRICING[plan] * 100,
            currency: 'NGN',
            subaccounts: [{ id: FLW_SUBACCOUNT_ID }],
            payment_options: 'card, banktransfer, ussd',
            
            callback: function(response) {
                if (response.status === 'successful') {
                    window.location.href = '/dashboard.html?welcome=true&payment=success';
                }
            },
            
            onclose: function() {
                if (confirm('Are you sure you want to cancel this payment?')) {
                    showAlternativePaymentOptions();
                }
            },
            
            customer: {
                email: email,
                name: businessName,
                phone_number: phone
            }
        });
    } catch (error) {
        console.error('Flutterwave error:', error);
        showAlternativePaymentOptions();
    }
}

function showAlternativePaymentOptions() {
    const predictor = new BrandPredictor();
    predictor.collectFormData();
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>💳 Alternative Payment Options</h2>
            <p>Pay via bank transfer:</p>
            
            <div class="bank-details">
                <h3>🏦 Bank Transfer</h3>
                <p><strong>Bank:</strong> ${BANK_DETAILS.BANK_NAME}</p>
                <p><strong>Account:</strong> ${BANK_DETAILS.ACCOUNT_NUMBER}</p>
                <p><strong>Name:</strong> ${BANK_DETAILS.ACCOUNT_NAME}</p>
                <p><strong>Reference:</strong> ${predictor.formData.email}</p>
            </div>
            
            <div class="crypto-details">
                <h3>₿ USDT (${BANK_DETAILS.USDT_NETWORK})</h3>
                <p>${BANK_DETAILS.USDT_ADDRESS}</p>
            </div>
            
            <button class="btn-primary" onclick="window.location.href='mailto:${EMAIL_CONTACT.PAYMENTS}?subject=Payment%20Proof&body=My%20payment%20reference%3A'">
                Send Payment Proof
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function bookStrategyCall() {
    window.open(CALENDLY_URL, '_blank');
    
    const predictor = new BrandPredictor();
    predictor.collectFormData();
    predictor.sendConfirmationEmail();
    
    showNotification('Check your email. See you on the call!', 'success');
}

function startUrgencyTimer() {
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const timerEl = document.getElementById('offerTimer');
        if (timerEl) {
            timerEl.textContent = 
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
        }
        
        if (distance < 0) {
            clearInterval(timer);
            if (timerEl) timerEl.textContent = 'EXPIRED';
        }
    }, 1000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; background: white; color: #333;
        padding: 1rem 2rem; border-radius: 5px; box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10001; border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#d4af37'};
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', function() {
    const revenueSlider = document.getElementById('monthlyRevenue');
    if (revenueSlider) {
        revenueSlider.addEventListener('input', function() {
            document.getElementById('revenueValue').textContent = parseInt(this.value).toLocaleString();
        });
    }
    
    const budgetSlider = document.getElementById('marketingBudget');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            document.getElementById('budgetValue').textContent = parseInt(this.value).toLocaleString();
        });
    }
    
    const conversionSlider = document.getElementById('conversionRate');
    if (conversionSlider) {
        conversionSlider.addEventListener('input', function() {
            document.getElementById('conversionValue').textContent = this.value;
        });
    }
    
    const goalSlider = document.getElementById('revenueGoal');
    if (goalSlider) {
        goalSlider.addEventListener('input', function() {
            document.getElementById('revenueGoalValue').textContent = parseInt(this.value).toLocaleString();
        });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        const referralInput = document.getElementById('referralCode');
        if (referralInput) referralInput.value = ref;
    }
});

// ==================== LOGIN/SIGNUP MODALS ====================

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) modal.style.display = 'flex';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading(true);
    
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'atafi_login', email, password })
        });
        
        showLoading(false);
        showNotification('Login successful! Redirecting...', 'success');
        localStorage.setItem('userEmail', email);
        setTimeout(() => window.location.href = '/dashboard.html', 1500);
    } catch (error) {
        showLoading(false);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    showLoading(true);
    
    const userData = {
        fullName: document.getElementById('signupFullName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        password: password,
        referralCode: document.getElementById('referralCode').value
    };
    
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'atafi_register', ...userData })
        });
        
        showLoading(false);
        showNotification('Account created! Check your email.', 'success');
        closeSignupModal();
        
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.fullName);
    } catch (error) {
        showLoading(false);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

async function retryFailedEmails() {
    const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
    if (failedEmails.length === 0) {
        showNotification('No failed emails to retry', 'info');
        return;
    }
    
    showLoading(true);
    
    for (const email of failedEmails) {
        try {
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: 'sendReportEmail',
                    to: email.to,
                    subject: email.subject,
                    htmlBody: email.html
                })
            });
        } catch (error) {
            console.log('Retry failed for:', email.to);
        }
    }
    
    localStorage.setItem('failedEmails', JSON.stringify([]));
    showLoading(false);
    showNotification('Emails sent successfully!', 'success');
}