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
const showHistoryBtn = document.getElementById('show-history-btn');
const historyModal = document.getElementById('history-modal');
const historyContainer = document.getElementById('history-container');
const closeModalBtn = document.querySelector('.close');
const suitCheckboxes = document.querySelectorAll('.suits-checkboxes input[type="checkbox"]');

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

function showHistory() {
    historyContainer.innerHTML = '';
    
    shownCardsHistory.forEach((card, index) => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        
        const cardNumber = document.createElement('div');
        cardNumber.className = 'card-number';
        cardNumber.textContent = index + 1;
        
        const cardValue = document.createElement('div');
        cardValue.textContent = card.value;
        cardValue.className = suitColors[card.suit];
        
        const cardSuit = document.createElement('div');
        cardSuit.textContent = card.suit;
        cardSuit.className = suitColors[card.suit];
        
        historyCard.appendChild(cardNumber);
        historyCard.appendChild(cardValue);
        historyCard.appendChild(cardSuit);
        
        historyContainer.appendChild(historyCard);
    });
    
    historyModal.classList.remove('hidden');
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

resetDeck();
updateMaxCards();