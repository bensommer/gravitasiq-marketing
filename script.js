// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const heroForm = document.getElementById('heroForm');
    const signupForm = document.getElementById('signupForm');
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Hero form submission
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showError(emailInput, 'Email is required');
                return;
            }
            
            if (!emailRegex.test(email)) {
                showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // Clear any previous errors
            clearError(emailInput);
            
            // Track conversion event
            trackConversion('hero_email_submit', { email: email });
            
            // Store email in localStorage for the full signup form
            localStorage.setItem('userEmail', email);
            
            // Redirect to signup section
            document.querySelector('.final-cta').scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill the email in the final form
            const finalEmailInput = signupForm.querySelector('input[name="email"]');
            if (finalEmailInput) {
                finalEmailInput.value = email;
            }
        });
    }
    
    // Full signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                company: formData.get('company').trim(),
                role: formData.get('role')
            };
            
            // Validate all fields
            let hasErrors = false;
            
            // Name validation
            const nameInput = this.querySelector('input[name="name"]');
            if (!data.name) {
                showError(nameInput, 'Name is required');
                hasErrors = true;
            } else {
                clearError(nameInput);
            }
            
            // Email validation
            const emailInput = this.querySelector('input[name="email"]');
            if (!data.email) {
                showError(emailInput, 'Email is required');
                hasErrors = true;
            } else if (!emailRegex.test(data.email)) {
                showError(emailInput, 'Please enter a valid email address');
                hasErrors = true;
            } else {
                clearError(emailInput);
            }
            
            // Company validation
            const companyInput = this.querySelector('input[name="company"]');
            if (!data.company) {
                showError(companyInput, 'Company is required');
                hasErrors = true;
            } else {
                clearError(companyInput);
            }
            
            // Role validation
            const roleSelect = this.querySelector('select[name="role"]');
            if (!data.role) {
                showError(roleSelect, 'Please select your role');
                hasErrors = true;
            } else {
                clearError(roleSelect);
            }
            
            if (hasErrors) {
                return;
            }
            
            // Submit the form
            submitSignupForm(data);
        });
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize FAQ toggle functionality
    initFAQToggle();
    
    // Initialize pricing card interactions
    initPricingCards();
});

// Show error message
function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '4px';
    
    input.style.borderColor = '#e53e3e';
    input.parentNode.appendChild(errorDiv);
}

// Clear error message
function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// Submit signup form
async function submitSignupForm(data) {
    const submitButton = document.querySelector('.final-cta .cta-button');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Creating Your Account...';
    submitButton.disabled = true;
    
    try {
        // Track conversion event
        trackConversion('full_signup_submit', data);
        
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Show error message
        alert('There was an error creating your account. Please try again.');
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Track conversion events
function trackConversion(event, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            event_category: 'conversion',
            event_label: event,
            value: event === 'full_signup_submit' ? 1 : 0.5,
            custom_parameters: data
        });
    }
    
    // LinkedIn Insight Tag
    if (typeof window.lintrk !== 'undefined') {
        window.lintrk('track', { conversion_id: event });
    }
    
    // Console log for debugging
    console.log('Conversion tracked:', event, data);
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
}

// Initialize FAQ toggle functionality
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.display = 'none';
        question.style.cursor = 'pointer';
        question.style.position = 'relative';
        
        // Add toggle icon
        const toggleIcon = document.createElement('span');
        toggleIcon.textContent = '+';
        toggleIcon.style.position = 'absolute';
        toggleIcon.style.right = '0';
        toggleIcon.style.top = '0';
        toggleIcon.style.fontSize = '1.5rem';
        toggleIcon.style.color = '#3182ce';
        question.appendChild(toggleIcon);
        
        question.addEventListener('click', () => {
            const isVisible = answer.style.display === 'block';
            
            if (isVisible) {
                answer.style.display = 'none';
                toggleIcon.textContent = '+';
            } else {
                answer.style.display = 'block';
                toggleIcon.textContent = '−';
            }
        });
    });
}

// Initialize pricing card interactions
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('.cta-button');
        
        button.addEventListener('click', () => {
            const plan = card.querySelector('h3').textContent;
            
            // Track pricing selection
            trackConversion('pricing_plan_selected', { plan: plan });
            
            // Scroll to signup form
            document.querySelector('.final-cta').scrollIntoView({ behavior: 'smooth' });
            
            // Store selected plan
            localStorage.setItem('selectedPlan', plan);
        });
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Handle form input focus states
document.addEventListener('focus', function(e) {
    if (e.target.matches('input, select, textarea')) {
        e.target.parentNode.classList.add('focused');
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.matches('input, select, textarea')) {
        e.target.parentNode.classList.remove('focused');
    }
}, true);

// Lazy loading for images (if any are added later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize on load
window.addEventListener('load', function() {
    initLazyLoading();
    
    // Remove loading states and show content
    document.body.classList.add('loaded');
});

// Handle viewport changes for mobile optimization
function handleViewportChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', handleViewportChange);
handleViewportChange();

// Prevent form submission on Enter key for better UX
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.matches('input:not([type="submit"])')) {
        e.preventDefault();
        
        // Find the next input field
        const form = e.target.closest('form');
        const inputs = Array.from(form.querySelectorAll('input, select'));
        const currentIndex = inputs.indexOf(e.target);
        const nextInput = inputs[currentIndex + 1];
        
        if (nextInput) {
            nextInput.focus();
        } else {
            // Submit the form if we're at the last input
            form.querySelector('button[type="submit"]')?.click();
        }
    }
});