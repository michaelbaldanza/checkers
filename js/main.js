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

let turnCounter = 0;
let currentPlayer;

const boardContainerEl = document.getElementById('board-container');

init();

function init() {
  initBoardState();
  initPieceState();
  setupBoardView();
  takeTurn();
}

function initBoardState() {
  for (i = 0; i < board.length; i++) {
    // empty strings hold state for playable tiles, null for non-playable
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
}

function initPieceState() {
  for (i = 0; i < board.length; i++) {
    // 'r' indicates starting position of red; 'w' starting position of white
    if (i < 24 && board[i] !== null) {
      board[i] = 'r';
    }
    if (i > 39 && board[i]!== null) {
      board[i] = 'w';
    }
  }
}

function setupBoardView() {
  for (i = 0; i < board.length; i++) {
    // create tiles
    let newSquare = document.createElement('div');
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('tileNo', i.toString());
    if (board[i] !== null) {
      newSquare.setAttribute('grey', 'true');
    } else {
      newSquare.setAttribute('grey', 'false');
    }
    // create pieces
    if (board[i] === 'r' || board[i] === 'w') {
      let newPiece = document.createElement('div');
      newPiece.setAttribute('class', 'piece');
      if (board[i] === 'r') {
        newPiece.setAttribute('red', 'true');
      }
      if (board[i] === 'w') {
        newPiece.setAttribute('red', 'false');
      }
      // place each piece on its starting tile
      newSquare.appendChild(newPiece);
    }
    // lay the tiles on the board
    boardContainerEl.appendChild(newSquare);
    // add the tiles to an array for ease of 'moving' pieces
    boardEls.push(newSquare);
  }
}

function takeTurn() {
  turnCounter += 1;
  currentPlayer = turnCounter % 2 !== 0 ? 'r' : 'w';
  console.log(turnCounter);
  console.log(currentPlayer);
  determineMovement();
}

function determineMovement() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === currentPlayer) {
      // toggle the red pieces that can make a valid move
      if (currentPlayer === 'r') {
        if (board[i + moves.men[0]] === '' || board[i + moves.men[1]] === '') {
          boardEls[i].firstChild.addEventListener('click', selectPiece);
          board[i] = 'm';
        }   
      }
      // toggle the white pieces that can make a valid move
      if (currentPlayer === 'w') {
        if (board[i - moves.men[0]] === '' || board[i - moves.men[1]] === '') {
          boardEls[i].firstChild.addEventListener('click', selectPiece);
          board[i] = 'm';
        }
      }
    }
  }
}

function selectPiece(evt) {
  let selectedPiece = evt.target;
  selectedPiece.setAttribute('selected', '');
  let pieceId = selectedPiece.parentElement.getAttribute('tileNo');
  board[pieceId] = 's';
  selectedPiece.removeEventListener('click', selectPiece);
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm') {
      boardEls[i].firstChild.removeEventListener('click', selectPiece);
      board[i] = currentPlayer;
    }
    if (board[i] === 's') {
      if (currentPlayer === 'r') {
        board[i + moves.men[0]] = 'd';
        board[i + moves.men[1]] = 'd';
        boardEls[i + moves.men[0]].addEventListener('click', selectDestination);
        boardEls[i + moves.men[1]].addEventListener('click', selectDestination);
      }
      if (currentPlayer === 'w') {
        board[i - moves.men[0]] = 'd';
        board[i - moves.men[1]] = 'd';
        boardEls[i - moves.men[0]].addEventListener('click', selectDestination);
        boardEls[i - moves.men[1]].addEventListener('click', selectDestination);
      }
    }
  }
  console.log(board);
}

function selectDestination(evt) {
  let selectedDestination = evt.target;
  let newIdx = parseInt(selectedDestination.getAttribute('tileNo'));
  let oldIdx = board.indexOf('s');
  let selectedPiece = boardEls[oldIdx].firstChild;
  // move piece
  selectedDestination.appendChild(selectedPiece);
  selectedPiece.removeAttribute('selected');
  // 
  selectedDestination.removeEventListener('click', selectDestination);
  board[oldIdx] = '';
  board[newIdx] = currentPlayer;
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'd') {
      boardEls[i].removeEventListener('click', selectDestination);
      board[i] = '';
    }
  }
  takeTurn();
}