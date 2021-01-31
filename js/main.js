/*----- constants -----*/
const moves = {
  men: [9, 7],
  jump: [18, 14], 
  king: [9, 7, -9, -7],
  kingJump: [18, 14, -18, -14]
};

let myArr = [];
console.log(myArr.indexOf(1));


/*----- app's state (variables) -----*/
let board, turn, selPieceIdx, canJump, canMove, availJumps, availMoves;

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');

/*----- functions -----*/
init();

function init() {
  board = getBoard();
  turn = -1;
  selPieceIdx = 0;
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
      piece.setAttribute('king', 'true');
    }
    if (board[i] === 0) piece.setAttribute('color', '');
  }
  if (selPieceIdx !== 0) squares[selPieceIdx].firstChild.setAttribute('color', 'yellow');
}

function takeTurn() {
  console.log(board);
  turn *= -1;
  canJump = [];
  canMove = [];
  availJumps = [];
  availMoves = [];
  mustJump = false;
  getJump();
  if (board.indexOf('j') === -1) getMove();
}

function getJump() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    let jumps = checkJump(i, moves.men, moves.jump);
    if (
      Math.round(board[i]) === turn &&
      Number.isInteger(board[i]) &&
      jumps.length
    ) {
      canJump.push(i);
    }
  }
  console.log(canJump);
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
  console.log(canMove);
}

function selectPiece(evt) {
  let selPiece = evt.target;
  selPieceIdx = Number(selPiece.parentElement.getAttribute('tileNo'));
  if (
    canJump.indexOf(selPieceIdx) !== -1 ||
    canMove.indexOf(selPieceIdx) !== -1
  ) {
    resetStrings();
    render();
    setJump(selPieceIdx);
    if (canMove.length) setMove();
  }
  console.log(board);
}

function setMove() {
  availMoves = checkMove(selPieceIdx, moves.men);
  console.log(availMoves);
}

function setJump(idx) {
  availJumps = checkJump(idx, moves.men, moves.jump);
  if (availJumps) {
    mustJump = true;
  }
}

function selectDest(evt) {
  let selDest = evt.target;
  let newIdx = Number(selDest.getAttribute('tileNo'));
  if (
    availJumps.indexOf(newIdx) !== -1 ||
    availMoves.indexOf(newIdx) !== -1
  ) {
    console.log( `hitting selDest`);
    console.log(`${selPieceIdx} is moving to ${newIdx}`);
    board[selPieceIdx] = 0;
    board[newIdx] = turn;
    console.log(board)
    if (availJumps.length) {
      availJumps = [];
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

function isNonZero(num) {
  if (typeof(num) === 'number' && num !== 0) return true;
}

function getMoveType(oldIdx, newIdx) {
  if (moves.men.indexOf(Math.abs(oldIdx - newIdx)) !== -1) return true;
}

function endTurn(newIdx) {
  board[newIdx] = turn;
  selPieceIdx = 0;
  resetStrings();
  render();
  takeTurn();
}

function checkJump(idx, moveArr, jumpArr) {
  let jumps = [];
  for (l = 0; l < jumpArr.length; l++) {
    if (
      board[idx + turn * moveArr[l]] === turn * -1 &&
      board[idx + turn * jumpArr[l]] === 0
    ) {
      jumps.push(idx + turn * jumpArr[l])
    }
  return jumps;
  }
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