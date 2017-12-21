import React from 'react';
import { connect } from 'react-redux';
import { socket } from '.././socket';
import Chatroom from './Chatroom';

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }
  componentDidUpdate() {
    if (this.elem) {
      this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
  }

  render() {

    if (!this.props.chatMessages) {
      return <div>Loading...</div>
    }

    console.log('propping: ', this.props)


    const { chatMessages, handleChange, onKeyPressed, sendMessage } = this.props

    const messages = (
      <div className="chat-message">
        {chatMessages.map(messages => <Chatroom messages={messages} />)}
      </div>
    )

    if (!this.props) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }

    return (
      <div id="chatroom">
        <div className="chat-box">
        <div className="message-window" ref={elem => this.elem = elem}>
            <div className="chat-messages">
              {!!chatMessages && messages}
              {(chatMessages.length == 0) && <p>Start the converstation</p>}
            </div>
        </div>
        <div className="message-bar">
          <input className="message-input" name="message" type="text" placeholder="[Be bold...]" onChange={handleChange} onKeyDown={onKeyPressed}/><button type="button" onClick={sendMessage}>Send</button>
        </div>
      </div>
      </div>
    )

  }
}

const mapStateToProps = function (state) {
  return {
    chatMessages: state.messages
  }
}


export default connect(mapStateToProps)(Chat)
