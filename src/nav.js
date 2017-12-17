import React from 'react';
import { Link } from 'react-router';

export default class Nav extends React.Component {
  render() {
    const { profile_pic } = this.props
    return(
      <div id="nav-bar">
        <div id="links">
          <Link to="/messages">Private Messages</Link>
          <Link to="/online">sMASHERS Online</Link>
          <Link to='/public-chatroom'>Chatroom</Link>
          <Link to='/logout'>Logout</Link>
        </div>
        <img id="nav-pic" src={profile_pic} />
      </div>
    )
  }
}
