let selectedCell;
//some global variables
let boardData;
const WHITE_PLAYER = 'white';
const DARK_PLAYER = 'dark';
let table;

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

// what happen when click on cell
function onCellClick(event, row, col) {
  //clean the table from pos move
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('possible-move');
    }
  }

  //add pos move to the cells
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined) {
    let possibleMoves = boardData.getPiece(row, col).getPossibleMoves();
    for (let possibleMove of possibleMoves)
      table.rows[possibleMove[0]].cells[possibleMove[1]].classList.add('possible-move');
  }

  // selected cell
  if (selectedCell !== undefined) {
    selectedCell.classList.remove('selected');
  }
  selectedCell = event.currentTarget;
  selectedCell.classList.add('selected');
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
  getPossibleMoves() {
    let relativeMoves;
    if (this.type === 'pawn') {
      relativeMoves = this.getPawnRelativeMoves();
    } else if (this.type === 'rook') {
      relativeMoves = this.getRookRelativeMoves();
    } else if (this.type === 'knight') {
      relativeMoves = this.getKnightRelativeMoves();
    } else if (this.type === 'bishop') {
      relativeMoves = this.getBishopRelativeMoves();
    } else if (this.type === 'king') {
      relativeMoves = this.getKingRelativeMoves();
    } else if (this.type === 'queen') {
      relativeMoves = this.getQueenRelativeMoves();
    } else {
      console.log("Unknown type", type)
    }
    
  // consider the position of the piece
    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1];
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    
    // consider the size of the board
    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
        filteredMoves.push(absoluteMove);
      }
    }

    // consider in other pieces (pawn)
    let k = [-1, -1];
    if (this.type === "pawn") {
      if ((this.player === WHITE_PLAYER) && (boardData.getPiece(this.row + 1, this.col) !== undefined))
        return k;
      else if ((this.player === DARK_PLAYER) && (boardData.getPiece(this.row - 1, this.col) !== undefined))
        return k;
    }

    // consider in other pieces (knight)
    if (this.type === "knight") {
      for (let i1 = 0; i1 < filteredMoves.length; i1++) {
        let arr = filteredMoves[i1];
        let row = arr[0];
        let col = arr[1];
        if (boardData.getPiece(row, col) !== undefined) {
          filteredMoves.splice(i1, 1);
        }
      }
    }

    // consider in other pieces (bishop)
    if (this.type === "bishop") {
      for (let i2 = 0; i2 < filteredMoves.length; i2++) {
        let arr = filteredMoves[i2];
        let row = arr[0];
        let col = arr[1];
        if (boardData.getPiece(row, col) !== undefined) {
          if (row > this.row && col > this.col)
            for (let j1 = 0; j1 < 8; j1++)
              if ((j1 + row) < 8 && (j1 + col) < 8)
                filteredMoves.splice(i2, 1);

              else if (row > this.row && col < this.col)
                for (let j2 = 0; j2 < 8; j2++)
                  if ((j2 + row) < 8 && (col - j2) >= 0)
                    filteredMoves.splice(i2, 1);

                  else if (row < this.row && col > this.col)
                    for (let j3 = 0; j3 < 8; j3++)
                      if ((row - j3) >= 0 && (col + j3) < 8)
                        filteredMoves.splice(i2, 1);

                      else if (row < this.row && col < this.col)
                        for (let j4 = 0; j4 < 8; j4++)
                          if ((row - j4) >= 0 && (col - j4) >= 0)
                            filteredMoves.splice(i2, 1);
        }
      }
    }

    // consider in other pieces (rook)
    if (this.type === "rook") {
      for (let i3 = 0; i3 < filteredMoves.length; i3++) {
        let arr = filteredMoves[i3];
        let row = arr[0];
        let col = arr[1];
        if (boardData.getPiece(row, col) !== undefined) {
          if (row > this.row)
            for (let j1 = 0; j1 < 8; j1++)
              if ((j1 + row) < 8)
                filteredMoves.splice(i3, 1);

              else if (col < this.col)
                for (let j2 = 0; j2 < 8; j2++)
                  if ((col - j2) >= 0)
                    filteredMoves.splice(i3, 1);

                  else if (row < this.row)
                    for (let j3 = 0; j3 < 8; j3++)
                      if ((row - j3) >= 0)
                        filteredMoves.splice(i3, 1);

                      else if (col > this.col)
                        for (let j4 = 0; j4 < 8; j4++)
                          if ((col - j4) >= 0)
                            filteredMoves.splice(i3, 1);
        }
      }
    }

    // consider in other pieces (king)
    if (this.type === "king") {
      for (let i4 = 0; i4 < filteredMoves.length; i4++) {
        let arr = filteredMoves[i4];
        let row = arr[0];
        let col = arr[1];
        if (boardData.getPiece(row, col) !== undefined)
          filteredMoves.splice(i4, 1);
      }
    }

    return filteredMoves;
  }

  // return the possible moves of pawn
  getPawnRelativeMoves() {
    let result = [];
    if (this.player === WHITE_PLAYER) {
      result.push([1, 0]);
      return result;
    } else if (this.player === DARK_PLAYER) {
      result.push([-1, 0]);
      return result;
    }
    else
      return (undefined, console.log("unknown player: " + this.player))
  }

  // return the possible moves of rook
  getRookRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, 0]);
      result.push([-i, 0]);
      result.push([0, i]);
      result.push([0, -i]);
    }
    return result;
  }

  // return the possible moves of knight
  getKnightRelativeMoves() {
    let result = [];

    result.push([-2, 1]);
    result.push([-1, 2]);
    result.push([1, 2]);
    result.push([2, 1]);
    result.push([2, -1]);
    result.push([1, -2]);
    result.push([-1, -2]);
    result.push([-2, -1]);

    return result;
  }

  // return the possible moves of bishop
  getBishopRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, i]);
      result.push([-i, i]);
      result.push([i, -i]);
      result.push([-i, -i]);
    }
    return result;
  }

  // return the possible moves of king
  getKingRelativeMoves() {
    let result = [];
    for (let i = -1; i < 2; i++)
      for (let j = -1; j < 2; j++)
        if (!(i === 0 && j === 0))
          result.push([i, j]);
    return result;
  }

  // return the possible moves of queen
  getQueenRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, i]);
      result.push([-i, i]);
      result.push([i, -i]);
      result.push([-i, -i]);
    }
    for (let j = 1; j < 8; j++) {
      result.push([j, 0]);
      result.push([-j, 0]);
      result.push([0, j]);
      result.push([0, -j]);
    }
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
}

// create the board in html and call the events of the elements
function chessBoard() {
  table = document.createElement("table");
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
  boardData = new BoardData(getInitialBoard());

  for (let piece of boardData.pieces) {
    addImage(table.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }



}

// the starting line
window.addEventListener('load', chessBoard);


