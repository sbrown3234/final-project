import React from 'react';
import Body from './body';
import Friends from "./friendsList";
import Icon from './icon';
import Pic from './pic'
import CoverPhoto from './coverPhoto';
import Images from './images';
import { Link } from 'react-router';

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
  }

  render(){

    if (!this.props) {
      return <div>Loading...</div>
    }



    const { firstname, lastname, bio,  profile_pic, cover_photo, toggleUpload, showUploader, toggleBio, showBio, handleChange, handlePic, upload, update } = this.props;

    return  (
      <div className="profile">
        <div className="pictures">
          <CoverPhoto
            firstname = {firstname}
            lastname = {lastname}
            cover_photo = {cover_photo}
            toggleUpload = {toggleUpload}
            showUploader = {showUploader}
            handlePic = {handlePic}
            upload = {upload}
          />
        <Pic
          profile_pic = {profile_pic}
          firstname = {firstname}
          lastname = {lastname}

          toggleUpload = {toggleUpload}
          showUploader = {showUploader}
          handlePic = {handlePic}
          upload = {upload}
        />
      </div>
        <div className="bio-friends">
          <Body
            bio = {bio}

            handleChange = {handleChange}
            toggleBio = {toggleBio}
            showBio = {showBio}
            update = {update}
          />
          <Friends />
        </div>
        <div className="albums">
          <Images />
        </div>


      </div>
    )
  }
}
