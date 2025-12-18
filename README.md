# JPT MOPA 100W Calculator

Aplikacja webowa służąca jako symulator i kalkulator parametrów procesu laserowego dla lasera światłowodowego JPT MOPA 100W (Model: YDFLP-E-100-M7-M-R).

## 🚀 Funkcjonalności

- **Kalkulator parametrów fizycznych:** Oblicza moc średnią, energię impulsu, moc szczytową, fluencję, irradiancję oraz nakładanie się impulsów (overlap).
- **Symulacja parametrów:** Pozwala na eksperymentowanie z ustawieniami takimi jak moc, częstotliwość, szerokość impulsu, prędkość, czy interwał linii.
- **Presety:** Wbudowana baza ustawień dla różnych materiałów i zastosowań.
- **Wizualizacja:** Graficzna reprezentacja procesu laserowego.
- **Wykresy:** Wykresy częstotliwości odcięcia (Cutoff Frequency).

## 🛠️ Technologie

Projekt został zbudowany przy użyciu nowoczesnych technologii webowych:

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (ikony)

## 📦 Instalacja i uruchomienie

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

1.  Sklonuj repozytorium:

    ```bash
    git clone <adres-repozytorium>
    cd fiber-laser-app
    ```

2.  Zainstaluj zależności:

    ```bash
    npm install
    ```

3.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```

Aplikacja będzie dostępna pod adresem wskazanym w terminalu (zazwyczaj `http://localhost:5173`).

## 🏗️ Budowanie wersji produkcyjnej

Aby zbudować aplikację do wdrożenia na produkcję:

```bash
npm run build
```

Pliki wynikowe znajdą się w katalogu `dist`.

## 📄 Licencja

Projekt stworzony na potrzeby własne / edukacyjne.
