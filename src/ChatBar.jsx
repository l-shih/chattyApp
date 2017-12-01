import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevUser: this.props.currentUsername.name,
      currentUser: this.props.currentUsername.name,
      message: '',
      type: ''
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.onMessageEnterKey = this.onMessageEnterKey.bind(this);
    this.onUserEnterKey = this.onUserEnterKey.bind(this);
  }

  //allows user to input a message in the provided input box
  handleUserChange(event) {
    this.setState({
      currentUser: event.target.value,
    });
  }

  onUserEnterKey(event) {
    if(event.keyCode == 13) {
      this.props.onNewUsername(this.state.currentUser);
    }
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  // once user hits 'enter' key, text will be console logged
  onMessageEnterKey(event) {
    if(event.keyCode == 13) {
      let user = this.state.currentUser || 'Anonymous';
      this.props.onNewMessage(user, this.state.message, this.state.type);
      this.state.message = ''
    }
  }


  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" 
        placeholder="Username"
        value={ this.state.currentUser } 
        onChange={ this.handleUserChange }
        onKeyDown={ this.onUserEnterKey }/>
        <input 
        className="chatbar-message" 
        placeholder="Type a message and hit ENTER" 
        value={ this.state.message } 
        onChange={ this.handleMessageChange }
        onKeyDown={ this.onMessageEnterKey }/>
      </footer>
    );
  }
}
export default ChatBar;