/**
 * Professional Image Viewer Module
 * Modularny, reużywalny viewer do wyświetlania obrazów i wideo
 * Zgodny z DRY - wszystkie funkcje w jednym module
 * 
 * PRZYKŁAD UŻYCIA:
 * 
 * // 1. Dodaj do HTML:
 * // <link rel="stylesheet" href="image-viewer.css">
 * // <script src="image-viewer.js"></script>
 * 
 * // 2. Inicjalizacja:
 * const viewer = new ImageViewer({
 *     images: [
 *         'path/to/image1.jpg',
 *         'path/to/image2.png',
 *         'path/to/video.mp4'
 *     ],
 *     enableZoom: true,
 *     enableFullscreen: true,
 *     enableKeyboard: true,
 *     enableThumbnails: true
 * });
 * 
 * // 3. Otwórz viewer:
 * viewer.open(0); // Otwórz pierwszy obraz
 * 
 * // 4. Zamknij:
 * viewer.close();
 * 
 * OPCJE:
 * - images: Array ścieżek do obrazów/wideo (wymagane)
 * - startIndex: Indeks początkowy (domyślnie: 0)
 * - enableZoom: Włącz zoom (domyślnie: true)
 * - enableFullscreen: Włącz pełny ekran (domyślnie: true)
 * - enableKeyboard: Włącz skróty klawiszowe (domyślnie: true)
 * - enableThumbnails: Włącz miniaturki (domyślnie: true)
 * - container: Kontener DOM (domyślnie: document.body)
 * 
 * SKRÓTY KLAWISZOWE:
 * - Strzałki: Nawigacja między obrazami
 * - +/-: Zoom in/out
 * - 0: Reset zoom
 * - F: Pełny ekran
 * - ESC: Zamknij
 */

class ImageViewer {
    constructor(options = {}) {
        this.options = {
            images: options.images || [],
            startIndex: options.startIndex || 0,
            enableZoom: options.enableZoom !== false,
            enableFullscreen: options.enableFullscreen !== false,
            enableKeyboard: options.enableKeyboard !== false,
            enableThumbnails: options.enableThumbnails !== false,
            container: options.container || document.body,
            ...options
        };
        
        this.currentIndex = this.options.startIndex;
        this.isOpen = false;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createViewerHTML();
        this.attachEventListeners();
        if (this.options.enableKeyboard) {
            this.attachKeyboardListeners();
        }
    }
    
