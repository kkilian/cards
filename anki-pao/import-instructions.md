# Instrukcja importu talii PAO do Anki

## 📋 Przygotowanie

Ta talia zawiera 52 karty z systemem PAO (Person-Action-Object) dla zapamiętywania kart do gry.

### Pliki w pakiecie:
- `deck.csv` - podstawowa wersja (symbole tekstowe)
- `deck-with-images.csv` - wersja z grafikami SVG kart
- `anki-card-template.html` - szablon wyglądu kart
- `generate-cards.html` - generator grafik kart

## 🚀 Szybki import (zalecany)

### Krok 1: Import pliku CSV
1. Otwórz Anki
2. Wybierz **File → Import** (lub Ctrl/Cmd + Shift + I)
3. Wybierz plik `deck-with-images.csv`
4. Ustaw następujące opcje:
   - **Type**: Basic
   - **Deck**: Utwórz nową talię "PAO - Karty"
   - **Fields separated by**: Comma
   - **Allow HTML in fields**: ✅ ZAZNACZ!
   - Mapowanie pól:
     - Field 1 → pomiń (Card ID)
     - Field 2 → Front
     - Field 3 → Back
     - Field 4 → Tags

### Krok 2: Zastosuj szablon (opcjonalne)
1. Przejdź do **Browse** (Przeglądaj)
2. Wybierz wszystkie karty z talii PAO
3. Kliknij **Cards** → **Change Note Type**
4. Możesz dostosować wygląd używając kodu z `anki-card-template.html`

## 📝 Import podstawowy (bez grafik)

Jeśli wolisz wersję bez grafik:
1. Importuj plik `deck.csv` zamiast `deck-with-images.csv`
2. Postępuj według tych samych kroków

## 🎨 Dostosowanie wyglądu kart

### Aby zmienić szablon:
1. W Anki przejdź do **Tools → Manage Note Types**
2. Wybierz typ notatki używany przez twoją talię
3. Kliknij **Cards**
4. Skopiuj odpowiednie sekcje z `anki-card-template.html`:
   - **Front Template** - wklej do pola "Front Template"
   - **Back Template** - wklej do pola "Back Template"  
   - **Styling** - wklej do pola "Styling"

## 🏷️ Organizacja tagów

Karty są oznaczone tagami:
- `PAO` - wszystkie karty
- `karty` - wszystkie karty
- `trefle`/`piki`/`karo`/`kiery` - według koloru
- `zwierzęta`/`sportowcy`/`politycy`/`miasta` - według kategorii

### Filtrowanie:
- W przeglądarce Anki użyj: `tag:sportowcy` aby zobaczyć tylko sportowców
- Kombinuj tagi: `tag:PAO tag:piki` dla pików

## 💡 Wskazówki

### Optymalne ustawienia nauki:
1. **Nowe karty/dzień**: 5-10 (zacznij powoli)
2. **Interwał początkowy**: 1 dzień, 3 dni
3. **Łatwość początkowa**: 250%

### Strategia nauki:
1. **Tydzień 1-2**: Naucz się po jednym kolorze
2. **Tydzień 3-4**: Łącz kolory, pracuj nad szybkością
3. **Tydzień 5+**: Ćwicz sekwencje 3-5 kart

### Ćwiczenia dodatkowe:
- Losuj karty fizycznie i przypominaj PAO
- Twórz historie łączące 3 karty (9 elementów)
- Mierz czas zapamiętywania całej talii

## ❓ Rozwiązywanie problemów

### Problem: Karty się nie wyświetlają
- Upewnij się, że zaznaczyłeś "Allow HTML in fields" podczas importu
- Sprawdź czy w przeglądarce Anki widzisz kod HTML

### Problem: Brak grafik kart
- Grafiki są osadzone jako SVG bezpośrednio w HTML
- Jeśli nie działają, użyj wersji `deck.csv` z symbolami tekstowymi

### Problem: Złe kodowanie polskich znaków
- Upewnij się, że plik CSV jest w kodowaniu UTF-8
- W razie problemów, otwórz CSV w Notepad++ i zapisz jako UTF-8

## 📱 Synchronizacja z AnkiWeb

Po zaimportowaniu:
1. Zsynchronizuj z AnkiWeb (Sync)
2. Grafiki SVG będą działać na wszystkich urządzeniach
3. Na urządzeniach mobilnych karty mogą wyglądać nieco inaczej

## 🔧 Modyfikacje

### Chcesz zmienić asocjacje PAO?
1. Edytuj plik CSV w Excelu lub edytorze tekstu
2. Zachowaj format: `"Symbol","Postać | akcja | obiekt","tagi"`
3. Zaimportuj ponownie z opcją "Update existing notes"

### Chcesz dodać własne grafiki?
1. Użyj `generate-cards.html` do wygenerowania nowych kart
2. Podmień kod SVG w pliku CSV
3. Pamiętaj o cudzysłowach wokół kodu HTML

---

**Powodzenia w nauce!** 🎴🧠

Jeśli masz pytania, sprawdź dokumentację Anki lub społeczność na r/Anki.