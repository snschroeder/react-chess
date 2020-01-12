import React from 'react';
import Piece from '../piece/Piece'

export default class Piecelist extends React.Component {
    state = {
        pieces: []
    }

    displayPiecesPos = () => {
        const { pieces, squareSize, updatePos } = this.props;

        let piecesJSX = pieces.map(piece => {
            return <Piece
                color={piece.color}
                square={piece.notation}
                pieceType={piece.pieceType}
                id={piece.id}
                pos={piece.position}
                key={piece.id}
                squareSize={squareSize}
                updatePos={updatePos} 
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