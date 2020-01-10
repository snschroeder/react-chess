import React from 'react';
import Piece from '../piece/Piece'

export default class Piecelist extends React.Component {
    state = {
        pieces: []
    }

    displayPiecesPos = () => {
        let piecesJSX = this.props.pieces.map(piece => {
            return <Piece
                color={piece.color}
                // square={piece.notation}
                pieceType={piece.pieceType}
                // id={piece.id}
                pos={piece.position}
                // key={piece.id}
                squareSize={this.props.squareSize}
                updatePos={this.props.updatePos} 
            />
        })
        return piecesJSX;
    }

    render() {
        return (
            <>
                {this.displayPiecesPos()}
            </>
        )
    }
}