// Get DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const boardSizeInput = document.getElementById('size');
const startBtn = document.querySelector('.start-btn');
const btnContainer = document.querySelector('.container-btn'); 
const scoreEl = document.getElementById('score-board');
const scoreText = document.querySelector('.score-text')

// Game status
let sequence = [];
let playerSequence = [];
let level = -1;
let isGameActive = false;
let isPlayerTurn = false;
let buttons = []; // Stores button elements

// Helper: Generate random number
function getRandom(max) {
    return Math.floor(Math.random() * max);
}

// Animate buttons
function flashButton(btn) {
    btn.style.backgroundColor = '#00FF00';
    setTimeout(() => {
        btn.style.backgroundColor = '#BBBBBB';
    }, 500);
}

// Handle wrong button click
function triggerError(btn) {
    btn.style.backgroundColor = '#FF0000';
    setTimeout(() => {
        btn.style.backgroundColor = '#DDDDDD';
    }, 500);
    alert("Game Over! Score: " + level);
    resetGame();
}

// Restart game
function resetGame() {
    isGameActive = false;
    sequence = [];
    playerSequence = [];
    level = 0;
    startScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    btnContainer.innerHTML = ''; // Remove previous button
}

// Start next round
function nextRound() {
    level++;
    scoreText.innerHTML = `Score: ${level}`
    playerSequence = []; // Reset player input sequence
    isPlayerTurn = false;
    darkenBtns('#BBBBBB')
    
    // Add
    const totalButtons = buttons.length;
    sequence.push(getRandom(totalButtons));

    // Mainkan urutan (Sequence)
    playSequence();
}

// Flash correct sequence
function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        const btnIndex = sequence[i];
        
        i++;
        if (i > sequence.length) {
            clearInterval(interval);
            isPlayerTurn = true;
            darkenBtns('#DDDDDD')
        } else {
            flashButton(buttons[btnIndex]);
        }
    }, 1000); // 1 second delay between flashes
}

function darkenBtns(color) {
    for (const btn of buttons) {
        btn.style['background-color'] = color
        btn.style.transition = 'background-color 0.3s'
    }
}

// Handle button click
function handleBtnClick(index, btnElement) {
    if (!isGameActive || !isPlayerTurn) return;

    // Flash clicked button
    btnElement.style.backgroundColor = '#00FF00';
    setTimeout(() => {
        btnElement.style.backgroundColor = '#DDDDDD';
    }, 200);

    // Check logic
    const expectedIndex = sequence[playerSequence.length];

    if (index === expectedIndex) {
        // Correct button
        playerSequence.push(index);

        // Check if player finishes sequence
        if (playerSequence.length === sequence.length) {
            isPlayerTurn = false;
            setTimeout(nextRound, 1000); // Staart next round after 1 second delay
        }
    } else {
        // Wrong button
        triggerError(btnElement);
    }
}

// --- MAIN START EVENT ---
startBtn.addEventListener('click', function() {
    // 1. UI setup
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    gameScreen.style.height = '625px';
    gameScreen.style.marginTop = '120px';
    btnContainer.innerHTML = '';
    buttons = [];

    // 2. Buat Grid Tombol
    const size = parseInt(boardSizeInput.value);
    const totalBtn = size * size;
    
    // Setup CSS Grid
    btnContainer.style.display = 'grid';
    btnContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    btnContainer.style.gap = '10px';
    btnContainer.style.margin = '0 auto';
    btnContainer.style.padding = '10px';
    btnContainer.style.borderRadius= '15px';

    for (let i = 0; i < totalBtn; i++) {
        let btn = document.createElement('div');
        
        // Button styling
        btn.style.backgroundColor = '#DDDDDD';
        btn.style.aspectRatio = '1 / 1';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '8px';
        btn.style.transition = 'background-color 0.3s';

        // Add click event
        btn.addEventListener('click', () => handleBtnClick(i, btn));

        btnContainer.appendChild(btn);
        buttons.push(btn);
    }

    // 3. Start game
    isGameActive = true;
    nextRound();
});
