import React from 'react';
import { connect } from 'react-redux';
import { getTheirFriends } from '.././actions';
import OtherUser from './otherUser';

class OtherFriends extends React.Component {
  componentDidMount() {
    if (!this.props.getTheirFriends) {
      this.props.getTheirFriends(this.props.otherId)
    } else {
      this.props.getTheirFriends(this.props.otherId)
    }
  }

  render(){
    const { users } = this.props;

    if (!users) {
      this.props.getTheirFriends(this.props.otherId)
    }


      return(
        <div className="req-lists">
          <OtherUser users={users} />
        </div>
      )
    }
  }

  const mapStateToProps = function(state) {
    return {
      users: state.othersFriends && state.othersFriends.filter(user => user.status == 1)
    }
  }

  const mapDispatchToProps = function(dispatch) {
    return {
      getTheirFriends: (id) => dispatch(getTheirFriends(id))
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(OtherFriends)
