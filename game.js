const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const pacmanFrames = document.getElementById('animations');
const ghostFrames = document.getElementById('ghosts');
let eatEffetc = document.getElementById("effects-eat");
let deathEffetc = document.getElementById("effects-death");

const oneBlockSize = 20;
const wallColor = "#342DCA";
const wallSpaceWidth = oneBlockSize / 1.6;
const wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
const wallInnerColor = 'black';
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_DOWN = 1;
const FOOD_COLOR = '#feb897';

let lives = 3;
let ghosts = [];
let ghostCount = 4;
let score = 0;
let foodCount  = 0;
let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

let createRect = (x, y, width, height, color) => {
   canvasContext.fillStyle = color;
   canvasContext.fillRect(x, y, width, height);
};

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length + 1; j++) {
        if(map[j][i] === 2) {           
            foodCount++;
        }
    }
}

let createPacMan = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5,
    );
}

let checkGamepadInput = () => {
    let gamepads = navigator.getGamepads();
    console.log(gamepads);
    for (let i = 0; i < gamepads.length; i++) {
        let gp = gamepads[i];
        if (gp) {
            // Eixos do joystick: gp.axes[0] é o eixo horizontal, gp.axes[1] é o eixo vertical
            if (gp.axes[0] < -0.5) {
                pacman.nextDirection = DIRECTION_LEFT;
            } else if (gp.axes[0] > 0.5) {
                pacman.nextDirection = DIRECTION_RIGHT;
            } else if (gp.axes[1] < -0.5) {
                pacman.nextDirection = DIRECTION_UP;
            } else if (gp.axes[1] > 0.5) {
                pacman.nextDirection = DIRECTION_DOWN;
            }

            // Botões: gp.buttons[0] pode ser o botão A, gp.buttons[1] o botão B, etc.
            if (gp.buttons[0].pressed) {
                // Ação associada ao botão A, se necessário
            }
        }
    }
}


let gameLoop = () => {
    draw();
    update();
    checkGamepadInput();
}

const fps = 30;
let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
    createPacMan();
    createGhost();
};

let onGhostCollision = () => {
    lives--;    
    // deathEffetc.play()
    
    restartPacmanAndGhosts();
    if (lives === 0) {
        gameOver();
    }   
};


let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts()
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }

    if (score > foodCount) {
        drawWin();  
        clearInterval(gameInterval);
    }
}

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length + 1; j++) {
            if(map[i][j] === 2) {
                canvasContext.beginPath();
                canvasContext.arc(
                    j * oneBlockSize + oneBlockSize / 2,  // X do centro do círculo
                    i * oneBlockSize + oneBlockSize / 2,  // Y do centro do círculo
                    oneBlockSize / 6,                     // Raio do círculo
                    0,                                    // Ângulo inicial
                    2 * Math.PI                           // Ângulo final (círculo completo)
                );
                canvasContext.fillStyle = FOOD_COLOR;
                canvasContext.fill();
                canvasContext.closePath();
            }
        }
    }
}

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = '20px Emulogic';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1) + 8     
    )
}

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawFoods();
    drawScore();
    pacman.draw();
    drawGhosts();
    drawRemainingLives();
}

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
}

let drawGameOver = () => {
    canvasContext.font = '20px Emulogic';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Game Over", 150, 200 )
}

let drawWin = () => {
    canvasContext.font = '40px Emulogic';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Win", 150, 200 )
}

let createGhost = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
         let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 === 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 === 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            121,
            114,
            6 + i
         );
 
         ghosts.push(newGhost);
    }
}

createPacMan();
createGhost();
gameLoop();


window.addEventListener('keydown', (event) => {
    let key = event.keyCode
    setTimeout(() => {
        if (key === 37 || key === 65 ) { // esquerda
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (key === 38 || key === 87) { // cima
            pacman.nextDirection = DIRECTION_UP;
        } else if (key === 39 || key === 68 ) { // right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (key === 40  || key === 83 ) { // baixo
            pacman.nextDirection = DIRECTION_DOWN;
        }
    }, 1)
})

window.addEventListener("gamepadconnected", (event) => {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        event.gamepad.index, event.gamepad.id,
        event.gamepad.buttons.length, event.gamepad.axes.length);     
        
    updateGamepads();
});

let updateGamepads = () => {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    console.log("Gamepads updated:", gamepads);
}