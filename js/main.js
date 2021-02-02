/*----- constants -----*/
const moves = {
  men: [9, 7],
  jump: [18, 14], 
  king: [9, 7, -9, -7],
  kingJump: [18, 14, -18, -14]
};

/*----- app's state (variables) -----*/
let board, turn, selPieceIdx, canJump, canMove, availJumps, availQuarries, availMoves;

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');

/*----- functions -----*/
init();

function init() {
  turn = -1;
  selPieceIdx = 0;
  board = getBoard();
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
      newSquare.addEventListener('click', selectDest);
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
    if (Math.round(board[i]) === 1) piece.setAttribute('color', 'red');
    if (Math.round(board[i]) === -1) piece.setAttribute('color', 'white');
    if (!Number.isInteger(board[i]) && typeof(board[i]) === 'number') {
      // piece.setAttribute('king', 'true');
      piece.textContent = 'KING';
    }
    if (board[i] === 0) piece.setAttribute('color', '');
  }
  if (selPieceIdx !== 0) {
    squares[selPieceIdx].firstChild.setAttribute('color', 'yellow');
  }
}

function takeTurn() {
  turn *= -1;
  canJump = [];
  canMove = [];
  availJumps = [];
  availQuarries = [];
  availMoves = [];
  getJump();
  if (!canJump.length) getMove();
}

function getJump() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    let jumps = checkJump(i, moves.men, moves.jump);
    if (
      Math.round(board[i]) === turn &&
      Number.isInteger(board[i]) &&
      jumps[0].length
    ) {
      canJump.push(i);
    }
  }
}

function getMove() {
  for (i = 0; i < board.length; i++) {
    if (
      Math.round(board[i]) === turn &&
      Number.isInteger(board[i]) &&
      checkMove(i, moves.men)
    ) {
      canMove.push(i);
    }
  }
}

function selectPiece(evt) {
  let selPiece = evt.target;
  selPieceIdx = Number(selPiece.parentElement.getAttribute('tileNo'));
  if (
    canJump.indexOf(selPieceIdx) !== -1 ||
    canMove.indexOf(selPieceIdx) !== -1
  ) {
    render();
    setJump(selPieceIdx);
    if (canMove.length) setMove();
  }
}

function setMove() {
  availMoves = checkMove(selPieceIdx, moves.men);
}

function setJump(idx) {
  availJumps = checkJump(idx, moves.men, moves.jump)[0];
  availQuarries = checkJump(idx, moves.men, moves.jump)[1];
}

function selectDest(evt) {
  let selDest = evt.target;
  let newIdx = Number(selDest.getAttribute('tileNo'));
  if (
    availJumps.indexOf(newIdx) !== -1 ||
    availMoves.indexOf(newIdx) !== -1
  ) {
    board[selPieceIdx] = 0;
    board[newIdx] = turn;
    if (availJumps.length) {
      board[availQuarries[availJumps.indexOf(newIdx)]] = 0;
      availJumps = [];
      availQuarries = [];
      setJump(newIdx);
      if (availJumps.length) {
        selPieceIdx = newIdx;
        render();
        return;
      } else {
        endTurn(newIdx);
      }
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

function isOdd(num) {
  if (num % 2 !== 0) return true;
};

function endTurn(newIdx) {
  selPieceIdx = 0;
  kingMaker(newIdx);
  render();
  console.log(board);
  takeTurn();
}

function checkJump(idx, moveArr, jumpArr) {
  let dests = [], quarries = [], jumps = [dests, quarries];
  for (l = 0; l < jumpArr.length; l++) {
    if (
      board[idx + turn * moveArr[l]] === turn * -1 &&
      board[idx + turn * jumpArr[l]] === 0
    ) {
      dests.push(idx + turn * jumpArr[l])
      quarries.push(idx + turn * moveArr[l]);
    }
  }
  return jumps;
}

function checkMove(idx, moveArr) {
  let regMoves = [];
  for (l = 0; l < moveArr.length; l++) {
    if (board[idx + turn * moveArr[l]] === 0) {
      regMoves.push(idx + turn * moveArr[l]);
    }
  }
  if (regMoves.length) return regMoves;
}

function kingMaker(idx) {
  let crownhead = [1, 3, 5, 7, 56, 58, 60, 62];
  if (crownhead.indexOf(idx) === -1) {
    return;
  } else {
    board[idx] = board[idx] + 0.1 * turn;
  }
}