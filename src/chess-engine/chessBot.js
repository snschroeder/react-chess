const chessBot = {
  findBestMove(gameState) {
    //let color = gameState.currentState[0].player;
    let allMoves = gameState.generateAllLegalMoves('white');
    allMoves = allMoves.filter(piece => piece.moves.length !== 0);
    let best = { piece: null, move: [] };
    let gauge = 0;

    allMoves.forEach(piece => {
      piece.moves.forEach(move => {
        const [rank, file] = move;
        if (this.pointBoard[rank][file] <= gauge) {
          gauge = this.pointBoard[rank][file];
          best.piece = piece;
          best.move = move;
        }
      })
    })
    if (gauge === 0) {
      return this.pickRandomMove(gameState)
    }
    return best;
  },

pickRandomMove(gameState) {
    if (gameState.currentState[0].player === 'white') {
      let legalMoves = gameState.generateAllLegalMoves('white');
      legalMoves = legalMoves.filter(piece => piece.moves.length !== 0);
      const randomPiece = legalMoves[Math.floor(Math.random() * Math.floor(legalMoves.length))]
      let randomMove = randomPiece.moves[Math.floor(Math.random() * Math.floor(randomPiece.moves.length))]
      return { piece: randomPiece, move: randomMove }
    }
  },

miniMaxRoot(depth, game, isMaxPlayer) {
    // let color;
    // if (isMaxPlayer) {
    //     color = 'white';
    // } else {
    //     color = 'black';
    // }
    let moves = game.generateAllLegalMoves('white');
    let bestEval = -9999;
    let best = { piece: null, move: null };

    moves.forEach(piece => {
      piece.moves.forEach(move => {
        game.turn(piece, move)
        let val = this.miniMax(depth - 1, game, !isMaxPlayer);
        game.undo();

        if (val >= bestEval) {
          bestEval = val;
          best = { piece, move };
        }
      })
    })
    console.log('final: ' + bestEval)

    if (bestEval === 0) {
      best = this.pickRandomMove(game)
    }
    return best;
  },

miniMax(depth, game, isMaxPlayer) {
    if (depth === 0 || game.currentState[0].checkmate || game.currentState[1].checkmate || game.currentState[0].stalemate || game.currentState[1].stalemate) {
      return game.evaluateBoard();

    }
    //let moves = game.generateAllLegalMoves(isMaxPlayer ? 'white' : 'black');
    let bestEval;
    let moves = [];

    if (isMaxPlayer) {

      moves = game.generateAllLegalMoves('white')
      bestEval = -9999;

      moves.forEach(piece => {
        piece.moves.forEach(move => {
          console.log(piece);
          console.log(move);
          game.turn(piece, move)
          bestEval = Math.max(bestEval, this.miniMax(depth - 1, game, !isMaxPlayer));
          //console.log(game.board.playArea)
          game.undo();
        })
      })
      //console.log('white player best: ' + bestEval)
      return bestEval;
    } else {
      moves = game.generateAllLegalMoves('black')
      bestEval = 9999;
      moves.forEach(piece => {
        piece.moves.forEach(move => {
          console.log(piece);
          console.log(move);
          game.turn(piece, move)
          bestEval = Math.min(bestEval, this.miniMax(depth - 1, game, !isMaxPlayer));
          //console.log(game.board.playArea)
          game.undo();
        })
      })
      //console.log('black player best: ' + bestEval)
      return bestEval;
    }
  },
}

export default chessBot;