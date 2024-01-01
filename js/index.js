// Variables used in the project
let canvasBoard;
let canvasBoardWidth = 750;
let canvasBoardHeight = 250;
let canvasRenderingContext;

// Dino properties
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = canvasBoardHeight - dinoHeight;
let dinoImage;

let dinoRun1Img;
let dinoRun2Img;

let dinoAnimationFrame = 0;
let rapidImageChangeInterval = 5; // Change image every 5 frames

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
};

// Cactus properties
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = canvasBoardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Cloud properties
let cloudImg;
let cloudWidth = 100;
let cloudHeight = 50;
let cloudX = canvasBoardWidth;
let cloudY = 30;
let cloudVelocityX = -0.1; // Adjust the velocity as needed

//Game Music
let gameMusic = new Audio('./music/gameMusic.mp3');
let dinoJump = new Audio('./music/dinoJump.mp3');
let dinoDie = new Audio('./music/dinoDie.mp3');


// Game physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

// Game state
let gameOver = false;
let score = 0;

// Night mode settings
let nightMode = false;
let stars = [];

let lastToggleScore = 1000;

// Drawing functions
function drawSun() {
    // Draw sun
    const sunRadius = 30;
    const sunX = canvasBoardWidth - 100;
    const sunY = 50;

    canvasRenderingContext.beginPath();
    canvasRenderingContext.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
    canvasRenderingContext.fillStyle = "#FFD700"; // Yellow color for the sun
    canvasRenderingContext.fill();
    canvasRenderingContext.closePath();

    // Draw sun rays
    for (let i = 0; i < 12; i++) {
        const rayStartX = sunX + sunRadius * Math.cos((i * 2 * Math.PI) / 12);
        const rayStartY = sunY + sunRadius * Math.sin((i * 2 * Math.PI) / 12);
        const rayEndX = sunX + (sunRadius + 20) * Math.cos((i * 2 * Math.PI) / 12);
        const rayEndY = sunY + (sunRadius + 20) * Math.sin((i * 2 * Math.PI) / 12);

        canvasRenderingContext.beginPath();
        canvasRenderingContext.moveTo(rayStartX, rayStartY);
        canvasRenderingContext.lineTo(rayEndX, rayEndY);
        canvasRenderingContext.strokeStyle = "#FFD700"; // Yellow color for the sun rays
        canvasRenderingContext.lineWidth = 2;
        canvasRenderingContext.stroke();
        canvasRenderingContext.closePath();
    }
}

function activateNightMode() {
    // Activate night mode
    canvasBoard.style.backgroundColor = "#001f3f"; // Dark blue for the night sky
    canvasRenderingContext.fillStyle = "#FFF"; // White for text color
    nightMode = true;

    // Initialize stars on the canvas
    for (let i = 0; i < 50; i++) {
        let x = Math.random() * canvasBoardWidth;
        let y = Math.random() * canvasBoardHeight;
        stars.push({ x, y });
    }
}

function deactivateNightMode() {
    // Deactivate night mode
    canvasBoard.style.backgroundColor = "#FFF"; // Set to default (transparent)
    canvasRenderingContext.fillStyle = "#000"; // Black for text color
    nightMode = false;
}

function toggleNightMode() {
    // Toggle night mode
    if (nightMode) {
        deactivateNightMode();
    } else {
        activateNightMode();
    }
}

function drawMoon() {
    // Draw moon
    const moonRadius = 30;
    const moonX = canvasBoardWidth - 100;
    const moonY = 50;

    canvasRenderingContext.beginPath();
    canvasRenderingContext.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI);
    canvasRenderingContext.fillStyle = "#FFE";
    canvasRenderingContext.fill();
    canvasRenderingContext.closePath();
}

// Initialization
window.onload = function () {
    // Initialize canvas and context
    canvasBoard = document.querySelector('.boardContainer');
    canvasBoard.height = canvasBoardHeight;
    canvasBoard.width = canvasBoardWidth;
    canvasRenderingContext = canvasBoard.getContext('2d');

    // Load dino run images
    dinoRun1Img = new Image();
    dinoRun1Img.src = './img/dino-run1.png';

    dinoRun2Img = new Image();
    dinoRun2Img.src = './img/dino-run2.png';

    // Use the first dino image initially
    dinoImage = dinoRun1Img;

    dinoImage.onload = function () {
        canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    };

    // Load cactus images
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Load cloud image
    cloudImg = new Image();
    cloudImg.src = './img/cloud.png';

    // Start the game loop
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);

    // Event listener for keydown
    document.addEventListener("keydown", function (e) {
        if (gameOver && (e.code === "Space" || e.code === "ArrowUp")) {
            resetGame();
        } else {
            movingDino(e);
        }
    });
};

