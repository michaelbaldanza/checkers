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

/*----- cached element references -----*/
const boardContainerEl = document.getElementById('board-container');
const squares = document.getElementsByClassName('square');


init();

function init() {
  initState();
  setupBoardView();
  takeTurn();
}

function initState() {
  let boundary = 8;
  for (i = 0; i < board.length; i++) {
    // empty strings hold state for playable tiles, null for non-playable
    if (isOdd(boundary / 8)) {
      board[i] = isOdd(i) ? '' : null;
    } else {
      board[i] = isOdd(i) ? null : '';
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
    if (board[i] === 1 || board[i] === -1) {
      let newPiece = document.createElement('div');
      newPiece.setAttribute('class', 'piece');
      if (board[i] === 1) newPiece.setAttribute('red', 'true');
      if (board[i] === -1) newPiece.setAttribute('red', 'false');
      // place each piece on its starting tile
      newSquare.appendChild(newPiece);
    }
    // lay the tiles on the board
    boardContainerEl.appendChild(newSquare);
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
  determineMoveablePieces();
}

function determineMoveablePieces() {
  for (i = 0; i < board.length; i++) {
    // select the indices modeling the current player's pieces
    if (board[i] === turn) {
      // check which pieces can make a valid move
        moves.men.forEach(function (move, idx) {
          if (
            board[i + turn * move] === '' ||
            board[i + turn * move] === turn * -1 &&
            board[i + turn * moves.jump[idx]] === ''
          ) {
          squares[i].firstChild.addEventListener('click', selectPiece);
          board[i] = 'm';
          }
        })
    }
  }
  // console.log(`This is the board after running determineMoveablePieces`);
  // console.log(board);
}

function selectPiece(evt) {
  let selectedPiece = evt.target;
  selectedPiece.setAttribute('selected', '');
  selectedPiece.removeEventListener('click', selectPiece);
  board[selectedPiece.parentElement.getAttribute('tileNo')] = 's';
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'm') {
      squares[i].firstChild.removeEventListener('click', selectPiece);
      board[i] = currentPlayer;
    }
  }
  determineMoves();
  determineJump();
  console.log(`This is the board after selectPiece`);
  console.log(board);
}

function determineMoves() {
  for (i = 0; i < board.length; i++) {
    let redMove1 = i + moves.men[0];
    let redMove2 = i + moves.men[1];
    let whiteMove1 = i - moves.men[0];
    let whiteMove2 = i - moves.men[1];
    if (board[i] === 's') {
      if (currentPlayer === 1) {
        if (board[redMove1] === '') {
          board[redMove1] = 'd';
          squares[redMove1].addEventListener('click', selectDestination);
        }
        if (board[redMove2] === '') {
          board[redMove2] === 'd';
          squares[redMove2].addEventListener('click', selectDestination);
        }
      }
      if (currentPlayer === -1) {
        if(board[whiteMove1] === '') {
          board[whiteMove1] = 'd';
          squares[whiteMove1].addEventListener('click', selectDestination);
        }
        if(board[whiteMove2] === '') {
          board[whiteMove2] = 'd';
          squares[whiteMove2].addEventListener('click', selectDestination);
        }
      }
    }
  }
}

function determineJump() {
  let selPieceIdx = board.indexOf('s');
  let typMov = moves.men;
  let counter = 0;
  moves.jump.forEach(function (j) {
    if (currentPlayer === 1) {
      if (
        board[selPieceIdx + j] === '' &&
        board[selPieceIdx + typMov[counter]] === -1
        ) {
        squares[selPieceIdx + j].addEventListener('click', selectDestination);
      }
      console.log(`Red can move fromselPieceIdx + j`);
    }
    if (currentPlayer === -1) {
      if (
        board[selPieceIdx - j] === '' &&
        board[selPieceIdx - typMov[counter]] === 1
        ) {
        squares[selPieceIdx + j].addEventListener('click', selectDestination);
      }
    }
    counter ++;
  });
}

function selectDestination(evt) {
  let selectedDestination = evt.target;
  let newIdx = parseInt(selectedDestination.getAttribute('tileNo'));
  let oldIdx = board.indexOf('s');
  console.log(`${currentPlayer} moves from ${oldIdx} to ${newIdx}`);
  let selectedPiece = squares[oldIdx].firstChild;
  // move piece
  selectedDestination.appendChild(selectedPiece);
  selectedPiece.removeAttribute('selected');
  // 
  selectedDestination.removeEventListener('click', selectDestination);
  board[oldIdx] = '';
  board[newIdx] = currentPlayer;
  for (i = 0; i < board.length; i++) {
    if (board[i] === 'd') {
      squares[i].removeEventListener('click', selectDestination);
      board[i] = '';
    }
  }
  takeTurn();
}