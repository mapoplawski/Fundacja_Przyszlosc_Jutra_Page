# Fundacja Przeszłość Jutra — Statyczny Serwis WWW (v2)

W pełni statyczna strona internetowa (HTML5 + Bootstrap 5.3 + CSS3 + JS) przygotowana pod hosting na **GitHub Pages**, formularze **FormSubmit.co** oraz obsługę bloga i późniejsze modyfikacje w **Publii CMS**.

---

## 1. Jak uruchomić na GitHub Pages
1. Rozpakuj archiwum ZIP bezpośrednio do głównego katalogu repozytorium GitHub (tak, aby plik `index.html` był w katalogu głównym).
2. Wejdź w **Settings → Pages → Build and deployment → Source: Deploy from a branch** (`main` / `/ (root)`) i zapisz.
3. Wyślij pierwszą wiadomość testową przez formularz na `kontakt.html` lub `wspolpraca.html`, a następnie kliknij link aktywacyjny wysłany przez **FormSubmit.co** na adres `fundacja@przeszloscjutra.pl`.

---

## 2. Jak dodawać nowe aktualności (system blogowy)

### Opcja A — Ręcznie (statyczny plik HTML + JSON, bez generatorów)
Każda aktualność to osobny plik `.html` w folderze `aktualnosci/`:
1. Skopiuj plik `aktualnosci/_szablon-aktualnosci.html` i nadaj mu własną nazwę, np. `aktualnosci/nowe-wydarzenie.html`.
2. Uzupełnij tytuł, datę, kategorię, treść, ewentualną galerię `.webp` i film z YouTube.
3. Dodaj jeden wpis na górze pliku `data/aktualnosci.json` (i opcjonalnie zaktualizuj `data/aktualnosci-fallback.js` do podglądu offline).
4. **Efekt automatyczny:** nowy wpis natychmiast pojawi się:
   - w sekcji **05 / AKTUALNOŚCI** na Stronie Głównej (zawsze 3 najnowsze),
   - w zakładce **Aktualności** (jako wyróżniony, jeśli ma `"featured": true`, oraz w siatce, filtrach kategorii i wyszukiwarce),
   - w sekcji **Zobacz również** na dole innych artykułów.

### Opcja B — Przez program Publii CMS (edytor wizualny + 1-klik sync z GitHub)
W folderze `publii-theme/` znajdziesz gotowy do instalacji motyw **`fundacja-przeszlosc-jutra-publii-theme.zip`**:
1. Otwórz aplikację desktopową **Publii** → przejdź do **Themes** → przeciągnij plik `publii-theme/fundacja-przeszlosc-jutra-publii-theme.zip`.
2. W **Site Settings** wybierz motyw *Fundacja Przeszłość Jutra* i skonfiguruj połączenie **Server → GitHub Pages**.
3. Dodawaj nowe aktualności w zakładce **Posts** (przypisując im **Tags** jako kategorie) — Publii automatycznie wygeneruje osobny plik HTML dla każdego wpisu, zaktualizuje stronę główną oraz opublikuje statyczne pliki na GitHubie.

---

## 3. Struktura mediów (`.webp` i `.mp4`) — podmiana na docelowe pliki

Wszystkie obrazy na stronie są już podpięte pod gotowe ścieżki `.webp` (obecnie w tych miejscach znajdują się estetyczne pliki zastępcze z podpisaną ścieżką i rozdzielczością). Aby wstawić docelową grafikę, **wystarczy nadpisać plik dokładnie tą samą nazwą**:

| Folder / Plik | Zastosowanie | Zalecany rozmiar |
|---|---|---|
| `media/video/hero-tlo.mp4` | Film w tle sekcji Hero na Stronie Głównej | 1920×1080, MP4 H.264 bez audio, 4–15 MB |
| `media/img/hero/strona-glowna-poster.webp` | Kadr posterowy wideo na Stronie Głównej | 1600×900 px |
| `media/img/logo/logo-fundacja-ciemne.webp` | Logo na jasne tło (nagłówek) | 420×120 px |
| `media/img/logo/logo-fundacja-jasne.webp` | Logo na ciemne tło (stopka) | 420×120 px |
| `media/img/hero/o-fundacji-hero.webp` | Główne zdjęcie w zakładce O fundacji | 1200×800 px |
| `media/img/hero/projekty-hero.webp` | Tło nagłówka zakładki Projekty | 1600×680 px |
| `media/img/hero/aktualnosci-hero.webp` | Tło nagłówka zakładki Aktualności | 1600×620 px |
| `media/img/hero/wspolpraca-hero.webp` | Tło nagłówka zakładki Współpraca | 1600×700 px |
| `media/img/hero/wesprzyj-nas-hero.webp` | Tło nagłówka zakładki Wesprzyj nas | 1600×760 px |
| `media/img/o-fundacji/dzialalnosc-fundacji.webp` | Zdjęcie w sekcji „Nasze cele w praktyce” | 1000×750 px |
| `media/img/o-fundacji/igor-czapczyk-portret.webp` | Portret Założyciela i Prezesa | 900×1050 px |
| `media/img/projekty/tajemnica-rysia-okladka.webp` | Karta projektu „Tajemnica Rysia” | 960×640 px |
| `media/img/projekty/tajemnica-rysia-wyrozniony.webp` | Projekt wyróżniony (Por. Jan Nowicki „Ryś”) | 1000×760 px |
| `media/img/projekty/powstanie-warszawskie-szlak.webp` | Karta projektu „Śladami walk i pamięci” | 960×640 px |
| `media/img/projekty/symboliczne-groby-powazki.webp` | Karta projektu „Symboliczne groby powstańców” | 960×640 px |
| `media/img/projekty/galeria/*.webp` | Zdjęcia do galerii na podstronach projektów | 1200×800 px |
| `media/img/aktualnosci/*.webp` | Miniatury i zdjęcia główne aktualności | 960×640 / 1200×760 px |
| `media/img/aktualnosci/galeria/*.webp` | Zdjęcia do galerii Lightbox w artykułach | 1200×800 px |
| `media/img/wspolpraca/wspolne-dzialania.webp` | Zdjęcie w sekcji „Jak możemy współpracować?” | 960×760 px |
| `media/img/wspolpraca/wspolpraca-cta-tlo.webp` | Tło końcowego banera Współpracy | 1600×620 px |
| `media/img/wspolpraca/partnerzy/partner-01..04.webp` | Logotypy partnerów i instytucji | 420×180 px |
| `media/img/wesprzyj/dzialalnosc-dlugofalowa.webp` | Zdjęcie w ciemnej sekcji „Pomóż nam działać długofalowo” | 1000×750 px |
| `media/img/wesprzyj/nie-tylko-pieniadze.webp` | Zdjęcie w sekcji „Nie tylko pieniądze” | 1000×750 px |
| `media/img/wesprzyj/wesprzyj-cta-tlo.webp` | Tło końcowego banera Wesprzyj nas | 1600×620 px |
| `media/img/kontakt/archiwum-rozmowa.webp` | Zdjęcie w sekcji „Zaprośmy historię do rozmowy” | 1000×720 px |
