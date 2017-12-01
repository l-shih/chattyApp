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
      userCount: 1,
    };

    this.socket = null;
  }

  componentWillMount() {
    this.socket = new WebSocket(`ws://${location.hostname}:3001`);
    this.socket.addEventListener('open', ()=>{
      this.setState({ connected: true });
    });
    this.socket.addEventListener('close', ()=>{
      this.setState({ connected: false });
    });

    this.socket.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
      switch(data.type) {
        case 'incomingImageMessage':
        case 'incomingTextMessage':
        case 'incomingNotification':
          this.setState({messages: this.state.messages.concat(data) });
          break;
        case 'userCount':
          this.setState({ userCount: data.content });
          break;
        default:
          console.info(`Unknown message type: ${data.type}`, data);
      }
    });
  }

  componentWillUnmount() {
    this.socket.close();
    delete this.socket;
  }

  // THIS WORKS --- UNCOMMENT ME IF YOU FUCK UP
  // onNewMessage = (user, content) => {
  //   const newMessage = {
  //     type: 'postMessage',
  //     username: user,
  //     content: content,
  //   };
  //   this.socket.send(JSON.stringify(newMessage));
  // }

  // Trying to catch when a message has an image in it
  onNewMessage = (user, content) => {
    const imgTest = (/\.(gif|jpg|jpeg|tiff|png)$/i);
    const newMessage = {
      type: (imgTest.test(content) ? 'postImageMessage' : 'postTextMessage'),
      username: user,
      content: content,
    };
    // console.log(newMessage);
    this.socket.send(JSON.stringify(newMessage));
  }

  onNewUsername = (user) => {
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
        <MessageList messages={ this.state.messages } color={ this.state.color }/>
        <ChatBar currentUsername={ this.state.currentUser } 
         onNewMessage={ this.onNewMessage } onNewUsername={ this.onNewUsername } />
      </div>
    )
  }
}
export default App;
