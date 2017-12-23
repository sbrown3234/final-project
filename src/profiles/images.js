import React from 'react';
import { Link } from 'react-router';
import { getImages } from '.././actions'
import { connect } from 'react-redux';

class Images extends React.Component {
  componentDidMount(){
    if (!this.props.images) {
      this.props.getImages()
    } else {
      this.props.getImages()
    }
  }

  render() {

    if (!this.props.images) {
      this.props.getImages()
      return <div>Loading...</div>
    }

    const { images } = this.props

    const userImages = (
      <div className ='canv-images'>
        {images.map(image => <Link to={`image/${image.image_id}`}><img src={image.image_url} /></Link>)}
      </div>
    )

    return (
      <div className="user-images">
        <h1>Recent Collages</h1>
        {(images.length === 0) && <div>Get to <Link to="/collage">work</Link>!</div>}
        {userImages}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  console.log('in album mS2P: ', state)
  return {
    images: state.images.data
  }
}

const mapDispatchToProps = function(dispatch){
  return {
    getImages: () => dispatch(getImages())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Images)
