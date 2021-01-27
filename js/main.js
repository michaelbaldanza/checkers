/*----- constants -----*/
const moves = {
  men: [9, 7],
  jump: [18, 14], 
  king: [9, 7, -9, -7],
  kingJump: [18, 14, -18, -14]
};

/*----- app's state (variables) -----*/
let board, turn, canJump;

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');

/*----- functions -----*/
init();

function init() {
  board = getBoard();
  turn = -1;
  initView();
  render();
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
      newSquare.addEventListener('click', selectMove);
      let newPiece = document.createElement('div');
      newPiece.addEventListener('click', selectPiece);
      newSquare.appendChild(newPiece);
    } else {
      newSquare.setAttribute('grey', 'false');
    }
    boardContainerEl.appendChild(newSquare);
  }
}

function render() {
  for (i = 0; i < board.length; i++) {
    let piece = squares[i].firstChild
    if (board[i] === 's') piece.setAttribute('color', 'yellow');
    if (Math.round(board[i]) === 1) piece.setAttribute('color', 'red');
    if (Math.round(board[i]) === -1) piece.setAttribute('color', 'white');
    if (!Number.isInteger(board[i]) && isNum(board[i])) {
      piece.setAttribute('king', 'true');
    }
    if (board[i] === 0) piece.setAttribute('color', '');
  }
}

function takeTurn() {
  turn *= -1;
  canJump = false;
  getJump();
  if (board.indexOf('j') === -1) getMove();
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
  board[sqIdx] = 's';
  resetStrings();
  render();
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
      canJump = true;
    }
  }
}

function selectMove(evt) {
  let selDest = evt.target;
  let newIdx = Number(selDest.getAttribute('tileNo'));
  if (board[newIdx] !== 'd') return;
  let oldIdx = board.indexOf('s');
  board[oldIdx] = 0;
  if (getMoveType(oldIdx, newIdx)) {
    endTurn(newIdx);
  } else {
    board[newIdx] = 's';
    resetStrings();
    render();
    canJump = false;
    setJump();
    if (canJump) {
      return;
    } else {
      endTurn(newIdx);
    }
  }
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

function resetStrings() {
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm' || board[i] === 'j') board[i] = turn;
    if (board[i] === 'd' || board[i] === 'q') board[i] = 0;
  }
}

function isOdd(num) {
  if (num % 2 !== 0) return true;
};

function isNeg1(num) {
  if (num === -1) return true;
}

function isNum(num) {
  if (typeof(num) === 'num') return true;
}

function isNonZero(num) {
  if (typeof(num) === 'number' && num !== 0) return true;
}

function getMoveType(oldIdx, newIdx) {
  let moveOrJump;
  if (moves.men.indexOf(oldIdx + newIdx * turn) !== -1) moveOrJump = true;
  if (moves.jump.indexOf(oldIdx + newIdx * turn) !== -1) moveOrJump = false;
  return moveOrJump;
}

function endTurn(newIdx) {
  board[newIdx] = turn;
  resetStrings();
  render();
  takeTurn();
}