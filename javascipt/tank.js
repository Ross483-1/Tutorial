const canvas = document.getElementById("tankCanvas");
const ctx = canvas.getContext("2d");

// DOM элементы
const killsLabel = document.getElementById("kills-count");
const scrapLabel = document.getElementById("scrap-count");
const hpInner = document.getElementById("hp-bar-inner");
const msgBox = document.getElementById("msg-box");

// Свойства управления кнопками
const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let mouseX = 0;
let mouseY = 0;

// Характеристики и состояние Игрока
let player = {
    x: 100,
    y: 100,
    size: 24,
    angle: 0,
    turretAngle: 0,
    hp: 100,
    maxHp: 100,
    speed: 2.5,
    damage: 20,
    fireRate: 400, // Задержка между выстрелами в мс
    lastShot: 0,
    kills: 0,
    scrap: 0
};

// Хранилище уровней улучшений и их стоимости
let upgrades = {
    maxHp:    { lvl: 1, cost: 30, scale: 25 },
    damage:   { lvl: 1, cost: 40, scale: 8 },
    speed:    { lvl: 1, cost: 35, scale: 0.4 },
    fireRate: { lvl: 1, cost: 50, scale: 45 } // Вычитается из КД выстрела
};

let bullets = [];
let bots = [];
let buildings = []; // Укрытия (стены)

// Инициализация укрытий (Зданий) на карте
function generateMap() {
    buildings = [
        // Центральные блоки
        { x: 350, y: 250, w: 100, h: 100 },
        // Углы укрытий
        { x: 150, y: 120, w: 120, h: 40 },
        { x: 150, y: 160, w: 40, h: 80 },
        
        { x: 530, y: 120, w: 120, h: 40 },
        { x: 610, y: 160, w: 40, h: 80 },

        { x: 150, y: 440, w: 120, h: 40 },
        { x: 150, y: 360, w: 40, h: 80 },

        { x: 530, y: 440, w: 120, h: 40 },
        { x: 530, y: 360, w: 40, h: 80 }
    ];
}

// Спавн бота в случайном пустом месте карты
function spawnBot() {
    if (bots.length >= 4) return; // Держим максимум 4 активных бота одновременно
    
    let bx, by;
    let valid = false;
    
    while (!valid) {
        bx = Math.random() * (canvas.width - 100) + 50;
        by = Math.random() * (canvas.height - 100) + 50;
        valid = true;
        
        // Проверяем, чтобы бот не заспавнился внутри зданий
        for (let b of buildings) {
            if (bx > b.x - 30 && bx < b.x + b.w + 30 && by > b.y - 30 && by < b.y + b.h + 30) {
                valid = false;
            }
        }
        // Не спавнить слишком близко к игроку
        let distToPlayer = Math.hypot(bx - player.x, by - player.y);
        if (distToPlayer < 200) valid = false;
    }

    bots.push({
        x: bx,
        y: by,
        size: 24,
        angle: Math.random() * Math.PI * 2,
        turretAngle: 0,
        hp: 40 + player.kills * 5, // Боты становятся немного сильнее по мере убийств
        maxHp: 40 + player.kills * 5,
        speed: 1.2 + Math.min(player.kills * 0.05, 1),
        lastShot: 0,
        fireRate: 1200 - Math.min(player.kills * 20, 500),
        color: `hsl(${Math.random() * 40 + 5}, 85%, 50%)` // Оттенки враждебного оранжево-красного
    });
}

// Слушатели клавиатуры и мыши
window.addEventListener("keydown", (e) => { if (e.key.toLowerCase() in keys || e.key in keys) keys[e.key] = true; });
window.addEventListener("keyup", (e) => { if (e.key.toLowerCase() in keys || e.key in keys) keys[e.key] = false; });
canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", () => { firePlayerBullet(); });

function firePlayerBullet() {
    let now = Date.now();
    if (now - player.lastShot >= player.fireRate) {
        let speedX = Math.cos(player.turretAngle) * 7;
        let speedY = Math.sin(player.turretAngle) * 7;
        // Дуло пушки вынесено чуть вперед танка
        let startX = player.x + Math.cos(player.turretAngle) * 26;
        let startY = player.y + Math.sin(player.turretAngle) * 26;

        bullets.push({ x: startX, y: startY, dx: speedX, dy: speedY, fromPlayer: true, damage: player.damage });
        player.lastShot = now;
    }
}

