import React from 'react';
import { connect } from 'react-redux';
import { getUserFriends, addFriend, endFriend } from './actions';
import Pending from './pending';
import DMs from './dms';

class Messages extends React.Component {
    componentDidMount() {
      this.props.getAllDMs()
    }

  render(){
    const { directMessages } = this.props;
    return(
          <div id="dm-page">
            <DMs  directMessages={directMessages} />
          </div>
    )
  }
}

const mapStateToProps = function (state) {
  console.log('in directMessages: ', state)
  return {
    directMessages: state.everyDM && state.everyDM.filter
  }
}

const mapDispatchesToProps = function (dispatch) {
  return {
    getAllDMs: () => dispatch(getAllDMs())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
