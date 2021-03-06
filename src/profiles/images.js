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
      <div className ='canvas-images'>
        {images.map(image => <Link to={`image/${image.image_id}`}><img className="images" src={image.image_url} /></Link> )}
      </div>
    )

    return (
      <div className="user-images">
        <h1>Recent Collages</h1>
        {(images.length === 0) && <div><p>Get to <Link to="/collage">work</Link>!</p></div>}
        {userImages}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
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
