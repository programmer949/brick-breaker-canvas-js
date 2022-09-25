const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const body = document.body;
const width = canvas.width;
const height = canvas.height;
const hitSound = new Audio();
const ballCordinates = { x: width / 2 - 60, y: height / 2 + 50 };
const ballVelocity = { x: 4, y: 6 };
const bricks = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const paddle = { x: width / 2 - 60, y: height - 30, w: 120, h: 20 };
let isPaused = true;
let lives = 3;
let padding = 5;
let won = false;
let lost = false;

hitSound.src = "./assets/sfx/hit.wav";

window.addEventListener("load", () => {
    if (isPaused) {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "#2bb8f1";
        context.font = "32px consolas";
        context.fillText(
            "Press enter key or click here.",
            width / 12,
            height / 2,
            width - 100
        );
    }
});

window.addEventListener("resize", () => location.reload());

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "Left") {
        paddle.x -= 20;
    } else if (e.key === "ArrowRight" || e.key === "Right") {
        paddle.x += 20;
    } else if (
        isPaused &&
        won == false &&
        lost === false &&
        e.key === "Enter"
    ) {
        isPaused = false;
        canvas.className = "started";
    }
});

canvas.addEventListener("click", () => {
    if (isPaused && won == false && lost === false) {
        isPaused = false;
        canvas.className = "started";
    }
});

const clear = () => context.clearRect(0, 0, width, height);

const drawBricks = () => {
    context.fillStyle = "#cd4b1d";
    bricks.forEach((brick, index) => {
        for (let i = 0; i < brick.length; i++) {
            if (brick[i] === 1) {
                context.fillRect(
                    i * 60 + padding,
                    index * 30 + padding,
                    50,
                    20
                );
            }
            if (
                ballCordinates.y <= index * 30 + padding + 40 &&
                ballCordinates.x + 10 >= i * 60 + padding &&
                ballCordinates.x <= i * 60 + 50 + padding
            ) {
                brick[i] === 1 ? (ballVelocity.y = -ballVelocity.y) : null;
                brick[i] === 1 ? hitSound.play() : null;
                brick[i] = 0;
            }
        }
    });
};

const drawBall = () => {
    context.beginPath();
    context.arc(ballCordinates.x, ballCordinates.y, 10, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "#ff0";
    context.fill();
};

const drawPaddle = () => {
    context.fillStyle = "#2bb8f1";
    context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
};

const move = () => {
    ballCordinates.y += ballVelocity.y;
    ballCordinates.x += ballVelocity.x;
    ballCordinates.x = Math.floor(ballCordinates.x);
    ballCordinates.y = Math.floor(ballCordinates.y);
    ballVelocity.x = Math.floor(ballVelocity.x);
    ballVelocity.y = Math.floor(ballVelocity.y);
};

const collisions = () => {
    const paddleTop = paddle.y;
    const ballBottom = ballCordinates.y + 10;
    const ballLeft = ballCordinates.x;
    const ballRight = ballCordinates.x + 10;
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.w;
    if (ballCordinates.y < 10) {
        ballVelocity.y = -ballVelocity.y;
        hitSound.play();
    } else if (ballBottom > paddleTop + 20) {
        ballVelocity.x = 4;
        ballVelocity.y = 6;
        ballCordinates.x = width / 2 - 200;
        ballCordinates.y = height / 2 + 50;
        lives--;
    } else if (ballCordinates.x < 10 || ballCordinates.x > width - 10) {
        ballVelocity.x = -ballVelocity.x;
        hitSound.play();
    } else if (paddle.x < 0) {
        paddle.x = 6;
    } else if (paddle.x > width - paddle.w) {
        paddle.x = width - paddle.w;
    } else if (
        ballBottom >= paddleTop &&
        ballRight >= paddleLeft &&
        ballLeft <= paddleRight
    ) {
        ballVelocity.y = -ballVelocity.y;
        hitSound.play();
    }
};

const drawLives = () => {
    context.fillStyle = "white";
    context.font = "16px consolas";
    context.fillText(`Lives: ${lives}`, 0, height, 100);
};

const checkState = () => {
    if (
        bricks.every((brickArray) => brickArray.every((brick) => brick === 0))
    ) {
        won = true;
        setTimeout(() => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = "white";
            context.font = "30px Tahoma";
            context.fillText("You Win!", 250, height / 2, 300);
            isPaused = true;
        }, 100);
    } else if (lives === 0) {
        lost = true;
        setTimeout(() => {
            isPaused = true;
            location.reload();
        }, 100);
    }
};

const mainLoop = () => {
    if (!isPaused) {
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
