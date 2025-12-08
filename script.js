/**
 * Main JavaScript File - Inicjalizuje wszystkie moduły
 */
import { initNavigation } from './js/navigation.js';
import { initTabs } from './js/tabs.js';
import { initMobileMenu } from './js/mobile-menu.js';
import {
    initScrollAnimations,
    initParallax,
    initProjectCardHover,
    initCounterAnimation,
    initRippleEffect,
    initScrollProgress,
    initPageLoadAnimation
} from './js/animations.js';

// Inicjalizacja wszystkich modułów
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initProjectCardHover();
    initCounterAnimation();
    initRippleEffect();
    initScrollProgress();
    initPageLoadAnimation();
});
