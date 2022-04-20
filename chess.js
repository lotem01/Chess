let selectedCell;
let boardData;
const WHITE_PLAYER = 'white';
const DARK_PLAYER = 'dark';
let table;


function addImage(cell, player, name) {
  const image = document.createElement('img');
  image.src = 'images/' + player + '/' + name + '.png';
  cell.appendChild(image);
  image.className = 'img1';
}


function onCellClick(event, row, col) {
  // console.log(row);
  // console.log(col);
  //clean the table from pos move
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('possible-move');
    }
  }

  //add pos move to the cells
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined) {
    // console.log(Piece);
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

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }
  whereP() {
    let l = [];
    l = [this.row, this.col];
    return l;
  }
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
    // console.log('relativeMoves', relativeMoves);

    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1];
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    // console.log('absoluteMoves', absoluteMoves);

    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
        filteredMoves.push(absoluteMove);
      }
      // console.log('filteredMoves', filteredMoves);
    }
    // check if there is players that distract
    let k =[-1, -1];
    if (this.type=== "pawn") {
      if ((this.player=== WHITE_PLAYER) && (boardData.getPiece(this.row+1, this.col)!== undefined))
        return k;
      else if ((this.player=== DARK_PLAYER) && (boardData.getPiece(this.row-1, this.col)!== undefined))
        return k;
    }
    return filteredMoves;
  }

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

  getKingRelativeMoves() {
    let result = [];
    for (let i = -1; i < 2; i++)
      for (let j = -1; j < 2; j++)
        if (!(i === 0 && j === 0))
          result.push([i, j]);
    return result;
  }

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



class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  // Returns piece in row, col, or undefined if not exists.
  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
    return undefined;
  }
}


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

window.addEventListener('load', chessBoard);


