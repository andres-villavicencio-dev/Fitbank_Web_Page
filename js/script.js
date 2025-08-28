// Modern FIT-BANK JavaScript with AI Integration
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.getAttribute('data-open') === 'true';
            nav.setAttribute('data-open', String(!open));
            toggle.setAttribute('aria-expanded', String(!open));
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // AI Integration Components
    const analyzeButton = document.getElementById('analyzeButton');
    const useCaseNotes = document.getElementById('useCaseNotes');
    const resultDiv = document.getElementById('geminiAnalysisResult');
    const demoForm = document.getElementById('demoForm');
    const modal = document.getElementById('responseModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalButton = document.getElementById('closeModalButton');
    const copyButton = document.getElementById('copyButton');

    // Language Detection
    const isSpanish = window.location.pathname.includes('/es/');
    
    // Secure AI API Call (Backend Proxy Required)
    const callAI = async (prompt, maxRetries = 3) => {
        // This should point to your secure backend endpoint
        const apiEndpoint = '/api/ai-analysis';
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        prompt: prompt,
                        language: isSpanish ? 'es' : 'en'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const result = await response.json();
                return result.analysis || result.text || 'Analysis completed successfully.';

            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) {
                    return isSpanish 
                        ? `Error al conectar con el servidor de IA: ${error.message}. Por favor, contacte al soporte técnico.`
                        : `Error connecting to AI server: ${error.message}. Please contact technical support.`;
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    };

    // Use Case Analysis Feature
    if (analyzeButton && useCaseNotes && resultDiv) {
        analyzeButton.addEventListener('click', async () => {
            const notes = useCaseNotes.value.trim();
            
            if (notes.length < 10) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = isSpanish 
                    ? 'Por favor, describe tu caso de uso con más detalle (mínimo 10 caracteres).'
                    : 'Please describe your use case in more detail (minimum 10 characters).';
                return;
            }

            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<div class="spinner"></div>';
            analyzeButton.disabled = true;
            analyzeButton.textContent = isSpanish ? 'Analizando...' : 'Analyzing...';

            const moduleList = isSpanish 
                ? "Canales e integración, Activos (Crédito), Contingentes, Pasivos (Ahorros), Canales electrónicos, Servicios y administración"
                : "Channels and integration, Assets (Credit), Contingent, Liabilities (Savings), Electronic channels, Services and administration";
                
            const prompt = isSpanish
                ? `Basado en el siguiente caso de uso para una plataforma bancaria, sugiere los 3 módulos más relevantes de FIT-BANK de esta lista: ${moduleList}. Explica brevemente por qué cada uno es importante para este caso específico. Responde en español de manera profesional y concisa. Caso de uso: "${notes}"`
                : `Based on the following use case for a banking platform, suggest the 3 most relevant FIT-BANK modules from this list: ${moduleList}. Briefly explain why each one is important for this specific case. Respond in English professionally and concisely. Use case: "${notes}"`;
            
            const analysis = await callAI(prompt);
            resultDiv.innerHTML = analysis.replace(/\n/g, '<br>');
            
            analyzeButton.disabled = false;
            analyzeButton.textContent = isSpanish ? '✨ Analizar mi caso de uso con IA' : '✨ Analyze my use case with AI';
        });
    }

    // Enhanced Form Submission with AI
    if (demoForm) {
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(demoForm);
            const name = formData.get('name');
            const company = formData.get('company');
            const email = formData.get('email');
            const country = formData.get('country');
            const notes = formData.get('notes');

            // Basic validation
            if (!name || !company || !email) {
                alert(isSpanish 
                    ? 'Por favor, complete todos los campos obligatorios.'
                    : 'Please fill in all required fields.');
                return;
            }

            const modalTitleText = isSpanish 
                ? "Generando Resumen de Seguimiento ✨" 
                : "Generating Follow-up Summary ✨";
                
            showModal(modalTitleText, '<div class="spinner"></div>');
            copyButton.style.display = 'none';

            const prompt = isSpanish
                ? `Eres un asistente de ventas de FIT-BANK. Escribe un borrador de correo electrónico de seguimiento conciso y profesional para el equipo de ventas. El correo debe resumir la solicitud del cliente potencial y sugerir los siguientes pasos específicos. Información del cliente:
                - Nombre: ${name}
                - Empresa: ${company}
                - Email: ${email}
                - País: ${country || 'No especificado'}
                - Caso de uso: "${notes || 'No proporcionado'}"
                
                El correo debe estar en español, ser interno para el equipo de ventas, e incluir recomendaciones específicas de módulos FIT-BANK basadas en el caso de uso.`
                : `You are a FIT-BANK sales assistant. Write a concise and professional follow-up email draft for the sales team. The email should summarize the prospect's request and suggest specific next steps. Client information:
                - Name: ${name}
                - Company: ${company}
                - Email: ${email}
                - Country: ${country || 'Not specified'}
                - Use case: "${notes || 'Not provided'}"
                
                The email should be in English, internal for the sales team, and include specific FIT-BANK module recommendations based on the use case.`;

            const emailDraft = await callAI(prompt);
            
            const successTitle = isSpanish 
                ? "Borrador de Correo de Seguimiento ✨" 
                : "Follow-up Email Draft ✨";
                
            showModal(successTitle, `<pre>${emailDraft}</pre>`);
            copyButton.style.display = 'inline-block';
            copyButton.textContent = isSpanish ? 'Copiar al portapapeles' : 'Copy to clipboard';
            
            // Reset form after successful submission
            demoForm.reset();
        });
    }

    // Modal Functions
    const showModal = (title, body) => {
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.innerHTML = body;
            modal.classList.add('is-visible');
        }
    };

    const hideModal = () => {
        if (modal) {
            modal.classList.remove('is-visible');
        }
    };

    // Modal Event Listeners
    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const textToCopy = modalBody.querySelector('pre')?.innerText || modalBody.innerText;
            
            // Enhanced clipboard functionality
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyButton.textContent = isSpanish ? '¡Copiado!' : 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = isSpanish ? 'Copiar al portapapeles' : 'Copy to clipboard';
                    }, 2000);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyButton.textContent = isSpanish ? '¡Copiado!' : 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = isSpanish ? 'Copiar al portapapeles' : 'Copy to clipboard';
                    }, 2000);
                } catch (err) {
                    console.error('Fallback: Unable to copy', err);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    // Header scroll effect
    let lastScrollY = 0;
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.background = 'rgba(11, 16, 32, 0.95)';
            } else {
                header.style.background = 'rgba(11, 16, 32, 0.75)';
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    // Analytics tracking for AI features
    const trackAIUsage = (action, details = {}) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ai_interaction', {
                'action': action,
                'language': isSpanish ? 'es' : 'en',
                ...details
            });
        }
    };

    // Track AI feature usage
    if (analyzeButton) {
        analyzeButton.addEventListener('click', () => {
            trackAIUsage('use_case_analysis', {
                'has_content': useCaseNotes.value.length > 0
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape' && modal?.classList.contains('is-visible')) {
            hideModal();
        }
        
        // Ctrl/Cmd + Enter submits form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement?.tagName === 'TEXTAREA') {
            const form = document.activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    });
});

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Enhanced resize handler
const handleResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 860) {
        const nav = document.querySelector('.site-nav');
        const toggle = document.querySelector('.nav-toggle');
        
        if (nav && toggle) {
            nav.setAttribute('data-open', 'false');
            toggle.setAttribute('aria-expanded', 'false');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// Performance monitoring
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Initialize non-critical features during idle time
        console.log('FIT-BANK: Enhanced features loaded');
    });
}

