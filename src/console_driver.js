var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
var charToNum = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
}

var displayBoard = function () {
  var column = [0, 1, 2, 3, 4, 5, 6, 7];
  console.log("  | " + column.join("   "));
  console.log("-----------------------------------");
  for (var i = 0; i < board.length; i++) {
    console.log(numToChar[i] + " |" + board[i].join(" "));
  }
};

var getMove = function() {
  displayBoard();
  var row1 = numToChar.indexOf(prompt(currentPlayer + "'s move: please enter the row of piece to move:"));
  var col1 = parseInt(prompt("and the column:"));
  var row2 = numToChar.indexOf(prompt("And the row of the destination:"));
  var col2 = parseInt(prompt("And the column of the destination:"));
  attemptMove(row1, col1, row2, col2);
}

var play = function() {
  resetBoard();
  getMove();
}