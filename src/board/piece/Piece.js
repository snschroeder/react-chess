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
    const dragStyle = {
      left: this.state.dragPos.x + 'px',
      top: this.state.dragPos.y + 'px',
      zIndex: 9999,
    }
    const staticStyle = {
      left: (this.props.pos.x * this.props.squareSize) + 'px',
      top: (this.props.pos.y * this.props.squareSize) + 'px'
    }
    return (
      <div className={this.props.pieceType}
        id={this.props.id}
        color={this.props.color}
        style={this.state.dragging ? dragStyle : staticStyle}
        onMouseDown={(e)=> this.onMouseDown(e)}>
      </div >
    );
  }
}