//some global variables
let boardData;
const WHITE_PLAYER = 'white';
const DARK_PLAYER = 'dark';
let table;
const CHESS_BOARD_ID = 'chess-board';
let selectedPiece;

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
  cell.appendChild(image);
  image.className = 'img1';
}

function showMovesForPiece(row, col) {
  console.log('showMovesForPiece');
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
    // TODO: Refactor based on Yuval's suggestion
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
      boardData.removePiece(row, col);
      piece.row = row;
      piece.col = col;
      return true;
    }
  }
  return false;
}

// class with some attributes and functions on the pieces
class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  // return the position of selected piece
  whereP() {
    let l = [];
    l = [this.row, this.col];
    return l;
  }

  // check the possible move of piece by his type
  getPossibleMoves(boardData) {
    let moves;
    if (this.type === 'pawn') {
      moves = this.getPawnRelativeMoves(boardData);
    } else if (this.type === 'rook') {
      moves = this.getRookRelativeMoves(boardData);
    } else if (this.type === 'knight') {
      moves = this.getKnightRelativeMoves(boardData);
    } else if (this.type === 'bishop') {
      moves = this.getBishopRelativeMoves(boardData);
    } else if (this.type === 'king') {
      moves = this.getKingRelativeMoves(boardData);
    } else if (this.type === 'queen') {
      moves = this.getQueenRelativeMoves(boardData);
    } else {
      console.log("Unknown type", type)
    }


    // consider the size of the board
    let filteredMoves = [];
    for (let absoluteMove of moves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
        filteredMoves.push(absoluteMove);
      }
    }

    return filteredMoves;
  }

  // return the possible moves of pawn
  getPawnRelativeMoves(boardData) {
    let result = [];

    if (this.player === WHITE_PLAYER) {
      if (boardData.getPiece(this.row + 1, this.col) === undefined)
        result.push([this.row + 1, this.col]);
      if (boardData.getPiece(this.row + 1, this.col + 1) !== undefined)
        if (boardData.getPiece(this.row + 1, this.col + 1).player === DARK_PLAYER)
          result.push([this.row + 1, this.col + 1]);
      if (boardData.getPiece(this.row + 1, this.col - 1) !== undefined)
        if (boardData.getPiece(this.row + 1, this.col - 1).player === DARK_PLAYER)
          result.push([this.row + 1, this.col - 1]);
    }

    else {
      if (boardData.getPiece(this.row - 1, this.col) === undefined)
        result.push([this.row - 1, this.col]);
      if (boardData.getPiece(this.row - 1, this.col + 1) !== undefined)
        if (boardData.getPiece(this.row - 1, this.col + 1).player === WHITE_PLAYER)
          result.push([this.row - 1, this.col + 1]);
      if (boardData.getPiece(this.row - 1, this.col - 1) !== undefined)
        if (boardData.getPiece(this.row - 1, this.col - 1).player === WHITE_PLAYER)
          result.push([this.row - 1, this.col - 1]);
    }
    return result;
  }

  // return the possible moves of rook
  getRookRelativeMoves(boardData) {
    let result = [];
    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row + i, this.col) === undefined)
        result.push([this.row + i, this.col]);
      else
        if (boardData.getPiece(this.row + i, this.col).player !== this.player) {
          result.push([this.row + i, this.col]);
          i = 8;
        }
        else
          i = 8;
    }


    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row, this.col + i) === undefined)
        result.push([this.row, this.col + i]);
      else
        if (boardData.getPiece(this.row, this.col + i).player !== this.player) {
          result.push([this.row, this.col + i]);
          i = 8;
        }
        else
          i = 8;

    }

    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row - i, this.col) === undefined)
        result.push([this.row - i, this.col]);
      else
        if (boardData.getPiece(this.row - i, this.col).player !== this.player) {
          result.push([this.row - i, this.col]);
          i = 8;
        }
        else
          i = 8;
    }

    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row, this.col - i) === undefined)
        result.push([this.row, this.col - i]);
      else
        if (boardData.getPiece(this.row, this.col - i).player !== this.player) {
          result.push([this.row, this.col - i]);
          i = 8;
        }
        else
          i = 8;
    }

    return result;
  }

  // return the possible moves of knight
  getKnightRelativeMoves(boardData) {
    let result = [];
    const relativeMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  // return the possible moves of bishop
  getBishopRelativeMoves(boardData) {
    let result = [];
    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row + i, this.col + i) === undefined)
        result.push([this.row + i, this.col + i]);
      else
        if (boardData.getPiece(this.row + i, this.col + i).player !== this.player) {
          result.push([this.row + i, this.col + i]);
          i = 8;
        }
        else
          i = 8;
    }


    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row - i, this.col + i) === undefined)
        result.push([this.row - i, this.col + i]);
      else
        if (boardData.getPiece(this.row - i, this.col + i).player !== this.player) {
          result.push([this.row - i, this.col + i]);
          i = 8;
        }
        else
          i = 8;

    }

    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row - i, this.col - i) === undefined)
        result.push([this.row - i, this.col - i]);
      else
        if (boardData.getPiece(this.row - i, this.col - i).player !== this.player) {
          result.push([this.row - i, this.col - i]);
          i = 8;
        }
        else
          i = 8;
    }

    for (let i = 1; i < 8; i++) {
      if (boardData.getPiece(this.row + i, this.col - i) === undefined)
        result.push([this.row + i, this.col - i]);
      else
        if (boardData.getPiece(this.row + i, this.col - i).player !== this.player) {
          result.push([this.row + i, this.col - i]);
          i = 8;
        }
        else
          i = 8;
    }
    return result;
  }


  // return the possible moves of king
  getKingRelativeMoves(boardData) {
    let result = [];
    const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  // return the possible moves of queen
  getQueenRelativeMoves(boardData) {
    let result = this.getBishopRelativeMoves(boardData);
    result = result.concat(this.getRookRelativeMoves(boardData));
    return result;
  }

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


// class that contain all the pieces
class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  // Returns piece in row, col, or undefined if not exists
  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
    return undefined;
  }

  removePiece(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        // Remove piece at index i
        this.pieces.splice(i, 1);
      }
    }
  }

  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }

  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }
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



}

// the starting line
window.addEventListener('load', initGame);


