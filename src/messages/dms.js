import React from 'react';
import { Link } from 'react-router';

export default class DMs extends React.Component {
  render(){

    const { directMessages } = this.props

    console.log("dms ah: ", directMessages)

    const messages = (
      <div className="dm">
        {directMessage.map(messages=> <div className="messenger">
          <Link to={`messages/${messages.id}`}><img className="messenger-image" src={messages.profile_pic} /></Link>
          <p>{messages.firstname + " " + messages.lastname}</p>
          <p>{messages.messages[0]}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="dm-container">
      {!directMessages.length && <p>You have no private messages. Sorry! ;(</p>}
      {!!directMessages.length && messages}
    </div>
  )
}
}
