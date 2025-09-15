/* ============================================================================
   FIT-BANK WEBSITE JAVASCRIPT - ORGANIZED BY FUNCTIONALITY
   Professional Banking Website Interactive Features
   ============================================================================ */

/* ============================================================================
   1. GLOBAL VARIABLES & CONFIGURATION
   ============================================================================ */
let countdownTimer = 10;
let countdownInterval;

/* ============================================================================
   2. INITIALIZATION & DOM READY
   ============================================================================ */

/**
 * Main initialization function - called when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    // Initialize FAB-based floating AI chat before wiring chat logic
    initializeAIFab();
    initializeAIAssistant();
    initializeContactForm();
    initializeLazyLoading();
    checkBrowserSupport();
});

/* ============================================================================
   3. NAVIGATION FUNCTIONS
   ============================================================================ */

/**
 * Initialize navigation functionality including mobile menu
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle mobile menu
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

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

/**
 * Smooth scroll to specific section
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Track scroll event for analytics
        trackEvent('scroll_to_section', {
            section: sectionId,
            method: 'navigation'
        });
    }
}

/* ============================================================================
   4. SCROLL EFFECTS & ANIMATIONS
   ============================================================================ */

/**
 * Initialize scroll-based effects and animations
 */
function initializeScrollEffects() {
    initializeHeaderScrollEffect();
    initializeIntersectionObserver();
    initializeParallaxScrollEffect();
}

/**
 * Header scroll effect for dynamic background
 */
function initializeHeaderScrollEffect() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    const debouncedScroll = debounce(function() {
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
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
}

/**
 * Intersection Observer for scroll animations
 */
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add loaded class for images
                if (entry.target.tagName === 'IMG') {
                    entry.target.classList.add('loaded');
                }
                
                // Add animation class for client logos
                if (entry.target.classList.contains('client-logo-item')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .client-logo, .growth-card, .client-logo-item img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Enhanced Parallax Scroll Effect for Background Images
 * Creates depth by adjusting background position based on scroll
 */
function initializeParallaxScrollEffect() {
    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Check for mobile devices - disable parallax for better performance
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        return;
    }
    
    // Get all parallax sections
    const parallaxSections = document.querySelectorAll('.features, .architecture, #clients');
    
    if (parallaxSections.length === 0) {
        return;
    }
    
    let ticking = false;
    
    // Throttled scroll handler for better performance
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrolled;
            
            // Only apply parallax when section is visible in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                // Calculate parallax offset (background moves slower than scroll)
                const parallaxOffset = (scrolled - sectionTop) * 0.5;
                
                // Update background position to create parallax effect
                section.style.backgroundPosition = `center, center ${parallaxOffset}px`;
            }
        });
        
        ticking = false;
    }
    
    // Throttled scroll event listener
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize on load
    updateParallax();
    
    // Handle resize events
    window.addEventListener('resize', debounce(function() {
        // Re-check mobile status
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile) {
            window.removeEventListener('scroll', onScroll);
            // Reset background positions on mobile
            parallaxSections.forEach(section => {
                section.style.backgroundPosition = 'center, center';
            });
        }
    }, 250));
}

/* ============================================================================
   5. AI ASSISTANT FUNCTIONALITY
   ============================================================================ */

/**
 * Prefer floating chat elements when present, fallback to first matching IDs
 */
function getChatElements() {
    const floating = document.getElementById('floatingChat');
    if (floating) {
        const chatMessages = floating.querySelector('#floatingChatMessages');
        const userInput = floating.querySelector('#floatingUserInput');
        return { chatMessages, userInput };
    }
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    return { chatMessages, userInput };
}


/**
 * Build Floating Action Button (FAB) and floating chat container
 * Injects into document.body and wires basic open/close accessibility behavior
 */
