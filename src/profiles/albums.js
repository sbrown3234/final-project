import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Albums extends React.Component {
  componentDidMount(){
    this.props.getAlbums()
  }

  render() {
    const { albums, showUploader, toggleUpload,  } = this.props;

    const userAlbums = (
      <div>
        {albums.map(album => (<div className="album">
          <Link to=`album/${album.id}`><img src=`${album.image[0]}` alt=`${album.title[0]}` /></Link>
        </div>))}
      </div>
    )

    return (
      <div className ='albums'>
        {(albums.length === 0) && <div onClick={props.toggleUpload} className="album-upload">Start uploading some work!</div>}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  console.log('in album mS2P: ', state)
  return {
    album: state.albums && state.albums.filter(album => album.album_name)
  }
}
