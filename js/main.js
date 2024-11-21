const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const BALL_RADIUS = 10;

canvas.width = 400;
canvas.height = 400;

const objects = []; // 存储剪刀、石头、布
const objectTypes = ['scissors', 'rock', 'paper']; // 类型
const colors = {
    scissors: 'red',
    rock: 'blue',
    paper: 'green'
};

const beats = {
    scissors: 'paper',
    rock: 'scissors',
    paper: 'rock'
}

function compareEnum(type1, type2) {
    if (type1 == type2) return 0;
    return beats[type1] == type2 ? 1 : -1;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createObject(type) {
    return {
        x: random(50, canvas.width - 50),
        y: random(50, canvas.height - 50),
        vx: random(-2, 2),
        vy: random(-2, 2),
        type: type,
    };
}

for (let i = 0; i < 30; i++) {
    const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    objects.push(createObject(type));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < objects.length; i++) {
        const obj1 = objects[i];
        obj1.x += obj1.vx;
        obj1.y += obj1.vy;

        if (obj1.x < 0 || obj1.x > canvas.width) obj1.vx *= -1;
        if (obj1.y < 0 || obj1.y > canvas.height) obj1.vy *= -1;

        for (let j = i + 1; j < objects.length; j++) {
            const obj2 = objects[j];
            const dx = obj2.x - obj1.x;
            const dy = obj2.y - obj1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= BALL_RADIUS * 2) {
                const overlap = 2 * BALL_RADIUS - distance;
                const separationX = (overlap / 2) * (dx / distance);
                const separationY = (overlap / 2) * (dy / distance);
                obj1.x -= separationX;
                obj1.y -= separationY;
                obj2.x += separationX;
                obj2.y += separationY;
                
                const compRes = compareEnum(obj1.type, obj2.type);
                if (compRes == 1) {
                    obj2.type = obj1.type;
                } else if (compRes == -1) {
                    obj1.type = obj2.type;
                }

                obj1.vx = -obj1.vx;
                obj1.vy = -obj1.vy;
                obj2.vx = -obj2.vx;
                obj2.vy = -obj2.vy;
            }
        }

        ctx.beginPath();
        ctx.arc(obj1.x, obj1.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = colors[obj1.type];
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
