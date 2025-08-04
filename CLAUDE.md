# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a card memorization training application with two main components:
1. **Main Card Viewer** (`index.html`) - Shows cards automatically with configurable intervals for memory training
2. **Recognition Trainer** (`card-recognition-trainer/`) - Times how quickly users can recognize individual cards

The application helps users learn and memorize playing cards using the PAO (Person-Action-Object) memory technique with Polish cultural references.

## Development Commands

### Local Development Server
```bash
# Recommended: Use Python's built-in server to avoid CORS issues
python3 -m http.server 8000
# Then open: http://localhost:8000

# Alternative: Open directly in browser (may have limitations)
open index.html
```

### Project Structure
- `index.html` + `script.js` + `style.css` - Main card training application
- `card-recognition-trainer/` - Standalone speed recognition trainer with its own HTML/JS/CSS
- `talia-kart-pao.json` - PAO memory associations data (Person-Action-Object for each card)
- `INSTALACJA.md` - Setup instructions for new Mac users

## Architecture

### Main Application (index.html)
- **Card Display System**: Shows cards with configurable timing intervals (1-10 seconds)
- **Session Management**: Tracks and stores training sessions in localStorage with export functionality
- **Suit Filtering**: Allows selecting specific card suits (♠♥♦♣) for focused practice
- **Memory Testing Modal**: Carousel interface to review previously shown cards

### Recognition Trainer (card-recognition-trainer/)
- **Timing System**: Measures recognition speed for individual cards
- **Statistics Tracking**: Records session data with charts using Chart.js
- **Focus Mode**: Hides UI elements during training
- **Progress Analytics**: Historical performance tracking with filtering options

### Data Structure
- **PAO System**: `talia-kart-pao.json` contains Polish memory associations for each card
- **Session Storage**: Both apps use localStorage for persistence
- **Card Representation**: Standard 52-card deck with Unicode suit symbols

### Key JavaScript Patterns
- Event-driven architecture with DOM manipulation
- LocalStorage for session persistence
- Modular functions for card generation, display, and timing
- Chart.js integration for data visualization

## Browser Compatibility
- Works best in Chrome/Firefox
- Safari may have limitations with some features
- All functionality is client-side (no backend required)