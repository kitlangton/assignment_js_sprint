function Piece(color) {
  this.color = color;

  this.enemyColor = function() {
    if (this.color == "red") {
      return 'black';
    } else {
      return 'red';
    }
  }

  this.redSingleMoves = function(from) {
    return [
      [from[0] + 1, from[1] + 1] ,
      [from[0] + 1, from[1] - 1]
    ]
  };

  this.blackSingleMoves = function(from) {
    return [
      [from[0] - 1, from[1] + 1] ,
      [from[0] - 1, from[1] - 1]
    ]
  };

  this.redDoubleMoves = function(from) {
    return [
    [from[0] + 2, from[1] + 2] ,
    [from[0] + 2, from[1] - 2]
  ]
  };

  this.blackDoubleMoves = function(from) {
    return [
      [from[0] - 2, from[1] + 2] ,
      [from[0] - 2, from[1] - 2] ,
    ]
  };

  this.validSingleMoves = function(from) {
    if (this.color == 'red') {
      return this.redSingleMoves(from);
    } else {
      return this.blackSingleMoves(from);
    }
  }

  this.validDoubleMoves = function(from) {
    if (this.color == 'red') {
      return this.redDoubleMoves(from);
    } else {
      return this.blackDoubleMoves(from);
    }
  }
}


function Checkers() {

  this.board = new Array(8);
  this.turn = "red";

  this.buildBoard = function() {
    for (var i = 0; i < 8 ; i++) {
      this.board[i] = new Array(8);

      for (var j = 0; j < 8 ; j++) {
        if ((i + j) % 2 == 1 ) {
          if (i < 3) {
            this.board[i][j] = new Piece("red");
          } else if (i > 4) {
            this.board[i][j] = new Piece("black");
          }
        }
      }
    }
  };

  this.pieceAt = function(row, col) {
    return this.board[row][col];
  };

  this.colorAt = function(row, col) {
    var piece = this.board[row][col];
    if (piece) {
      return piece.color;
    } else {
      return "";
    }
  };

  this.validMove = function(from, to) {

    var fromPiece = this.pieceAt(from[0], from[1]);

    if (!fromPiece)  {
      return false;
    }

    if (fromPiece.color != this.turn)  {
      return false;
    }

    if (to[0] >= this.board.length || to[1] >= this.board.length) {
      return false;
    }


    for (var i = 0; i < fromPiece.validSingleMoves(from).length; i++ ) {

      if ( to.join("") == fromPiece.validSingleMoves(from)[i].join("") ) {
        if (!this.pieceAt(to[0], to[1])) {
          return true;
        }
      }
    }

    for (var i = 0; i < fromPiece.validDoubleMoves(from).length; i++ ) {

      if ( to.join("") == fromPiece.validDoubleMoves(from)[i].join("") ) {

        if ( !this.pieceAt(to[0], to[1]) ) {

          if ( to[0] > from[0] ) {
            var middle_row = from[0] + 1;
          } else {
            var middle_row = from[0] - 1;
          }

          if ( to[1] > from[1] ) {
            var middle_col = from[1] + 1;
          } else {
            var middle_col = from[1] - 1;
          }

          if ( this.colorAt(middle_row, middle_col) == this.pieceAt(from[0], from[1]).enemyColor()) {
            this.board[middle_row][middle_col] = null;
            return true;
          }
        }
      }
    }

    return false;
  };

  this.nextTurn = function() {
    if (this.turn == "red") {
      this.turn = 'black';
    } else {
      this.turn = 'red';
    }
  }

  this.move = function(from, to) {
    if (this.validMove(from,to)) {
      this.board[to[0]][to[1]] = this.pieceAt(from[0], from[1]);
      this.board[from[0]][from[1]] = null;
      this.nextTurn();
      return true;
    } else {
      console.log("This is not a valid move");
      return false;
    }
  }

  this.buildBoard();
}

function CheckersUI(el) {
  this.game = new Checkers();
  var self = this;
  this.el = $(el);

  this.render = function() {
    this.el.html("");
    for (var i = 0; i < this.game.board.length; ++i) {
      for (var j = 0; j < this.game.board[i].length; ++j) {
        var space = $($.parseHTML("<div class='space'></div>"));
        space.data("row", i);
        space.data("col", j);
        if ( (i + j) % 2 == 0 ) {
          space.addClass('even');
        }
        var piece = this.game.pieceAt(i,j);
        if (piece) {
          space.append("<div class='piece " + this.game.colorAt(i,j) + "'></div>");
        }
        this.el.append(space);
      }
      this.el.append("<br>");
    }
    this.el.prepend("<h2 id='turn'>" + this.game.turn + "'s move<h2>");
  }

  this.moving = false;
  var fromPiece;
  var fromOffset;
  var from;

  this.handleClick = function() {
    $('.board').on('click', '.space', function(event) {
      if (self.moving) {
        return false;
      }
      if (from) {
        fromPiece.removeClass('selected');
        var to = [$(this).data('row'), $(this).data('col')];
        var toSpace = $(this);
        var offset = toSpace.offset();
        if (self.game.move(from, to)) {
          fromPiece.css({left: offset.left - fromOffset.left + 5, top: offset.top - fromOffset.top + 5});
          from = null;
          self.moving = true;
          setTimeout(function() { self.render(); self.moving = false; }, 500 );
        } else {
          fromPiece = null;
          fromOffset = null;
          from = null;
        }
      } else {
        fromPiece = $(this).find(".piece");
        if (!fromPiece) {
          return false;
        } else {
          from = [$(this).data('row'), $(this).data('col')];
          if (self.game.colorAt(from[0], from[1]) == self.game.turn) {
            fromPiece.addClass('selected');
          }
          fromOffset = fromPiece.offset();
        }
      }
    });
  }

  this.render();
  this.handleClick();
}

$(document).ready(function() {
  var checkers = new CheckersUI('.board');
});
