import React from 'react';
import { Link } from 'react-router';

export default function Nav (props) {
    const { profile_pic } = props
    return(
      <div id="nav-bar">
        <div className="links">
          <Link to="/messages">Private Messages</Link>
          <Link to='/public-chatroom'>Chatroom</Link>
          <Link to='/logout'>Logout</Link>
        </div>
        <img id="nav-pic" src={profile_pic} />
      </div>
    )
}
