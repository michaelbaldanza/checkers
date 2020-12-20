console.log("hello");

let board = new Array(64);
let boardEls = [];

const boardContainerEl = document.getElementById("board-container");

const testEl = document.getElementById("test");

init();

function init() {
  setupBoard();
}

function setupBoard() {
  for (i = 1; i <= board.length; i++) {
    // create the tiles of the board
    let newSquare = document.createElement("div");
    newSquare.setAttribute("class", "square");
    if (i <= 8 ||
        i >= 17 && i <= 24 ||
        i >= 33 && i <= 40 ||
        i >= 49 && i <= 56) {
      if (i % 2 !== 0) {
      newSquare.setAttribute("black", "false");
      } else {
        newSquare.setAttribute("black", "true");
      }
    } else {
      if (i % 2 === 0) {
        newSquare.setAttribute("black", "false");
      } else {
        newSquare.setAttribute("black", "true");
      }
    }
    newSquare.textContent = "";
    boardContainerEl.appendChild(newSquare);
    boardEls.push(newSquare);
  }
}
