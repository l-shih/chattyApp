import React, { Component } from 'react';

class Message extends Component {
  render() {
    return (
      <div className="message">
        <span className="message-username" style={{ color: this.props.color }}>{ this.props.name }</span>
        { this.props.type === "incomingMessage" 
          ? <span className="message-content">{ this.props.content }</span>
          : <div className="message system">{ this.props.content }</div> }
      </div>
    )
  }
}
export default Message;
