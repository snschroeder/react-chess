import React from 'react';
import './board.css'
import Piecelist from './pieceslist/Piecelist'

import chess from '../chess-engine/chessEngine';

export default class Board extends React.Component {
  state = {
    boardHeight: null,
    boardWidth: null,
    squareSize: null,
    board: null,
    pieces: [],
  }

  board = React.createRef();

  componentDidMount() {
    this.updateDimensions();
    const currBoard = [...chess.board];
    this.setState({
      board: currBoard,
    });
    window.addEventListener('resize', this.updateDimensions);
    setTimeout(() => {
      this.updatePieceList()
    }, 50)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    let board = this.board.current;
    let square = board.clientWidth / 8;
    this.setState({
      boardHeight: board.clientHeight,
      boardWidth: board.clientWidth,
      squareSize: square,
    })
  }

  updatePieceList = () => {
    const pieceList = this.generatePiecePosition();
    this.setState({ pieces: pieceList })
  }

  generatePiecePosition = () => {
    const pieceData = [];
    const { board } = this.state;

    for (let i = 0; i < board.length; i += 1) {
      if (board[i] !== 0 && board[i] !== 7) {
        const color = Math.sign(board[i]) === 1 ? 'w' : 'b';
        const x = i % 10;
        const y = (i - x) / 10;
        const piece = chess.pieces[Math.abs(board[i])];
        const id = `${color}-${chess.squares[i][0]}-${piece}`

        const pieceInfo = {
          color,
          id,
          value: board[i],
          pieceType: `${color}-${piece}`,
          pieceClass: piece,
          notation: chess.squares[i],
          position: {x: x - 1, y: y - 2},
          boardIndex: i,
        }
        pieceData.push(pieceInfo);
      }

    }
    return pieceData;
  }

  translateArrayIndexToXY(index) {
    const x = index % 10;
    const y = (index - x) / 10;
    return {x, y};
  }

  // can we store active piece in state, updating when a piece is moved?

  findPieceByPos(position) {
    // console.log('searching')
    console.log(position);
    // const xyPos = this.translateArrayIndexToXY(position);
    const { pieces } = this.state;

    for (let i = 0; i < pieces.length; i += 1) {
      if (pieces[i].position.x === position.x && pieces[i].position.y === position.y) {
        // console.log(pieces[i].position);
        return pieces[i];
      }
    }
    return null;
  }

  onChange = (startPos, id, endPos) => {
    const { squareSize } = this.state;

    // console.log(endPos)

    // const start = this.translateArrayIndexToXY(startPos);
    // const end = this.translateArrayIndexToXY(endPos);

    const snapX = Math.round((endPos.x / squareSize));
    const snapY = Math.round((endPos.y / squareSize));

    const snappedPos = {x: snapX, y: snapY};
    // console.log('snapped pos');
    // console.log(snappedPos);

    const piece = this.findPieceByPos(startPos);

    console.log(snappedPos);

    const moveIndex = ((snappedPos.y + 2) * 10) + snappedPos.x + 1;
    console.log(moveIndex);

    const move = chess.isValidMove(chess.board, piece.color, piece.value, piece.boardIndex, moveIndex);
    console.log(move);

  }


  //update to use pieceId to find moving piece rather than position

  // onChange = (x, y, piecePos) => {
  //   const { squareSize } = this.state;
    // let piecePosArr = [piecePos.y, piecePos.x]
    // let snapX = Math.round((x / this.state.squareSize));
    // let snapY = Math.round((y / this.state.squareSize));
    // let piece;

    // let move = this.state.gameState.isValidMove(piecePosArr, [snapY, snapX])

    // if (move) {
    //   this.state.gameState.board.playArea.forEach(row => row.forEach(col => {
    //     if (col.position[0] === piecePos.x && col.position[1] === piecePos.y) {
    //       piece = col.getPiece()
    //     }
    //   }))
    //   this.state.gameState.turn(piece, [snapY, snapX])
    //   this.updatePieceList();
    // }
  // }

  render() {
    const { squareSize, pieces } = this.state;

    return (
      <div className="board" ref={this.board} >

        <Piecelist
          squareSize={squareSize}
          pieces={pieces}
          updatePos={this.onChange} />
      </div>
    );
  }
}