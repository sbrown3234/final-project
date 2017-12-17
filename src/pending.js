import React from 'react';
import { connect } from 'react-redux';
import User from './user';

export default class Pending extends React.Component {
  render() {
    const { users, addFriend, endFriend } = this.props
    console.log('hello users: ', users)
    if(!users) {
      return null;
    }

    const pendingFriends = (
      <div className="pending-users">
        {users.map(user => <User user={user} addFriend={addFriend} endFriend={endFriend} />)}
      </div>
    );

    return (
      <div className="pending-losers">
          {!!users.length && pendingFriends}
      </div>
    )
  }
}
