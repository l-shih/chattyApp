import React, { Component } from 'react';

import Navbar from './Navbar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: 'Anonymous' },
      messages: [],
      type: '',
      userCount: 1,
      clientId: ''
    };

  this.socket = null;
  this.onNewMessage=this.onNewMessage.bind(this);
  this.onNewUsername=this.onNewUsername.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001")
    this.socket.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.type === 'incomingMessage' || data.type === 'incomingNotification') {
        this.setState({messages: this.state.messages.concat({ username: data.username, content: data.content, type: data.type })});
      } else {
      this.setState({ userCount: data.content, clientId: data.clientId });
      };
      console.log('i am data in did mount, ', data);
    });
  }

  onNewMessage(user, content) {
    const newMessage = {
      type: 'postMessage',
      username: user,
      content: content,
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  onNewUsername(user) {
    let currentUser = this.state.currentUser;
    const oldUser = this.state.currentUser.name;
    const newUser = user;

    if (oldUser !== newUser) {
      const newUsername = {
        type: 'postNotification',
        content: `${ oldUser } changed to ${ newUser }`
      };

      this.socket.send(JSON.stringify(newUsername));

      currentUser.name = user
      this.setState({ currentUser });
    }
  }

  render() {
    return (
      <div>
        <Navbar count={ this.state.userCount }/>
        <MessageList messages={ this.state.messages }/>
        <ChatBar currentUsername={ this.state.currentUser } 
         onNewMessage={ this.onNewMessage } onNewUsername={ this.onNewUsername } />
      </div>
    )
  }
}
export default App;
