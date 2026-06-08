const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const infoBanner = document.getElementById("info-banner");
const bgUploader = document.getElementById("bg-uploader");
const achievementsBox = document.getElementById("achievements-box");
const menuBox = document.getElementById("menu-box");
const achCountLabel = document.getElementById("ach-count");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toast-title");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 15, y: 15 }];
let segmentsColors = [];
let dx = 0, dy = 0;
let score = 0;
let highScore = localStorage.getItem("adv_snake_high") || 0;
highScoreElement.textContent = highScore;

let gameInterval;
let gameSpeed = 110;
let customWallImg = null;
let fruitsEatenCount = 0;

const fruitsConfig = {
    Apple:      { color: "#e74c3c", points: 10,  emoji: "🍎" },
    Banana:     { color: "#f1c40f", points: 15,  emoji: "🍌" },
    Grapes:     { color: "#9b59b6", points: 25,  emoji: "🍇" },
    Orange:     { color: "#e67e22", points: 15,  emoji: "🍊" },
    Watermelon: { color: "#2ecc71", points: 30,  emoji: "🍉" },
    Strawberry: { color: "#ff4757", points: 20,  emoji: "🍓" },
    Lemon:      { color: "#f7d794", points: 10,  emoji: "🍋" },
    Pineapple:  { color: "#ffa502", points: 40,  emoji: "🍍" },
    Peach:      { color: "#ff7f50", points: 20,  emoji: "🍑" },
    Cherries:   { color: "#ff6b81", points: 25,  emoji: "🍒" },
    Coconut:    { color: "#ffffff", points: 35,  emoji: "🥥" }
};

let food = { x: 8, y: 8, ...fruitsConfig.Apple, type: "Apple" };

let achievements = [
    { id: "start", title: "First Slither", desc: "Start moving the snake", done: false },
    { id: "eat1", title: "Fresh Vitamin", desc: "Eat your very first real fruit", done: false },
    { id: "eat10", title: "Healthy Diet", desc: "Chomp down 10 fruits overall", done: false },
    { id: "score_50", title: "Apprentice", desc: "Hit a score of 50 points", done: false },
    { id: "score_150", title: "Professional", desc: "Hit a score of 150 points", done: false },
    { id: "score_300", title: "Grandmaster", desc: "Hit a score of 300 points", done: false },
    { id: "coconut", title: "Nutcracker", desc: "Crack open a valuable Coconut", done: false },
    { id: "pineapple", title: "Tropical King", desc: "Eat a Pineapple (+40 points)", done: false },
    { id: "rainbow", title: "Chameleon", desc: "Possess 5 distinct colors in tail", done: false },
    { id: "wallpaper", title: "Interior Designer", desc: "Upload a custom file wallpaper", done: false }
];

function initGame() {
    menuBox.innerHTML = Object.entries(fruitsConfig).map(([name, item]) => `
        <div class="list-item">
            <span style="font-size: 1.4rem;">${item.emoji}</span>
            <div><strong>${name}</strong><br><span style="color:#2ecc71">+${item.points} pts</span></div>
        </div>
    `).join('');
    updateAchievementsUI();
    spawnFruit();
}

function updateAchievementsUI() {
    let unlocked = achievements.filter(a => a.done).length;
    achCountLabel.textContent = unlocked;
    
    achievementsBox.innerHTML = achievements.map(a => `
        <div class="list-item ${a.done ? 'ach-unlocked' : 'ach-locked'}">
            <div style="font-size:1.2rem;">${a.done ? '⭐' : '🔒'}</div>
            <div><strong>${a.title}</strong><br><span style="color:#aaa; font-size:0.75rem;">${a.desc}</span></div>
        </div>
    `).join('');
}

function unlockAchievement(id) {
    let ach = achievements.find(a => a.id === id);
    if (ach && !ach.done) {
        ach.done = true;
        updateAchievementsUI();
        
        toastTitle.textContent = ach.title;
        toast.classList.remove("hidden-toast");
        setTimeout(() => toast.classList.add("hidden-toast"), 3500);
    }
}

// Background wallpaper file handler logic
bgUploader.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                customWallImg = img;
                unlockAchievement("wallpaper");
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener("keydown", changeDirection);

