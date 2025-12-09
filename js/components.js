/**
 * Components Module - Komponenty reużywalne
 */

/**
 * Generuje HTML nawigacji
 * @param {Object} config - Konfiguracja nawigacji
 * @param {string} config.logoText - Tekst logo
 * @param {string} config.logoLink - Link logo
 * @param {Array} config.menuItems - Elementy menu [{href, text, active}]
 * @returns {string} HTML nawigacji
 */
export function createNavigation(config) {
    const { logoText, logoLink, menuItems = [] } = config;
    
    const menuItemsHTML = menuItems.map(item => {
        const activeClass = item.active ? 'active' : '';
        const ariaCurrent = item.active ? 'aria-current="page"' : '';
        return `
            <li role="none">
                <a href="${item.href}" class="nav-link ${activeClass}" role="menuitem" ${ariaCurrent}>
                    ${item.text}
                </a>
            </li>
        `;
    }).join('');

    return `
        <nav class="navbar">
            <div class="container">
                <div class="nav-content">
                    <div class="logo">
                        <a href="${logoLink}" class="logo-link" aria-label="${logoText} - Strona główna">
                            <span class="logo-text">${logoText}</span>
                        </a>
                    </div>
                    <ul class="nav-menu" role="menubar">
                        ${menuItemsHTML}
                    </ul>
                    <button class="mobile-menu-toggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    `;
}

/**
 * Inicjalizuje galerię obrazów
 * @param {Object} config - Konfiguracja galerii
 * @param {string} config.containerId - ID kontenera galerii
 * @param {Array} config.images - Tablica ścieżek do obrazów
 * @param {string} config.basePath - Bazowa ścieżka do obrazów
 * @param {Object} config.viewerOptions - Opcje ImageViewer
 */
export function initGallery(config) {
    const { containerId, images, basePath = '', viewerOptions = {} } = config;
    
    const galleryContainer = document.getElementById(containerId);
    if (!galleryContainer) {
        console.error(`Gallery container not found: ${containerId}`);
        return;
    }

    console.log(`Initializing gallery in container: ${containerId} with ${images.length} images`);

    // Wyczyść kontener
    galleryContainer.innerHTML = '';

    const cleanBasePath = basePath.endsWith('/') ? basePath : basePath + '/';
    const fullImages = images.map(name => cleanBasePath + name);
    
    console.log('Full image paths:', fullImages);
    
    // Tworzenie miniatur galerii
    fullImages.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Zrzut ekranu ${index + 1}`;
        img.loading = 'lazy';
        
        // Obsługa błędów ładowania
        img.onerror = function() {
            console.error(`Failed to load image: ${imageSrc}`);
            galleryItem.style.background = 'rgba(255, 0, 0, 0.1)';
            galleryItem.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); padding: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <span>Błąd ładowania</span>
                    <small style="font-size: 0.75rem; margin-top: 0.5rem;">${imageSrc}</small>
                </div>
            `;
        };
        
        img.onload = function() {
            galleryItem.classList.add('loaded');
            console.log(`Image loaded: ${imageSrc}`);
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        overlay.innerHTML = '<i class="fas fa-search-plus"></i>';
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        
        galleryContainer.appendChild(galleryItem);
    });
    
    console.log(`Gallery initialized with ${fullImages.length} images. Items created: ${galleryContainer.children.length}`);
    
    // Aktualizuj event listenery dla kliknięć
    galleryContainer.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            // Inicjalizacja ImageViewer przy pierwszym kliknięciu lub użycie istniejącego
            if (!window.imageViewer || !window.imageViewer.images || window.imageViewer.images.length !== fullImages.length) {
                if (typeof ImageViewer !== 'undefined' || typeof window.ImageViewer !== 'undefined') {
                    const ViewerClass = typeof ImageViewer !== 'undefined' ? ImageViewer : window.ImageViewer;
                    window.imageViewer = new ViewerClass({
                        images: fullImages,
                        enableZoom: true,
                        enableFullscreen: true,
                        enableKeyboard: true,
                        enableThumbnails: true,
                        container: document.body,
                        ...viewerOptions
                    });
                }
            }
            if (window.imageViewer) {
                window.imageViewer.open(index);
            }
        });
    });
    
    // Pre-inicjalizacja ImageViewer jeśli jest dostępny
    if ((typeof ImageViewer !== 'undefined' || typeof window.ImageViewer !== 'undefined')) {
        const ViewerClass = typeof ImageViewer !== 'undefined' ? ImageViewer : window.ImageViewer;
        try {
            window.imageViewer = new ViewerClass({
                images: fullImages,
                enableZoom: true,
                enableFullscreen: true,
                enableKeyboard: true,
                enableThumbnails: true,
                container: document.body,
                ...viewerOptions
            });
        } catch (e) {
            console.warn('ImageViewer initialization deferred:', e);
        }
    }
}

