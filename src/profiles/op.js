import React from 'react';
import axios from 'axios';
import Pic from './pic';
import CoverPhoto from './coverPhoto'
import Button from './fbutton';
import OtherFriends from './otherFriends';
import OtherImages from './otherImages'
import { browserHistory } from 'react-router';

export default class OP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var id = this.props.params.id;
    axios.get('/getUser/'+ id).then(({ data }) => {

      if (data.currUser) {
        browserHistory.push('/')
      }

      if (data.success) {
        const { bio, firstname, lastname, profile_pic, cover_photo } = data.otherProf

        this.setState({ bio, firstname, lastname, profile_pic, cover_photo})
      }
    })
  }

  render() {
    const { firstname, lastname, profile_pic, cover_photo, bio, error } = this.state;
    const { id } = this.props.params;



    return (
      <div className="profile">

        {error && <div>Sorry, I don't know her....</div>}
        <div className="pictures">
        <CoverPhoto
          firstname = {firstname}
          lastname = {lastname}
          cover_photo = {cover_photo}
        />
        <div className="headline-container">
        <Pic
          profile_pic = {profile_pic}
          firstname = {firstname}
          lastname = {lastname}
        />
        <Button otherId={id}/>
      </div>
      </div>
        <div className="bio-friends">
          <div className="bio">
            <h1>About {firstname}:</h1>
            {!bio && <p>Looks like {firstname} is too busy to tell you about themselves</p>}
            <p>{bio}</p>
          </div>
          <div className="other-container">
          <h1>Comrades-In-Collaboration</h1>
          <div className="list">
          <OtherFriends otherId={id}/>
          </div>
        </div>
        </div>
        <div className="albums">
          <OtherImages otherId={id}/>
        </div>

      </div>
    )
  }

}
