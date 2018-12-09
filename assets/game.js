var turn = 'yellow';
var selectedPiece = {};
var yellowPieces = {};
var bluePieces = {};
var cursor = [undefined, undefined];
var gameSquares = document.getElementsByClassName('game-square');
var borderSquares = document.getElementsByClassName('border-square');
var infoMessage = document.getElementById('info-message');
var skipButton = document.getElementById('skip');

var board = [
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ,'empty', 'empty']
];

// Piece constructor
function Piece (name, occupiedSpaces) {
  this.name = name;
  this.occupiedSpaces = occupiedSpaces;
  this.occupiedSpaces.push([0,0]);
  this.rotate = function(){
    let newSpaces = [];
    for(let space of this.occupiedSpaces){
      let newX = -1 * space[1];
      let newY = space[0];
      newSpaces.push([newX, newY]);
    }
    this.occupiedSpaces = newSpaces;
  }
};

function restartGame (){
  // Fill piece banks
  let newPiece = new Piece('blue-W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]);
  bluePieces['blue-W'] = newPiece;
  newPiece = new Piece('blue-U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]);
  bluePieces['blue-U'] = newPiece;
  newPiece = new Piece('blue-+', [[-1, 0], [0, -1], [0, 1], [1, 0]]);
  bluePieces['blue-+'] = newPiece;
  newPiece = new Piece('blue-&', [[-1, 0], [0, -1], [1, 1], [0, 1]]);
  bluePieces['blue-&'] = newPiece;
  newPiece = new Piece('blue-Z', [[0, -1], [1, 0], [1, 1]]);
  bluePieces['blue-Z'] = newPiece;
  newPiece = new Piece('blue-square', [[-1, 0], [-1, -1], [0, -1]]);
  bluePieces['blue-square'] = newPiece;
  newPiece = new Piece('blue-T', [[0, -1], [0, 1], [1, 0]]);
  bluePieces['blue-T'] = newPiece;
  newPiece = new Piece('blue-line', [[0, 1], [0, -1]]);
  bluePieces['blue-line'] = newPiece;
  newPiece = new Piece('blue-V1', [[0, -1], [1, 0]]);
  bluePieces['blue-V1'] = newPiece;
  newPiece = new Piece('blue-V2', [[0, -1], [1, 0]]);
  bluePieces['blue-V2'] = newPiece;
  newPiece = new Piece('blue-two1', [[0, -1]]);
  bluePieces['blue-two1'] = newPiece;
  newPiece = new Piece('blue-two2', [[0, -1]]);
  bluePieces['blue-two2'] = newPiece;
  newPiece = new Piece('blue-one1', []);
  bluePieces['blue-one1'] = newPiece;
  newPiece = new Piece('blue-one1', []);
  bluePieces['blue-one2'] = newPiece;

  newPiece = new Piece('yellow-W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]);
  yellowPieces['yellow-W'] = newPiece;
  newPiece = new Piece('yellow-U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]);
  yellowPieces['yellow-U'] = newPiece;
  newPiece = new Piece('yellow-+', [[-1, 0], [0, -1], [0, 1], [1, 0]]);
  yellowPieces['yellow-+'] = newPiece;
  newPiece = new Piece('yellow-&', [[-1, 0], [0, -1], [1, 1], [0, 1]]);
  yellowPieces['yellow-&'] = newPiece;
  newPiece = new Piece('yellow-Z', [[0, -1], [1, 0], [1, 1]]);
  yellowPieces['yellow-Z'] = newPiece;
  newPiece = new Piece('yellow-square', [[-1, 0], [-1, -1], [0, -1]]);
  yellowPieces['yellow-square'] = newPiece;
  newPiece = new Piece('yellow-T', [[0, -1], [0, 1], [1, 0]]);
  yellowPieces['yellow-T'] = newPiece;
  newPiece = new Piece('yellow-line', [[0, -1], [0, 1]]);
  yellowPieces['yellow-line'] = newPiece;
  newPiece = new Piece('yellow-V1', [[0, -1], [1, 0]]);
  yellowPieces['yellow-V1'] = newPiece;
  newPiece = new Piece('yellow-V2', [[0, -1], [1, 0]]);
  yellowPieces['yellow-V2'] = newPiece;
  newPiece = new Piece('yellow-two1', [[0, -1]]);
  yellowPieces['yellow-two1'] = newPiece;
  newPiece = new Piece('yellow-two2', [[0, -1]]);
  yellowPieces['yellow-two2'] = newPiece;
  newPiece = new Piece('yellow-one1', []);
  yellowPieces['yellow-one1'] = newPiece;
  newPiece = new Piece('yellow-one1', []);
  yellowPieces['yellow-one2'] = newPiece;

  // Create cathedral
  selectedPiece = new Piece('cathedral', [[-1, 0], [0, 1], [0, 2], [1, 0], [0, -1]]);
}


var onClickPiece = function(event) {
  // Don't let them choose a piece if they're placing the cathedral
  if (selectedPiece.name === 'cathedral'){
    return;
  }
  // Don't let them choose the piece if they dont have it
  if (yellowPieces[event.target.id] && bluePieces[event.target.id]){
    return;
  }
  // Assign the selected piece
  selectedPiece = bluePieces[event.target.id] ? bluePieces[event.target.id] : yellowPieces[event.target.id];
  let allPieces = document.getElementsByClassName('game-piece');
  for (let piece of allPieces){
    piece.style.setProperty('border', '1px solid white');
  };
  event.target.style.setProperty('border', '1px solid red');
}

var onClickSquare = function (event) {
  let X = +event.target.id[1];
  let Y = +event.target.id[4];
  let square = board[X][Y];
  if(Object.keys(selectedPiece).length === 0){
    return;
  }
  else{
    // Determine if the piece can go there  
    let isValidPlacement = true;
    for(let occupiedSpace of selectedPiece.occupiedSpaces){
      let spaceX = X + occupiedSpace[0];
      let spaceY = Y + occupiedSpace[1];
      if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
        isValidPlacement = false;
        break
      }
      let thisSpace = board[spaceX][spaceY];
      if(thisSpace !== 'empty' && thisSpace !== turn){
        isValidPlacement = false;
        break
      }
    }
    if(isValidPlacement){
      // Color the squares
      for(let occupiedSpace of selectedPiece.occupiedSpaces){
        let spaceX = X + occupiedSpace[0];
        let spaceY = Y + occupiedSpace[1];
        board[spaceX][spaceY] = selectedPiece.name;
        let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
        domElement.style.setProperty('background-color', selectedPiece.name === 'cathedral' ? 'white' : turn);
      }
      if(selectedPiece.name === 'cathedral'){
        infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
      }
      else{
        // Remove that piece from bank, and do the turn-changing stuff
        delete bluePieces[selectedPiece.name];
        let pieceHtmlElement = document.getElementById(selectedPiece.name);
        pieceHtmlElement.style.setProperty('opacity', '0.0');
        let yellowBank = document.getElementById('yellow-bank');
        let blueBank = document.getElementById('blue-bank');
        
        if(turn === 'yellow'){
          delete yellowPieces[selectedPiece.name];
          turn = 'blue';
          yellowBank.style.setProperty('display', 'none');
          blueBank.style.setProperty('display', 'block');
          infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
        }
        else {
          delete bluePieces[selectedPiece.name];
          turn = 'yellow';
          blueBank.style.setProperty('display', 'none');
          yellowBank.style.setProperty('display', 'block');
          infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
        }
      }
      selectedPiece = {};
    }
    return;
  }
};

var onMouseenter = function(event){
  if(Object.keys(selectedPiece).length === 0){
    return;
  }
  let X = +event.target.id[1];
  let Y = +event.target.id[4];
  cursor = [X, Y];
  for(let occupiedSpace of selectedPiece.occupiedSpaces){
    let spaceX = X + occupiedSpace[0];
    let spaceY = Y + occupiedSpace[1];
    // Disregard squares beyond board / borders
    if(spaceX < -1 || spaceX > 10 || spaceY < -1 || spaceY > 10){
      continue;
    }
    // Color invalid border spaces
    if(spaceX === -1){
      if(spaceY < -1 || spaceY > 10){
      }
      let invalidSquare = document.getElementById('left-y' + spaceY);
      invalidSquare.style.setProperty('background-color', 'red'); 
    }
    else if(spaceX === 10){
      if(spaceY < -1 || spaceY > 10){
      }
      let invalidSquare = document.getElementById('right-y' + spaceY);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else if(spaceY === -1){
      if(spaceX < -1 || spaceX > 10){
      }
      let invalidSquare = document.getElementById('top-x' + spaceX);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else if(spaceY === 10){
      if(spaceX < -1 || spaceX > 10){
      }
      let invalidSquare = document.getElementById('bottom-x' + spaceX);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else {
      let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
      if(board[spaceX][spaceY] === 'empty' || board[spaceX][spaceY] === turn){
        domElement.style.setProperty('background-color', '#9f9');
      }
      else {
        domElement.style.setProperty('background-color', 'red');
      }
    }
  }
};

var onMouseleave = function(event){
  cursor = [undefined, undefined];
  for(let square of borderSquares){
    square.style.setProperty('background-color', 'white');
  }
  let boardSquares = document.getElementsByClassName('game-square');
  for(let square of gameSquares){
    let X = square.id[1];
    let Y = square.id[4];
    switch(board[X][Y][0]){
      case 'e':
        square.style.setProperty('background-color', '#ddd');
        break;
      case 'c':
        square.style.setProperty('background-color', 'white');
        break;
      case 'y':
        if(board[X][Y] === 'yellow'){
          square.style.setProperty('background-color', 'lightyellow');
        }
        else {
          square.style.setProperty('background-color', 'yellow');
        }
        break;
      case 'b':
        if(board[X][Y] === 'blue'){
          square.style.setProperty('background-color', 'lightblue');
        }
        else {
          square.style.setProperty('background-color', 'blue');
        }
        break;
      default:
        break;
    }
  }
};

var onSpacebar = function(event){
  // If cursor not on board, do nothing
  if (!cursor[0] || !cursor[1]){
    return;
  }
  if(Object.keys(selectedPiece).length > 0 && event.keyCode === 32){
    let X = cursor[0];
    let Y = cursor[1];
    // Get rid of current highlighted squares
    for(let occupiedSpace of selectedPiece.occupiedSpaces){
      let spaceX = X + occupiedSpace[0];
      let spaceY = Y + occupiedSpace[1];
      // Ignore spaces not contained on board
      if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
        continue;
      }
      let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
      switch(board[spaceX][spaceY][0]){
        case 'e':
          domElement.style.setProperty('background-color', '#ddd');
          break;
        case 'y':
          if(board[spaceX][spaceY] === 'yellow'){
            domElement.style.setProperty('background-color', 'lightyellow');
          }
          else {
            domElement.style.setProperty('background-color', 'yellow');
          }
          break;
        case 'b':
          if(board[spaceX][spaceY] === 'blue'){
            domElement.style.setProperty('background-color', 'lightblue');
          }
          else {
            domElement.style.setProperty('background-color', 'blue');
          }
          break;
        default:
          break;
      }
    }
    // Make the rotation
    selectedPiece.rotate();
    for(let occupiedSpace of selectedPiece.occupiedSpaces){
      let spaceX = X + occupiedSpace[0];
      let spaceY = Y + occupiedSpace[1];
      // Ignore spaces not contained on board
      if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
        continue;
      }
      let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
      switch(board[spaceX][spaceY][0]){
        case 'e':
          domElement.style.setProperty('background-color', '#9f9');
          break;
        default:
          domElement.style.setProperty('background-color', 'red');
          break;
      }
    }
  }
}

// Create event listeners for the board squares
for (let square of gameSquares){
  square.addEventListener('click', onClickSquare);
  square.addEventListener('mouseenter', onMouseenter);
  square.addEventListener('mouseleave', onMouseleave);
  square.onkeyup = function(event){
    console.log('zzzz');
    onSpacebar(event);
  };
};

// Create event listeners for pieces in bank
var gamePieces = document.getElementsByClassName('game-piece');
for (let piece of gamePieces){
  piece.addEventListener('click', onClickPiece);
};

//Spacebar rotate
document.body.onkeyup = function(event){
  onSpacebar(event);
}

//Skip
skipButton.addEventListener('click', function(){
  selectedPiece = {};
  let yellowBank = document.getElementById('yellow-bank');
  let blueBank = document.getElementById('blue-bank');
  if(turn === 'yellow'){
    turn = 'blue';
    yellowBank.style.setProperty('display', 'none');
    blueBank.style.setProperty('display', 'block');
    infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
  }
  else {
    turn = 'yellow';
    blueBank.style.setProperty('display', 'none');
    yellowBank.style.setProperty('display', 'block');
    infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
  }
});

restartGame();