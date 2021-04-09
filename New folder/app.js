// make blocks
const board = document.querySelector(".board");
const container = document.querySelector(".container");
const count = document.querySelector(".count");

let row = 0,
  col = 0,
  snakeSpeed = 400,
  gameOver,
  timer,
  arrBlocks,
  snake,
  curDirection,
  makeSnake,
  lostGameModal,
  makeFood,
  firstTimer,
  countDown = 3;

while (row < 40) {
  if (col === 40) {
    col = 0;
    row++;
  } else {
    const block = document.createElement("div");
    block.className = `block ${
      row === 0 || col === 0 || row === 39 || col === 39 ? "extra" : ""
    }`;
    board.appendChild(block);
    col++;
  }
}

const blocks = document.querySelectorAll(".block");

//make snake
function gameInit() {
  countDown = 3;
  curDirection = "";
  blocks.forEach((block) => (block.innerHTML = ""));
  makeSnake = () => {
    const snake = document.createElement("div");
    snake.className = "snake";
    return snake;
  };
  arrBlocks = Array.from(blocks);
  snakes = [makeSnake(), makeSnake(), makeSnake()];
  snakes.forEach((snake, i) => {
    arrBlocks[288 + i + 1].appendChild(snake);
  });
  !gameOver && lostGame();
  makeFood = () => {
    const rn = Math.floor(Math.random() * arrBlocks.length);
    if (arrBlocks[rn].classList.contains("extra")) {
      makeFood();
      return;
    }
    arrBlocks[rn].classList.add("food");
  };
  gameOver = false;
}

gameInit();
makeFood();
//move snake

const moveSnakeFunc = (num) => {
  let parentNode;
  snakes.forEach((snake, i) => {
    const curIndex = arrBlocks.indexOf(snake.parentNode);
    if (i === 0) {
      parentNode = curIndex;
      arrBlocks[curIndex + num].appendChild(snake);
    } else {
      arrBlocks[parentNode].appendChild(snake);
      parentNode = curIndex;
    }
  });
  checkLoseGame();
  if (snakes[0].parentNode.classList.contains("food")) {
    addFood();
  }
};

function moveSnake(direction) {
  if (direction === 40) {
    moveSnakeFunc(row);
  } else if (direction === 38) {
    moveSnakeFunc(-row);
  } else if (direction === 39) {
    moveSnakeFunc(1);
  } else if (direction === 37) {
    moveSnakeFunc(-1);
  }
}

const startGame = (e) => {
  if (!gameOver) {
    firstTimer && clearInterval(firstTimer);
    timer && clearInterval(timer);
    timer = setInterval(() => {
      moveSnake(e.keyCode);
    }, snakeSpeed);
  }
};
window.addEventListener("keydown", (e) => {
  if (countDown === 0) {
    if (!curDirection) {
      startGame(e);
    } else if (curDirection === 38 || curDirection === 40) {
      if (e.keyCode !== 38 && e.keyCode !== 40) {
        startGame(e);
      }
    } else if (curDirection === 37 || curDirection === 39) {
      if (e.keyCode !== 37 && e.keyCode !== 39) {
        startGame(e);
      }
    }
    curDirection = e.keyCode;
  }
});

function checkLoseGame() {
  const gameOverFunc = () => {
    gameOver = true;
    clearInterval(timer);
  };
  snakes.forEach((snake) => {
    if (
      snake.parentNode.querySelectorAll(".snake").length > 1 ||
      snake.parentNode.classList.contains("extra")
    ) {
      gameOverFunc();
    }
  });
  gameOver && lostGame();
}

function addFood() {
  snakes.push(makeSnake());
  snakes[0].parentNode.classList.remove("food");
  makeFood();
  snakes.length >= 6 && snakeSpeed > 100 ? (snakeSpeed -= 50) : null;
}

function lostGame() {
  let html;
  lostGameModal = document.createElement("div");
  lostGameModal.classList.add("lost");
  if (gameOver) {
    html = `<div>
    <h3>You Lost The Game</h3>
    <button>Play Again</button>
   </div>`;
  } else {
    html = `<div>
    <h3>Click to start</h3>
    <button>Start The Game</button>
   </div>`;
  }

  lostGameModal.innerHTML = html;
  container.appendChild(lostGameModal);
  playAgainFunc();
}

//start game again
function playAgainFunc() {
  const playAgainBtn = document.querySelector(".lost button");
  if (playAgainBtn && gameOver) {
    playAgainBtn.addEventListener("click", (e) => {
      lostGameModal.remove();
      gameInit();
      startCountDown();
    });
  } else if (playAgainBtn && !gameOver) {
    playAgainBtn.addEventListener("click", (e) => {
      startCountDown();
      lostGameModal.remove();
    });
  }
}
let countDownTimer;
function startCountDown() {
  count.textContent = countDown;
  setTimeout(() => {
    firstTimer = setInterval(() => {
      moveSnake(40);
    }, 1000);
  }, 3000);
  countDownTimer = setInterval(() => {
    countDown = countDown - 1;
    count.textContent = countDown;
    if (countDown === 0) {
      count.textContent = "";
      clearInterval(countDownTimer);
    }
  }, 1000);
}
