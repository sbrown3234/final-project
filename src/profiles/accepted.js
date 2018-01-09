import React from 'react';
import { connect } from 'react-redux';
import User from './user'

export default class Accepted extends React.Component {
  render() {
    const { users, endFriend } = this.props

    if(!users) {
      return null;
    }

    const acceptedFriends = (
      <div className="requested-users">
        {users.map(user => <User user={user} endFriend={endFriend} />)}
      </div>
    );

    return (
      <div className="friends">
          {!users.length && <div>Get out there and meet some other sMASHERS!</div>}
          {!!users.length && acceptedFriends}
      </div>
    )
  }
}
