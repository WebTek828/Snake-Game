const board = document.querySelector(".board");
let snakeSpeed = 200;
let col = 0,
  row = 0,
  clearTimer,
  timer,
  gameOver = false;

while (row < 36) {
  if (col === 36) {
    col = 0;
    row += 1;
  } else {
    const div = document.createElement("div");
    div.className = `block ${row}-${col}`;
    board.appendChild(div);
    col += 1;
  }
}
const blocks = document.querySelectorAll(".block");

const arrBlocks = Array.from(blocks);
//snake
const div = document.createElement("div");
div.className = "snake";
arrBlocks[99].appendChild(div);

const snake = document.querySelector(".snake");

//food
function addFood() {
  const rn = Math.floor(Math.random() * arrBlocks.length);
  arrBlocks[rn].classList.add("food");
}

addFood();

const directionObj = {
  a: (index) => index - 1,
  d: (index) => index + 1,
  s: (index) => index + 36,
  w: (index) => index - 36,
};

function moveSnake(type) {
  const index = arrBlocks.indexOf(snake.parentNode);
  if (!gameOver) {
    arrBlocks.forEach((arrBlock) => (arrBlock.innerHTML = ""));
    arrBlocks[directionObj[type](index)].appendChild(div);
    const colRow = snake.parentNode.classList[1].split("-");
    if (snake.parentNode.classList.contains("food")) {
      snake.parentNode.classList.remove("food");
      addFood();
      // arrBlocks[directionObj[type](index) / 2].insertAdjacentHTML(
      //   "afterbegin",
      //   `<div class="snake"></div>`
      // );
      console.log(arrBlocks[directionObj[type](index)]);

      gameOver = true;
    }
    if (
      colRow[1] === "0" ||
      colRow[1] === "35" ||
      colRow[0] === "0" ||
      colRow[1] === "35"
    ) {
      gameOver = true;
      clearInterval(clearTimer || timer);
    }
  }
}
timer = setInterval(() => {
  moveSnake("a");
}, snakeSpeed);
let curDirection = "a";
window.addEventListener("keypress", (e) => {
  const func = () => {
    clearInterval(timer);
    clearTimer && clearInterval(clearTimer);
    clearTimer = setInterval(() => {
      moveSnake(e.key);
    }, snakeSpeed);
  };
  if (curDirection === "a" || curDirection === "d") {
    if (e.key !== "a" && e.key !== "d") {
      func();
    }
  } else if (curDirection === "w" || curDirection === "s") {
    if (e.key !== "w" && e.key !== "s") {
      func();
    }
  }
  curDirection = e.key;
});
