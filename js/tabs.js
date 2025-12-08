/**
 * Tabs Module - Obsługa zakładek projektów
 */
import { smoothScrollTo } from './utils.js';

export function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectPanels = document.querySelectorAll('.project-panel');
    
    if (tabButtons.length === 0) return;

    // Keyboard navigation helper
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
                    smoothScrollTo(projectsSection, 80);
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
}

