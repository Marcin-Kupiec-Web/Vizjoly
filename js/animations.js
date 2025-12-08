/**
 * Animations Module - Obsługa animacji i efektów wizualnych
 */
import { prefersReducedMotion, smoothScrollTo } from './utils.js';

/**
 * Inicjalizuje animacje scroll dla elementów
 */
export function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.addEventListener('DOMContentLoaded', () => {
        const animateElements = document.querySelectorAll('.project-card, .stat-item, .contact-item, .section-header');
        
        if (!prefersReducedMotion()) {
            animateElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px) scale(0.95)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        } else {
            animateElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }

        // Auto-scroll to projects section if hash is present
        handleHashScroll();
    });
}

/**
 * Obsługa hash scroll i powrotu z podstron
 */
function handleHashScroll() {
    const hash = window.location.hash;
    if (hash === '#projects') {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            smoothScrollTo(projectsSection, 80);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            const projectsLink = document.querySelector('a[href="#projects"]');
            if (projectsLink) {
                projectsLink.classList.add('active');
            }
        }
    }

    // Check if coming from project page
    const referrer = document.referrer;
    const isFromProjectPage = referrer && (
        referrer.includes('homerevio.html') || 
        referrer.includes('ilewpadlo.html') ||
        referrer.includes('guardtrack.html')
    );

    if (isFromProjectPage || window.location.hash === '#projects') {
        setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                smoothScrollTo(projectsSection, 80);
            }
        }, 100);
    }
}

/**
 * Inicjalizuje efekt parallax dla kształtów
 */
export function initParallax() {
    if (prefersReducedMotion()) return;

    let parallaxTicking = false;
    const prefersReducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleParallax = () => {
        if (prefersReducedMotionMedia.matches) return;
        
        if (!parallaxTicking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const shapes = document.querySelectorAll('.shape');
                
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.15;
                    const rotation = scrolled * 0.05;
                    shape.style.transform = `translate3d(${scrolled * speed * 0.1}px, ${scrolled * speed * 0.1}px, 0) rotate(${rotation}deg)`;
                });
                
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
}

/**
 * Inicjalizuje efekty hover dla kart projektów
 */
export function initProjectCardHover() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.01)';
            this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Animacja licznika dla statystyk
 */
export function initCounterAnimation() {
    const animateCounter = (element, target, duration = 2500) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            const progress = Math.min(current / target, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(target * easeOutQuart);
            
            if (value < target) {
                const originalText = element.textContent;
                const suffix = originalText.includes('+') ? '+' : (originalText.includes('%') ? '%' : '');
                element.textContent = value + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                const originalText = element.textContent;
                const suffix = originalText.includes('+') ? '+' : (originalText.includes('%') ? '%' : '');
                element.textContent = target + suffix;
            }
        };
        
        updateCounter();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (number) {
                        const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');
                        statNumber.textContent = '0' + suffix;
                        setTimeout(() => {
                            animateCounter(statNumber, number, 2500);
                        }, 200);
                    }
                }
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
}

/**
 * Inicjalizuje efekt ripple dla przycisków
 */
export function initRippleEffect() {
    // Add CSS for ripple effect dynamically
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Inicjalizuje scroll progress indicator
 */
export function initScrollProgress() {
    if (prefersReducedMotion()) return;

    const progressBar = document.createElement('div');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Postęp przewijania strony');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899);
        z-index: 10000;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        pointer-events: none;
    `;
    document.body.appendChild(progressBar);
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = Math.min((window.scrollY / windowHeight) * 100, 100);
                progressBar.style.width = scrolled + '%';
                progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Inicjalizuje smooth page load animation
 */
export function initPageLoadAnimation() {
    window.addEventListener('load', () => {
        if (!prefersReducedMotion()) {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-in';
            
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
            });
        } else {
            document.body.style.opacity = '1';
        }
    });
}

