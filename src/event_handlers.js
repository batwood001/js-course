var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
var clicks = 0;
var col, row, col1, row1

$(document).ready(function(e) {
	
	$(document).on('boardChange', function (e, board) {
		e.preventDefault();
		turns += 1;
		$(".turncounter").html("Turns: " + turns);
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
	  clicks += 1
	  executeMove(col, row, clicks)
	})

	var executeMove = function(col, row, clicks) {
		if (clicks === 2) {
	  		console.log("2 clicks; col1 = " + col1 + ", row1 = " + row1 + ", col = " + col + ", row = " + row)
	  		attemptMove(col1, row1, col, row);
	  		clicks = 0;
	  	} else {
	  		col1, row1 = col, row;
	  	}		
	}


})

