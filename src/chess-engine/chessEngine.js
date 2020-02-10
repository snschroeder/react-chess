// const boards = require('../test/test-helpers');

const chess = {
  black: 'b',
  white: 'w',

  pieces: {
    1: 'pawn',
    3: 'knight',
    4: 'bishop',
    5: 'rook',
    9: 'queen',
    10: 'king',
  },

  board: [
    7,  7,  7,  7,  7,  7,   7,  7,  7, 7,
    7,  7,  7,  7,  7,  7,   7,  7,  7, 7,
    7,  5,  3,  4,  9,  10,  4,  3,  5, 7,
    7,  1,  1,  1,  1,  1,   1,  1,  1, 7,
    7,  0,  0,  0,  0,  0,   0,  0,  0, 7,
    7,  0,  0,  0,  0,  0,   0,  0,  0, 7,
    7,  0,  0,  0,  0,  0,   0,  0,  0, 7,
    7,  0,  0,  0,  0,  0,   0,  0,  0, 7,
    7, -1, -1, -1, -1, -1,  -1, -1, -1, 7,
    7, -5, -3, -4, -9, -10, -4, -3, -5, 7,
    7,  7,  7,  7,  7,  7,   7,  7,  7, 7,
    7,  7,  7,  7,  7,  7,   7,  7,  7, 7,
  ],

  squares: {
    21: 'a1', 22: 'b1', 23: 'c1', 24: 'd1', 25: 'e1', 26: 'f1', 27: 'g1', 28: 'h1',
    31: 'a2', 32: 'b2', 33: 'c2', 34: 'd2', 35: 'e2', 36: 'f2', 37: 'g2', 38: 'h2',
    41: 'a3', 42: 'b3', 43: 'c3', 44: 'd3', 45: 'e3', 46: 'f3', 47: 'g3', 48: 'h3',
    51: 'a4', 52: 'b4', 53: 'c4', 54: 'd4', 55: 'e4', 56: 'f4', 57: 'g4', 58: 'h4',
    61: 'a5', 62: 'b5', 63: 'c5', 64: 'd5', 65: 'e5', 66: 'f5', 67: 'g5', 68: 'h5',
    71: 'a6', 72: 'b6', 73: 'c6', 74: 'd6', 75: 'e6', 76: 'f6', 77: 'g6', 78: 'h6',
    81: 'a7', 82: 'b7', 83: 'c7', 84: 'd7', 85: 'e7', 86: 'f7', 87: 'g7', 88: 'h7',
    91: 'a8', 92: 'b8', 93: 'c8', 94: 'd8', 95: 'e8', 96: 'f8', 97: 'g8', 98: 'h8',
  },

  history: [],
  currentTurn: ['w', 'b'],

  rookOffset: [-10, -1, 1, 10],
  bishopOffset: [-11, -9, 9, 11],
  omniOffset: [-11, -10, -9, -1, 1, 9, 10, 11],


  generateSlidingMoves(board, pos, pattern) {
    const offset = [...pattern];
    const side = Math.sign(board[pos]);
    const moves = [];

    for (let j = 0; j < offset.length; j += 1) {
      for (let i = 1; i < 8; i += 1) {
        if (offset[j] !== 0) {
          const xSide = Math.sign(board[pos + (i * offset[j])]);
          if (board[pos + (i * offset[j])] === 7 || side === xSide) {
            offset[j] = 0;
          } else if (board[pos + (i * offset[j])] === 0) {
            moves.push(pos + (i * offset[j]));
          } else if (side !== xSide) {
            moves.push(pos + (i * offset[j]));
            offset[j] = 0;
          }
        }
      }
    }
    return moves;
  },

  generateKnightMoves(board, pos) {
    const knightOffset = [21, 19, 8, 12, -8, -12, -19, -21];
    const side = Math.sign(board[pos]);
    const moves = [];

    knightOffset.forEach((jump) => {
      const xSide = Math.sign(board[pos + jump]);
      if (board[pos + jump] !== 7) {
        if (board[pos + jump] === 0 || side !== xSide) {
          moves.push(pos + jump);
        }
      }
    });
    return moves;
  },

  generateKingMoves(board, pos) {
    const offset = [-11, -10, -9, -1, 1, 9, 10, 11];
    const side = Math.sign(board[pos]);
    const moves = [];

    offset.forEach((move) => {
      const xSide = Math.sign(board[pos + move]);
      if (board[pos + move] !== 7) {
        if (board[pos + move] === 0 || side !== xSide) {
          moves.push(pos + move);
        }
      }
    });
    return moves;
  },

  generatePawnMoves(board, pos) {
    const side = Math.sign(board[pos]);
    const moves = [];
    let offset = [10];
    let captures = [9, 11];
    if (pos >= 31 && pos <= 38 && board[pos + 10] === 0) {
      offset.push(20);
    } else if (pos >= 81 && pos <= 88 && board[pos - 10] === 0) {
      offset.push(20);
    }
    offset = offset.map((val) => val * side);
    captures = captures.map((val) => val * side);
    offset.forEach((move) => {
      const xSide = Math.sign(board[pos + move]);
      if (board[pos + move] !== 7 && xSide === 0) {
        moves.push(pos + move);
      }
    });
    captures.forEach((move) => {
      const xSide = Math.sign(board[pos + move]);
      if (board[pos + move] !== 7 && side !== xSide && board[pos + move] !== 0) {
        moves.push(pos + move);
      }
    });
    return moves;
  },

  evaluateBoard(board) {
    return board.reduce((a, b) => a + b) - 392;
  },


  genDirtyMoves(board, color) {
    const side = color === 'w' ? 1 : -1;
    const moves = [];
    board.forEach((square, index) => {
      if (square !== 7) {
        switch (square * side) {
          case 1:
            moves.push([square, index, ...this.generatePawnMoves(board, index)]);
            break;
          case 3:
            moves.push([square, index, ...this.generateKnightMoves(board, index)]);
            break;
          case 4:
            moves.push([square, index, ...this.generateSlidingMoves(board, index, this.bishopOffset)]);
            break;
          case 5:
            moves.push([square, index, ...this.generateSlidingMoves(board, index, this.rookOffset)]);
            break;
          case 9:
            moves.push([square, index, ...this.generateSlidingMoves(board, index, this.omniOffset)]);
            break;
          case 10:
            moves.push([square, index, ...this.generateKingMoves(board, index)]);
            break;
          default:
            break;
        }
      }
    });
    return moves;
  },

  // O n^2 - can we make this O(n)?
  genShortDirtyMoves(board, color) {
    const piecesMoves = this.genDirtyMoves(board, color);
    const moves = [];
    piecesMoves.forEach((piece) => moves.push(...piece.splice(2)));
    return moves;
  },

  checkForCheck(board, defColor) {
    const attColor = (defColor === 'w' ? 'b' : 'w');
    const side = (defColor === 'w' ? 1 : -1);
    const kingPos = board.findIndex((square) => square * side === 10);
    const attacks = this.genShortDirtyMoves(board, attColor);
    const filteredAttacks = attacks.filter((move) => move === kingPos);
    return filteredAttacks.length > 0;
  },

  // O n^2 - can we make this O(n)?
  genAllPseudoLegalMoves(board, moveColor) {
    const moves = this.genDirtyMoves(board, moveColor);
    const cleanMoves = moves.map((piece) => piece.filter((move, index) => {
      if (index > 1) {
        const boardClone = [...board];
        const [val, pos] = [...piece];
        boardClone[pos] = 0;
        boardClone[move] = val;
        return !this.checkForCheck(boardClone, moveColor);
      }
      return true;
    }));
    return cleanMoves;
  },

  genAllLegalMoves(board, moveColor) {
    const moves = this.genAllPseudoLegalMoves(board, moveColor);
    const cleanMoves = moves.map((piece) => piece.filter((move, index) => {
      if (index > 1) {
        if (board[move] === 10 || board[move] === -10) {
          return false;
        }
      }
      return true;
    }));
    return cleanMoves;
  },

  // O n^2 - can we make this O(n)?
  genShortPseudoLegalMoves(board, moveColor) {
    const moves = this.genAllPseudoLegalMoves(board, moveColor);
    const dirtyMoves = [];
    moves.forEach((piece) => dirtyMoves.push(...piece.splice(2)));
    return dirtyMoves;
  },

  isValidMove(board, moveColor, reqPiece, startPos, move) {
    const side = moveColor === 'w' ? 1 : -1;
    if (side * reqPiece < 0) {
      return false;
    }
    if (board[move] === 7) {
      return false;
    }
    if (moveColor !== this.currentTurn[0]) {
      return false;
    }
    if (move < 21 || move > 98) {
      return false;
    }
    let isValid = false;
    const moves = this.genAllLegalMoves(board, moveColor);
    moves.forEach((piece) => {
      if (piece[0] === reqPiece && piece[1] === startPos) {
        if (piece.splice(2).includes(move)) {
          isValid = true;
        }
      }
    });
    return isValid;
  },

  turn(color, reqPiece, startPos, move) {
    if (color !== this.currentTurn[0]) {
      return `Not ${color === 'w' ? 'white' : 'black'}'s turn`;
    }
    if (!this.isValidMove(this.board, color, reqPiece, startPos, move)) {
      return 'That is not a valid move';
    }
    const storedPiece = this.board[move];
    this.board[startPos] = 0;
    this.board[move] = reqPiece;

    const hist = {
      moved: reqPiece,
      from: startPos,
      to: move,
      cap: storedPiece,
    };

    this.history.push(hist);
    this.currentTurn.reverse();
  },

  undo() {
    if (this.history.length > 0) {
      const last = this.history.pop();
      this.board[last.from] = last.moved;

      if (last.cap) {
        console.log('in the cap undo')
        this.board[last.to] = last.cap;
      } else {
        this.board[last.to] = 0;
      }
    }
  },

  // undo() {
  //   if (this.history.length > 0) {
  //     const lastIndex = this.history.length -1;
  //     const last = this.history[lastIndex]
  //     this.board[last.from] = last.moved;

  //     if (last.cap) {
  //       console.log('in the cap undo')
  //       this.board[last.to] = last.cap;
  //     } else {
  //       this.board[last.to] = 0;
  //     }
  //   }
  // },

  // enPassant {

  // },
  // promotion {

  // },
  // castle {

  // },

  // threefoldRep() {

  // },
};

export default chess;


// module.exports = chess;