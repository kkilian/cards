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
const suitCheckboxes = document.querySelectorAll('.suits-checkboxes input[type="checkbox"]');
const showHistoryBtn = document.getElementById('show-history-btn');
const historyModal = document.getElementById('history-modal');
const closeModalBtn = document.querySelector('.close');

// Carousel elements
const previousCard = document.getElementById('previous-card');
const currentCard = document.getElementById('current-card');
const nextCard = document.getElementById('next-card');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPositionSpan = document.getElementById('current-position');
const totalCardsSpan = document.getElementById('total-cards');

let currentHistoryIndex = 0;

// Focus mode functionality
const focusModeToggle = document.getElementById('focus-mode-toggle');
let isFocusMode = false;


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
        
        // Add special class for focus mode
        if (isFocusMode) {
            showHistoryBtn.classList.add('visible-after-session');
        }
        
        return null;
    }
    
    const card = deck.pop();
    cardsShown++;
    cardsShownSpan.textContent = cardsShown;
    shownCardsHistory.push(card);
    
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
    
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    intervalSlider.disabled = true;
    cardsCountSlider.disabled = true;
    
    // Add session-active class for focus mode
    if (isFocusMode) {
        document.body.classList.add('session-active');
    }
    
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
    
    // Remove session-active class for focus mode
    document.body.classList.remove('session-active');
    
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
    showHistoryBtn.classList.remove('visible-after-session');
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

function toggleFocusMode() {
    isFocusMode = focusModeToggle.checked;
    
    if (isFocusMode) {
        document.body.classList.add('focus-mode');
    } else {
        document.body.classList.remove('focus-mode');
        document.body.classList.remove('session-active');
        // Remove focus mode specific classes
        showHistoryBtn.classList.remove('visible-after-session');
    }
    
    // Save preference
    localStorage.setItem('focusMode', isFocusMode);
}

// Load focus mode preference
function loadFocusModePreference() {
    const savedFocusMode = localStorage.getItem('focusMode') === 'true';
    focusModeToggle.checked = savedFocusMode;
    isFocusMode = savedFocusMode;
    if (savedFocusMode) {
        document.body.classList.add('focus-mode');
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

focusModeToggle.addEventListener('change', toggleFocusMode);

// Add ESC key support to exit focus mode
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        if (isFocusMode && !isRunning) {
            // Exit focus mode when not in session
            focusModeToggle.checked = false;
            toggleFocusMode();
        } else if (isRunning) {
            // Stop session when in session
            stopCardShow();
        }
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


// Initialize
resetDeck();
updateMaxCards();
loadFocusModePreference();