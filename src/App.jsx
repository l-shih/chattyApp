import React, { Component } from 'react';

import Navbar from './Navbar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };

   this.onNewMessage=this.onNewMessage.bind(this);
  }

  onNewMessage(content) {
    this.setState({
      messages: this.state.messages.concat({
        username: 'Anonymous',
        content: content
      })
    })
  }

  render() {
    return (
      <div>
        <Navbar />
        <MessageList messages={ this.state.messages }/>
        <ChatBar currentUsername={ this.state.currentUser } 
         onNewMessage={ this.onNewMessage } />
      </div>
    )
  }
}
export default App;
