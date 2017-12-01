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

    this.socket.addEventListener('error', ()=>{
      this.setState({ connected: false });
    });

    this.socket.addEventListener('message', (message) => {
      // console.log('message');
      const data = JSON.parse(message.data);
      // console.log('Received message', data);

      switch(data.type) {
        case 'incomingMessage':
        case 'incomingNotification':
          this.setState({messages: this.state.messages.concat(data) });
        break;
        case 'userCount':
          this.setState({ userCount: data.content });
          break;
        default:
          console.info(`Unknown message type: ${data.type}`, data);
      }
      //console.log(data);
      // if (data.type === 'incomingMessage' || data.type === 'incomingNotification') {
      //   this.setState({messages: this.state.messages.concat(data) });
      //   //console.log('i just came from server, i am messages obj', this.state.messages, this.state.color, this.state.type);
      // } else {
      //   this.setState({ userCount: data.content, color: data.color });
      //   //console.log('i just came from server, i am userchage obj', this.state.userCount, this.state.color);
      // };
      //console.log('i am data in did mount, ', this.state.messages);
    });
  }

  componentWillUnmount() {
    this.socket.close();
    delete this.socket;
  }

  onNewMessage = (user, content) => {
    const newMessage = {
      type: 'postMessage',
      username: user,
      content: content,
    };
    console.log('Sending a message', newMessage);
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
