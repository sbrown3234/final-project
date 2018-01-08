import React from 'react';

export default function CoverPic (props) {

    const { cover_photo } = props


    return  (
      <div className="cover-photo">
      <img onClick={props.toggleUpload} src={props.cover_photo} alt={props.firstname + " " + props.lastname + '/s undefined cover photo....is it too much to ask for you to put in a cover photo?!?!?!'} />
      {props.showUploader &&  <div id="pic-upload"> <input onChange={props.handlePic} type="file" name="coverPhoto" /> <button onClick={props.upload} type="submit" name="button"> Upload File </button> </div>}
    </div>
    )
}