// Механика Покупки Улучшений в Магазине
function buyUpgrade(type) {
    let upg = upgrades[type];
    if (player.scrap >= upg.cost) {
        player.scrap -= upg.cost;
        upg.lvl++;
        
        // Модифицируем параметры игрока на основе прокачки
        if (type === "maxHp") {
            player.maxHp += upg.scale;
            player.hp += upg.scale; // Лечим танк при увеличении ХП
        } else if (type === "damage") {
            player.damage += upg.scale;
        } else if (type === "speed") {
            player.speed += upg.scale;
        } else if (type === "fireRate") {
            player.fireRate = Math.max(120, player.fireRate - upg.scale);
        }

        // Повышаем стоимость следующего апгрейда
        upg.cost = Math.floor(upg.cost * 1.5);
        
        // Обновляем визуальный интерфейс магазина
        document.getElementById(`lvl-${type}`).textContent = `Lvl ${upg.lvl}`;
        document.getElementById(`cost-${type}`).textContent = `Cost: ${upg.cost} Scrap`;
        scrapLabel.textContent = player.scrap;
        updateHpBar();
        msgBox.textContent = "";
    } else {
        msgBox.textContent = "❌ Not enough Scrap Metal!";
        setTimeout(() => msgBox.textContent = "", 2000);
    }
}

function updateHpBar() {
    let pct = Math.max(0, (player.hp / player.maxHp) * 100);
    hpInner.style.width = pct + "%";
}

// Универсальная функция детекции коллизий круг-прямоугольник (Танк-Здание)
function checkBuildingCollision(circle, rect) {
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (circle.size * circle.size);
}

// Основной физический цикл обновления игры
function update() {
    // 1. Движение игрока
    let moveX = 0;
    let moveY = 0;
    if (keys.w || keys.ArrowUp) moveY = -player.speed;
    if (keys.s || keys.ArrowDown) moveY = player.speed;
    if (keys.a || keys.ArrowLeft) moveX = -player.speed;
    if (keys.d || keys.ArrowRight) moveX = player.speed;

    // Плавный расчет угла корпуса танка при движении
    if (moveX !== 0 || moveY !== 0) {
        player.angle = Math.atan2(moveY, moveX);
    }

    // Применяем позицию с проверкой коллизий со зданиями и границами
    let oldX = player.x;
    let oldY = player.y;
    
    player.x += moveX;
    player.y += moveY;

    // Границы карты для игрока
    if (player.x < player.size) player.x = player.size;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (player.y < player.size) player.y = player.size;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;

    // Возврат назад при столкновении со зданиями
    for (let b of buildings) {
        if (checkBuildingCollision(player, b)) {
            player.x = oldX;
            player.y = oldY;
            break;
        }
    }

    // Угол поворота пушки игрока направлен на мышь
    player.turretAngle = Math.atan2(mouseY - player.y, mouseX - player.x);

    // 2. Обновление снарядов
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Удаление снаряда при выходе за экран
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
            continue;
        }

        // Проверка столкновения снаряда со зданиями
        let hitWall = false;
        for (let b of buildings) {
            if (bullet.x >= b.x && bullet.x <= b.x + b.w && bullet.y >= b.y && bullet.y <= b.y + b.h) {
                bullets.splice(i, 1);
                hitWall = true;
                break;
            }
        }
        if (hitWall) continue;

        // Попадание во врагов
        if (bullet.fromPlayer) {
            for (let j = bots.length - 1; j >= 0; j--) {
                let bot = bots[j];
                if (Math.hypot(bullet.x - bot.x, bullet.y - bot.y) < bot.size) {
                    bot.hp -= bullet.damage;
                    bullets.splice(i, 1);

                    // Если бот уничтожен
                    if (bot.hp <= 0) {
                        bots.splice(j, 1);
                        player.kills++;
                        player.scrap += 15; // Даем 15 металлолома за фраг
                        killsLabel.textContent = player.kills;
                        scrapLabel.textContent = player.scrap;
                    }
                    break;
                }
            }
        } else {
            // Попадание вражеского снаряда в игрока
            if (Math.hypot(bullet.x - player.x, bullet.y - player.y) < player.size) {
                player.hp -= bullet.damage;
                bullets.splice(i, 1);
                updateHpBar();

                if (player.hp <= 0) {
                    alert(`GAME OVER! You secured ${player.kills} kills before being blown to scrap.`);
                    document.location.reload();
                }
            }
        }
    }

    // 3. Логика ИИ Ботов
    for (let bot of bots) {
        let distToPlayer = Math.hypot(player.x - bot.x, player.y - bot.y);
        bot.turretAngle = Math.atan2(player.y - bot.y, player.x - bot.x);

        // Движение к игроку, если он далеко
        let botOldX = bot.x;
        let botOldY = bot.y;
        
        if (distToPlayer > 150) {
            bot.x += Math.cos(bot.turretAngle) * bot.speed;
            bot.y += Math.sin(bot.turretAngle) * bot.speed;
            bot.angle = bot.turretAngle;
        }

        // Проверка коллизий ботов со зданиями
        for (let b of buildings) {
            if (checkBuildingCollision(bot, b)) {
                bot.x = botOldX;
                bot.y = botOldY;
                // Меняем случайным образом траекторию при утыкании в стену
                bot.x += Math.cos(bot.angle + Math.PI/2) * bot.speed;
                bot.y += Math.sin(bot.angle + Math.PI/2) * bot.speed;
            }
        }

        // Стрельба ботов в игрока с кулдауном
        let now = Date.now();
        if (distToPlayer < 350 && now - bot.lastShot >= bot.fireRate) {
            let startX = bot.x + Math.cos(bot.turretAngle) * 25;
            let startY = bot.y + Math.sin(bot.turretAngle) * 25;
            bullets.push({
                x: startX,
                y: startY,
                dx: Math.cos(bot.turretAngle) * 4.5,
                dy: Math.sin(bot.turretAngle) * 4.5,
                fromPlayer: false,
                damage: 10 + Math.floor(player.kills * 0.8)
            });
            bot.lastShot = now;
        }
    }

    // Всегда поддерживаем популяцию врагов на арене
    if (bots.length < 4) spawnBot();
}

