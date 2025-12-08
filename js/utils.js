/**
 * Utility Functions - Wspólne funkcje pomocnicze
 */

/**
 * Throttle function - ogranicza częstotliwość wywołań
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function - opóźnia wywołanie do momentu zakończenia serii zdarzeń
 */
export function debounce(func, wait) {
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
 * Sprawdza preferencje użytkownika dotyczące redukcji animacji
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smooth scroll do elementu z offsetem
 */
export function smoothScrollTo(target, offset = 80) {
    if (!target) return;
    
    const targetPosition = target.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Pobiera parametr z URL
 */
export function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Sprawdza czy element jest widoczny w viewport
 */
export function isElementInViewport(el, threshold = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= -threshold &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

