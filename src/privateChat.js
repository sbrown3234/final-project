import React from 'react';
import { connect } from 'react-redux';
import { getDMs } from './actions';
import Chatroom from './Chatroom';
import axios from 'axios';

class PrivateChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    this.props.getDMs(this.props.params.id)
  }

  componentDidUpdate() {
    if (this.elem) {
      this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
  }

  render() {

    console.log('dm: ', this.props.dms)

    const { dms, handleChange, sendDM } = this.props

    console.log('propping: ', this.props)

    const messages = (
      <div className="chat-messages">
        {dms.map(message => <Chatroom messages={message} />)}
      </div>
    )

    if (!this.props.dms) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }

    return (
      <div id="private-chat">
        <h1>Sliding in them DM's eh?</h1>
      <div className="chat-box">
        <div className="message-window" ref={elem => this.elem = elem}>
          <div className="chat-messages">
            {!!dms.length && messages}
          </div>
        </div>
          <div className="message-bar">
            <input className="message-input" name="dm" type="text" placeholder="[Be bold...]" onChange={handleChange}/><button type="button" onClick={sendDM}>Send</button>
          </div>
        </div>
      </div>
    )

  }
}

const mapStateToProps = function (state) {
  console.log('state2: ', state)
  return {
    dms: state.dms
  }
}

const mapDispatchesToProps = function (dispatch) {
  return {
    getDMs: (id) => dispatch(getDMs(id))
  }
}


export default connect(mapStateToProps, mapDispatchesToProps)(PrivateChat)
