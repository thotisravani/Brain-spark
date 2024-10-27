let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let score = 0; // Initialize score
let timerInterval;
let startTime;
const maxAttempts = 20; 

const allCardValues = [
    'image1.jpeg', 'image1.jpeg',
    'image2.jpeg', 'image2.jpeg',
    'image3.jpeg', 'image3.jpeg',
    'image4.jpeg', 'image4.jpeg',
    'image5.jpeg', 'image5.jpeg',
    'image6.jpeg', 'image6.jpeg',
    'image7.jpeg', 'image7.jpeg',
    'image8.jpeg', 'image8.jpeg',
    'image9.jpeg', 'image9.jpeg',
    'image10.jpeg', 'image10.jpeg',
    'image11.jpeg', 'image11.jpeg',
    'image12.jpeg', 'image12.jpeg'
];

window.onload = function() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('reset-button').addEventListener('click', resetGame);
};

function startGame() {
    resetGame();
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const shuffledCards = shuffleArray(getCardsByDifficulty(difficulty));
    createCards(shuffledCards);
    startTimer();
}

function resetGame() {
    attempts = 0;
    score = 0; // Reset score
    matchedCards = [];
    flippedCards = [];
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('attempts').innerText = `Attempts: ${attempts} / ${maxAttempts}`;
    document.getElementById('timer').innerText = `Time: 0s`;
    clearInterval(timerInterval);
    document.getElementById('game-board').innerHTML = '';
}

function getCardsByDifficulty(difficulty) {
    const cardCountMap = {
        easy: 8,   // 4 pairs
        medium: 16, // 8 pairs
        hard: 24    // 12 pairs
    };
    const cardCount = cardCountMap[difficulty] || 0;
    return allCardValues.slice(0, cardCount);
}

function createCards(cards) {
    const gameBoard = document.getElementById('game-board');
    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner" onclick="flipCard(this, '${value}')">
                <div class="card-front"></div> <!-- Leave the card front empty -->
                <div class="card-back">
                    <img src="${value}" alt="Memory card image" style="width: 100%; height: 100%; border-radius: 5px;">
                </div>
            </div>
        `;
        gameBoard.appendChild(card);
    });
}

function flipCard(cardInner, value) {
    if (flippedCards.length < 2 && !cardInner.parentElement.classList.contains('flipped')) {
        cardInner.parentElement.classList.add('flipped');
        flippedCards.push({ card: cardInner.parentElement, value });

        if (flippedCards.length === 2) {
            attempts++;
            document.getElementById('attempts').innerText = `Attempts: ${attempts} / ${maxAttempts}`;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.value === secondCard.value) {
        matchedCards.push(firstCard.card, secondCard.card);
        score += 10; // Increase score for a match
    } else {
        firstCard.card.classList.remove('flipped');
        secondCard.card.classList.remove('flipped');
        score -= 1; // Decrease score for a failed attempt
    }
    flippedCards = [];
    
    document.getElementById('score').innerText = `Score: ${score}`;

    console.log("Matched cards:", matchedCards.length, "Total cards:", allCardValues.length);
    console.log("Attempts:", attempts, "Max attempts:", maxAttempts);

    // Check for win or loss
    if (matchedCards.length === allCardValues.length) {
        clearInterval(timerInterval);
        alert(`Congratulations! You've matched all the cards! Your final score: ${score} with ${attempts} attempts.`);
    } else if (attempts >= maxAttempts) {
        clearInterval(timerInterval);
        alert(`Game Over! You reached the maximum attempts (${maxAttempts}). Your final score: ${score}.`);
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').innerText = `Time: ${elapsedTime}s`;
}
