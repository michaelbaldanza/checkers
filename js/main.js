let board = new Array(64);

let redPieces = 0;
let blackPieces = 0;

let boardEls = [];
let redPieceEls = [];
let blackPieceEls = [];
let pieceEls = [];

let turnCounter = 1;
let currentPlayer = turnCounter % 2 !== 0 ? 'b' : 'r';

const boardContainerEl = document.getElementById('board-container');

const testEl = document.getElementById('test');

init();

function init() {
  initBoardState();
  initPieceState();
  setupBoard();
  startGame();
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
    let newTileNo = i.toString();
    // add tracking attributes
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('tileNo', newTileNo);
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
      newRedPiece.setAttribute('tileNo', newTileNo);
      newSquare.appendChild(newRedPiece);
      redPieceEls.push(newRedPiece);
      pieceEls.push(newRedPiece);
    }
    if (board[i] === 'b') {
      let newBlackPiece = document.createElement('div');
      newBlackPiece.setAttribute('class', 'piece');
      newBlackPiece.setAttribute('red', 'false');
      newBlackPiece.setAttribute('tileNo', newTileNo);
      newSquare.appendChild(newBlackPiece);
      blackPieceEls.push(newBlackPiece);
      pieceEls.push(newBlackPiece);
    }
    boardContainerEl.appendChild(newSquare);
    boardEls.push(newSquare);
  }
  console.log(`The board view is manifested by ${boardEls}`);
}

function startGame() {
  takeTurn();
}

function takeTurn() {
  // determine what pieces can move
  let moveablePieces = [];
  console.log(`The current player is ${currentPlayer}`)
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === currentPlayer) {
      // select the piece that can make valid move
      if (
        board[i - 9] === '' ||
        board[i - 7] === '' ||
        board[i + 7] === '' ||
        board[i + 9] === ''
      ) { 
        // change the model to reflect that the piece is allowed to be moved
        moveablePieces.push(i);
        board[i] = 'm';
      }
    }
  }
  moveablePieces.forEach(function(piece) {
    console.log(`The tile at ${piece} contains ${board[piece]}`);
  });
  console.log(`${moveablePieces} are moveable pieces.`);
  // add event listeners to the moveable pieces
  // for (i = 0; i < board.length; i++) {
  //   if (board)
  // }
}