function initializeAIFab() {
    // Avoid duplicate initialization
    if (document.getElementById('aiFab') || document.getElementById('floatingChat')) {
        return;
    }

    const isES = (document.documentElement.lang || 'en').toLowerCase().startsWith('es');
    const txt = {
        title: isES ? 'Asistente IA de FIT-BANK' : 'FIT-BANK AI Assistant',
        online: isES ? '🤖 Asistente IA En Línea' : '🤖 AI Assistant Online',
        placeholder: isES ? 'Pregunta sobre las soluciones FIT-BANK...' : 'Ask about FIT-BANK solutions...',
        send: isES ? 'Enviar' : 'Send',
        openAssistant: isES ? 'Abrir asistente' : 'Open assistant',
        close: isES ? 'Cerrar' : 'Close'
    };

    // Create FAB button
    const fab = document.createElement('button');
    fab.id = 'aiFab';
    fab.className = 'ai-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', txt.openAssistant);
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'floatingChat');
    fab.innerHTML = '<span class="ai-fab-icon">💬</span>';

    // Create floating chat wrapper and content
    const floating = document.createElement('div');
    floating.id = 'floatingChat';
    floating.className = 'floating-chat';
    floating.setAttribute('role', 'dialog');
    floating.setAttribute('aria-modal', 'false');
    floating.setAttribute('aria-label', txt.title);

    floating.innerHTML = `
      <div class="ai-chat-container" tabindex="-1">
        <div class="ai-chat-header" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="ai-status">${txt.online}</span>
          <button type="button" class="chat-close-btn" aria-label="${txt.close}" title="${txt.close}" style="background:transparent;color:var(--ink);border:none;font-size:20px;cursor:pointer;line-height:1;">×</button>
        </div>
        <div class="ai-chat-messages" id="floatingChatMessages"></div>
        <div class="ai-chat-input">
          <input type="text" id="floatingUserInput" placeholder="${txt.placeholder}">
          <button class="send-btn" type="button" onclick="sendMessage()">${txt.send}</button>
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(floating);

    // Toggle behavior
    function openChat() {
        floating.classList.add('open');
        fab.setAttribute('aria-expanded', 'true');
        floating.setAttribute('aria-modal', 'true');
        // Focus input
        const input = floating.querySelector('#floatingUserInput');
        setTimeout(() => input && input.focus(), 0);
    }
    function closeChat() {
        floating.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
        floating.setAttribute('aria-modal', 'false');
        fab.focus();
    }

    fab.addEventListener('click', () => {
        if (floating.classList.contains('open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    // Close button
    const closeBtn = floating.querySelector('.chat-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    // ESC to close when open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && floating.classList.contains('open')) {
            closeChat();
        }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!floating.classList.contains('open')) return;
        const container = floating.querySelector('.ai-chat-container');
        if (container && !container.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
            closeChat();
        }
    });

    // Basic focus trap within chat when open
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !floating.classList.contains('open')) return;
        const focusables = floating.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
}


/**
 * Initialize AI Assistant chat functionality
 */
function initializeAIAssistant() {
    const { chatMessages, userInput } = getChatElements();
    
    // Initialize with welcome message if not already present
    if (chatMessages && chatMessages.children.length <= 1) {
        addWelcomeMessage();
    }
    
    // Add event listeners for input
    if (userInput) {
        userInput.addEventListener('keypress', handleKeyPress);
    }
}

/**
 * Add welcome message to chat
 */
function addWelcomeMessage() {
    const { chatMessages } = getChatElements();
    if (!chatMessages) return;
    
    // Check if welcome message already exists
    const existingMessages = chatMessages.querySelectorAll('.ai-message');
    if (existingMessages.length > 0) return;
    
    const welcomeMessage = createMessageElement('ai', 'Hello! I\'m the FIT-BANK AI Assistant. Ask me about our core banking solutions, client success stories, or implementation process.');
    chatMessages.appendChild(welcomeMessage);
}

/**
 * Create message element for chat
 * @param {string} type - 'ai' or 'user'
 * @param {string} content - Message content
 * @returns {HTMLElement} Message element
 */
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

/**
 * Handle Enter key press in chat input
 * @param {Event} event - Keyboard event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

/**
 * Send message in AI chat
 */
function sendMessage() {
    const { userInput, chatMessages } = getChatElements();
    
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
    scrollChatToBottom(chatMessages);
    
    // Track message for analytics
    trackEvent('ai_chat_message', {
        message_length: message.length,
        message_type: 'user'
    });
    
    // Simulate AI response
    setTimeout(() => {
        chatMessages.removeChild(typingMessage);
        
        const aiResponse = generateAIResponse(message);
        const aiMessage = createMessageElement('ai', aiResponse);
        chatMessages.appendChild(aiMessage);
        
        // Scroll to bottom
        scrollChatToBottom(chatMessages);
        
        // Track AI response
        trackEvent('ai_chat_response', {
            user_message: message,
            response_length: aiResponse.length
        });
    }, 1500);
}

/**
 * Generate AI response based on user message
 * @param {string} userMessage - User's message
 * @returns {string} AI response
 */
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
    
    // Architecture questions
    if (message.includes('architecture') || message.includes('technical') || message.includes('system')) {
        return "FIT-BANK features a revolutionary 4-layer architecture: UCI (Universal Channel Interface), Functional Modules Layer, Customer Information System, and Management Information System (MIS) at the core. This design ensures scalability, security, and seamless integration across all banking channels.";
    }
    
    // Company experience
    if (message.includes('experience') || message.includes('company') || message.includes('years')) {
        return "Soft Warehouse S.A. has over 21 years of experience in technological consulting and specialized system development for the Latin American financial sector. We've successfully served 35+ financial institutions across 5 countries, with proven results like 454% average asset growth for our clients.";
    }
    
    // Default response
    return "Thank you for your question! FIT-BANK offers comprehensive core banking solutions for financial institutions across Latin America. Our system includes core banking, digital platforms, AI analytics, and security features. Would you like to know more about our client success stories, implementation process, or specific features?";
}

/**
 * Ask predefined question in AI chat
 * @param {string} question - Predefined question
 */
function askPredefined(question) {
    const { userInput } = getChatElements();
    if (userInput) {
        userInput.value = question;
        sendMessage();
    }
}

/**
 * Scroll chat messages to bottom
 * @param {HTMLElement} chatMessages - Chat messages container
 */
function scrollChatToBottom(chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ============================================================================
   6. CONTACT FORM FUNCTIONALITY
   ============================================================================ */

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submission event
 */
function submitForm(event) {
    handleContactSubmit(event);
}

/**
 * Process contact form submission
 * @param {Event} event - Form submission event
 */
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
    
    // Validate form data
    const validationResult = validateContactForm({ name, email, institution, interest, message });
    if (!validationResult.isValid) {
        showNotification(validationResult.message, 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Track form submission attempt
    trackEvent('contact_form_submit', {
        institution: institution,
        interest: interest,
        has_message: !!message
    });
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your interest! We will contact you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Track successful submission
        trackEvent('contact_form_success', {
            institution: institution,
            interest: interest
        });
        
        // Optional: Send to actual backend
        // sendToBackend(formData);
    }, 2000);
}

/**
 * Validate contact form data
 * @param {Object} data - Form data object
 * @returns {Object} Validation result
 */
function validateContactForm(data) {
    const { name, email, institution, interest } = data;
    
    // Check required fields
    if (!name || !email || !institution || !interest) {
        return {
            isValid: false,
            message: 'Please fill in all required fields.'
        };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address.'
        };
    }
    
    // Name validation (minimum length)
    if (name.length < 2) {
        return {
            isValid: false,
            message: 'Please enter a valid name.'
        };
    }
    
    // Institution validation (minimum length)
    if (institution.length < 2) {
        return {
            isValid: false,
            message: 'Please enter a valid institution name.'
        };
    }
    
    return { isValid: true };
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
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
        background: ${type === 'success' ? '#00d4aa' : type === 'error' ? '#ff6b35' : '#0093EA'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
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

/* ============================================================================
   7. IMAGE & MEDIA LOADING
   ============================================================================ */

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            loadImage(img);
        });
    }
}

/**
 * Load individual image
 * @param {HTMLImageElement} img - Image element to load
 */
function loadImage(img) {
    img.src = img.dataset.src;
    img.classList.remove('lazy');
    img.classList.add('loaded');
    
    img.addEventListener('load', function() {
        img.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        console.warn('Failed to load image:', img.dataset.src);
        img.style.opacity = '0.5';
    });
}

/* ============================================================================
   8. LANGUAGE SELECTION & REDIRECTION
   ============================================================================ */

/**
 * Update countdown for language selection
 */
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = countdownTimer;
    }
    
    if (countdownTimer <= 0) {
        autoRedirect();
    } else {
        countdownTimer--;
    }
}

/**
 * Auto-redirect based on browser language
 */
function autoRedirect() {
    clearInterval(countdownInterval);
    
    // Get browser language
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.substring(0, 2).toLowerCase();
    
    // Check if user has a saved preference
    const savedLang = localStorage.getItem('fitbank-language');
    if (savedLang) {
        window.location.href = savedLang + '/index.html';
        return;
    }
    
    // Track auto-redirect
    trackEvent('language_auto_redirect', {
        browser_language: langCode,
        detected_language: langCode === 'es' ? 'spanish' : 'english'
    });
    
    // Redirect based on browser language
    if (langCode === 'es') {
        window.location.href = 'es/index.html';
    } else {
        window.location.href = 'en/index.html';
    }
}

/**
 * Clear countdown timer
 */
function clearCountdown() {
    clearInterval(countdownInterval);
}

/**
 * Track language selection
 * @param {string} language - Selected language
 */
function trackLanguageSelection(language) {
    trackEvent('language_selection', {
        'language': language,
        'method': 'manual'
    });
}

/* ============================================================================
   9. ANALYTICS & TRACKING
   ============================================================================ */

/**
 * Track events for analytics
 * @param {string} eventName - Event name
 * @param {Object} eventData - Event data
 */
function trackEvent(eventName, eventData) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Console logging for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Event tracked:', eventName, eventData);
    }
    
    // Custom analytics endpoint (if needed)
    // sendAnalyticsEvent(eventName, eventData);
}

/**
 * Track button clicks automatically
 */
function initializeButtonTracking() {
    document.addEventListener('click', function(event) {
        if (event.target.matches('.btn-primary, .btn-secondary, .nav-cta')) {
            trackEvent('button_click', {
                button_text: event.target.textContent.trim(),
                button_class: event.target.className,
                page_section: findNearestSection(event.target)
            });
        }
    });
}

/**
 * Find nearest section for tracking context
 * @param {HTMLElement} element - Target element
 * @returns {string} Section identifier
 */
function findNearestSection(element) {
    let current = element;
    while (current && current !== document.body) {
        if (current.id) {
            return current.id;
        }
        if (current.classList.contains('section')) {
            return current.querySelector('h2')?.textContent || 'unknown_section';
        }
        current = current.parentElement;
    }
    return 'unknown';
}

/* ============================================================================
   10. UTILITY FUNCTIONS
   ============================================================================ */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
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

/**
 * Get element by ID safely
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
    }
    return element;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ============================================================================
   11. BROWSER COMPATIBILITY & SUPPORT
   ============================================================================ */

/**
 * Check browser compatibility
 */
function checkBrowserSupport() {
    const requiredFeatures = [
        'querySelector',
        'addEventListener',
        'IntersectionObserver'
    ];
    
    const unsupportedFeatures = requiredFeatures.filter(feature => {
        if (feature === 'IntersectionObserver') {
            return !('IntersectionObserver' in window);
        }
        return !(feature in window || feature in document);
    });
    
    if (unsupportedFeatures.length > 0) {
        console.warn('Some features may not work in this browser:', unsupportedFeatures);
        
        // Show fallback notification for very old browsers
        if (unsupportedFeatures.includes('querySelector')) {
            showBrowserWarning();
        }
    }
}

/**
 * Show browser compatibility warning
 */
function showBrowserWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b35;
        color: white;
        padding: 10px;
        text-align: center;
        z-index: 10000;
        font-size: 14px;
    `;
    warning.textContent = 'Your browser is outdated. Please update for the best experience.';
    document.body.insertBefore(warning, document.body.firstChild);
}

