import React from 'react';
import './piece.css'

export default class Piece extends React.Component {
  state = {
    dragPos: {},
    dragging: false,
    rel: null,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }

  onMouseDown = e => {
    if (e.button !== 0) {
      return;
    }
    let elem = document.elementFromPoint(e.pageX, e.pageY)

    let updatedRel = {
      x: e.pageX - elem.offsetLeft,
      y: e.pageY - elem.offsetTop
    }
    this.setState({
      dragging: true,
      dragPos: { x: this.props.pos.x * this.props.squareSize, y: this.props.pos.y * this.props.squareSize },
      rel: updatedRel
    })
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp = e => {
    const { x, y } = this.state;

    this.props.updatePos(this.state.dragPos.x, this.state.dragPos.y, this.props.id, this.props.pos)
    this.setState({
      dragging: false,
    });

    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove = e => {
    if (!this.state.dragging) {
      return
    }
    let updatedPos = {
      x: (e.pageX - this.state.rel.x),
      y: (e.pageY - this.state.rel.y)
    }

    this.setState({
      dragPos: updatedPos
    })
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { dragPos, dragging } = this.state;
    const { pos, squareSize, color } = this.props;

    const dragStyle = {
      left: dragPos.x + 'px',
      top: dragPos.y + 'px',
      zIndex: 9999,
    }
    const staticStyle = {
      left: (pos.x * squareSize) + 'px',
      top: (pos.y * squareSize) + 'px'
    }
    return (
      <div className={this.props.pieceType}
        id={this.props.id}
        color={color}
        style={dragging ? dragStyle : staticStyle}
        onMouseDown={(e)=> this.onMouseDown(e)}>
      </div >
    );
  }
}