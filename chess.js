//some global variables
let boardData;
const WHITE_PLAYER = 'white';
const DARK_PLAYER = 'dark';
let table;
const CHESS_BOARD_ID = 'chess-board';
let selectedPiece;

function popUp() {
  let pop = document.createElement("p");
  const node = document.createTextNode( boardData.currentTurn.charAt(0).toUpperCase() + boardData.currentTurn.slice(1)+ " Player Win!");
  pop.appendChild(node);
  table.appendChild(pop);
  pop.className = 'popMessage';
}


// check if x is in the array (boolean)
function isExist(x, arr) {
  for (let find of arr)
    if (find === x)
      return true;
  return false;
}

// add the images of the pieces
function addImage(cell, player, name) {
  const image = document.createElement('img');
  image.src = 'images/' + player + '/' + name + '.png';
  image.draggable = false;
  cell.appendChild(image);
  image.className = 'img1';
}

function showMovesForPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('possible-move');
      table.rows[i].cells[j].classList.remove('selected');
    }
  }

  // Show possible moves
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined) {
    let possibleMoves = piece.getPossibleMoves(boardData);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add('possible-move');
    }
  }

  table.rows[row].cells[col].classList.add('selected');
  selectedPiece = piece;
}


// what happen when click on cell
function onCellClick(event, row, col) {
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.

  if (selectedPiece === undefined) {
    showMovesForPiece(row, col);
  } else {
    if (tryMove(selectedPiece, row, col)) {
      selectedPiece = undefined;
      // Recreate whole board - this is not efficient, but doesn't affect user experience
      chessBoard(boardData);
    } else {
      showMovesForPiece(row, col);
    }
  }
}

// Tries to actually make a move. Returns true if successful.
function tryMove(piece, row, col) {

  const possibleMoves = piece.getPossibleMoves(boardData);
  // possibleMoves looks like this: [[1,2], [3,2]]
  for (const possibleMove of possibleMoves) {
    // possibleMove looks like this: [1,2]

    if (possibleMove[0] === row && possibleMove[1] === col) {
      // There is a legal move
      if (boardData.getPiece(row, col) === "king")
        win = true;
      boardData.removePiece(row, col);
      piece.row = row;
      piece.col = col;
      boardData.opposite();
      return true;
    }
  }
  return false;
}


// set the board in the initial pose
function getInitialBoard() {
  let result = [];
  result.push(new Piece(0, 0, "rook", WHITE_PLAYER));
  result.push(new Piece(0, 1, "knight", WHITE_PLAYER));
  result.push(new Piece(0, 2, "bishop", WHITE_PLAYER));
  result.push(new Piece(0, 3, "queen", WHITE_PLAYER));
  result.push(new Piece(0, 4, "king", WHITE_PLAYER));
  result.push(new Piece(0, 5, "bishop", WHITE_PLAYER));
  result.push(new Piece(0, 6, "knight", WHITE_PLAYER));
  result.push(new Piece(0, 7, "rook", WHITE_PLAYER));
  result.push(new Piece(7, 0, "rook", DARK_PLAYER));
  result.push(new Piece(7, 1, "knight", DARK_PLAYER));
  result.push(new Piece(7, 2, "bishop", DARK_PLAYER));
  result.push(new Piece(7, 3, "queen", DARK_PLAYER));
  result.push(new Piece(7, 4, "king", DARK_PLAYER));
  result.push(new Piece(7, 5, "bishop", DARK_PLAYER));
  result.push(new Piece(7, 6, "knight", DARK_PLAYER));
  result.push(new Piece(7, 7, "rook", DARK_PLAYER));
  for (let i = 0; i <= 7; i++) {
    result.push(new Piece(1, i, "pawn", WHITE_PLAYER));
    result.push(new Piece(6, i, "pawn", DARK_PLAYER));
  }
  return result;
}

function initGame() {
  // Create list of pieces (32 total)
  boardData = new BoardData(getInitialBoard());
  chessBoard(boardData);
}

// create the board in html and call the events of the elements
function chessBoard(boardData) {
  table = document.getElementById(CHESS_BOARD_ID);
  if (table !== null) {
    table.remove();
  }
  table = document.createElement("table");
  table.id = CHESS_BOARD_ID;
  document.body.appendChild(table);
  table.className = 'table';
  let tb = document.createElement("tbody");
  table.appendChild(tb);
  for (let i = 0; i < 8; i++) {
    let tr = document.createElement("tr");
    tb.appendChild(tr);
    for (let j = 0; j < 8; j++) {
      let td = document.createElement("td");
      tr.appendChild(td);
      if ((j % 2 == 1 && i % 2 == 1) || (j % 2 == 0 && i % 2 == 0))
        td.className = 'white';
      else
        td.className = 'black';


      td.addEventListener('click', (event) => onCellClick(event, i, j));

    }
  }


  for (let piece of boardData.pieces) {
    addImage(table.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }

  if (boardData.win !== undefined)
    popUp();

}

// the starting line
window.addEventListener('load', initGame);


