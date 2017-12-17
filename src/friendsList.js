import React from 'react';
import { connect } from 'react-redux';
import { getUserFriends, addFriend, endFriend } from './actions';
import Pending from './pending';
import Accepted from './accepted';

class Friends extends React.Component {
  componentDidMount() {
    if (!this.props.getUserFriends) {
        this.props.getUserFriends()
    } else {
      this.props.getUserFriends()
    }
  }

  render(){
    const { users, wannabies, endFriend, addFriend } = this.props;
    return(
          <div className="panel">
            <h1>Notification Panel</h1>
            <div className="req-lists">
            <Pending  users={wannabies} addFriend={addFriend} endFriend={endFriend} />
            <Accepted users={users} endFriend={endFriend} />
            </div>
          </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    users: state.users && state.users.filter(user => user.status == 1),
    wannabies: state.users && state.users.filter(users => users.status == 0)
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    getUserFriends: () => dispatch(getUserFriends()),
    addFriend: (id) => dispatch(addFriend(id)),
    endFriend: (id) => dispatch(endFriend(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
