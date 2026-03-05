/**
 * ATAFI LUXURY - BRAND TRANSFORMATION PREDICTOR
 * World-class prediction algorithm
 */

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
            password: document.getElementById('accountPassword')?.value || ''
        };
        
        return this.formData;
    }

    // Calculate growth score (0-100)
    calculateGrowthScore() {
        let score = 50; // Base score
        
        // Revenue factor (higher revenue = higher score)
        if (this.formData.monthlyRevenue > 10000000) score += 15;
        else if (this.formData.monthlyRevenue > 5000000) score += 10;
        else if (this.formData.monthlyRevenue > 1000000) score += 5;
        
        // Years in operation
        if (this.formData.yearsOperation === '5-10') score += 10;
        else if (this.formData.yearsOperation === '3-5') score += 7;
        else if (this.formData.yearsOperation === '1-3') score += 5;
        else if (this.formData.yearsOperation === '10+') score += 12;
        
        // Marketing channels
        const channelCount = this.formData.marketingChannels.length;
        score += Math.min(channelCount * 3, 15);
        
        // Branding status
        if (this.formData.brandingStatus === 'established') score += 10;
        else if (this.formData.brandingStatus === 'moderate') score += 7;
        else if (this.formData.brandingStatus === 'basic') score += 3;
        
        // Digital presence
        if (this.formData.websiteStatus !== 'none') score += 5;
        if (this.formData.socialPresence !== 'none') score += 5;
        if (this.formData.seoRanking !== 'none') score += 5;
        
        // Sales system
        if (this.formData.salesProcess !== 'none') score += 5;
        if (this.formData.followup !== 'none') score += 5;
        if (this.formData.crm !== 'none') score += 5;
        
        // Cap at 100
        return Math.min(100, score);
    }

    // Calculate projected growth percentage
    calculateGrowth() {
        let growth = 50; // Base growth
        
        // Industry multipliers
        const industryMultipliers = {
            'technology': 1.8,
            'services': 1.5,
            'retail': 1.4,
            'health': 1.6,
            'education': 1.3,
            'realestate': 1.5,
            'finance': 1.7,
            'hospitality': 1.4,
            'manufacturing': 1.3,
            'other': 1.2
        };
        
        growth *= industryMultipliers[this.formData.industry] || 1.2;
        
        // Current revenue factor (more room to grow if smaller)
        if (this.formData.monthlyRevenue < 1000000) growth *= 1.5;
        else if (this.formData.monthlyRevenue < 5000000) growth *= 1.3;
        else if (this.formData.monthlyRevenue < 10000000) growth *= 1.2;
        
        // Marketing budget factor
        if (this.formData.marketingBudget < 100000) growth *= 1.4;
        else if (this.formData.marketingBudget < 500000) growth *= 1.3;
        else if (this.formData.marketingBudget < 1000000) growth *= 1.2;
        
        // Current conversion rate (lower = more room for improvement)
        if (this.formData.conversionRate < 1) growth *= 1.6;
        else if (this.formData.conversionRate < 2) growth *= 1.4;
        else if (this.formData.conversionRate < 3) growth *= 1.2;
        
        return Math.round(growth * 100) / 100;
    }

    // Calculate lead increase
    calculateLeadIncrease() {
        let increase = 100; // Base 100% increase
        
        // Social presence factor
        if (this.formData.socialPresence === 'none') increase += 150;
        else if (this.formData.socialPresence === 'basic') increase += 100;
        else if (this.formData.socialPresence === 'active') increase += 50;
        
        // SEO factor
        if (this.formData.seoRanking === 'none') increase += 100;
        else if (this.formData.seoRanking === 'low') increase += 75;
        else if (this.formData.seoRanking === 'medium') increase += 50;
        
        // Marketing channels factor
        const channelCount = this.formData.marketingChannels.length;
        increase += (5 - channelCount) * 20;
        
        return Math.min(300, Math.round(increase));
    }

    // Calculate conversion improvement
    calculateConversionImprovement() {
        let improvement = 50; // Base improvement
        
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
        
        // Profit = leads × conversion × value
        return Math.round((leadIncrease / 100) * (conversionImprovement / 100) * 100);
    }

    // Generate all predictions
    generatePredictions() {
        this.collectFormData();
        
        this.results = {
            growthScore: this.calculateGrowthScore(),
            brandStrength: Math.min(100, Math.round(this.growthScore * 0.85 + 25)),
            marketingEfficiency: Math.min(100, Math.round(this.growthScore * 0.7 + 20)),
            salesConversion: Math.min(100, Math.round(this.growthScore * 0.75 + 15)),
            customerTrust: Math.min(100, Math.round(this.growthScore * 0.9 + 10)),
            
            growthPercentage: this.calculateGrowth(),
            leadIncrease: this.calculateLeadIncrease(),
            conversionImprovement: this.calculateConversionImprovement(),
            profitGrowth: this.calculateProfitGrowth(),
            
            projectedRevenue: Math.round(this.formData.monthlyRevenue * (1 + this.calculateGrowth() / 100)),
            projectedLeads: Math.round(this.parseLeadsToNumber(this.formData.leadsPerMonth) * (1 + this.calculateLeadIncrease() / 100)),
            projectedCustomers: Math.round((this.formData.monthlyRevenue / (this.formData.customerLTV || 50000)) * (1 + this.calculateProfitGrowth() / 100)),
            
            marketVisibility: Math.min(100, Math.round(this.growthScore * 0.8 + 30)),
            brandAuthority: Math.min(100, Math.round(this.growthScore * 0.95 + 5))
        };
        
        return this.results;
    }

    // Helper: Parse leads string to number
    parseLeadsToNumber(leadsString) {
        const leadMap = {
            '0-10': 5,
            '10-50': 30,
            '50-200': 125,
            '200-1000': 600,
            '1000+': 1500
        };
        return leadMap[leadsString] || 100;
    }

    // Render results dashboard
    renderResults() {
        const results = this.generatePredictions();
        
        // Update score
        document.getElementById('growthScore').textContent = results.growthScore;
        document.getElementById('growthScoreMeter').style.width = results.growthScore + '%';
        
        // Update metrics
        document.getElementById('brandStrength').textContent = results.brandStrength + '%';
        document.getElementById('marketingEfficiency').textContent = results.marketingEfficiency + '%';
        document.getElementById('salesConversion').textContent = results.salesConversion + '%';
        document.getElementById('customerTrust').textContent = results.customerTrust + '%';
        
        // Update revenue
        document.getElementById('currentRevenue').textContent = '₦' + this.formData.monthlyRevenue.toLocaleString();
        document.getElementById('projectedRevenue').textContent = '₦' + results.projectedRevenue.toLocaleString();
        
        // Update leads
        document.getElementById('leadGrowth').textContent = '+' + results.leadIncrease + '%';
        document.getElementById('leadGrowthBar').style.width = Math.min(100, results.leadIncrease * 0.33) + '%';
        
        // Update visibility
        document.getElementById('marketVisibility').textContent = results.marketVisibility + '%';
        document.getElementById('visibilityBar').style.width = results.marketVisibility + '%';
        document.getElementById('brandAuthority').textContent = results.brandAuthority + '%';
        document.getElementById('authorityBar').style.width = results.brandAuthority + '%';
        
        // Update transformation numbers
        const currentProfit = Math.round(this.formData.monthlyRevenue * 0.3); // Assume 30% profit margin
        document.getElementById('currentProfit').textContent = '₦' + currentProfit.toLocaleString();
        document.getElementById('projectedProfit').textContent = '₦' + (currentProfit * (1 + results.profitGrowth / 100)).toLocaleString();
        
        const currentCustomers = Math.round(this.formData.monthlyRevenue / (this.formData.customerLTV || 50000));
        document.getElementById('currentCustomers').textContent = currentCustomers;
        document.getElementById('projectedCustomers').textContent = results.projectedCustomers;
        
        // Business initials for logo preview
        const businessName = this.formData.businessName || 'Your Brand';
        const initials = businessName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('businessInitials').textContent = initials;
        
        // Create revenue chart
        this.createRevenueChart();
    }

    // Create revenue projection chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        const weeklyRevenue = [];
        const currentRevenue = this.formData.monthlyRevenue / 4; // Weekly revenue
        const growthRate = this.results.growthPercentage / 4; // Weekly growth rate
        
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
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '₦' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
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
            // Send to Apps Script
            const response = await fetch('YOUR_APPS_SCRIPT_URL', {
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
            
            // Send confirmation email
            await this.sendConfirmationEmail();
            
            return true;
        } catch (error) {
            console.error('Account creation failed:', error);
            return false;
        }
    }

    // Send confirmation email (using email service)
    async sendConfirmationEmail() {
        // Email content with all form data and predictions
        const emailContent = this.generateEmailContent();
        
        // Send via email service
        await fetch('YOUR_EMAIL_SERVICE_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: this.formData.email,
                subject: 'Your Atafi Luxury Brand Transformation Report',
                html: emailContent
            })
        });
    }

    // Generate email content
    generateEmailContent() {
        return `
            <h1>Your Brand Transformation Report</h1>
            <p>Thank you for completing the Atafi Luxury brand assessment.</p>
            
            <h2>Account Details</h2>
            <p>Email: ${this.formData.email}</p>
            <p>Password: ${this.formData.password}</p>
            
            <h2>Your Business Information</h2>
            <pre>${JSON.stringify(this.formData, null, 2)}</pre>
            
            <h2>Your Growth Predictions</h2>
            <pre>${JSON.stringify(this.results, null, 2)}</pre>
            
            <p>Login to your dashboard to view your complete transformation report.</p>
            <a href="https://atafi-lux.onrender.com/dashboard.html">Access Dashboard</a>
        `;
    }
}

