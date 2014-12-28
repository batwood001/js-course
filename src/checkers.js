var board, currentPlayer

var resetBoard = function () {
  board = [
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    ['wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X '],
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X '],
    [' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ', 'red'],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ']
  ];

  currentPlayer = 'wht'
};


var $invalid = $(document).trigger("invalidMove")

var enemyPlayer = function(currentPlayer) {
  if (currentPlayer === 'wht') {
    return 'red'
  } else {
    return 'wht'
  }
}

var makeMove = function (row1, col1, row2, col2) {
  console.log("makeMove called")
  board[row1][col1] = " X ";
  board[row2][col2] = currentPlayer;
  currentPlayer = enemyPlayer(currentPlayer);       // Change players
  console.log(board)
  $(document).trigger("boardChange", [board]);
  // getMove();
}

var removePiece = function (row, col) {
  console.log("removePiece called on row " + row + ", column " + col)
  board[row][col] = " X ";
  $(document).trigger("pieceTaken", [currentPlayer, enemyPlayer(currentPlayer), row, col]);
}

var attemptMove = function (row1, col1, row2, col2) {
  console.log("attemptMove called with params: " + row1 + col1 + row2 + col2);
  if (selectedPieceBelongsToCurrentPlayer(row1, col1)) {
    if (nextPositionIsEmpty(row2, col2)) {
      if (currentPlayer === "wht") {                // if the current player is white
        tryValidDownMove(row1, col1, row2, col2)
      } else {                                      // if the current player is red
        tryValidUpMove(row1, col1, row2, col2)
      }
    }
  }
}

//:::
//universal (both player) methods:
//:::

function selectedPieceBelongsToCurrentPlayer(row1, col1) {
  if (board[row1][col1] === currentPlayer) {
    console.log("current player is white; white piece selected");
    return true
  } else {
    console.log("Error: You didn't select one of your pieces");
    $(document).trigger("invalidMove", "You didn't select one of your pieces!")
    return false
  }
}

function nextPositionIsEmpty(row2, col2) {
  if (board[row2][col2] === " X ") {
    console.log("destination is empty");
    return true
  } else {
    console.log("Error: That position is not empty")
    $(document).trigger("invalidMove", "That position is not empty")
    return false
  }
}

//:::
//white-specific methods:
//:::

function isValidOneSquareDownMove(row1, col1, row2, col2) {
  if (row1 + 1 === row2 && (col2 === col1 -1 || col2 === col1 + 1)) {
    console.log("valid non-aggressive downward move");
    return true
  } else {
    console.log("Error: Not a valid non-aggressive move")
    return false
  }
}

function isValidTwoSquareDownMove(row1, col1, row2, col2) {
  if (row1 + 2 === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) {                        //check if it is moving 2 spaces
    if (row1 + 2 === row2 && col1 + 2 === col2) {                                             //check if it is moving down and to the right
      if (board[row1 + 1][col1 + 1] != currentPlayer && board[row1 + 1][col1 + 1] != " X ") { //check if there is an enemy piece down and to the right
        removePiece(row1 + 1, col1 + 1);
        return true 
      }
    } else if (row1 + 2 === row2 && col1 - 2 === col2) {                                      //check if it is moving down and to the left
      if (board[row1 + 1][col1 - 1] != currentPlayer && board[row1 + 1][col1 - 1] != " X ") { //check if there is an enemy piece down and to the left
        removePiece(row1 + 1, col1 - 1)
        return true
      }
    }
  } else {
    console.log("Error: Not a valid aggressive move");
    $(document).trigger("invalidMove", "Not a valid aggressive move")
    return false
  }
}

function tryValidDownMove(row1, col1, row2, col2) {
  if (isValidOneSquareDownMove(row1, col1, row2, col2)) {
    makeMove(row1, col1, row2, col2);
  } else if (isValidTwoSquareDownMove(row1, col1, row2, col2)) {
    makeMove(row1, col1, row2, col2);
  }
}

//:::
//red-specific methods:
//:::

function isValidOneSquareUpMove(row1, col1, row2, col2) {
  if (row1 - 1 === row2 && (col2 === col1 -1 || col2 === col1 + 1)) {
    console.log("valid non-aggressive downward move");
    return true;
  } else {
    console.log("Error: Not a valid non-aggressive move")
    return false
  }
}

function isValidTwoSquareUpMove(row1, col1, row2, col2) {
  if (row1 - 2 === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) {                            //check if it is moving 2 spaces
    if (row1 - 2 === row2 && col1 + 2 === col2) {                                                 //check if it is moving down and to the right
      if (board[row1 - 1][col1 + 1] != currentPlayer && board[row1 - 1][col1 + 1] != " X ") {     //check if there is an enemy piece down and to the right
        removePiece(row1 - 1, col1 + 1);
        return true 
      }
    } else if (row1 - 2 === row2 && col1 - 2 === col2) {                                          //check if it is moving down and to the left
      if (board[row1 - 1][col1 - 1] != currentPlayer && board[row1 - 1][col1 - 1] != " X ") {     //check if there is an enemy piece down and to the left
        removePiece(row1 - 1, col1 - 1)
        return true
      }
    }
  } else {
    console.log("Error: Not a valid aggressive move");
    $(document).trigger("invalidMove", "Not a valid aggressive move")
    return false
  }
}

function tryValidUpMove(row1, col1, row2, col2) {
  if (isValidOneSquareUpMove(row1, col1, row2, col2)) {
    makeMove(row1, col1, row2, col2);
  } else if (isValidTwoSquareUpMove(row1, col1, row2, col2)) {
    makeMove(row1, col1, row2, col2);
  }
}