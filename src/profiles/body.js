import React from 'react';

export default function Body(props) {
  const { bio, handleChange, showBio, toggleBio, update } = props

  return (
    <div className="bio">

      <h1>About you:</h1>
      <p onClick={toggleBio}>{bio || "[Tell us about yourself...]"}</p>

      { showBio && <div id="bio-field"><textarea type="text" name="bio" onChange={handleChange} placeholder="What do you want us to know about you?" value={!!bio && bio} /> <button type="submit" name="button" onClick={update}> Submit Changes </button></div> }


    </div>
  )
}
