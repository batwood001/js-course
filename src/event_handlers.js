var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
var clicks = 0;
var col, row, col1, row1
var $showPieces = function(board) {
	for (row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (board[row][col] === "wht") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whitepiece></div")
			} else if (board[row][col] === "red") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redpiece></div")
			}
		}
	}	
}

$(document).ready(function(e) {

	$(".start").click(function(e){
		e.preventDefault();
		resetBoard();
		turns = 0;
		displayBoard();
		$showPieces(board);
	})
	
	$(document).on('boardChange', function (e, board) {
		e.preventDefault();
		turns += 1;
		$(".turncounter").html("Turns: " + turns);
		$(".col").children().remove();
		$showPieces(board);
	});

	$(document).on("pieceTaken", function (e, currentPlayer, enemyPlayer, row, col) {
		e.preventDefault();
		alert(enemyPlayer + " took " + currentPlayer + "'s piece at location " + row + ", " + col + "!");
	})

	$(document).on("invalidMove", function(e){
		e.preventDefault();
		alert("That's not a valid move!")
	})

	$( ".col" ).click(function(e) {
	  col = parseInt(this.className[8]);
	  console.log("col = " + col)
	});

	$( ".row" ).click(function(e) {
	  row = numToChar.indexOf(this.className[8]);
	  console.log("row = " + row)
	  clicks += 1
	  if (clicks === 2) {
	  	console.log("2 clicks; col1 = " + col1 + ", row1 = " + row1 + ", col = " + col + ", row = " + row)
	  	attemptMove(row1, col1, row, col);
	  	clicks = 0;
	  } else {
	  	col1 = col;
	  	row1 = row;
	  	console.log("col1this = " + col1 + ", row1this = " + row1);
	  }	
	})

})

