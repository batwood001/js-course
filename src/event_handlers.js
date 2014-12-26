var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];

$(document).on('boardChange', function(e, board){
	e.preventDefault();
	$(".col").children().remove();
	for (row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (board[row][col] === "wht") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whitepiece></div")
			} else if (board[row][col] === "red") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redpiece></div")
			}
		}
	}
});