// Game logic functions
function resetGame() {


    // Reset game state
    gameOver = false;
    score = 0;
    dinoAnimationFrame = 0;

    // Reset dino position and images
    dino.x = dinoX;
    dino.y = dinoY;
    dinoRun1Img = new Image();
    dinoRun1Img.src = './img/dino-run1.png';

    dinoRun2Img = new Image();
    dinoRun2Img.src = './img/dino-run2.png';

    // Use the first dino image initially
    dinoImage = dinoRun1Img;

    dinoImage.onload = function () {
        canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    };

    // Clear cactus array
    cactusArray = [];

    // Activate night mode if the score is beyond the last toggle score
    if (score >= lastToggleScore) {
        toggleNightMode();
    } else {
        // Deactivate night mode if game over
        deactivateNightMode();
    }

    // Reset the last toggle score
    lastToggleScore = 1000;

    // Continue the game loop
    requestAnimationFrame(update);
}


function update() {
    gameMusic.play();

    if (gameOver) {
        // Deactivate night mode if game over
        if (nightMode) {
            deactivateNightMode();
        }
        gameMusic.pause();

        return;
    }

    // Clear canvas
    canvasRenderingContext.clearRect(0, 0, canvasBoard.width, canvasBoard.height);

    // Draw sun or stars and moon based on night mode
    if (nightMode) {
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            canvasRenderingContext.beginPath();
            canvasRenderingContext.arc(star.x, star.y, 1, 0, 2 * Math.PI);
            canvasRenderingContext.fillStyle = "#FFF";
            canvasRenderingContext.fill();
        }
        drawMoon();
    } else {
        drawSun();
    }

    // Draw cloud
    canvasRenderingContext.drawImage(cloudImg, cloudX, cloudY, cloudWidth, cloudHeight);

    // Move cloud
    cloudX += cloudVelocityX;

    // Reset cloud position if it goes off-screen
    if (cloudX + cloudWidth < 0) {
        cloudX = canvasBoardWidth;
    }

    // Apply gravity to the dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);

    // Change dino images rapidly
    if (dinoAnimationFrame % rapidImageChangeInterval === 0) {
        dinoImage = dinoImage === dinoRun1Img ? dinoRun2Img : dinoRun1Img;
    }

    // Move and render cacti
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;

        // Rendering cactus
        canvasRenderingContext.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check for collision with dino
        if (collisionOccurring(dino, cactus)) {
            gameOver = true;
            dinoImage.src = "./img/dino-dead.png";
            dinoDie.play();
            dinoImage.onload = function () {
                // Draw the dino after stars and cactus
                canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
            };
            

        }
    }

    // Rendering dino
    canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

    // Score display
    canvasRenderingContext.fillStyle = nightMode ? "#FFF" : "black";
    canvasRenderingContext.font = "20px courier";
    score++;
    canvasRenderingContext.fillText(score, 5, 20);

    // Check for night mode activation
    if (score >= lastToggleScore) {
        lastToggleScore += 1000; // Increase score for the next toggle
        toggleNightMode();
    }

    // Increment the animation frame counter
    dinoAnimationFrame++;

    // Continue the game loop
    requestAnimationFrame(update);
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight,
    };

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function collisionOccurring(a, b) {
    // Check if collision is occurring between two objects
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// User input handling
let isDuckMode = false;

function movingDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        dinoJump.play();
        // Jump
        velocityY = -10;
        if (isDuckMode) {
            // Revert to the default running dino images
            revertToDefaultDinoImages();
        }
    } else if (e.code == "ArrowDown") {
        // Duck
        switchToDuckImages();
    } else if (e.code == "ArrowUp" && isDuckMode) {
        // Revert to the default running dino images
        revertToDefaultDinoImages();
    }
}

function revertToDefaultDinoImages() {
    // Revert dino images to default
    dinoRun1Img = new Image();
    dinoRun1Img.src = './img/dino-run1.png';  // Replace with the actual path to your default dino run image

    dinoRun2Img = new Image();
    dinoRun2Img.src = './img/dino-run2.png';  // Replace with the actual path to your default dino run 2 image

    // Use the first default dino image initially
    dinoImage = dinoRun1Img;

    dinoImage.onload = function () {
        canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    };

    isDuckMode = false;
}

function switchToDuckImages() {
    // Switch dino images to duck mode
    dinoRun1Img = new Image();
    dinoRun1Img.src = './img/dino-duck1.png';  // Replace with the actual path to your dino duck image

    dinoRun2Img = new Image();
    dinoRun2Img.src = './img/dino-duck2.png';  // Replace with the actual path to your dino duck 2 image

    // Use the first dino duck image initially
    dinoImage = dinoRun1Img;

    dinoImage.onload = function () {
        canvasRenderingContext.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    };

    isDuckMode = true;
}
