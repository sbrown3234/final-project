import React from 'react';
import { Link } from 'react-router';

export default function User({ user, addFriend, endFriend }) {

  const { firstname, lastname, profile_pic, status, id } = user


  return (
    <div className="user">
      <Link to={`user/profile/${id}`}><img className="user-image" src={profile_pic} /></Link>
      <p>{firstname} {lastname}</p>
      <div className="user-buttons">
        {(user.status == 0) && <button onClick={e => addFriend(id)}>Confirm Collab</button>}
        {(user.status == 0) && <button onClick={e => endFriend(id)}>Cancel Request</button>}
        {(user.status == 1) && <button onClick={e => endFriend(id)}>End Collab</button>}
    </div>
  </div>
  )
}
