import React from 'react';
import ReactDOM from 'react-dom';
import PieceList from './Piecelist';

it('PieceList renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PieceList />, div);
    ReactDOM.unmountComponentAtNode(div)
});