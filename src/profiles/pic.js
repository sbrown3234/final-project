import React from 'react';

export default function Pic (props) {

    return  (
      <div className="profile-image">
      <img onClick={props.toggleUpload} src={props.profile_pic} alt={props.firstname + " " + props.lastname} />
      {!!props.showUploader && props.showUploader &&  <div id="pic-upload"> <input onChange={props.handlePic} type="file" name="file" /> <button onClick={props.upload} type="submit" name="button"> Upload File </button> </div>}
      <h2>{props.firstname + " " + props.lastname}</h2>
    </div>
    )
}
