import React from 'react';
import './square.css';

export default class Square extends React.Component {


  render() {
    return (
      <div className="square" id={this.props.square}>
      </div>
    );
  }
}