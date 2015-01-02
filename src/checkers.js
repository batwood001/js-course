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

var enemyPlayer = function(currentPlayer) {
  if (currentPlayer === 'wht') {
    return 'red'
  } else {
    return 'wht'
  }
}

var makeMove = function (row1, col1, row2, col2) {
  console.log("makeMove called with params " + row1 + col1 + row2 + col2);
  if (board[row1][col1] === "redK") {
    board[row2][col2] = "redK"
  } else if (board[row1][col1] === "whtK") {
    board[row2][col2] = "whtK"
  } else if (board[row1][col1] === "red" && row2 === 0) {
    console.log("UNIT SHOULD BE KINGED")
    board[row2][col2] = "redK"
  } else if (board[row1][col1] === "wht" && row2 === 7) {
    board[row2][col2] = "whtK"
  } else {
    board[row2][col2] = currentPlayer;
  }
  board[row1][col1] = " X ";
  // currentPlayer = enemyPlayer(currentPlayer);       // Change players
  displayBoard()
  $(document).trigger("boardChange", [board]);
  // $( "body" ).append("<div>Current Player Is:" + currentPlayer + "</div>")
  // getMove();
}

// var removePiece = function (row, col) {
//   console.log("removePiece called on row " + row + ", column " + col)
//   board[row][col] = " X ";
//   $(document).trigger("pieceTaken", [currentPlayer, enemyPlayer(currentPlayer), row, col]);
// }

var removePiece = function (row1, col1, row2, col2) {
  var row = (row1 + row2) / 2
  var col = (col1 + col2) / 2  // taking the average of the rows and columns give the piece in between
  console.log("removePiece called on row " + row + ", column " + col)
  board[row][col] = " X ";
  $(document).trigger("pieceTaken", [currentPlayer, enemyPlayer(currentPlayer), row, col]);
}

var attemptMove = function (row1, col1, row2, col2) {
  console.log("attemptMove called with params: " + row1 + col1 + row2 + col2);
  if (selectedPieceBelongsToCurrentPlayer(row1, col1)) {
    if (nextPositionIsEmpty(row2, col2)) {
      if (board[row1][col1] === "wht") {
        if (tryMove(row1, col1, row2, col2, "down")) {
          return (tryMove(row1, col1, row2, col2, "down"))
        } else {
          return false
        }
      } else if (board[row1][col1] === "red") {
        if (tryMove(row1, col1, row2, col2, "up")) {         // if the current player is red
          return (tryMove(row1, col1, row2, col2, "up"))
        } else {
          return false
        }
      } else if (board[row1][col1] === "whtK" || board[row1][col1] === "redK") {
        console.log("YOU ARE MOVING A KINGED PIECE")
        if (tryMove(row1, col1, row2, col2, "up")) {
          return (tryMove(row1, col1, row2, col2, "up"))
        } else if (tryMove(row1, col1, row2, col2, "down")) {
          return (tryMove(row1, col1, row2, col2, "down"))
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}

//:::
//universal (both player) methods:
//:::

function selectedPieceBelongsToCurrentPlayer(row1, col1) {
  if (board[row1][col1] === currentPlayer || board[row1][col1] === currentPlayer + "K") {
    // console.log("current player is white; white piece selected");
    return true
  } else {
    // console.log("Error: You didn't select one of your pieces");
    // $(document).trigger("invalidMove", "You didn't select one of your pieces!")
    // currentPlayer = enemyPlayer(currentPlayer); //this is a hack that will break the Console UI version, but make the GUI version work (for now).
    // moveSequence = [];
    return false
  }
}

function nextPositionIsEmpty(row2, col2) {
  if (board[row2][col2] === " X ") {
    console.log("destination is empty");
    return true
  } else {
    console.log("Error: That position is not empty")
    // $(document).trigger("invalidMove", "That position is not empty")
    // currentPlayer = enemyPlayer(currentPlayer); //this is a hack that will break the Console UI version, but make the GUI version work (for now).
    // moveSequence = [];
    return false
  }
}

var vertMove = function(start, distance, direction) {             // helper function to isValidOneSquareMove and isValidTwoSquareMove
  if (direction === "down") {
    return start + distance
  } else {
    return start - distance
  }
}

function isValidOneSquareMove(row1, col1, row2, col2, direction) {
  if (vertMove(row1, 1, direction) === row2 && (col2 === col1 -1 || col2 === col1 + 1)) {
    console.log("valid non-aggressive downward move");
    return true
  } else {
    console.log("Error: Not a valid non-aggressive move");
    return false
  }
}

function isValidTwoSquareMove(row1, col1, row2, col2, direction) {
  if (vertMove(row1, 2, direction) === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) {                        //check if it is moving 2 spaces
    if (vertMove(row1, 2, direction) === row2 && col1 + 2 === col2) {                                             //check if it is moving down and to the right
      if (board[vertMove(row1, 1, direction)][col1 + 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 + 1] != " X ") { //check if there is an enemy piece down and to the right
        return "valid right move" 
      }
    } else if (vertMove(row1, 2, direction) === row2 && col1 - 2 === col2) {                                      //check if it is moving down and to the left
      if (board[vertMove(row1, 1, direction)][col1 - 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 - 1] != " X ") { //check if there is an enemy piece down and to the left
        return "valid left move"
      }
    }
  } else {
    console.log("Error: Not a valid aggressive move");
    // $(document).trigger("invalidMove", "Not a valid aggressive move")
    // moveSequence = [];
    // currentPlayer = enemyPlayer(currentPlayer); //this is a hack that will break the Console UI version, but make the GUI version work (for now).
    return false
  }
}

function tryMove(row1, col1, row2, col2, direction) {
  if (isValidOneSquareMove(row1, col1, row2, col2, direction)) {
    return "nonaggressive"
  } else if (isValidTwoSquareMove(row1, col1, row2, col2, direction) === "valid right move") {
    // removePiece(vertMove(row1, 1, direction), col1 + 1);
    // makeMove(row1, col1, row2, col2);
    return "aggressive"
  } else if (isValidTwoSquareMove(row1, col1, row2, col2, direction) === "valid left move") {
    // removePiece(vertMove(row1, 1, direction), col1 - 1)
    // makeMove(row1, col1, row2, col2); 
    return "aggressive"
  } else {
    return false
  }
}
