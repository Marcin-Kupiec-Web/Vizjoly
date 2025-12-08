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
    if (!galleryContainer) return;

    const fullImages = images.map(name => basePath + name);
    
    // Tworzenie miniatur galerii
    fullImages.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Zrzut ekranu ${index + 1}`;
        img.loading = 'lazy';
        
        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        overlay.innerHTML = '<i class="fas fa-search-plus"></i>';
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        
        galleryContainer.appendChild(galleryItem);
    });
    
    // Inicjalizacja ImageViewer
    if (typeof ImageViewer !== 'undefined') {
        const viewer = new ImageViewer({
            images: fullImages,
            enableZoom: true,
            enableFullscreen: true,
            enableKeyboard: true,
            enableThumbnails: true,
            container: document.body,
            ...viewerOptions
        });
        
        // Przechowuj viewer w globalnym scope dla kompatybilności
        window.imageViewer = viewer;
        
        // Aktualizuj event listenery, aby używały nowego viewera
        galleryContainer.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                viewer.open(index);
            });
        });
    }
}

