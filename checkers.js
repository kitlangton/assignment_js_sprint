function Piece(color) {
  this.color = color;
}


function Checkers() {

  this.board = new Array(8);

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

    if (to[0] >= this.board.length || to[1] >= this.board.length) {
      return false;
    }

    validSingleMoves = [ [from[0] - 1, from[1] + 1] , 
                         [from[0] + 1, from[1] + 1] , 
                         [from[0] + 1, from[1] - 1] , 
                         [from[0] - 1, from[1] - 1]  
                       ];
   

    validDoubleMoves = [ [from[0] - 2, from[1] + 2] , 
                         [from[0] + 2, from[1] + 2] , 
                         [from[0] + 2, from[1] - 2] , 
                         [from[0] - 2, from[1] - 2] , 
                       ];

    for (var i = 0; i < validSingleMoves.length; i++ ) {

      if ( to.join("") == validSingleMoves[i].join("") ) {
        if (!this.pieceAt(to[0], to[1])) {
          return true;
        }
      }
    }

    for (var i = 0; i < validDoubleMoves.length; i++ ) {

      if ( to.join("") == validDoubleMoves[i].join("") ) {

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
     
          if ( this.colorAt(middle_row, middle_col) != this.colorAt(from[0], from[1])) {
            this.board[middle_row][middle_col] = null;
            return true;
          }
        }
      }
    }

    return false;
  };

  this.move = function(from, to) {

    if (this.validMove(from,to)) {
      this.board[to[0]][to[1]] = this.pieceAt(from[0], from[1]);
      this.board[from[0]][from[1]] = null;
    } else {
      console.log("This is not a valid move");
    }
  }
  
  this.buildBoard();
  }

var renderBoard = function(game) {
  $(".board").html("");
  for (var i = 0; i < game.board.length; ++i) {
    for (var j = 0; j < game.board[i].length; ++j) {
      var space = $($.parseHTML("<div class='space'></div>"));
      space.data("row", i);
      space.data("col", j);
      if ( (i + j) % 2 == 0 ) {
        space.addClass('even');
      }
      var piece = game.pieceAt(i,j);
      if (piece) {
        space.append("<div class='piece " + game.colorAt(i,j) + "'></div>");
      }
      $(".board").append(space);
    }
    $(".board").append("<br>");
  }
};


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
        var to = [$(this).data('row'), $(this).data('col')];
        var toSpace = $(this);
        var offset = toSpace.offset();
        self.game.move(from, to);
        fromPiece.animate({left: offset.left - fromOffset.left + 5, top: offset.top - fromOffset.top + 5});
        from = null;
        self.moving = true;
        setTimeout(function() { self.render(); self.moving = false; }, 500 );
      } else {
        fromPiece = $(this).find(".piece");
        if (!fromPiece) {
          return false;
        }
        from = [$(this).data('row'), $(this).data('col')];
        fromOffset = fromPiece.offset();
      }
    });
  }

  this.render();
  this.handleClick();
}

$(document).ready(function() {
  var checkers = new CheckersUI('.board');
});