function main() {
    if (hasGameEnded()) { resetGame(); return; }
    
    // Draw background wall
    if (customWallImg) {
        ctx.drawImage(customWallImg, 0, 0, canvas.width, canvas.height);
        // Dim tint layer to keep canvas crisp
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#050d09";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    moveSnake();
    drawFood();
    drawSnake();
    checkStats();
}

function drawSnake() {
    snake.forEach((part, index) => {
        let x = part.x * gridSize;
        let y = part.y * gridSize;

        if (index === 0) {
            // Half-Circle Curved Head Formula based on heading vectors
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            
            let radius = gridSize / 2;
            let cx = x + radius;
            let cy = y + radius;
            
            let startAngle = 0;
            let endAngle = 2 * Math.PI;

            if (dx === 0 && dy === -1) { // Up
                startAngle = Math.PI; endAngle = 0;
            } else if (dx === 0 && dy === 1) { // Down
                startAngle = 0; endAngle = Math.PI;
            } else if (dx === -1 && dy === 0) { // Left
                startAngle = 0.5 * Math.PI; endAngle = 1.5 * Math.PI;
            } else if (dx === 1 && dy === 0) { // Right
                startAngle = 1.5 * Math.PI; endAngle = 0.5 * Math.PI;
            }

            if(dx !== 0 || dy !== 0) {
                ctx.arc(cx, cy, radius, startAngle, endAngle);
                // Complete the square backbase for smooth continuity
                ctx.lineTo(cx, cy);
            } else {
                ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            }
            ctx.fill();
            drawEyes(x, y);
        } else {
            // Textured rounded look body tail segments
            ctx.fillStyle = segmentsColors[index - 1] || "#27ae60";
            ctx.beginPath();
            ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2 - 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

function drawEyes(hx, hy) {
    ctx.fillStyle = "#fff";
    let eSize = 3;
    let eL = {x: hx + 10, y: hy + 10}, eR = {x: hx + 10, y: hy + 10};

    if (dy === -1) { eL = {x: hx+5, y: hy+6}; eR = {x: hx+15, y: hy+6}; }
    else if (dy === 1) { eL = {x: hx+15, y: hy+14}; eR = {x: hx+5, y: hy+14}; }
    else if (dx === -1) { eL = {x: hx+6, y: hy+15}; eR = {x: hx+6, y: hy+5}; }
    else { eL = {x: hx+14, y: hy+5}; eR = {x: hx+14, y: hy+15}; }

    ctx.beginPath(); ctx.arc(eL.x, eL.y, eSize, 0, 2 * Math.PI); ctx.arc(eR.x, eR.y, eSize, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(eL.x, eL.y, 1, 0, 2 * Math.PI); ctx.arc(eR.x, eR.y, 1, 0, 2 * Math.PI); ctx.fill();
}

function drawFood() {
    let x = food.x * gridSize;
    let y = food.y * gridSize;
    
    // Draw realistic styled textures instead of pure geometric blobs
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(food.emoji, x + gridSize/2, y + gridSize/2);
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += food.points;
        fruitsEatenCount++;
        scoreElement.textContent = score;
        infoBanner.textContent = `Eaten ${food.type}! +${food.points} pts`;
        
        segmentsColors.push(food.color);

        // Individual unique achievement unlocks checks
        unlockAchievement("eat1");
        if (food.type === "Coconut") unlockAchievement("coconut");
        if (food.type === "Pineapple") unlockAchievement("pineapple");

        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem("adv_snake_high", highScore);
        }

        if (gameSpeed > 50) {
            clearInterval(gameInterval);
            gameSpeed -= 1.5;
            gameInterval = setInterval(main, gameSpeed);
        }
        spawnFruit();
    } else {
        snake.pop();
    }
}

function spawnFruit() {
    const keys = Object.keys(fruitsConfig);
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];
    
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        ...fruitsConfig[selectedKey],
        type: selectedKey
    };

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) spawnFruit();
    });
}

function changeDirection(event) {
    unlockAchievement("start");
    const key = event.key.toLowerCase();
    if ((key === "a" || event.key === "ArrowLeft") && dx !== 1) { dx = -1; dy = 0; }
    if ((key === "d" || event.key === "ArrowRight") && dx !== -1) { dx = 1; dy = 0; }
    if ((key === "w" || event.key === "ArrowUp") && dy !== 1) { dx = 0; dy = -1; }
    if ((key === "s" || event.key === "ArrowDown") && dy !== -1) { dx = 0; dy = 1; }
}

function hasGameEnded() {
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function checkStats() {
    if (score >= 50) unlockAchievement("score_50");
    if (score >= 150) unlockAchievement("score_150");
    if (score >= 300) unlockAchievement("score_300");
    if (fruitsEatenCount >= 10) unlockAchievement("eat10");
    
    const colorsSet = new Set(segmentsColors);
    if (colorsSet.size >= 5) unlockAchievement("rainbow");
}

function resetGame() {
    alert("Game Over! Score: " + score);
    snake = [{ x: 15, y: 15 }];
    segmentsColors = [];
    dx = 0; dy = 0; score = 0; gameSpeed = 110;
    scoreElement.textContent = "0";
    infoBanner.textContent = "Game Reset. Click Arrow keys to start!";
    clearInterval(gameInterval);
    gameInterval = setInterval(main, gameSpeed);
    spawnFruit();
}

// Ignition entry point
initGame();
gameInterval = setInterval(main, gameSpeed);
