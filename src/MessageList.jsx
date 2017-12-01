import React, { Component } from 'react';

import Message from './Message.jsx';

class MessageList extends Component {
  
  render() {
    // console.log('i am in messagelist, trying to be a color ', this.props.color);
    const messages = this.props.messages.map((message) => {
      return <Message
      key={ message.id }
      name={ message.username }
      content={ message.content }
      type={ message.type } 
      color={message.color} />
    });

    return (
      <main className='messages'>
        { messages }
      </main>
    )
  }
}
export default MessageList;
