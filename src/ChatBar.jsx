import React, {Component} from 'react';

class ChatBar extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.onEnterKey = this.onEnterKey.bind(this);
  }

  // allows user to input a message in the provided input box
  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  // once user hits 'enter' key, text will be console logged
  onEnterKey(event) {
    if(event.keyCode == 13) {
      console.log(event.target.value)
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder={`${this.props.currentUsername.name}`}/>
        <input 
        className="chatbar-message" 
        placeholder="Type a message and hit ENTER" 
        value={this.state.value} 
        onChange={this.handleChange}
        onKeyDown={this.onEnterKey}/>
      </footer>
    );
  }
}
export default ChatBar;