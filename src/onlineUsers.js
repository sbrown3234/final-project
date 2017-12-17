import React from 'react';
import { Link } from 'react-router';

export default function OnUser({ user }) {

  console.log('in onlineUsers comp')

  const { firstname, lastname, profile_pic, id } = user


  return (
    <div className="online-user">
      <Link to={`user/profile/${id}`}><img src={profile_pic} /></Link>
      <h1>{firstname} {lastname}</h1>
  </div>
  )
}
