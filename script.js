const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitColors = {
    '♠': 'black',
    '♣': 'black',
    '♥': 'red',
    '♦': 'red'
};

let deck = [];
let currentInterval = null;
let cardsShown = 0;
let isRunning = false;
let cardsToShow = 10;
let shownCardsHistory = [];

// Session tracking
let currentSession = null;
let sessions = [];

const cardElement = document.getElementById('card');
const cardValueElement = document.getElementById('card-value');
const cardSuitElement = document.getElementById('card-suit');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const intervalSlider = document.getElementById('interval');
const intervalValueSpan = document.getElementById('interval-value');
const cardsShownSpan = document.getElementById('cards-shown');
const cardsCountSlider = document.getElementById('cards-count');
const cardsCountValueSpan = document.getElementById('cards-count-value');
const cardsTotalSpan = document.getElementById('cards-total');
const showHistoryBtn = document.getElementById('show-history-btn');
const historyModal = document.getElementById('history-modal');
const closeModalBtn = document.querySelector('.close');
const suitCheckboxes = document.querySelectorAll('.suits-checkboxes input[type="checkbox"]');

// Carousel elements
const previousCard = document.getElementById('previous-card');
const currentCard = document.getElementById('current-card');
const nextCard = document.getElementById('next-card');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPositionSpan = document.getElementById('current-position');
const totalCardsSpan = document.getElementById('total-cards');

let currentHistoryIndex = 0;

function getSelectedSuits() {
    const selectedSuits = [];
    suitCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedSuits.push(checkbox.value);
        }
    });
    return selectedSuits;
}

