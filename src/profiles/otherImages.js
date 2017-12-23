import React from 'react';
import { Link } from 'react-router';
import { getTheirImages } from '.././actions'
import { connect } from 'react-redux';

class OtherImages extends React.Component {
  componentDidMount(){
    this.props.getTheirImages(this.props.otherId)
  }

  render() {

    if (!this.props.theirImages) {
      this.props.getTheirImages(this.props.otherId)
      return <div>Loading....</div>
    }

    const { theirImages } = this.props;

    const userImages = (
      <div className ='canv-images'>
        {theirImages.map(image => <Link to={`image/${image.image_id}`}><img src={image.image_url} /></Link> )}
      </div>
    )

    return (
      <div className ='user-images'>
        <h1>Recent Collages</h1>
        {(theirImages.length == 0) && <div>No images to see here ;(</div>}
        {userImages}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  console.log('in their images state: ', state)
  return {
    theirImages: state.theirImages.data
  }
}

const mapDispatchToProps = function(dispatch){
  return {
    getTheirImages: (otherId) => dispatch(getTheirImages(otherId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherImages)
