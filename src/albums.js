import React from 'react';

class Albums extends React.Component {
  componentDidMount(){
    this.props.getAlbums()
  }

  render() {
    const { albums } = this.props;
    return (

    )
  }
}

const mapStateToProps = function(state) {
  console.log('in album mS2P: ', state)
  return {
    album: state.albums && state.albums.filter(album => album.album_name)
  }
}
