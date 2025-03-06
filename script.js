// Game variables
let canvas, ctx;
let bikeX = 200;
let bikeY = 300;
let bikeSpeed = 0;
let score = 0;
let gameTime = 0;
let obstacles = [];
let gameRunning = false;
let lastFrameTime = 0;

// Constants
const BIKE_WIDTH = 40;
const BIKE_HEIGHT = 60;
const MAX_SPEED = 15;
const GRAVITY = 0.1;
const FRICTION = 0.95;
const OBSTACLE_INTERVAL = 2000;

// Initialize game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Reset game state
    bikeX = canvas.width / 2 - BIKE_WIDTH / 2;
    bikeY = canvas.height - BIKE_HEIGHT - 20;
    bikeSpeed = 0;
    score = 0;
    gameTime = 0;
    obstacles = [];
    gameRunning = true;
    
    // Hide/show UI elements
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    
    // Start game loop
    lastFrameTime = performance.now();
    gameLoop();
}

// Game loop
function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;
    
    updateGame(deltaTime);
    drawGame();
    
    requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame(deltaTime) {
    // Update bike position
    bikeY += bikeSpeed;
    bikeSpeed += GRAVITY;
    bikeSpeed *= FRICTION;
    
    // Keep bike within bounds
    if (bikeY > canvas.height - BIKE_HEIGHT) {
        bikeY = canvas.height - BIKE_HEIGHT;
        bikeSpeed = 0;
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed * deltaTime;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }
    
    // Add new obstacles
    if (Math.random() < 0.01) {
        obstacles.push({
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 200 + Math.random() * 100
        });
    }
    
    // Check collisions
    for (const obstacle of obstacles) {
        if (bikeX < obstacle.x + obstacle.width &&
            bikeX + BIKE_WIDTH > obstacle.x &&
            bikeY < obstacle.y + obstacle.height &&
            bikeY + BIKE_HEIGHT > obstacle.y) {
            gameOver();
            return;
        }
    }
    
    // Update HUD
    gameTime += deltaTime;
    document.getElementById('score').textContent = score;
    document.getElementById('speed').textContent = Math.abs(bikeSpeed).toFixed(1);
    document.getElementById('timer').textContent = gameTime.toFixed(1);
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bike
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(bikeX, bikeY, BIKE_WIDTH, BIKE_HEIGHT);
    
    // Draw obstacles
    ctx.fillStyle = '#ff00cc';
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Handle game over
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Event listeners
document.getElementById('startButton').addEventListener('click', initGame);
document.getElementById('restartButton').addEventListener('click', initGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowLeft' && bikeX > 0) {
        bikeX -= 10;
    }
    if (e.key === 'ArrowRight' && bikeX < canvas.width - BIKE_WIDTH) {
        bikeX += 10;
    }
    if (e.key === 'ArrowUp') {
        bikeSpeed = Math.max(bikeSpeed - 2, -MAX_SPEED);
    }
    if (e.key === 'ArrowDown') {
        bikeSpeed = Math.min(bikeSpeed + 2, MAX_SPEED);
    }
});
