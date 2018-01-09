import React from 'react';
import { connect } from 'react-redux';
import { getOnlineFriends } from './actions';
import { Link } from 'react-router';
import OnUser from './onlineUsers';

class Online extends React.Component {

  render() {

    if (!this.props.onlineUsers) {
      return <div>Loading...</div>;
    }

    const { onlineFriends, onlineUsers } = this.props
    console.log('onlineUsers in online: ', onlineUsers)

    const strangers = (
      <div className="online-strangers">
        {onlineUsers.map(user => <OnUser user={user}/>)}
      </div>
    );

    console.log('strangers: ', strangers)

    const friends = (
      <div className="online-friend">
        {onlineFriends.map(friend => <OnUser user={friend}/>)}
      </div>
    );

    return (
      <div id="online-container">
        <div className="online-users">
          <h1>Here are your friends!</h1>
          {(onlineFriends.length==0) && <h2>Looks like no one's online...sorry!</h2>}
          {!!onlineFriends.length && friends}
        </div>
        <div className="online-users">
          <h1>Everyone online right now!</h1>
          {!!onlineUsers.length && strangers}
        </div>
      </div>
    )
  }
}


const mapStateToProps = function(state) {
  return {
    onlineFriends: state.onlineUsers && state.onlineUsers.filter(onlineUser => onlineUser.status == 1),
    onlineUsers: state.onlineUsers && state.onlineUsers.filter(onlineUser => onlineUser.status != 1)
  }
}


export default connect(mapStateToProps)(Online)