    createViewerHTML() {
        // Główny kontener viewera
        this.viewer = document.createElement('div');
        this.viewer.className = 'image-viewer';
        this.viewer.setAttribute('role', 'dialog');
        this.viewer.setAttribute('aria-label', 'Przeglądarka obrazów');
        this.viewer.setAttribute('aria-modal', 'true');
        
        // Overlay (tło)
        this.overlay = document.createElement('div');
        this.overlay.className = 'image-viewer-overlay';
        
        // Główny kontener zawartości
        this.content = document.createElement('div');
        this.content.className = 'image-viewer-content';
        
        // Toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'image-viewer-toolbar';
        this.toolbar.innerHTML = `
            <div class="image-viewer-info">
                <span class="image-viewer-counter">
                    <span class="current-index">${this.currentIndex + 1}</span> / 
                    <span class="total-count">${this.options.images.length}</span>
                </span>
                <span class="image-viewer-filename"></span>
            </div>
            <div class="image-viewer-controls">
                <button class="image-viewer-btn" data-action="zoom-out" aria-label="Zmniejsz">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="image-viewer-btn" data-action="zoom-reset" aria-label="Resetuj zoom">
                    <i class="fas fa-expand-arrows-alt"></i>
                </button>
                <button class="image-viewer-btn" data-action="zoom-in" aria-label="Powiększ">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button class="image-viewer-btn" data-action="fullscreen" aria-label="Pełny ekran">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="image-viewer-btn" data-action="close" aria-label="Zamknij">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Kontener obrazu
        this.imageContainer = document.createElement('div');
        this.imageContainer.className = 'image-viewer-image-container';
        
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'image-viewer-image';
        this.imageElement.setAttribute('draggable', 'false');
        
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'image-viewer-video';
        this.videoElement.setAttribute('controls', 'true');
        this.videoElement.style.display = 'none';
        
        this.imageContainer.appendChild(this.imageElement);
        this.imageContainer.appendChild(this.videoElement);
        
        // Nawigacja
        this.navPrev = document.createElement('button');
        this.navPrev.className = 'image-viewer-nav image-viewer-nav-prev';
        this.navPrev.setAttribute('aria-label', 'Poprzedni obraz');
        this.navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        this.navNext = document.createElement('button');
        this.navNext.className = 'image-viewer-nav image-viewer-nav-next';
        this.navNext.setAttribute('aria-label', 'Następny obraz');
        this.navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Thumbnails (opcjonalnie)
        if (this.options.enableThumbnails && this.options.images.length > 1) {
            this.thumbnails = document.createElement('div');
            this.thumbnails.className = 'image-viewer-thumbnails';
            this.createThumbnails();
        }
        
        // Składanie struktury
        this.content.appendChild(this.toolbar);
        this.content.appendChild(this.imageContainer);
        this.content.appendChild(this.navPrev);
        this.content.appendChild(this.navNext);
        if (this.thumbnails) {
            this.content.appendChild(this.thumbnails);
        }
        
        this.viewer.appendChild(this.overlay);
        this.viewer.appendChild(this.content);
        
        // Ukryj domyślnie
        this.viewer.style.display = 'none';
        this.options.container.appendChild(this.viewer);
    }
    
    createThumbnails() {
        this.options.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'image-viewer-thumbnail';
            if (index === this.currentIndex) {
                thumb.classList.add('active');
            }
            
            const thumbImg = document.createElement('img');
            thumbImg.src = this.getImageSrc(image);
            thumbImg.setAttribute('draggable', 'false');
            thumbImg.setAttribute('loading', 'lazy');
            
            thumb.appendChild(thumbImg);
            thumb.addEventListener('click', () => this.goToImage(index));
            
            this.thumbnails.appendChild(thumb);
        });
    }
    
    attachEventListeners() {
        // Zamknij na kliknięcie overlay
        this.overlay.addEventListener('click', () => this.close());
        
        // Zamknij na ESC (jeśli włączone)
        if (this.options.enableKeyboard) {
            this.viewer.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            });
        }
        
        // Przyciski toolbar
        this.toolbar.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                this.handleAction(action);
            });
        });
        
        // Nawigacja
        this.navPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previous();
        });
        
        this.navNext.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });
        
        // Zoom i pan dla obrazów
        if (this.options.enableZoom) {
            this.attachZoomListeners();
        }
        
        // Zapobiegaj propagacji kliknięć w kontenerze obrazu
        this.imageContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    attachZoomListeners() {
        // Zoom scroll
        this.imageContainer.addEventListener('wheel', (e) => {
            if (!this.isImage()) return;
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoom(this.zoomLevel + delta, e.clientX, e.clientY);
        }, { passive: false });
        
        // Pan (przeciąganie)
        this.imageElement.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.dragStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                this.panX = e.clientX - this.dragStart.x;
                this.panY = e.clientY - this.dragStart.y;
                this.updateImageTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // Touch support
        let touchStartDistance = 0;
        let touchStartZoom = 1;
        
        this.imageContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchStartDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                touchStartZoom = this.zoomLevel;
            }
        });
        
        this.imageContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                const zoom = touchStartZoom * (distance / touchStartDistance);
                this.zoom(zoom, (touch1.clientX + touch2.clientX) / 2, (touch1.clientY + touch2.clientY) / 2);
            }
        });
    }
    
    attachKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previous();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoom(this.zoomLevel + 0.2);
                    break;
                case '-':
                    e.preventDefault();
                    this.zoom(this.zoomLevel - 0.2);
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }
    
    handleAction(action) {
        switch(action) {
            case 'zoom-in':
                this.zoom(this.zoomLevel + 0.2);
                break;
            case 'zoom-out':
                this.zoom(this.zoomLevel - 0.2);
                break;
            case 'zoom-reset':
                this.resetZoom();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
            case 'close':
                this.close();
                break;
        }
    }
    
    getImageSrc(image) {
        if (typeof image === 'string') {
            return image;
        }
        return image.src || image.url || image;
    }
    
    getImageName(image) {
        if (typeof image === 'string') {
            return image.split('/').pop().split('\\').pop();
        }
        return image.name || image.filename || this.getImageSrc(image).split('/').pop().split('\\').pop();
    }
    
    isImage() {
        const current = this.options.images[this.currentIndex];
        if (!current) return false;
        const src = this.getImageSrc(current).toLowerCase();
        return src.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/);
    }
    
    isVideo() {
        const current = this.options.images[this.currentIndex];
        if (!current) return false;
        const src = this.getImageSrc(current).toLowerCase();
        return src.match(/\.(mp4|webm|ogg|mov)$/);
    }
    
    loadImage(index) {
        if (index < 0 || index >= this.options.images.length) return;
        
        this.currentIndex = index;
        const image = this.options.images[index];
        const src = this.getImageSrc(image);
        const name = this.getImageName(image);
        
        // Aktualizuj licznik
        const currentIndexEl = this.toolbar.querySelector('.current-index');
        const totalCountEl = this.toolbar.querySelector('.total-count');
        const filenameEl = this.toolbar.querySelector('.image-viewer-filename');
        
        if (currentIndexEl) currentIndexEl.textContent = index + 1;
        if (totalCountEl) totalCountEl.textContent = this.options.images.length;
        if (filenameEl) filenameEl.textContent = name;
        
        // Reset zoom przy zmianie obrazu
        this.resetZoom();
        
        // Załaduj odpowiedni typ media
        if (this.isVideo()) {
            this.imageElement.style.display = 'none';
            this.videoElement.style.display = 'block';
            this.videoElement.src = src;
            this.videoElement.load();
        } else {
            this.videoElement.style.display = 'none';
            this.imageElement.style.display = 'block';
            this.imageElement.src = src;
        }
        
        // Aktualizuj thumbnails
        if (this.thumbnails) {
            this.thumbnails.querySelectorAll('.image-viewer-thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
        
        // Aktualizuj przyciski nawigacji
        this.navPrev.style.opacity = index === 0 ? '0.3' : '1';
        this.navNext.style.opacity = index === this.options.images.length - 1 ? '0.3' : '1';
    }
    
    zoom(level, centerX = null, centerY = null) {
        if (!this.isImage()) return;
        
        this.zoomLevel = Math.max(0.5, Math.min(5, level));
        
        if (centerX !== null && centerY !== null) {
            const rect = this.imageContainer.getBoundingClientRect();
            const relativeX = centerX - rect.left - rect.width / 2;
            const relativeY = centerY - rect.top - rect.height / 2;
            
            this.panX = -relativeX * (this.zoomLevel - 1);
            this.panY = -relativeY * (this.zoomLevel - 1);
        }
        
        this.updateImageTransform();
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateImageTransform();
    }
    
    updateImageTransform() {
        if (!this.isImage()) return;
        
        this.imageElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
        this.imageElement.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.viewer.requestFullscreen().catch(err => {
                console.warn('Nie można włączyć pełnego ekranu:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    previous() {
        if (this.currentIndex > 0) {
            this.loadImage(this.currentIndex - 1);
        }
    }
    
    next() {
        if (this.currentIndex < this.options.images.length - 1) {
            this.loadImage(this.currentIndex + 1);
        }
    }
    
    goToImage(index) {
        this.loadImage(index);
    }
    
    open(index = null) {
        if (index !== null) {
            this.currentIndex = Math.max(0, Math.min(index, this.options.images.length - 1));
        }
        
        this.isOpen = true;
        this.viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Załaduj obraz
        this.loadImage(this.currentIndex);
        
        // Fokus dla accessibility
        this.viewer.focus();
        
        // Event dla custom handlers
        this.viewer.dispatchEvent(new CustomEvent('viewer:open', { detail: { index: this.currentIndex } }));
    }
    
    close() {
        this.isOpen = false;
        this.viewer.style.display = 'none';
        document.body.style.overflow = '';
        this.resetZoom();
        
        // Event dla custom handlers
        this.viewer.dispatchEvent(new CustomEvent('viewer:close'));
    }
    
    updateImages(images) {
        this.options.images = images;
        if (this.thumbnails) {
            this.thumbnails.innerHTML = '';
            this.createThumbnails();
        }
        this.loadImage(Math.min(this.currentIndex, images.length - 1));
    }
    
    destroy() {
        if (this.viewer && this.viewer.parentNode) {
            this.viewer.parentNode.removeChild(this.viewer);
        }
    }
}

// Export dla użycia w innych modułach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageViewer;
}

// Export globalnie dla użycia bezpośrednio w HTML
if (typeof window !== 'undefined') {
    window.ImageViewer = ImageViewer;
}