/* ============================================================================
   12. ERROR HANDLING & LOGGING
   ============================================================================ */

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // Track error for analytics
    trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno
    });
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    trackEvent('promise_rejection', {
        reason: event.reason?.toString() || 'Unknown error'
    });
});

/* ============================================================================
   13. INITIALIZATION HELPERS
   ============================================================================ */

/**
 * Initialize all tracking features
 */
function initializeTracking() {
    initializeButtonTracking();
    
    // Track page load
    trackEvent('page_load', {
        page: window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent.substring(0, 100) // Truncate for privacy
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        trackEvent('page_visibility', {
            state: document.visibilityState
        });
    });
}

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring() {
    // Track page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            trackEvent('page_performance', {
                load_time: loadTime,
                dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                first_paint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
            });
        }, 0);
    });
}

/* ============================================================================
   14. EXPORT FUNCTIONS FOR GLOBAL USE
   ============================================================================ */

// Make functions available globally for HTML onclick handlers
window.scrollToSection = scrollToSection;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.askPredefined = askPredefined;
window.submitForm = submitForm;
window.toggleMenu = toggleMenu;
window.trackLanguageSelection = trackLanguageSelection;
window.clearCountdown = clearCountdown;

/* ============================================================================
   15. ADDITIONAL INITIALIZATION ON LOAD
   ============================================================================ */

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
    initializePerformanceMonitoring();
    
    // Start language countdown if on language selection page
    if (document.getElementById('countdown')) {
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Add click handlers to save language preference
        const englishBtn = document.getElementById('englishBtn');
        const spanishBtn = document.getElementById('spanishBtn');
        
        if (englishBtn) {
            englishBtn.addEventListener('click', function() {
                localStorage.setItem('fitbank-language', 'en');
                trackLanguageSelection('english');
                clearCountdown();
            });
        }
        
        if (spanishBtn) {
            spanishBtn.addEventListener('click', function() {
                localStorage.setItem('fitbank-language', 'es');
                trackLanguageSelection('spanish');
                clearCountdown();
            });
        }
    }
});

/* ============================================================================
   END OF ORGANIZED FIT-BANK JAVASCRIPT
   ============================================================================ */