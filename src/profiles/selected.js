import React from 'react';
import axios from 'axios';
import $ from 'jquery'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getImage } from '.././actions';
import { getSocket } from '.././socket'

class SelectedImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleComment = this.handleComment.bind(this)
    this.newComment = this.newComment.bind(this)
  }

  handleComment(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  newComment(e) {
    getSocket().emit('comment', {comment: this.state.comment, picId: this.props.params.picId})
    e.preventDefault()
  }

  componentDidMount() {
    var id = this.props.params.picId;

    this.props.getImage(id)
  }

  render(){

    const { image, comments } = this.props

    if (!this.props.image) {
      return <div>Loading.... Please Wait</div>
    }


    const userComments = (
      <div className="comment-container">
        {comments.map(comment=>
        <div className="comment">
          <div className="comment-title">
          <Link to={`user/profile/${comment.id}`}><img className="user-image" src={comment.profile_pic} /></Link>
          <p>{comment.firstname + " " + comment.lastname}</p>
          </div>
          <div>
            <p>{comment.comment}</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div id="selected-container">
      <div id="image-container">
        <div id="selected-title">
          <Link to={`user/profile/${image.user_id}`}><h1>creds: {image.firstname + " " +image.lastname}</h1></Link> <p>s_MASHED @: {image.created_at}</p>
        </div>
        <img id="selected-image" src={image.image_url} />
      </div>
      <div id="comment-field">
      {!!comments.length && userComments}
      <div id="comment-input">
        <input id="comment-box" onChange={(e) => this.handleComment(e)} type="text" name="comment" placeholder="Comment..." /><button onClick={(e) => this.newComment(e)} type="submit">Post</button>
      </div>
    </div>
  </div>
  )
}
}

const mapDispatchToProps = function (dispatch) {
  return {
    getImage: (id) => dispatch(getImage(id))
  }
}

const mapStateToProps = function (state) {
  return {
    comments: state.comments.filter(comment=> comment.created_at),
    image: state.image
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedImage)