// Отрисовка графических элементов (Рендеринг)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Рисуем Здания/Стены (Укрытия)
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    for (let b of buildings) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        
        // Декоративная штриховка текстуры зданий
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        ctx.fillRect(b.x + 5, b.y + 5, b.w - 10, b.h - 10);
        ctx.fillStyle = "#1e293b";
    }

    // 2. Рисуем Снаряды (Плазменные сферы)
    for (let bullet of bullets) {
        ctx.fillStyle = bullet.fromPlayer ? "#00f3ff" : "#ff3366";
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // 3. Рисуем Ботов (Вражеские танки)
    for (let bot of bots) {
        drawTank(bot.x, bot.y, bot.angle, bot.turretAngle, bot.color, bot.hp, bot.maxHp);
    }

    // 4. Рисуем Игрока (Неоновый синий танк)
    drawTank(player.x, player.y, player.angle, player.turretAngle, "#00f3ff", player.hp, player.maxHp);
}

// Универсальная функция отрисовки красивого детализированного танка
function drawTank(x, y, bodyAngle, turretAngle, color, hp, maxHp) {
    ctx.save();
    ctx.translate(x, y);

    // Полоска здоровья над каждым конкретным танком
    let barW = 32;
    let barH = 4;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(-barW/2, -32, barW, barH);
    ctx.fillStyle = hp / maxHp > 0.4 ? "#00ff66" : "#ff3366";
    ctx.fillRect(-barW/2, -32, barW * (hp / maxHp), barH);

    // Отрисовка Гусениц и Корпуса (Крутится по направлению движения)
    ctx.save();
    ctx.rotate(bodyAngle);
    
    ctx.fillStyle = "#2d3748"; // Левая и правая гусеницы
    ctx.fillRect(-18, -16, 36, 6);
    ctx.fillRect(-18, 10, 36, 6);

    ctx.fillStyle = "#1a202c"; // Базовая плита брони
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(-14, -11, 28, 22);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Отрисовка Башни и Дула Пушки (Поворачивается на цель независимо)
    ctx.save();
    ctx.rotate(turretAngle);
    
    ctx.lineWidth = 4; // Дуло пушки
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();

    ctx.fillStyle = "#2d3748"; // Круглая кабина башни
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
}

// Запуск игрового движка
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Инициализация старта игры
generateMap();
updateHpBar();
loop();
