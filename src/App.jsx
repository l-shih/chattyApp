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
  }

  // load() {
  //   this.setState({ messages });
  // }

  // componentDidMount() {
  //   this.load();
  // }

  // // 
  // onNewMessage(content) {
  //   console.log(content);
  // }

  // componentDidMount() {
  //   console.log("componentDidMount <App />");
  //   setTimeout(() => {
  //     console.log("Simulating incoming message");
  //     // Add a new message to the list of messages in the data store
  //     const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
  //     const messages = this.state.messages.concat(newMessage)
  //     // Update the state of the app component.
  //     // Calling setState will trigger a call to render() in App and all child components.
  //     this.setState({messages: messages})
  //   }, 3000);
  // }

  render() {
    return (
      <div>
        <Navbar />
        <MessageList messages={ this.state.messages }/>
        <ChatBar currentUsername={ this.state.currentUser } 
         onPost={ this.onNewMessage } />
      </div>
    )
  }
}
export default App;
