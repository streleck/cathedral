let turn = 'yellow';
const firstTurn = 'yellow';
//const turn = Math.floor(2 * Math.random());
let selectedPiece = {};
let pieces = {};
let boardCursor = [undefined, undefined];
const gameSquares = document.getElementsByClassName('game-square');
const borderSquares = document.getElementsByClassName('border-square');
const infoMessage = document.getElementById('info-message');
const skipButton = document.getElementById('skip');

const COLOR_MAP = {
  pieces: {
    blue: 'blue',
    yellow: 'yellow',
    cathedral: 'white'
  },
  emptySpaces: {
    blue: '',
    yellow: '',
    unclaimed: '#ddd',
  }
}

function Space (piece) {
  this.piece = piece ?? null
  this.owner = null
}

const makeBoard = (rows, columns) => {
  const board = []
  for (let i=0; i<rows; i++) {
    const row = []
    for (let j=0; j<columns; j++) {
      row.push(new Space())
    }
    board.push(row)
  }
  return board
}

const opponentOf = (playerColor) => {
  if (playerColor == 'yellow') {
    return 'blue'
  } else {
    return 'yellow'
  }
}

let board = makeBoard(10, 10)

function Piece (player, name, occupiedSpaces) {
  this.player = player;
  this.name = name;
  this.occupiedSpaces = occupiedSpaces;
  this.occupiedSpaces.push([0,0]);
  this.isAvailable = true;

  this.mapPieces = function(){
    const pieceMap = [];
    for(let space of this.occupiedSpaces){
      // Create a list of borders and delete those that arent needed
      const thisSpaceBorders = ['top', 'right', 'bottom', 'left'];
      for(let otherSpace of this.occupiedSpaces){
        // There's a space to the right, so you can delete the right border...
        if(space[0] === otherSpace[0]+1 && space[1] === otherSpace[1]){
          thisSpaceBorders.splice(thisSpaceBorders.indexOf('left'), 1);
        }
        if(space[0] === otherSpace[0]-1 && space[1] === otherSpace[1]){
          thisSpaceBorders.splice(thisSpaceBorders.indexOf('right'), 1);
        }
        if(space[1] === otherSpace[1]+1 && space[0] === otherSpace[0]){
          thisSpaceBorders.splice(thisSpaceBorders.indexOf('top'), 1);
        }
        if(space[1] === otherSpace[1]-1 && space[0] === otherSpace[0]){
          thisSpaceBorders.splice(thisSpaceBorders.indexOf('bottom'), 1);
        }
      }
      pieceMap.push({coordinates: space, borders: thisSpaceBorders});
    }
    return pieceMap;
  };
  
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

const createPieces = () => {
  return {
    'blue-W': new Piece('blue', 'W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]),
    'blue-U': new Piece('blue', 'U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]),
    'blue-+': new Piece('blue', '+', [[-1, 0], [0, -1], [0, 1], [1, 0]]),
    'blue-&': new Piece('blue', '&', [[-1, 0], [0, -1], [1, 1], [0, 1]]),
    'blue-Z': new Piece('blue', 'Z', [[0, -1], [1, 0], [1, 1]]),
    'blue-square': new Piece('blue', 'square', [[-1, 0], [-1, -1], [0, -1]]),
    'blue-T': new Piece('blue', 'T', [[0, -1], [0, 1], [1, 0]]),
    'blue-line': new Piece('blue', 'line', [[0, 1], [0, -1]]),
    'blue-V1': new Piece('blue', 'V1', [[0, -1], [1, 0]]),
    'blue-V2': new Piece('blue', 'V2', [[0, -1], [1, 0]]),
    'blue-two1': new Piece('blue', 'two1', [[0, -1]]),
    'blue-two2': new Piece('blue', 'two2', [[0, -1]]),
    'blue-one1': new Piece('blue', 'one1', []),
    'blue-one2':  new Piece('blue', 'one2', []),
    'yellow-W': new Piece('yellow', 'W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]),
    'yellow-U': new Piece('yellow', 'U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]),
    'yellow-+': new Piece('yellow', '+', [[-1, 0], [0, -1], [0, 1], [1, 0]]),
    'yellow-&': new Piece('yellow', '&', [[-1, 0], [0, -1], [1, 1], [0, 1]]),
    'yellow-Z': new Piece('yellow', 'Z', [[0, -1], [1, 0], [1, 1]]),
    'yellow-square': new Piece('yellow', 'square', [[-1, 0], [-1, -1], [0, -1]]),
    'yellow-T': new Piece('yellow', 'T', [[0, -1], [0, 1], [1, 0]]),
    'yellow-line': new Piece('yellow', 'line', [[0, 1], [0, -1]]),
    'yellow-V1': new Piece('yellow', 'V1', [[0, -1], [1, 0]]),
    'yellow-V2': new Piece('yellow', 'V2', [[0, -1], [1, 0]]),
    'yellow-two1': new Piece('yellow', 'two1', [[0, -1]]),
    'yellow-two2': new Piece('yellow', 'two2', [[0, -1]]),
    'yellow-one1': new Piece('yellow', 'one1', []),
    'yellow-one2':  new Piece('yellow', 'one2', []),
    'cathedral': new Piece('cathedral', 'cathedral', [[-1, 0], [0, 1], [0, 2], [1, 0], [0, -1]])
  }
}

function restartGame (){
  pieces = createPieces()
  selectedPiece = pieces.cathedral
}


const onClickPiece = function(event) {
  // Don't let them choose a piece if they're placing the cathedral
  if (selectedPiece.name === 'cathedral'){
    return;
  }
  // Don't let them choose the piece if they dont have it
  if (!pieces[event.target.id].isAvailable){
    return;
  }
  // Assign the new selected piece
  selectedPiece = pieces[event.target.id]
  let allPieces = document.getElementsByClassName('game-piece');
  for (let piece of allPieces){
    piece.style.setProperty('border', '1px solid white');
  };
  event.target.style.setProperty('border', '1px solid red');
}

const isPlacementValid = (board, X, Y, piece) => {
  for(let occupiedSpace of piece.occupiedSpaces){
    let spaceX = X + occupiedSpace[0];
    let spaceY = Y + occupiedSpace[1];
    
    if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
      return false;
    }
    let thisSpace = board[spaceX][spaceY];
    if(thisSpace.piece || thisSpace.owner === opponentOf(piece.player)){
      return false
    }
  }
  return true
} 

const onClickSquare = (event) => {
  let X = +event.target.id[1];
  let Y = +event.target.id[4];
  let square = board[X][Y];
  if(Object.keys(selectedPiece).length === 0){
    groupify(board, parseInt(event.target.id[1]), parseInt(event.target.id[4]));
    return;
  } else {

    if(isPlacementValid(board, X, Y, selectedPiece)){
      // Color the squares
      let pieceSpaces = selectedPiece.mapPieces();
      for(let pieceSpace of pieceSpaces){
        let spaceX = X + pieceSpace.coordinates[0];
        let spaceY = Y + pieceSpace.coordinates[1];
        board[spaceX][spaceY] = selectedPiece.name;
        let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
        domElement.style.setProperty('background-color', selectedPiece.name === 'cathedral' ? 'white' : turn);
        domElement.style.setProperty('border', '1px solid ' + (selectedPiece.name === 'cathedral' ? 'white' : turn));
        for(border of pieceSpace.borders){
          domElement.style.setProperty('border-' + border, '1px solid white');
        }
      }
      if(selectedPiece.name === 'cathedral'){
        infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
      } else{
        // Make that piece unavailable, and do the turn-changing stuff
        pieces[selectedPiece.name].isAvailable = false;
        let pieceHtmlElement = document.getElementById(selectedPiece.name);
        pieceHtmlElement.style.setProperty('opacity', '0.0');
        let yellowBank = document.getElementById('yellow-bank');
        let blueBank = document.getElementById('blue-bank');
        
        if(turn === 'yellow'){
          turn = 'blue';
          yellowBank.style.setProperty('display', 'none');
          blueBank.style.setProperty('display', 'block');
          infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
        } else {
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

const onMouseenter = function(event){
  if(!selectedPiece || Object.keys(selectedPiece).length === 0){
    return;
  }
  let X = +event.target.id[1];
  let Y = +event.target.id[4];
  boardCursor = [X, Y];
  for(let occupiedSpace of selectedPiece.occupiedSpaces){
    let spaceX = X + occupiedSpace[0];
    let spaceY = Y + occupiedSpace[1];
    // Disregard squares beyond board / borders
    if(spaceX < -1 || spaceX > 10 || spaceY < -1 || spaceY > 10){
      continue;
    }
    // Color invalid border spaces
    else if(spaceX === -1){
      let invalidSquare = document.getElementById('left-y' + spaceY);
      invalidSquare.style.setProperty('background-color', 'red');
    }
    else if(spaceX === 10){
      let invalidSquare = document.getElementById('right-y' + spaceY);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else if(spaceY === -1){
      let invalidSquare = document.getElementById('top-x' + spaceX);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else if(spaceY === 10){
      let invalidSquare = document.getElementById('bottom-x' + spaceX);
      invalidSquare.style.setProperty('background-color', 'red');  
    }
    else {
      let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
      console.log('eggg', spaceX, spaceY, board)
      const space = board[spaceX][spaceY]
      if(!space.piece && space.owner !== turn){
        domElement.style.setProperty('background-color', '#9f9');
      }
      else {
        domElement.style.setProperty('background-color', 'red');
      }
    }
  }
};

const onMouseleave = function(event){
  boardCursor = [undefined, undefined];
  for(let square of borderSquares){
    square.style.setProperty('background-color', 'white');
  }
  let boardSquares = document.getElementsByClassName('game-square');

  for(let square of boardSquares){
    let X = square.id[1];
    let Y = square.id[4];
    
    const space = board[X][Y]
    let color = COLOR_MAP.emptySpaces.unclaimed
    if (space.piece) {
      color = COLOR_MAP.pieces[space.piece.player]
    } else if (space.owner) {
      color = COLOR_MAP.space[space.owner]
    } 

    square.style.setProperty('background-color', color);
  }
};

const onSpacebar = function(event){
  // If boardCursor not on board, do nothing
  if (!boardCursor || (typeof boardCursor[1] !== 'number')){
    return;
  }
  if(Object.keys(selectedPiece).length > 0){
    let X = boardCursor[0];
    let Y = boardCursor[1];
    // Get rid of current highlighted squares
    for(let borderSquare of borderSquares){
      borderSquare.style.setProperty('background-color', 'white')
    }
    for(let occupiedSpace of selectedPiece.occupiedSpaces){
      let spaceX = X + occupiedSpace[0];
      let spaceY = Y + occupiedSpace[1];
      // Ignore spaces not contained on board
      if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
        continue;
      }
      let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY);
      switch(board[spaceX][spaceY].owner[0]){
        case 'e':
          domElement.style.setProperty('background-color', '#ddd');
          break;
        case 'c':
          domElement.style.setProperty('background-color', 'white');
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
      // Disregard squares beyond board / borders
      if(spaceX < -1 || spaceX > 10 || spaceY < -1 || spaceY > 10){
        continue;
      }
      // Color invalid border spaces
      if(spaceX === -1){
        let invalidSquare = document.getElementById('left-y' + spaceY);
        invalidSquare.style.setProperty('background-color', 'red');
      }
      else if(spaceX === 10){
        if(spaceY < -1 || spaceY > 10){
          continue;
        }
        let invalidSquare = document.getElementById('right-y' + spaceY);
        invalidSquare.style.setProperty('background-color', 'red');  
      }
      else if(spaceY === -1){
        if(spaceX < -1 || spaceX > 10){
          continue;
        }
        let invalidSquare = document.getElementById('top-x' + spaceX);
        invalidSquare.style.setProperty('background-color', 'red');  
      }
      else if(spaceY === 10){
        if(spaceX < -1 || spaceX > 10){
          continue;
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
  }
}

// Create event listeners for the board squares
for (let square of gameSquares){
  square.addEventListener('click', onClickSquare);
  square.addEventListener('mouseenter', onMouseenter);
  square.addEventListener('mouseleave', onMouseleave);
};

// Create event listeners for pieces in bank
const gamePieces = document.getElementsByClassName('game-piece');
for (let piece of gamePieces){
  piece.addEventListener('click', onClickPiece);
};

//Spacebar rotate
document.body.onkeypress = function(event){
  if(event.keyCode === 32){
    event.preventDefault();
    onSpacebar(event);
  }
};

//Skip
skipButton.addEventListener('click', function(){
  board = updateOwnership(board);
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

function groupify(gameBoard, X, Y){
  const sameGroup = [X.toString() + Y.toString()];
  const borderingPieces = [];
  const checkNeighbors = function(coordinateString){
    const X = parseInt(coordinateString[0])
    const Y = parseInt(coordinateString[1])
    const checkSquare = function(X, Y){
      if(sameGroup.indexOf(X.toString() + Y.toString()) !== -1 || borderingPieces.indexOf(gameBoard[X][Y]) !== -1){
        return;
      }
      else if(gameBoard[X][Y] === 'empty'){
        sameGroup.push(X.toString() + Y.toString());
        checkNeighbors(X.toString() + Y.toString());
      }
      else {
        borderingPieces.push(gameBoard[X][Y]);
        return;
      }
    }
    if(X>0 && Y>0){
      checkSquare(X-1, Y-1);
    }
    if(X>0){
      checkSquare(X-1, Y);
    }
    if(X>0 && Y<9){
      checkSquare(X-1, Y+1);
    }
    if(Y>0){
      checkSquare(X, Y-1);
    }
    if(Y<9){
      checkSquare(X, Y+1);  
    }
    if(X<9 && Y>0){
      checkSquare(X+1, Y-1);
    }
    if(X<9){
      checkSquare(X+1, Y);
    }
    if(X<9 && Y<9){
      checkSquare(X+1, Y+1);
    }
  }
  checkNeighbors(X.toString()+Y.toString());
  console.log('borders ', borderingPieces);
  console.log('group ', sameGroup);
  return {borderingPieces, sameGroup};
};



function updateOwnership(gameBoard){
  for(let i=0; i<10; i++){
    for(let j=0; j<10; j++){
      if(gameBoard[i][j] === 'empty'){
        let localGroup = groupify(gameBoard, i, j);
        console.log('local creq ', localGroup);

        let countColors = function(pieces){
          let yellows = [];
          let blues = [];
          let cathedrals = [];
          for(let piece of pieces){
            console.log('peace! ', piece);
            console.log('first char: ', piece[0]);
            switch(piece[0]){
              case 'y':
                yellows.push(piece);
                break;
              case 'b':
                blues.push(piece);
                break;
              case 'c':
                cathedrals.push(piece);
                break;
              default:
                console.log('what is it? ', piece);
                break;
            }
          }
          return {yellows, blues, cathedrals};
        }


        let fillArea = function(area, color){
          if(area.length = 0){
            return;
          }
          for(square of area){
           gameBoard[square[0]][square[1]] = color;
           document.getElementById('x' + square[0] + '-y' + square[1]).style.setProperty('background-color', 'light' + color);
          }
        }
        let erasePiece = function(pieceName, newColor){
          for(let i=0;i<10;i++){
            for(let j=0;j<10;j++){
              if(gameBoard[i][j] === pieceName){
                gameBoard[i][j] = newColor;
              }
            }
          }
        }
        // Dertermine
        if(blues.length > 0 && yellows.length + cathedrals.length === 0){
          fillArea(localGroup.sameGroup, 'blue');
        }
        else if(yellows.length > 0 && blues.length + cathedrals.length === 0){
          fillArea(localGroup.sameGroup, 'yellow');
        }
        else if(yellows.length === 1 && blues.length === 1 && cathedrals.length == 0){
          for(let piece of localGroup.borderingPieces){
            //pieces[piece].occupiedSpaces.length
          }
        }
        else if(yellows.length + cathedrals.length < 2){
          if(cathedrals.length === 1){
            erasePiece('cathedral');
          }
          erasePiece(yellows[0]);
          fillArea(localGroup.sameGroup, 'blue');
        }
        else if(blues.length + cathedrals.length < 2){
          if(cathedrals.length === 1){
            erasePiece('cathedral');
          }
          erasePiece(blues[0]);
          fillArea(localGroup.sameGroup, 'yellow');
        }
      }
    }
  }
  return gameBoard;
}













































restartGame();