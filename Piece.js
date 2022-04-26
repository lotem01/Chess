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