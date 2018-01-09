import React from 'react';
import { Link } from 'react-router';

export default class OtherUser extends React.Component {
  render(){

    const { users } = this.props

    const friends = (
      <div className="users">
        {users.map(user=> <div className="user">
          <Link to={`user/profile/${user.id}`}><img className="user-image" src={user.profile_pic} /></Link>
          <p>{user.firstname + " " + user.lastname}</p>
        </div>
      )}
    </div>
  )

  return (
    <div id="friends-list">
      {!users.length && <p>Looks like there's no collaboration taking place here</p>}
      {!!users.length && friends}
    </div>
  )
}
}
