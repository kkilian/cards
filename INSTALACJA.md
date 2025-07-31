# Instalacja Card Memorizer na nowym Mac

## 1. Instalacja Homebrew (menedżer pakietów)
Otwórz Terminal i wklej:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Po instalacji wykonaj polecenia które pokaże instalator (zazwyczaj):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Instalacja Git
```bash
brew install git
```

## 3. Pobranie projektu
Utwórz folder na projekty (opcjonalnie):
```bash
mkdir ~/Projekty
cd ~/Projekty
```

Sklonuj repozytorium:
```bash
git clone https://github.com/kkilian/cards.git
cd cards
```

## 4. Uruchomienie aplikacji

### Opcja A: Bezpośrednio w przeglądarce
Otwórz plik `index.html` w przeglądarce:
```bash
open index.html
```

### Opcja B: Z lokalnym serwerem (zalecane)
Zainstaluj Python (jeśli nie ma):
```bash
brew install python3
```

Uruchom serwer:
```bash
python3 -m http.server 8000
```

Otwórz w przeglądarce: http://localhost:8000

## 5. Struktura projektu

- `index.html` - główna aplikacja do nauki kart
- `anki-pao/` - generator kart do Anki
- `card-recognition-trainer/` - trener rozpoznawania kart
- `talia-kart-pao.json` - dane o kartach i skojarzeniach PAO

## Rozwiązywanie problemów

### "Command not found: brew"
Restart Terminal lub wykonaj:
```bash
source ~/.zprofile
```

### "Permission denied"
Dodaj `sudo` przed komendą:
```bash
sudo brew install git
```

### Nie działa w Safari
Użyj Chrome lub Firefox dla pełnej funkcjonalności.