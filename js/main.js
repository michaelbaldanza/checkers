/*----- constants -----*/
const board = new Array(64);

const moves = {
  men: [9, 7],
  jump: [18, 15], 
  king: [9, 7, -9, -7] 
};

/*----- app's state (variables) -----*/
let turn;
let turnCounter = 0;
let currentPlayer;
let playMoves;
let playJump;

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');


init();

function init() {
  initState();
  initView();
  render();
  takeTurn();
}

function initState() {
  let boundary = 8;
  for (i = 0; i < board.length; i++) {
    // empty strings hold state for playable tiles, null for non-playable
    if (isOdd(boundary / 8)) {
      board[i] = isOdd(i) ? 0 : null;
    } else {
      board[i] = isOdd(i) ? null : 0;
    }
    if (i === boundary - 1) boundary += 8;
    // 1's represent red pieces, -1's white pieces
    if (i < 24 && board[i] !== null) board[i] = 1;
    if (i > 39 && board[i]!== null) board[i] = -1;
  }
  turn = -1;
}

function isOdd(num) {
  if (num % 2 !== 0) return true;
};

function initView() {
  for (i = 0; i < board.length; i++) {
    // create tiles
    let newSquare = document.createElement('div');
    newSquare.setAttribute('class', 'square');
    newSquare.setAttribute('tileNo', i.toString());
    if (Number.isInteger(board[i])) {
      newSquare.setAttribute('grey', 'true');
    } else {
      newSquare.setAttribute('grey', 'false');
    }
    if (board[i] === 1 || board[i] === -1) {
      let newPiece = document.createElement('div');
      newPiece.setAttribute('class', 'piece');
      // if (board[i] === 1) newPiece.setAttribute('red', 'true');
      // if (board[i] === -1) newPiece.setAttribute('red', 'false');
      // place each piece on its starting tile
      newSquare.appendChild(newPiece);
    }
    boardContainerEl.appendChild(newSquare);
  }
}

function render() {
  for (i = 0; i < board.length; i++) {
    if (board[i] === 1) {
      squares[i].firstChild.setAttribute('red', 'true');
    }
    if (board[i] === -1) {
      squares[i].firstChild.setAttribute('red', 'false');
    }
    if (board[i] === 's') {
      squares[i].firstChild.setAttribute('selected', '');
    }
  }
}

function takeTurn() {
  turnCounter += 1;
  currentPlayer = turnCounter % 2 !== 0 ? 1 : -1;
  turn *= -1;
  // console.log(turnCounter);
  // console.log(currentPlayer);
  // console.log(`This is the board at the beginning of a player's turn`);
  // console.log(board);
  getJump();
}

function getJump() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === turn) {
      console.log(`hitting first condition`);
      for (j = 0; j < 2; j++) {
        if (
          board[i] === turn &&
          board[i + turn * moves.men[j]] === turn * -1 &&
          board[i + turn * moves.jump[j]] === 0
          ) {
          console.log(`hitting jump`);
          squares[i].firstChild.addEventListener('click', selectPiece);
          board[i] = 'j';
          }
      }
      console.log(board.indexOf('j'));
      if (board.indexOf('j') !== -1) {
        return;
      } else {
        getMove();
      }
    }
  }
}

function getMove() {
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < 2; j++) {
      if (
        board[i] === turn && board[i + turn * moves.men[j]] === 0
      ) {
        console.log(`hitting move`);
        squares[i].firstChild.addEventListener('click', selectPiece);
        board[i] = 'm';
      }
    }
  }
}

function selectPiece(evt) {
  let selectedPiece = evt.target;
  selectedPiece.removeEventListener('click', selectPiece);
  board[selectedPiece.parentElement.getAttribute('tileNo')] = 's';
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm') {
      squares[i].firstChild.removeEventListener('click', selectPiece);
      board[i] = currentPlayer;
    }
  }
  render();
  setMove();
  setJump();
  // console.log(`This is the board after selectPiece`);
  // console.log(board);
}

function setMove() {
  let selPieceIdx = board.indexOf('s');
  for (j = 0; j < 2; j++) {
    if (
      board[selPieceIdx + turn * moves.men[j]] === 0
    ) {
      console.log(`hitting jump`);
      board[selPieceIdx + turn * moves.men[j]] = 'd';
      squares[selPieceIdx + turn * moves.men[j]].addEventListener('click', selectDestination)
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
      console.log(`hitting jump`);
      board[selPieceIdx + turn * moves.jump[j]] = 'd';
      squares[selPieceIdx + turn * moves.jump[j]].addEventListener('click', selectDestination)
    }
  }
}

function selectDestination(evt) {
  let selectedDestination = evt.target;
  let newIdx = Number(selectedDestination.getAttribute('tileNo'));
  let oldIdx = board.indexOf('s');
  console.log(`${currentPlayer} moves from ${oldIdx} to ${newIdx}`);
  let selectedPiece = squares[oldIdx].firstChild;
  // move piece
  selectedDestination.appendChild(selectedPiece);
  selectedPiece.removeAttribute('selected');
  // 
  selectedDestination.removeEventListener('click', selectDestination);
  board[oldIdx] = 0;
  board[newIdx] = currentPlayer;
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'd') {
      squares[i].removeEventListener('click', selectDestination);
      board[i] = 0;
    }
  }
  takeTurn();
}