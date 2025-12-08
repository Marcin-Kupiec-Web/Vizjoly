// Navigation scroll effect with smooth transitions
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

// Smooth scroll for navigation links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link with animation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Active navigation link on scroll with throttling
const sections = document.querySelectorAll('section[id]');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 10);
});

// Project tabs functionality with smooth transitions and accessibility
const tabButtons = document.querySelectorAll('.tab-btn');
const projectPanels = document.querySelectorAll('.project-panel');

// Keyboard navigation for tabs
const handleTabNavigation = (currentIndex, direction) => {
    const nextIndex = direction === 'next' 
        ? (currentIndex + 1) % tabButtons.length 
        : (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    
    tabButtons[nextIndex].focus();
    tabButtons[nextIndex].click();
};

tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const targetProject = button.getAttribute('data-project');
        
        // Remove active class from all buttons and panels
        tabButtons.forEach((btn, btnIndex) => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.style.transform = '';
            
            const panel = projectPanels[btnIndex];
            if (panel) {
                panel.classList.remove('active');
                panel.setAttribute('hidden', '');
            }
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        button.style.transform = 'scale(1.05)';
        
        // Show corresponding panel with fade animation
        const targetPanel = document.getElementById(targetProject);
        if (targetPanel) {
            targetPanel.removeAttribute('hidden');
            requestAnimationFrame(() => {
                targetPanel.classList.add('active');
            });
        }
        
        // Scroll to projects section if not visible
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                const offsetTop = projectsSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
    
    // Keyboard navigation
    button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleTabNavigation(index, 'next');
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleTabNavigation(index, 'prev');
        } else if (e.key === 'Home') {
            e.preventDefault();
            tabButtons[0].focus();
            tabButtons[0].click();
        } else if (e.key === 'End') {
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            tabButtons[tabButtons.length - 1].click();
        }
    });
});

// Mobile menu toggle with smooth animation
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Advanced Intersection Observer for animations
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

// Observe elements for animation with staggered effect
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .stat-item, .contact-item, .section-header');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    } else {
        // Skip animations for users who prefer reduced motion
        animateElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});

// Enhanced parallax effect to hero shapes with reduced motion support
let parallaxTicking = false;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const handleParallax = () => {
    if (prefersReducedMotion.matches) return;
    
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

// Enhanced hover effect to project cards with glow (only on hover-capable devices)
if (window.matchMedia('(hover: hover)').matches) {
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

// Enhanced stats counter animation with easing
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
            element.textContent = value + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
        }
    };
    
    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    statNumber.textContent = '0' + (text.includes('+') ? '+' : '') + 
                                           (text.includes('%') ? '%' : '');
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

// Add ripple effect to buttons
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

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
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

// Add cursor glow effect on interactive elements
const interactiveElements = document.querySelectorAll('.btn, .tab-btn, .nav-link, .contact-item, .project-card');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
    
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add subtle glow effect based on mouse position
        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Smooth page load animation (respects reduced motion)
window.addEventListener('load', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    } else {
        document.body.style.opacity = '1';
    }
});

// Add scroll progress indicator with reduced motion support
const createScrollProgress = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
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
};

createScrollProgress();

// Circuit board interactive enhancement (optional - CSS handles most animations)

// Add typing effect to hero title (optional)
const addTypingEffect = () => {
    const titleLine = document.querySelector('.title-line');
    if (titleLine) {
        const text = titleLine.textContent;
        titleLine.textContent = '';
        titleLine.style.opacity = '1';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                titleLine.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
};

// Uncomment to enable typing effect
// setTimeout(addTypingEffect, 500);
