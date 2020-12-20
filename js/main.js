let board = new Array(64);

let currentPlayer = '';

let prevPlayer = '';

let turn = 0;

let winner = '';

let boardEls = [];

const boardContainerEl = document.getElementById("board-container");

const testEl = document.getElementById("test");

init();

function init() {
  initBoardState();
  initPieceState();
  setupBoard();
}

function initBoardState() {
  for (i = 0; i < board.length; i++) {
    if (
      i < 8 ||
      i > 15 && i < 24 ||
      i > 31 && i < 40 ||
      i > 47 && i < 56
    ) {
      if (i % 2 !== 0) {
        board[i] = '';
      } else {
        board[i] = null;
      }
    } else {
      if (i % 2 === 0) {
        board[i] = ''
      } else {
        board[i] = null;
      }
    }
  }
  console.log(board);
}

function initPieceState() {
  for (i = 0; i < board.length; i++) {
    if (i < 24 && board[i] !== null) {
      board[i] = 'X';
    }
    if (i > 32 && board[i]!== null) {
      board[i] = 'O';
    }
  }
  console.log(board);
}

function setupBoard() {
  for (i = 0; i < board.length; i++) {
      // create the tiles of the board
      let newSquare = document.createElement("div");
      newSquare.setAttribute("class", "square");
      // set the tiles' colour
      if (board[i] !== null) {
        newSquare.setAttribute("black", "true");
      } else {
        newSquare.setAttribute("black", "false");
      }
      // set up the pieces
      if (board[i] === 'X') {
        newSquare.textContent === 'X';
      }
      if (board[i] === 'O') {
        newSquare.textContent === 'O';
      }
      // add event listeners
      if (board[i] === 'X' || board[i] === 'O') {

      }
    boardContainerEl.appendChild(newSquare);
    boardEls.push(newSquare);
  }
}