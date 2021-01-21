/*----- constants -----*/
const moves = {
  men: [9, 7],
  jump: [18, 14], 
  king: [9, 7, -9, -7] 
};

if (-1) {
  console.log(`it's true`)
} else {
  console.log(`it's false`)
}

/*----- app's state (variables) -----*/
let board, turn, turnCounter, currentPlayer, playMoves, playJump;

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');

/*----- functions -----*/
init();

function init() {
  board = getBoard();
  turn = -1;
  turnCounter = 0;
  initView();
  // render();
  takeTurn();
}

function initView() {
  for (i = 0; i < board.length; i++) {
    // create tiles
    let newSquare = document.createElement('div');
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('tileNo', i.toString());
    if (Number.isInteger(board[i])) {
      newSquare.setAttribute('grey', 'true');
      newSquare.addEventListener('click', selectDest);
    } else {
      newSquare.setAttribute('grey', 'false');
    }
    if (board[i] === 1 || board[i] === -1) {
      let newPiece = document.createElement('div');
      newPiece.setAttribute('class', 'piece');
      newPiece.addEventListener('click', selectPiece);
      if (board[i] === 1) newPiece.setAttribute('red', 'true');
      if (board[i] === -1) newPiece.setAttribute('red', 'false');
      // place each piece on its starting tile
      newSquare.appendChild(newPiece);
    }
    boardContainerEl.appendChild(newSquare);
  }
}

function render() {
  for (i = 0; i < board.length; i++) {
    if (board[i] === 's') {
      squares[i].firstChild.setAttribute('selected', '');
    }
  }
}

function takeTurn() {
  turnCounter += 1;
  currentPlayer = turnCounter % 2 !== 0 ? 1 : -1;
  turn *= -1;
  getJump();
}

function getJump() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === turn) {
      for (j = 0; j < 2; j++) {
        if (
          board[i] === turn &&
          board[i + turn * moves.men[j]] === turn * -1 &&
          board[i + turn * moves.jump[j]] === 0
          ) {
          board[i] = 'j';
        }
      }
    }
  }
  if (board.indexOf('j') !== -1) {
    return;
  } else {
    getMove();
  }
}

function getMove() {
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < 2; j++) {
      if (board[i] === turn && board[i + turn * moves.men[j]] === 0) {
        board[i] = 'm';
      }
    }
  }
}

function selectPiece(evt) {
  let selPiece = evt.target;
  let sqIdx = Number(selPiece.parentElement.getAttribute('tileNo'));
  if (typeof(board[sqIdx]) !== 'string') return;
  selPiece.setAttribute('selected', '');
  board[selPiece.parentElement.getAttribute('tileNo')] = 's';
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm') {
      board[i] = currentPlayer;
    }
  }
  // render();
  setMove();
  setJump();
}

function setMove() {
  let selPieceIdx = board.indexOf('s');
  for (j = 0; j < 2; j++) {
    if (board[selPieceIdx + turn * moves.men[j]] === 0) {
      board[selPieceIdx + turn * moves.men[j]] = 'd';
    }
  }
}

function setJump() {
  let selPieceIdx = board.indexOf('s');
  for (j = 0; j < 2; j++) {
    if (
      board[selPieceIdx + turn * moves.men[j]] === turn * -1 &&
      board[selPieceIdx + turn * moves.jump[j]] === 0
    ) {
      board[selPieceIdx + turn * moves.men[j]] = 'q';
      board[selPieceIdx + turn * moves.jump[j]] = 'd';
    }
  }
}

function selectDest(evt) {
  console.log(board);
  let selDest = evt.target;
  let newIdx = Number(selDest.getAttribute('tileNo'));
  console.log(board.indexOf('q'));
  if (board[newIdx] !== 'd') return;
  let oldIdx = board.indexOf('s');
  let selPiece = squares[oldIdx].firstChild;
  // move piece
  selDest.appendChild(selPiece);
  selPiece.removeAttribute('selected');
  let qIdx = board.indexOf('q');
  if (qIdx !== -1) {
    squares[qIdx].firstChild.remove();
    board[qIdx] = 0;
  }
  // 
  board[oldIdx] = 0;
  board[newIdx] = currentPlayer;
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'd') {
      board[i] = 0;
    }
  }
  console.log(board);
  takeTurn();
}

function getBoard() {
  const game = new Array(64);
  let boundary = 8;
  for (i = 0; i < game.length; i++) {
    // empty strings hold state for playable tiles, null for non-playable
    if (isOdd(boundary / 8)) {
      game[i] = isOdd(i) ? 0 : null;
    } else {
      game[i] = isOdd(i) ? null : 0;
    }
    if (i === boundary - 1) boundary += 8;
    // 1's represent red pieces, -1's white pieces
    if (i < 24 && game[i] !== null) game[i] = 1;
    if (i > 39 && game[i]!== null) game[i] = -1;
  }
  return game;
}

function isOdd(num) {
  if (num % 2 !== 0) return true;
};