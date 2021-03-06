import React from 'react';
import { connect } from 'react-redux';
import { getAllDMs } from '.././actions';
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
    directMessages: state.everyDM && state.everyDM.filter(DM => )
  }
}

const mapDispatchesToProps = function (dispatch) {
  return {
    getAllDMs: () => dispatch(getAllDMs())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
