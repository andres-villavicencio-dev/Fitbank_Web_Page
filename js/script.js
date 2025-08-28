// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAIAssistant();
    initializeContactForm();
    initializeLazyLoading();
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.background = 'rgba(15, 20, 25, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(15, 20, 25, 0.95)';
                header.style.backdropFilter = 'blur(15px)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .client-logo, .growth-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// AI Assistant Functions
function initializeAIAssistant() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    
    // Initialize with welcome message if not already present
    if (chatMessages && chatMessages.children.length <= 1) {
        addWelcomeMessage();
    }
}

function addWelcomeMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Check if welcome message already exists
    const existingMessages = chatMessages.querySelectorAll('.ai-message');
    if (existingMessages.length > 0) return;
    
    const welcomeMessage = createMessageElement('ai', 'Hello! I\'m the FIT-BANK AI Assistant. Ask me about our core banking solutions, client success stories, or implementation process.');
    chatMessages.appendChild(welcomeMessage);
}

function createMessageElement(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'ai' ? 'ai-message' : 'user-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'ai' ? '🤖' : '👤';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    return messageDiv;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!userInput || !chatMessages) return;
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessage = createMessageElement('user', message);
    chatMessages.appendChild(userMessage);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    const typingMessage = createMessageElement('ai', 'Typing...');
    chatMessages.appendChild(typingMessage);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        chatMessages.removeChild(typingMessage);
        
        const aiResponse = generateAIResponse(message);
        const aiMessage = createMessageElement('ai', aiResponse);
        chatMessages.appendChild(aiMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Client success stories
    if (message.includes('client') || message.includes('success') || message.includes('growth')) {
        return "Our clients have achieved remarkable success! For example, Cooperativa Gualaquiza grew their assets by 454% from $22M to $122M since implementing FIT-BANK in 2017. Cooperativa Atuntaqui also saw 211% growth, from $173M to $538M. We serve 35+ financial institutions across Ecuador, Central America, Caribbean, Peru, and UK.";
    }
    
    // Implementation questions
    if (message.includes('implement') || message.includes('timeline') || message.includes('time')) {
        return "FIT-BANK implementation typically takes 3-6 months depending on your institution's size and requirements. We provide full support including data migration, staff training, and system integration. Our team works closely with you throughout the entire process to ensure a smooth transition.";
    }
    
    // Security questions
    if (message.includes('security') || message.includes('safe') || message.includes('protect')) {
        return "FIT-BANK uses bank-grade security protocols including end-to-end encryption, multi-factor authentication, real-time fraud detection, and full regulatory compliance for Latin American financial markets. We meet all international banking security standards and undergo regular security audits.";
    }
    
    // Features and differences
    if (message.includes('different') || message.includes('features') || message.includes('special')) {
        return "FIT-BANK stands out with our AI-powered analytics, real-time processing, comprehensive mobile platform, and proven track record in Latin America. We offer complete core banking, digital banking, business intelligence, and multi-channel integration. Our system is designed specifically for the Latin American financial market.";
    }
    
    // Pricing questions
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
        return "FIT-BANK pricing is customized based on your institution's size, requirements, and modules needed. We offer flexible licensing options and competitive pricing. Please contact our sales team for a detailed quote tailored to your specific needs.";
    }
    
    // Support questions
    if (message.includes('support') || message.includes('help') || message.includes('service')) {
        return "We provide 24/7 technical support, comprehensive training programs, regular system updates, and dedicated account management. Our support team includes banking experts and technical specialists who understand the financial industry's unique requirements.";
    }
    
    // Default response
    return "Thank you for your question! FIT-BANK offers comprehensive core banking solutions for financial institutions across Latin America. Our system includes core banking, digital platforms, AI analytics, and security features. Would you like to know more about our client success stories, implementation process, or specific features?";
}

function askPredefined(question) {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = question;
        sendMessage();
    }
}

// Contact Form Functions
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function submitForm(event) {
    handleContactSubmit(event);
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const institution = formData.get('institution');
    const interest = formData.get('interest');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !institution || !interest) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your interest! We will contact you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Optional: Send to actual backend
        // sendToBackend(formData);
    }, 2000);
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00d4aa' : '#ff6b35'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
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
            img.classList.remove('lazy');
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimization
const debouncedScroll = debounce(function() {
    // Handle scroll events that don't need to run frequently
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    // Optional: Send error to analytics
});

// Browser Compatibility Checks
function checkBrowserSupport() {
    const requiredFeatures = [
        'querySelector',
        'addEventListener',
        'IntersectionObserver'
    ];
    
    const unsupportedFeatures = requiredFeatures.filter(feature => {
        return !(feature in window || feature in document);
    });
    
    if (unsupportedFeatures.length > 0) {
        console.warn('Some features may not work in this browser:', unsupportedFeatures);
    }
}

checkBrowserSupport();

// Analytics and Tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Track button clicks
document.addEventListener('click', function(event) {
    if (event.target.matches('.btn-primary, .btn-secondary')) {
        trackEvent('button_click', {
            button_text: event.target.textContent,
            button_class: event.target.className
        });
    }
});

// Export functions for global use
window.scrollToSection = scrollToSection;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.askPredefined = askPredefined;
window.submitForm = submitForm;