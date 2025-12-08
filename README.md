# Vizioly - Strona Wizytówkowa

Profesjonalna strona wizytówkowa firmy Vizioly zajmującej się programowaniem, prezentująca projekty: HomeRevio, IleWpadło i GuardTrack.

## 🚀 Funkcje

- **Nowoczesny design** - Responsywna strona z profesjonalnym wyglądem
- **Animacje** - Płynne animacje i efekty wizualne
- **Zakładki projektów** - Interaktywne przełączanie między projektami
- **Responsywność** - Pełna obsługa urządzeń mobilnych
- **Smooth scrolling** - Płynne przewijanie między sekcjami

## 📁 Struktura projektu

```
vizjoly/
├── index.html      # Główny plik HTML
├── styles.css      # Style CSS
├── script.js       # Logika JavaScript
└── README.md       # Dokumentacja
```

## 🌐 Wdrożenie na GitHub Pages

### Metoda 1: Automatyczne wdrożenie (Rekomendowane)

1. **Utwórz repozytorium na GitHub:**
   - Przejdź na [GitHub](https://github.com)
   - Kliknij "New repository"
   - Nazwij repozytorium (np. `vizioly-website`)
   - Wybierz "Public" (GitHub Pages działa tylko dla publicznych repozytoriów)
   - Kliknij "Create repository"

2. **Prześlij pliki:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/vizioly-website.git
   git push -u origin main
   ```

3. **Włącz GitHub Pages:**
   - Przejdź do ustawień repozytorium (Settings)
   - Przewiń do sekcji "Pages"
   - W "Source" wybierz "Deploy from a branch"
   - Wybierz branch "main" i folder "/ (root)"
   - Kliknij "Save"

4. **Twoja strona będzie dostępna pod adresem:**
   ```
   https://TWOJA_NAZWA_UZYTKOWNIKA.github.io/vizioly-website/
   ```

### Metoda 2: Użycie brancha `gh-pages`

Alternatywnie możesz użyć dedykowanego brancha:

```bash
git checkout -b gh-pages
git push origin gh-pages
```

Następnie w ustawieniach repozytorium wybierz branch `gh-pages` jako źródło.

## 🎨 Personalizacja

### Zmiana kolorów

W pliku `styles.css` możesz zmienić kolory w sekcji `:root`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
    /* ... inne kolory */
}
```

### Edycja treści

- **Informacje o firmie** - Edytuj sekcję `#about` w `index.html`
- **Projekty** - Modyfikuj sekcje projektów w `index.html`
- **Kontakt** - Zaktualizuj dane kontaktowe w sekcji `#contact`

## 📱 Responsywność

Strona jest w pełni responsywna i dostosowuje się do:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (do 767px)

## 🔧 Wymagania

- Nowoczesna przeglądarka internetowa (Chrome, Firefox, Safari, Edge)
- Brak dodatkowych zależności - czysty HTML, CSS i JavaScript

## 📝 Licencja

© 2024 Vizioly. Wszystkie prawa zastrzeżone.

## 🤝 Wsparcie

W razie pytań lub problemów, skontaktuj się z nami:
- Email: kontakt@vizioly.pl
- Strona: www.vizioly.pl

