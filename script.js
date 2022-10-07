const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const body = document.body;
const width = canvas.width;
const height = canvas.height;
const msgStart = document.querySelector(".start");
const msgWin = document.querySelector(".win");
const msgLose = document.querySelector(".lose");
const hit = new Audio("./assets/sfx/hit.wav");
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
const paddle = { x: width / 2 - 60, y: height - 30, w: 120, h: 20, speed: 20 };
let paused = true;
let lives = 3;
let space = 5;
let won = false;
let lost = false;

window.addEventListener("load", () =>
    paused ? (msgStart.style.display = "block") : null
);

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "Left") {
        paddle.x -= paddle.speed;
    } else if (e.key === "ArrowRight" || e.key === "Right") {
        paddle.x += paddle.speed;
    } else if (paused && won == false && lost === false && e.key === "Enter") {
        msgStart.style.display = "none";
        paused = false;
        canvas.className = "started";
    }
});

canvas.addEventListener("click", () => {
    if (paused && won == false && lost === false) {
        msgStart.style.display = "none";
        paused = false;
        canvas.className = "started";
    }
});

body.addEventListener("mousemove", (e) => {
    if (!paused) {
        if (e.movementX < 200) return (paddle.x += e.movementX);
        else if (e.movementX > 200) return (paddle.x -= e.movementX);
    }
});

const clear = () => context.clearRect(0, 0, width, height);

const drawBricks = () => {
    context.fillStyle = "#cd4b1d";
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            if (bricks[i][j] === 1) {
                context.fillRect(j * 60 + space, i * 30 + space, 50, 20);
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
    context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
};

const move = () => {
    ball.y += ball.dy;
    ball.x += ball.dx;
    ball.x = Math.floor(ball.x);
    ball.y = Math.floor(ball.y);
    ball.dx = Math.floor(ball.dx);
    ball.dy = Math.floor(ball.dy);
};

const collisions = () => {
    const ballLeft = ball.x;
    const ballRight = ball.x + ball.rad;
    const ballBottom = ball.y + ball.rad;
    const paddleLeft = paddle.x;
    const paddleTop = paddle.y;
    const paddleRight = paddle.x + paddle.w;
    if (ball.y <= ball.rad * 2) {
        ball.dy = -ball.dy;
        hit.play();
    } else if (ballBottom >= paddleTop + 20) {
        ball.dx = 4;
        ball.dy = 6;
        ball.x = paddle.x;
        ball.y = paddleTop - ball.rad * 2;
        lives--;
    } else if (ball.x <= ball.rad * 2 || ball.x >= width - ball.rad * 2) {
        ball.dx = -ball.dx;
        hit.play();
    } else if (paddle.x <= 0) {
        paddle.x = 20;
    } else if (paddle.x >= width - paddle.w) {
        paddle.x = width - paddle.w - 20;
    } else if (
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
    context.fillText(`Lives: ${lives}`, 0, height, 100);
};

const reload = () => setTimeout(() => location.reload(), 500);

const checkState = () => {
    if (
        bricks.every((brickArray) => brickArray.every((brick) => brick === 0))
    ) {
        won = true;
        paused = true;
        clear();
        msgWin.style.display = "block";
        reload();
    } else if (lives === 0) {
        lost = true;
        paused = true;
        clear();
        msgLose.style.display = "block";
        reload();
    }
};

const mainLoop = () => {
    if (!paused) {
        clear();
        move();
        collisions();
        drawBricks();
        drawBall();
        drawPaddle();
        drawLives();
        checkState();
    }
    requestAnimationFrame(mainLoop);
};

mainLoop();
