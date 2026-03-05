/**
 * ATAFI LUXURY - BRAND TRANSFORMATION PREDICTOR
 * World-class prediction algorithm with Flutterwave integration
 */

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
            
            // Remove active class from all links
            navLinksItems.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Smooth scroll to section
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
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
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
            // First, create account in database
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
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
            
            // Then try to send email (but don't fail if it doesn't work)
            try {
                await this.sendConfirmationEmail();
            } catch (emailError) {
                console.log('Email failed but account created:', emailError);
                showNotification('Account created! Email delivery failed, but you can still proceed.', 'warning', 8000);
            }
            
            return true;
        } catch (error) {
            console.error('Account creation failed:', error);
            return false;
        }
    }

    // Send confirmation email using Apps Script
    async sendConfirmationEmail() {
        const emailContent = this.generateEmailContent();
        
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
            try {
                // Show loading notification
                showNotification('Sending report to your email...', 'info');
                
                const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'sendReportEmail',
                        to: this.formData.email,
                        subject: '🎯 Your Atafi Luxury Brand Transformation Report',
                        htmlBody: emailContent
                    })
                });
                
                console.log('Email sent successfully');
                showNotification('Report sent to your email! Check your inbox.', 'success');
                break;
                
            } catch (error) {
                attempt++;
                console.log(`Email attempt ${attempt} failed:`, error);
                
                if (attempt === maxRetries) {
                    // If all retries fail, save to localStorage for manual retry later
                    const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
                    failedEmails.push({
                        to: this.formData.email,
                        subject: 'Your Atafi Luxury Brand Transformation Report',
                        html: emailContent,
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('failedEmails', JSON.stringify(failedEmails));
                    
                    // Show notification to user with manual option
                    showNotification('⚠️ Email temporarily unavailable. Your report is saved. Click here to download.', 'warning', 10000, () => {
                        this.downloadReportAsPDF();
                    });
                }
                
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }
    }

    // Add fallback method to download report
    downloadReportAsPDF() {
        const emailContent = this.generateEmailContent();
        
        // Create a printable version
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Atafi Luxury - Brand Transformation Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
                    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .label { color: #666; font-size: 0.9em; }
                    .value { font-size: 1.2em; font-weight: bold; }
                    .button { background: #d4af37; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin: 10px 0; }
                </style>
            </head>
            <body>
                ${emailContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        
        showNotification('Report opened in new tab. You can save/print it.', 'success');
    }

    // Generate comprehensive email content with all data
    generateEmailContent() {
        const date = new Date().toLocaleDateString();
        const formData = this.formData;
        const results = this.results;
        const bank = CONFIG.BANK_DETAILS;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #d4af37, #9d4edd); color: white; padding: 30px; text-align: center; border-radius: 10px; }
                    .section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 10px; }
                    .section h2 { color: #d4af37; margin-top: 0; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .item { background: white; padding: 15px; border-radius: 5px; }
                    .label { color: #666; font-size: 0.9em; }
                    .value { font-size: 1.2em; font-weight: bold; color: #333; }
                    .highlight { color: #d4af37; font-size: 1.5em; }
                    .button { background: #d4af37; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; display: inline-block; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; }
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
                        <p>Thank you for completing your brand assessment. Your account has been created successfully.</p>
                        
                        <div style="background: #333; color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>Email:</strong> ${formData.email}</p>
                            <p><strong>Password:</strong> ${formData.password}</p>
                            <p style="color: #ff6b6b; font-size: 0.9em;">⚠️ Please save these credentials and change your password after logging in.</p>
                        </div>
                        
                        <a href="${CONFIG.SITE_URL}/dashboard.html" class="button">Access Your Dashboard</a>
                    </div>
                    
                    <div class="section">
                        <h2>📊 Your Growth Predictions</h2>
                        <div class="grid">
                            <div class="item">
                                <div class="label">Growth Score</div>
                                <div class="value highlight">${results.growthScore}/100</div>
                            </div>
                            <div class="item">
                                <div class="label">Projected Growth</div>
                                <div class="value highlight">+${results.growthPercentage}%</div>
                            </div>
                            <div class="item">
                                <div class="label">Lead Increase</div>
                                <div class="value highlight">+${results.leadIncrease}%</div>
                            </div>
                            <div class="item">
                                <div class="label">Profit Growth</div>
                                <div class="value highlight">+${results.profitGrowth}%</div>
                            </div>
                        </div>
                        
                        <h3 style="margin-top: 20px;">Financial Projection</h3>
                        <div class="grid">
                            <div class="item">
                                <div class="label">Current Monthly Revenue</div>
                                <div class="value">₦${formData.monthlyRevenue.toLocaleString()}</div>
                            </div>
                            <div class="item">
                                <div class="label">Projected Revenue (30 Days)</div>
                                <div class="value">₦${results.projectedRevenue.toLocaleString()}</div>
                            </div>
                            <div class="item">
                                <div class="label">Current Customers</div>
                                <div class="value">${Math.round(formData.monthlyRevenue / (formData.customerLTV || 50000))}</div>
                            </div>
                            <div class="item">
                                <div class="label">Projected Customers</div>
                                <div class="value">${results.projectedCustomers}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>🏢 Your Business Information</h2>
                        <div class="grid">
                            <div class="item">
                                <div class="label">Business Name</div>
                                <div class="value">${formData.businessName || 'Not provided'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Industry</div>
                                <div class="value">${formData.industry || 'Not provided'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Years in Operation</div>
                                <div class="value">${formData.yearsOperation || 'Not provided'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Employees</div>
                                <div class="value">${formData.employees || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>🎯 Brand & Marketing</h2>
                        <div class="grid">
                            <div class="item">
                                <div class="label">Brand Personality</div>
                                <div class="value">${(formData.personality || []).join(', ') || 'Not selected'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Brand Positioning</div>
                                <div class="value">${formData.positioning || 'Not selected'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Marketing Channels</div>
                                <div class="value">${(formData.marketingChannels || []).join(', ') || 'None'}</div>
                            </div>
                            <div class="item">
                                <div class="label">Monthly Marketing Budget</div>
                                <div class="value">₦${(formData.marketingBudget || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>📈 Your 30-Day Growth Roadmap</h2>
                        <div style="margin: 20px 0;">
                            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #d4af37;">
                                <strong>Week 1:</strong> Brand Strategy Development
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #9d4edd;">
                                <strong>Week 2:</strong> Brand Identity Creation
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #4d9eff;">
                                <strong>Week 3:</strong> Marketing System Launch
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #a4ff7c;">
                                <strong>Week 4:</strong> Sales Funnel Activation
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>💰 Ready to Transform Your Business?</h2>
                        <p>Choose your preferred plan and start your brand transformation today:</p>
                        
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
                            <a href="${CONFIG.SITE_URL}/subscription.html?plan=basic" style="flex: 1; background: #333; color: white; text-decoration: none; padding: 15px; text-align: center; border-radius: 5px;">
                                <strong>Basic</strong><br>
                                ₦${CONFIG.PRICING.BASIC}/month
                            </a>
                            <a href="${CONFIG.SITE_URL}/subscription.html?plan=pro" style="flex: 1; background: #d4af37; color: white; text-decoration: none; padding: 15px; text-align: center; border-radius: 5px;">
                                <strong>Professional</strong><br>
                                ₦${CONFIG.PRICING.PRO}/month
                            </a>
                            <a href="${CONFIG.SITE_URL}/subscription.html?plan=enterprise" style="flex: 1; background: #9d4edd; color: white; text-decoration: none; padding: 15px; text-align: center; border-radius: 5px;">
                                <strong>Enterprise</strong><br>
                                ₦${CONFIG.PRICING.ENTERPRISE}/month
                            </a>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="${CONFIG.CALENDLY_URL}" class="button" style="background: #9d4edd;">Book a Free Strategy Call</a>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>💳 Alternative Payment Options</h2>
                        <p>If you prefer to pay via bank transfer:</p>
                        
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <p><strong>Bank:</strong> ${bank.BANK_NAME}</p>
                            <p><strong>Account Name:</strong> ${bank.ACCOUNT_NAME}</p>
                            <p><strong>Account Number:</strong> ${bank.ACCOUNT_NUMBER}</p>
                            <p><strong>Amount:</strong> Based on selected plan</p>
                            <p style="color: #d4af37;"><strong>Reference:</strong> Use your email: ${formData.email}</p>
                        </div>
                        
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <p><strong>USDT (TRC20):</strong> ${bank.USDT_ADDRESS}</p>
                        </div>
                        
                        <p style="font-size: 0.9em; color: #666;">After payment, send proof to ${CONFIG.EMAIL.PAYMENTS} and we'll activate your account within 1 hour.</p>
                    </div>
                    
                    <div class="footer">
                        <p>Questions? Contact us at ${CONFIG.EMAIL.SUPPORT}</p>
                        <p>© 2026 Atafi Luxury. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
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
    
    // Create account and send email
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
            
            // Show success message
            showNotification('Account created! Check your email for your report.', 'success');
        } else {
            alert('Account created but email delivery failed. You can still proceed.');
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
            public_key: CONFIG.FLUTTERWAVE.PUBLIC_KEY,
            tx_ref: 'TRANSFORM_' + Date.now(),
            amount: CONFIG.PRICING[plan] * 100,
            currency: 'NGN',
            subaccounts: [{ id: CONFIG.FLUTTERWAVE.SUBACCOUNT_ID }],
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
                return false;
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
    const bank = CONFIG.BANK_DETAILS;
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>💳 Alternative Payment Options</h2>
            <p>Flutterwave is currently unavailable. You can pay via bank transfer:</p>
            
            <div class="bank-details">
                <h3>🏦 Bank Transfer Details</h3>
                <p><strong>Bank:</strong> ${bank.BANK_NAME}</p>
                <p><strong>Account Name:</strong> ${bank.ACCOUNT_NAME}</p>
                <p><strong>Account Number:</strong> ${bank.ACCOUNT_NUMBER}</p>
                <p><strong>Amount:</strong> ₦${CONFIG.PRICING.PRO} (Professional Plan)</p>
                <p><strong>Reference:</strong> Use your email: <strong>${predictor.formData.email}</strong></p>
            </div>
            
            <div class="crypto-details">
                <h3>₿ Crypto Payment (USDT)</h3>
                <p><strong>Network:</strong> ${bank.USDT_NETWORK}</p>
                <p><strong>Address:</strong> ${bank.USDT_ADDRESS}</p>
            </div>
            
            <p style="color: #666; margin-top: 20px;">After payment, send proof to ${CONFIG.EMAIL.PAYMENTS} and we'll activate your account within 1 hour.</p>
            
            <button class="btn-primary" onclick="window.location.href='mailto:${CONFIG.EMAIL.PAYMENTS}?subject=Payment%20Proof&body=My%20payment%20reference%3A'">
                <i class="fas fa-envelope"></i> Send Payment Proof
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles if not present
    if (!document.getElementById('payment-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'payment-modal-styles';
        style.textContent = `
            .payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .payment-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            }
            .close-modal {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .bank-details, .crypto-details {
                background: #f5f5f5;
                padding: 1.5rem;
                border-radius: 5px;
                margin: 1rem 0;
            }
            .bank-details h3, .crypto-details h3 {
                color: #d4af37;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function bookStrategyCall() {
    window.open(CONFIG.CALENDLY_URL, '_blank');
    
    const predictor = new BrandPredictor();
    predictor.collectFormData();
    predictor.sendConfirmationEmail();
    
    showNotification('Check your email for your report. See you on the call!', 'success');
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
    let overlay = document.getElementById('loadingOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div><p>Generating your brand transformation report...</p>';
        document.body.appendChild(overlay);
        
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    color: white;
                }
                .spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(212,175,55,0.3);
                    border-top-color: #d4af37;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    overlay.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info', duration = 5000, onClick = null) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10001;
        border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#d4af37'};
        animation: slideIn 0.3s ease;
        cursor: ${onClick ? 'pointer' : 'default'};
    `;
    
    if (onClick) {
        toast.addEventListener('click', onClick);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Initialize sliders and event listeners
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
    
    // Check URL params for referral
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        const referralInput = document.getElementById('referralCode');
        if (referralInput) {
            referralInput.value = ref;
        }
    }
});

// ==================== LOGIN/SIGNUP MODALS ====================

function openLoginModal() {
    let modal = document.getElementById('loginModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeLoginModal()">&times;</span>
                <h2>Welcome Back</h2>
                <p>Login to access your dashboard</p>
                
                <form id="loginForm" class="modal-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="loginEmail" required placeholder="you@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" required placeholder="Enter your password">
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" class="forgot-password">Forgot Password?</a>
                    </div>
                    
                    <button type="submit" class="btn-modal">Login</button>
                </form>
                
                <p class="modal-footer">
                    Don't have an account? <a href="#" onclick="switchToSignup()">Sign Up</a>
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    let modal = document.getElementById('signupModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'signupModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeSignupModal()">&times;</span>
                <h2>Create Account</h2>
                <p>Start your business growth journey</p>
                
                <form id="signupForm" class="modal-form" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="signupFullName" required placeholder="John Doe">
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="signupEmail" required placeholder="you@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="signupPhone" required placeholder="+2348012345678">
                    </div>
                    
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="signupPassword" required minlength="8" placeholder="Create a password">
                    </div>
                    
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="signupConfirmPassword" required minlength="8" placeholder="Confirm your password">
                    </div>
                    
                    <div class="form-group">
                        <label>Referral Code (Optional)</label>
                        <input type="text" id="referralCode" placeholder="Enter referral code">
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" id="termsAgree" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#">Terms of Service</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-modal">Create Account</button>
                </form>
                
                <p class="modal-footer">
                    Already have an account? <a href="#" onclick="switchToLogin()">Login</a>
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
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
        await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'atafi_login',
                email: email,
                password: password
            })
        });
        
        showLoading(false);
        showNotification('Login successful! Redirecting...', 'success');
        
        localStorage.setItem('userEmail', email);
        
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
        
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
        await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'atafi_register',
                ...userData
            })
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

// ==================== RETRY FAILED EMAILS ====================

async function retryFailedEmails() {
    const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
    
    if (failedEmails.length === 0) {
        showNotification('No failed emails to retry', 'info');
        return;
    }
    
    showLoading(true);
    showNotification(`Retrying ${failedEmails.length} emails...`, 'info');
    
    const remaining = [];
    
    for (const email of failedEmails) {
        try {
            await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: 'sendReportEmail',
                    to: email.to,
                    subject: email.subject,
                    htmlBody: email.html
                })
            });
            console.log('Retry successful for:', email.to);
        } catch (error) {
            console.log('Retry failed for:', email.to);
            remaining.push(email);
        }
    }
    
    localStorage.setItem('failedEmails', JSON.stringify(remaining));
    showLoading(false);
    
    if (remaining.length === 0) {
        showNotification('All emails sent successfully!', 'success');
    } else {
        showNotification(`${remaining.length} emails still pending`, 'warning');
    }
}

