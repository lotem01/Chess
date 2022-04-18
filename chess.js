let selectedCell;
let pieces = [];
const WHITE_PLAYER = 'white';
const DARK_PLAYER = 'dark';

function addImage(cell, player, name) {
    const image = document.createElement('img');
    image.src = 'images/' + player + '/' + name + '.png';
    cell.appendChild(image);
    image.className='img1';
  }
  

function onCellClick (event){
        if (selectedCell!== undefined)
            selectedCell.classList.remove('selected');
        console.log(event);
        selectedCell= event.currentTarget;
        selectedCell.classList.add('selected');
}

class Piece {
    constructor(row, col, type, player) {
      this.row = row;
      this.col = col;
      this.type = type;
      this.player = player;
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
    for (let i=0; i<=7; i++){
        result.push(new Piece(1, i, "pawn", WHITE_PLAYER));
        result.push(new Piece(6, i, "pawn", DARK_PLAYER));
    }
    return result;
  }

  function whereP (player, type)
  {
    let l=0;
    for (Piece in pieces)
        if ((Piece.player===player)&& (Piece.type===type))
            l= Piece.row.toString()+", " +Piece.col.toString();
  }

function chessBoard (){
    let table = document.createElement("table");
    document.body.appendChild(table);
    table.className= 'table';
    let tb = document.createElement("tbody");
    table.appendChild(tb);
    for (let i=1; i<=8; i++)
    {
        let tr = document.createElement("tr");
        tb.appendChild(tr);
        for (let y=1; y<=8; y++)
        {
            let td = document.createElement("td");
            tr.appendChild(td);
            if ((y%2==1&& i%2==1) || (y%2==0&& i%2==0) ) 
                td.className= 'white';
                else 
                    td.className= 'black';       
                 
            
            td.addEventListener('click', onCellClick);  
        }
    }
    pieces = getInitialBoard();
    for (let piece of pieces) {
        addImage(table.rows[piece.row].cells[piece.col], piece.player, piece.type);
      }
}
    
window.addEventListener('load', chessBoard);
whereP (WHITE_PLAYER, bishop);



