/*----- constants -----*/
const board = new Array(64);

const moves = {
  men: [9, 7],
  king: [9, 7, -9, -7,] 
};

/*----- app's state (variables) -----*/
let moveablePieces = [];
let possibleMoves = [];

let boardEls = [];
let pieceEls = [];

let turnCounter = 1;
let currentPlayer = turnCounter % 2 !== 0 ? 'r' : 'w';

const boardContainerEl = document.getElementById('board-container');

init();

function init() {
  initBoardState();
  initPieceState();
  setupBoardView();
  setupPieceView();
  startGame();
}

function initBoardState() {
  for (i = 0; i < board.length; i++) {
    // separate elements based on whether they are playable (empty strings) or
    // non-playable (null)
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
    // add text to elements that represent starting positions of red and black
    if (i < 24 && board[i] !== null) {
      board[i] = 'r';
    }
    if (i > 39 && board[i]!== null) {
      board[i] = 'w';
    }
  }
  console.log(board);
}

function setupBoardView() {
  for (i = 0; i < board.length; i++) {
    // create tiles of the board
    let newSquare = document.createElement('div');
    // add attributes for CSS
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('tileNo', i.toString());
    if (board[i] !== null) {
      newSquare.setAttribute('grey', 'true');
    } else {
      newSquare.setAttribute('grey', 'false');
    }
    // lay the tiles on the board
    boardContainerEl.appendChild(newSquare);
    // add the tiles to an array for ease of 'moving' pieces
    boardEls.push(newSquare);
  }
}

function setupPieceView() {
  for (i = 0; i < board.length; i++) {
    // create pieces
    let newPiece = document.createElement('div');
    // add identifying attribute
    newPiece.setAttribute('class', 'piece');
    newPiece.setAttribute('tileNo', i.toString());
    if (board[i] === 'r') {
      // red tiles
      newPiece.setAttribute('red', 'true');
      boardEls[i].appendChild(newPiece);
      pieceEls.push(newPiece);
    } else if (board[i] === 'w') {
      // black tiles
      newPiece.setAttribute('class', 'piece');
      newPiece.setAttribute('red', 'false');
      boardEls[i].appendChild(newPiece);
      pieceEls.push(newPiece)
    } else {
      // add null elements so that pieceEls tracks board
      let emptyTile = null;
      pieceEls.push(emptyTile);
    }
  }
}

function startGame() {
  determineMovement();
}

function determineMovement() {
  // determine what pieces can move
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === currentPlayer) {
      // toggle the red pieces that can make a valid move
      if (currentPlayer === 'r') {
        if (board[i + moves.men[0]] === '' || board[i + moves.men[1]] === '') {
          pieceEls[i].addEventListener('click', selectPiece);
          board[i] = 'm';
        }   
      }
      // toggle the white pieces that can make a valid move
      if (currentPlayer === 'w') {
        if (board[i - moves.men[0]] === '' || board[i - moves.men[1]] === '') {
          pieceEls[i].addEventListener('click', selectPiece);
          board[i] = 'm';
        }
      }
    }
  }
}

function selectPiece(evt) {
  let pieceId = evt.target.getAttribute('tileNo');
  board[pieceId] = 's';
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm') {
      pieceEls[i].removeEventListener('click', selectPiece);
      board[i] = currentPlayer;
    }
    if (currentPlayer === 'r') {
      if (board[i] === 's') {
        board[i + moves.men[0]] = 'd';
        board[i + moves.men[1]] = 'd';
      }
    }
    if (currentPlayer === 'w') {
      if (board[i] === 's') {
        board[i - moves.men[0]] = 'd';
        board[i - moves.men[1]] = 'd';
      }
    }
    if (board[i] === 'd') {
      boardEls[i].addEventListener('click', selectDestination);
    }
  }
  console.log(pieceEls);
}

function selectDestination(evt) {
  alert(`${evt.target.getAttribute('tileNo')} has been selected!`);
  console.log(board.indexOf('s'));
  evt.target.appendChild(pieceEls[board.indexOf('s')]);
  for (i = 0; i < board.length; i++) {

  }
}