// ==================== UI CONTROLLERS ====================

let currentStep = 1;
const totalSteps = 8;

function startAssessment() {
    document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
}

function nextStep(step) {
    // Validate current step
    if (!validateStep(step)) return;
    
    // Hide current step
    document.getElementById(`step${step}`).classList.remove('active');
    
    // Show next step
    currentStep = step + 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update progress bar
    updateProgress();
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${step}`).classList.remove('active');
    
    // Show previous step
    currentStep = step - 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update progress bar
    updateProgress();
}

function validateStep(step) {
    // Add validation logic for each step
    return true; // Simplified for now
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Update step labels
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update step label text
    const labels = [
        'Business Foundation',
        'Market & Customers',
        'Brand Strategy',
        'Digital Presence',
        'Marketing Performance',
        'Sales System',
        'Goals & Vision',
        'Create Account'
    ];
    document.getElementById('currentStepLabel').textContent = labels[currentStep - 1];
}

function generateReport() {
    // Validate final step
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
    
    // Show loading
    showLoading(true);
    
    // Generate predictions
    const predictor = new BrandPredictor();
    predictor.renderResults();
    
    // Create account
    predictor.createAccount().then(success => {
        showLoading(false);
        
        if (success) {
            // Hide form, show results
            document.getElementById('assessment').style.display = 'none';
            document.getElementById('resultsDashboard').style.display = 'block';
            
            // Scroll to results
            document.getElementById('resultsDashboard').scrollIntoView({ behavior: 'smooth' });
            
            // Start urgency timer
            startUrgencyTimer();
        } else {
            alert('Account creation failed. Please try again.');
        }
    });
}

function startTransformation() {
    // Process payment and start transformation
    const predictor = new BrandPredictor();
    const plan = 'PRO'; // Or get from selected plan
    
    // Flutterwave payment
    FlutterwaveCheckout({
        public_key: FLW_CONFIG.PUBLIC_KEY,
        tx_ref: 'TRANSFORM_' + Date.now(),
        amount: 490000, // ₦4,900 in kobo
        currency: 'NGN',
        subaccounts: [{ id: FLW_CONFIG.SUBACCOUNT_ID }],
        payment_options: 'card, banktransfer, ussd',
        customer: {
            email: predictor.formData.email,
            name: predictor.formData.businessName,
            phone_number: predictor.formData.phone
        },
        callback: function(response) {
            if (response.status === 'successful') {
                window.location.href = '/dashboard.html?welcome=true';
            }
        }
    });
}

function bookStrategyCall() {
    // Redirect to calendar booking
    window.open('https://calendly.com/atafiluxury/strategy-call', '_blank');
}

function startUrgencyTimer() {
    // Set 24 hours from now
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('offerTimer').textContent = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('offerTimer').textContent = 'EXPIRED';
        }
    }, 1000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        const div = document.createElement('div');
        div.id = 'loadingOverlay';
        div.className = 'loading-overlay';
        div.innerHTML = '<div class="spinner"></div><p>Generating your brand transformation report...</p>';
        document.body.appendChild(div);
    }
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', function() {
    // Revenue slider
    const revenueSlider = document.getElementById('monthlyRevenue');
    if (revenueSlider) {
        revenueSlider.addEventListener('input', function() {
            document.getElementById('revenueValue').textContent = 
                parseInt(this.value).toLocaleString();
        });
    }
    
    // Budget slider
    const budgetSlider = document.getElementById('marketingBudget');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            document.getElementById('budgetValue').textContent = 
                parseInt(this.value).toLocaleString();
        });
    }
    
    // Conversion slider
    const conversionSlider = document.getElementById('conversionRate');
    if (conversionSlider) {
        conversionSlider.addEventListener('input', function() {
            document.getElementById('conversionValue').textContent = this.value;
        });
    }
    
    // Revenue goal slider
    const goalSlider = document.getElementById('revenueGoal');
    if (goalSlider) {
        goalSlider.addEventListener('input', function() {
            document.getElementById('revenueGoalValue').textContent = 
                parseInt(this.value).toLocaleString();
        });
    }
});