function createDeck() {
    deck = [];
    const selectedSuits = getSelectedSuits();
    
    for (const suit of selectedSuits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function showCard(card) {
    cardValueElement.textContent = card.value;
    cardSuitElement.textContent = card.suit;
    
    const colorClass = suitColors[card.suit];
    cardValueElement.className = colorClass;
    cardSuitElement.className = colorClass;
    
    cardElement.classList.remove('hidden');
    cardElement.classList.add('show');
    
    setTimeout(() => {
        cardElement.classList.remove('show');
        cardElement.classList.add('hidden');
    }, parseFloat(intervalSlider.value) * 1000 * 0.7);
}

function getNextCard() {
    if (deck.length === 0 || cardsShown >= cardsToShow) {
        stopCardShow();
        showHistoryBtn.classList.remove('hidden');
        return null;
    }
    
    const card = deck.pop();
    cardsShown++;
    cardsShownSpan.textContent = cardsShown;
    shownCardsHistory.push(card);
    
    // Add card to current session
    if (currentSession) {
        currentSession.cards.push(card);
    }
    
    return card;
}

function startCardShow() {
    const selectedSuits = getSelectedSuits();
    if (selectedSuits.length === 0) {
        alert('Wybierz co najmniej jeden kolor kart!');
        return;
    }
    
    if (deck.length === 0) {
        resetDeck();
    }
    
    // Start new session
    currentSession = {
        id: Date.now(),
        startTime: new Date(),
        endTime: null,
        cardsShown: 0,
        interval: parseFloat(intervalSlider.value),
        selectedSuits: [...selectedSuits],
        totalCards: cardsToShow,
        cards: []
    };
    
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    intervalSlider.disabled = true;
    cardsCountSlider.disabled = true;
    
    const intervalTime = parseFloat(intervalSlider.value) * 1000;
    
    const showNextCard = () => {
        const card = getNextCard();
        if (card) {
            showCard(card);
        }
    };
    
    showNextCard();
    
    currentInterval = setInterval(() => {
        if (isRunning) {
            showNextCard();
        }
    }, intervalTime);
}

function stopCardShow() {
    isRunning = false;
    if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
    }
    
    // Save session if it exists and has shown cards
    if (currentSession && cardsShown > 0) {
        currentSession.endTime = new Date();
        currentSession.cardsShown = cardsShown;
        saveSession(currentSession);
        currentSession = null;
    }
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
    intervalSlider.disabled = false;
    cardsCountSlider.disabled = false;
}

function resetDeck() {
    stopCardShow();
    createDeck();
    shuffleDeck();
    cardsShown = 0;
    shownCardsHistory = [];
    cardsShownSpan.textContent = cardsShown;
    cardElement.classList.add('hidden');
    cardElement.classList.remove('show');
    showHistoryBtn.classList.add('hidden');
}

function updateMaxCards() {
    const selectedSuits = getSelectedSuits();
    const maxCards = selectedSuits.length * 13;
    
    cardsCountSlider.max = maxCards;
    
    if (cardsToShow > maxCards) {
        cardsToShow = maxCards;
        cardsCountSlider.value = maxCards;
        cardsCountValueSpan.textContent = maxCards;
        cardsTotalSpan.textContent = maxCards;
    }
}

function updateCarouselCard(cardElement, card, showQuestion = false) {
    const cardInner = cardElement.querySelector('.card-inner');
    
    // Clear the card inner content
    cardInner.innerHTML = '';
    
    if (showQuestion) {
        // Show question mark
        const qMark = document.createElement('span');
        qMark.className = 'question-mark';
        qMark.textContent = '?';
        cardInner.appendChild(qMark);
    } else if (card) {
        // Show card value and suit
        const valueSpan = document.createElement('span');
        valueSpan.className = 'card-value ' + suitColors[card.suit];
        valueSpan.textContent = card.value;
        
        const suitSpan = document.createElement('span');
        suitSpan.className = 'card-suit ' + suitColors[card.suit];
        suitSpan.textContent = card.suit;
        
        cardInner.appendChild(valueSpan);
        cardInner.appendChild(suitSpan);
    }
    
    // Always ensure card is visible
    cardElement.style.visibility = 'visible';
}

function updateCarousel() {
    // Update position counter
    currentPositionSpan.textContent = currentHistoryIndex + 1;
    totalCardsSpan.textContent = shownCardsHistory.length;
    
    // Update navigation buttons
    prevBtn.disabled = currentHistoryIndex === 0;
    nextBtn.disabled = currentHistoryIndex === shownCardsHistory.length - 1;
    
    // Update cards
    if (currentHistoryIndex > 0) {
        previousCard.style.visibility = 'visible';
        updateCarouselCard(previousCard, shownCardsHistory[currentHistoryIndex - 1]);
    } else {
        previousCard.style.visibility = 'hidden';
    }
    
    // Always update current card
    currentCard.style.visibility = 'visible';
    updateCarouselCard(currentCard, shownCardsHistory[currentHistoryIndex]);
    
    if (currentHistoryIndex < shownCardsHistory.length - 1) {
        nextCard.style.visibility = 'visible';
        updateCarouselCard(nextCard, null, true);
    } else {
        nextCard.style.visibility = 'hidden';
    }
}

function showHistory() {
    currentHistoryIndex = 0;
    updateCarousel();
    historyModal.classList.remove('hidden');
}

function showNextCard() {
    if (currentHistoryIndex < shownCardsHistory.length - 1) {
        currentHistoryIndex++;
        updateCarousel();
    }
}

function showPreviousCard() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        updateCarousel();
    }
}

intervalSlider.addEventListener('input', (e) => {
    intervalValueSpan.textContent = e.target.value;
});

cardsCountSlider.addEventListener('input', (e) => {
    cardsToShow = parseInt(e.target.value);
    cardsCountValueSpan.textContent = cardsToShow;
    cardsTotalSpan.textContent = cardsToShow;
});

startBtn.addEventListener('click', startCardShow);
stopBtn.addEventListener('click', stopCardShow);
resetBtn.addEventListener('click', resetDeck);
showHistoryBtn.addEventListener('click', showHistory);
prevBtn.addEventListener('click', showPreviousCard);
nextBtn.addEventListener('click', showNextCard);

