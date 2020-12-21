let board = new Array(64);

let redPieces = 0;
let blackPieces = 0;

let boardEls = [];
let redPieceEls = [];
let blackPieceEls = [];

const boardContainerEl = document.getElementById('board-container');

const testEl = document.getElementById('test');

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
      board[i] = 'r';
      redPieces++;
    }
    if (i > 39 && board[i]!== null) {
      board[i] = 'b';
      blackPieces++;
    }
  }
  console.log(board);
  console.log(`Red has ${redPieces} on the board`);
  console.log(`Black has ${blackPieces} on the board`)
}

function setupBoard() {
  for (i = 0; i < board.length; i++) {
    // create the tiles of the board
    let newSquare = document.createElement('div');
    let newSquareId = i.toString();
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('id', newSquareId);
    // set the tiles' colour
    if (board[i] !== null) {
      newSquare.setAttribute('black', 'true');
    } else {
      newSquare.setAttribute('black', 'false');
    }
    // set up the pieces
    if (board[i] === 'r') {
      let newRedPiece = document.createElement('div');
      newRedPiece.setAttribute('class', 'piece');
      newRedPiece.setAttribute('red', 'true');
      newSquare.appendChild(newRedPiece);
      redPieceEls.push(newRedPiece);
    }
    if (board[i] === 'b') {
      let newBlackPiece = document.createElement('div');
      newBlackPiece.setAttribute('class', 'piece');
      newBlackPiece.setAttribute('red', 'false');
      newSquare.appendChild(newBlackPiece);
      blackPieceEls.push(newBlackPiece);
    }
    boardContainerEl.appendChild(newSquare);
    boardEls.push(newSquare);
  }
  
}