// Animate client logos on scroll
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Client logo animation
    const clientObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100); // Stagger animation
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe client logo items
    document.querySelectorAll('.client-logo-item').forEach(item => {
        clientObserver.observe(item);
    });

    // Lazy load images for better performance
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe images for lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

// Show all clients modal function
function showAllClients() {
    const isSpanish = window.location.pathname.includes('/es/');
    
    const clientList = [
        "Cooperativa de Ahorro y Crédito La Dolorosa Ltda",
        "Cooperativa Mushuc Runa",
        "Cooperativa JEP", 
        "Cooperativa Atuntaqui",
        "Cooperativa Señor de Girón",
        "Cooperativa Pilahuin Tio",
        "Cooperativa Padre Julián Lorente",
        "Cooperativa Visión de los Andes",
        "Cooperativa Luz del Valle",
        "Educadores del Azuay",
        "Cooperativa Gualaquiza",
        "Cooperativa Financredit",
        "Cooperativa San Jorge",
        "Club Social de Aerotécnicos FAE",
        "Educadores de Loja",
        "Cooperativa Sierra Centro Ltda"
    ];
    
    const title = isSpanish ? "Todos Nuestros Clientes" : "All Our Clients";
    const subtitle = isSpanish ? "Instituciones financieras que confían en FIT-BANK:" : "Financial institutions that trust FIT-BANK:";
    
    const clientListHtml = clientList.map(client => `
        <div style="padding: 8px 12px; background: var(--chip); margin: 4px 0; border-radius: 6px; border-left: 3px solid var(--brand);">
            ${client}
        </div>
    `).join('');
    
    const modalContent = `
        <h3>${title}</h3>
        <p style="color: var(--muted); margin-bottom: 20px;">${subtitle}</p>
        <div style="max-height: 400px; overflow-y: auto;">
            ${clientListHtml}
        </div>
        <p style="color: var(--muted); margin-top: 20px; font-size: 0.9rem;">
            ${isSpanish ? 'Y muchas más instituciones en crecimiento...' : 'And many more growing institutions...'}
        </p>
    `;
    
    if (typeof showModal === 'function') {
        showModal(title, modalContent);
    }
}

// Enhanced error handling for dark theme logos
function handleLogoError(img, fallbackText) {
    img.style.display = 'none';
    const container = img.parentElement;
    container.classList.add('text-only');
    container.innerHTML = `<div class="client-logo-text">${fallbackText}</div>`;
}

// Improved logo loading for dark theme
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced image loading with dark theme filters
    const images = document.querySelectorAll('.client-logo-item img, .testimonial-logo img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            const fallbackText = this.alt || 'Client Logo';
            handleLogoError(this, fallbackText);
        });
    });
    
    // Staggered animation for client logos
    const clientItems = document.querySelectorAll('.client-logo-item');
    const clientObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150); // Stagger the animations
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    clientItems.forEach(item => {
        clientObserver.observe(item);
    });
});

// Enhanced analytics for client interactions
function trackClientInteraction(clientName, action) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'client_interaction', {
            'client_name': clientName,
            'action': action,
            'page_language': window.location.pathname.includes('/es/') ? 'es' : 'en'
        });
    }
}

// Add click tracking to client logos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.client-logo-item').forEach(item => {
        item.addEventListener('click', () => {
            const clientName = item.querySelector('img')?.alt || 
                             item.querySelector('.client-logo-text')?.textContent?.replace(/\n/g, ' ') || 
                             'Unknown Client';
            trackClientInteraction(clientName.trim(), 'click');
        });
        
        item.addEventListener('mouseenter', () => {
            const clientName = item.querySelector('img')?.alt || 
                             item.querySelector('.client-logo-text')?.textContent?.replace(/\n/g, ' ') || 
                             'Unknown Client';
            trackClientInteraction(clientName.trim(), 'hover');
        });
    });
});