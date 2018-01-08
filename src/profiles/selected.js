import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getComments, getImage } from '.././actions';

class SelectedImage extends React.Component {

  componentDidMount() {
    var id = this.props.params.id;
    { getComments, getImage } = this.props

    getComments(id)
    getImage(id)
  }

  render(){

    if (!this.props.image) {
      return <div>Loading.... Please Wait</div>
    }

    const { image, comments } = this.props

    console.log("userId: ", users)

    const comments = (
      <div className="comments">
        {comments.map(user=> <div className="user">
          <Link to={`user/profile/${user.id}`}><img className="user-image" src={user.profile_pic} /></Link>
          <p>{user.firstname + " " + user.lastname}</p>
        </div>
      )}
    </div>
  )

  return (
    <div id="fuck-this">
      {!users.length && <p>Looks like there's no collaboration taking place here</p>}
      {!!users.length && friends}
    </div>
  )
}
}

const mapDispatchesToProps = function (dispatch) {
  return {
    insertComment: (id) => dispatch(insertComment(id)),
    getComments: (id) => dispatch(getComments(id)),
    getImage: (id) => dispatch(getImage(id))
  }
}

const mapStateToProps = function (state) {
  return {
    comments: state.comments.filter(comment=> comment.user_id)
    image: state.image
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedImage)
