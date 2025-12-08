# Rozwiązywanie problemów z GitHub Pages

## Problem: Zmiany nie są widoczne na stronie

### Krok 1: Sprawdź konfigurację GitHub Pages

1. Przejdź do repozytorium: https://github.com/Marcin-Kupiec-Web/Vizjoly
2. Kliknij **Settings** (ustawienia)
3. W lewym menu przewiń do sekcji **Pages**
4. Sprawdź konfigurację:
   - **Source**: Powinno być ustawione na **"Deploy from a branch"**
   - **Branch**: Powinno być **"main"** (lub **"master"**)
   - **Folder**: Powinno być **"/ (root)"**
5. Jeśli coś jest nie tak, zmień i kliknij **Save**

### Krok 2: Wymuś odświeżenie strony

**W przeglądarce:**
- **Chrome/Edge**: `Ctrl + Shift + R` (Windows) lub `Cmd + Shift + R` (Mac)
- **Firefox**: `Ctrl + F5` (Windows) lub `Cmd + Shift + R` (Mac)
- **Safari**: `Cmd + Option + R` (Mac)

**Lub otwórz w trybie incognito/prywatnym:**
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)

### Krok 3: Sprawdź czy zmiany są w repozytorium

1. Przejdź do: https://github.com/Marcin-Kupiec-Web/Vizjoly
2. Sprawdź czy widzisz pliki:
   - `homerevio.html` ✅
   - `ilewpadlo.html` ✅
   - `index.html` (zaktualizowany) ✅
3. Sprawdź ostatni commit - powinien być: "Dodano oddzielne strony dla HomeRevio i IleWpadło z routingiem między aplikacjami"

### Krok 4: Sprawdź status wdrożenia

1. W repozytorium GitHub, przejdź do zakładki **Actions**
2. Sprawdź czy są jakieś błędy w procesie wdrożenia
3. Jeśli są błędy, kliknij na nie i zobacz szczegóły

### Krok 5: Wymuś ponowne wdrożenie (jeśli potrzeba)

Jeśli wszystko jest OK, ale strona nadal nie aktualizuje się:

1. W ustawieniach GitHub Pages, zmień branch na inny (np. `gh-pages` jeśli istnieje)
2. Kliknij **Save**
3. Poczekaj 30 sekund
4. Zmień z powrotem na **main**
5. Kliknij **Save**
6. Poczekaj 1-2 minuty

### Krok 6: Sprawdź czy pliki są dostępne bezpośrednio

Spróbuj otworzyć bezpośrednio:
- https://marcin-kupiec-web.github.io/Vizjoly/homerevio.html
- https://marcin-kupiec-web.github.io/Vizjoly/ilewpadlo.html

Jeśli te linki działają, to znaczy że pliki są wdrożone, ale może być problem z cache na stronie głównej.

## Najczęstsze przyczyny:

1. **Opóźnienie w aktualizacji** - GitHub Pages potrzebuje 1-10 minut na aktualizację
2. **Cache przeglądarki** - Przeglądarka pokazuje starą wersję z cache
3. **Błędna konfiguracja** - GitHub Pages może być skonfigurowane na inny branch/folder
4. **Błędy w kodzie** - Sprawdź zakładkę Actions w repozytorium

## Szybkie rozwiązanie:

1. Otwórz stronę w trybie incognito: https://marcin-kupiec-web.github.io/Vizjoly/
2. Jeśli działa, to problem jest z cache - wyczyść cache przeglądarki
3. Jeśli nie działa, sprawdź ustawienia GitHub Pages (Settings → Pages)