closeModalBtn.addEventListener('click', () => {
    historyModal.classList.add('hidden');
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.add('hidden');
    }
});

suitCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateMaxCards();
        if (deck.length > 0) {
            resetDeck();
        }
    });
});

// Session management functions
function saveSession(session) {
    sessions.unshift(session); // Add to beginning
    // Keep only last 20 sessions
    if (sessions.length > 20) {
        sessions = sessions.slice(0, 20);
    }
    saveSessions();
    updateSessionsList();
}

function saveSessions() {
    localStorage.setItem('cardSessions', JSON.stringify(sessions));
    localStorage.setItem('completedSessions', JSON.stringify(getCompletedSessions()));
}

function loadSessions() {
    const saved = localStorage.getItem('cardSessions');
    if (saved) {
        sessions = JSON.parse(saved);
    }
    updateSessionsList();
}

function getCompletedSessions() {
    const completed = localStorage.getItem('completedSessions');
    return completed ? JSON.parse(completed) : [];
}

function toggleSessionCompletion(sessionId) {
    const completedSessions = getCompletedSessions();
    const index = completedSessions.indexOf(sessionId);
    
    if (index === -1) {
        completedSessions.push(sessionId);
    } else {
        completedSessions.splice(index, 1);
    }
    
    localStorage.setItem('completedSessions', JSON.stringify(completedSessions));
    updateSessionsList();
}

function updateSessionsList() {
    const sessionsList = document.getElementById('sessions-list');
    const completedSessions = getCompletedSessions();
    
    sessionsList.innerHTML = '';
    
    sessions.forEach((session, index) => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        if (completedSessions.includes(session.id)) {
            sessionItem.classList.add('completed');
        }
        
        const date = new Date(session.startTime);
        const dateStr = date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        sessionItem.innerHTML = `
            <div class="session-date">${dateStr}</div>
            <div class="session-info">
                <span class="session-cards">Karty: ${session.cardsShown}/${session.totalCards}</span>
                <span class="session-interval">${session.interval}s</span>
            </div>
            <div class="session-completion">
                <input type="checkbox" 
                       class="completion-checkbox" 
                       id="session-${session.id}"
                       ${completedSessions.includes(session.id) ? 'checked' : ''}
                       onclick="toggleSessionCompletion(${session.id})">
                <label for="session-${session.id}" class="completion-label">Udało się!</label>
            </div>
        `;
        
        sessionsList.appendChild(sessionItem);
    });
}

// Export functions
function exportSessions(count) {
    const sessionsToExport = sessions.slice(0, count);
    
    if (sessionsToExport.length === 0) {
        alert('Brak sesji do eksportu!');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        sessionCount: sessionsToExport.length,
        sessions: sessionsToExport.map((session, index) => ({
            sessionNumber: index + 1,
            startTime: session.startTime,
            endTime: session.endTime,
            cardsShown: session.cardsShown,
            totalCards: session.totalCards,
            interval: session.interval,
            selectedSuits: session.selectedSuits,
            cards: session.cards
        }))
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `card-sessions-last-${count}-${timestamp}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    
    // Close the export modal
    document.getElementById('export-modal').classList.add('hidden');
}

// Export modal functionality
const exportSessionsBtn = document.getElementById('export-sessions-btn');
const exportModal = document.getElementById('export-modal');
const exportCloseBtn = document.querySelector('.export-close');

if (exportSessionsBtn) {
    exportSessionsBtn.addEventListener('click', () => {
        exportModal.classList.remove('hidden');
    });
}

if (exportCloseBtn) {
    exportCloseBtn.addEventListener('click', () => {
        exportModal.classList.add('hidden');
    });
}

exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
        exportModal.classList.add('hidden');
    }
});

// Initialize
resetDeck();
updateMaxCards();
loadSessions();