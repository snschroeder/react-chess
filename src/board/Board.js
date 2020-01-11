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
        const color = Math.sign(board[i]) === 1 ? 'white' : 'black';
        const x = i % 10;
        const y = (i - x) / 10;
        const id = `${color}-${chess.squares[i][0]}-${chess.pieces[Math.abs(board[i])]}`

        console.log(id);
        const pieceInfo = {
          color,
          id,
          pieceType: `${color}-${chess.pieces[Math.abs(board[i])]}`,
          notation: chess.squares[i],
          position: {x: x - 1, y: y - 2},
        }
        pieceData.push(pieceInfo);
      }

    }
    return pieceData;
  }




  //update to use pieceId to find moving piece rather than position

  onChange = (x, y, pieceId, piecePos) => {
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
  }

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