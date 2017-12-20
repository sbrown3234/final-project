import React from 'react';
import { Link } from 'react-router';

export default function Chatroom({ messages }) {

  const { firstname, lastname, profile_pic, message, id, created_at } = messages


  return (
    <div className="whateva">
    <div className="user">
      <Link to={`user/profile/${id}`}><img className="message-pic" src={profile_pic} /></Link>
      <p>{firstname} {lastname}</p><p>{created_at}</p>
    </div>
      <p>{message}</p>
  </div>
  )
}
