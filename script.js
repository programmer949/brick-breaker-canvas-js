const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const ball = { x: width / 2 - 60, y: height / 2 + 50, dx: 4, dy: 6, rad: 10 };
const bricks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const player = {
    x: width / 2 - 60,
    y: height - 30,
    width: 120,
    height: 20,
    speed: 0,
    lives: 3,
    won: false,
    lost: false,
};
const hit = new Audio("./sfx/hit.wav");
const body = document.body;
const game = { space: 5, running: false };

window.addEventListener("load", () => {
    if (!game.running) {
        context.fillStyle = "white";
        context.font = "28px consolas";
        context.fillText("Press enter key or click here", 73.818, height / 2);
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "Left") player.speed = -8;
    if (e.key === "ArrowRight" || e.key === "Right") player.speed = 8;
    if (
        !game.running &&
        player.won == false &&
        player.lost === false &&
        e.key === "Enter"
    )
        game.running = true;
});

window.addEventListener("keyup", (e) => {
    if (
        e.key === "ArrowLeft" ||
        e.key === "Left" ||
        e.key === "ArrowRight" ||
        e.key === "Right"
    ) {
        player.speed = 0;
    }
});

canvas.addEventListener("click", () => {
    if (!game.running && player.won == false && player.lost === false) {
        game.running = true;
        canvas.className = "started";
    }
});

body.addEventListener("mousemove", (e) => {
    if (game.running) {
        x = e.clientX - canvas.getBoundingClientRect().x;
        player.x = x - player.width / 2 - 15;
    }
});

const clear = () => context.clearRect(0, 0, width, height);

const drawBricks = () => {
    context.fillStyle = "#cd4b1d";
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            if (bricks[i][j] === 1) {
                context.fillRect(
                    j * 60 + game.space,
                    i * 30 + game.space,
                    50,
                    20
                );
                const ballLeft = ball.x;
                const ballTop = ball.y;
                const ballRight = ball.x + ball.rad;
                const ballBottom = ball.y + ball.rad;
                const brickTop = i * 30 + 40;
                const brickLeft = j * 60;
                const brickRight = j * 60 + 60;
                if (
                    ballTop <= brickTop &&
                    ballRight >= brickLeft &&
                    ballLeft <= brickRight &&
                    ballBottom <= brickTop
                ) {
                    ball.dy = -ball.dy;
                    hit.play();
                    bricks[i][j] = 0;
                }
            }
        }
    }
};

const drawBall = () => {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.rad, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = "#ff0";
    context.fill();
};

const drawPaddle = () => {
    context.fillStyle = "#2bb8f1";
    context.fillRect(player.x, player.y, player.width, player.height);
};

const move = () => {
    ball.y += ball.dy;
    ball.x += ball.dx;
    ball.x = Math.floor(ball.x);
    ball.y = Math.floor(ball.y);
    ball.dx = Math.floor(ball.dx);
    ball.dy = Math.floor(ball.dy);
    player.x += player.speed;
};

const collisions = () => {
    const ballLeft = ball.x;
    const ballRight = ball.x + ball.rad;
    const ballBottom = ball.y + ball.rad;
    const paddleLeft = player.x;
    const paddleTop = player.y;
    const paddleRight = player.x + player.width;
    if (ball.y <= ball.rad * 2) {
        ball.dy = -ball.dy;
        hit.play();
    }
    if (ballBottom >= paddleTop + 20) {
        ball.dx = 4;
        ball.dy = 6;
        ball.x = player.x;
        ball.y = paddleTop - ball.rad * 2;
        player.lives--;
    }
    if (ball.x <= ball.rad * 2 || ball.x >= width - ball.rad * 2) {
        ball.dx = -ball.dx;
        hit.play();
    }
    if (player.x <= 20) {
        player.speed = 0;
        player.x = 21;
    }
    if (player.x >= width - player.width - 20) {
        player.speed = 0;
        player.x = width - player.width - 21;
    }
    if (
        ballBottom >= paddleTop &&
        ballRight >= paddleLeft &&
        ballLeft <= paddleRight
    ) {
        ball.y -= ball.rad;
        ball.dy = -ball.dy;
        hit.play();
    }
};

const drawLives = () => {
    context.fillStyle = "white";
    context.font = "16px consolas";
    context.fillText(`Lives: ${player.lives}`, 0, height, 100);
};

const reload = () => setTimeout(() => location.reload(), 500);

const checkState = () => {
    if (
        bricks.every((brickArray) => brickArray.every((brick) => brick === 0))
    ) {
        player.won = true;
        game.running = false;
        clear();
        context.fillStyle = "white";
        context.font = "28px consolas";
        context.fillText("You Win!", width / 2 - 56, height / 2);
        reload();
    }
    if (player.lives === 0) {
        player.lost = true;
        game.running = false;
        clear();
        context.fillStyle = "white";
        context.font = "28px consolas";
        context.fillText("You Lose!", width / 2 - 63, height / 2);
        reload();
    }
};

const mainLoop = () => {
    if (game.running) {
        clear();
        drawBricks();
        drawBall();
        drawPaddle();
        move();
        collisions();
        drawLives();
        checkState();
    }
    requestAnimationFrame(mainLoop);
};

mainLoop();
