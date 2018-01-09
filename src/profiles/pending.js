import React from 'react';
import { connect } from 'react-redux';
import User from './user';

export default class Pending extends React.Component {
  render() {
    const { users, addFriend, endFriend } = this.props

    if(!users) {
      return null;
    }

    const pendingFriends = (
      <div className="requested-users">
        {users.map(user => <User user={user} addFriend={addFriend} endFriend={endFriend} />)}
      </div>
    );

    return  (
      <div className="pending-requests">
        {!!users.length && pendingFriends}
      </div>
    )
  }
}
