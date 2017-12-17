import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      noStatus: false,
      acceptRequest: false,
      pendingRequest: false,
      cancelRequest: false,
      terminateRequest: false,
      privateChat: false,
      deleteRequest: false
    }
    this.sendRequest = this.sendRequest.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  sendRequest() {
    axios.post('/send-request/'+ this.props.otherId).then(({data}) => {
      if (data.success) {
        this.setState({
          noStatus: false,
          pendingRequest: true,
          cancelRequest: true
        })
      }
    })
  }

  acceptRequest() {
    axios.post('/accept-request/'+this.props.otherId).then(({data}) => {
      if(data.success) {
        this.setState({
          acceptRequest: false,
          deleteRequest: false,
          terminateRequest : true
        })
      }
    })
  }

  cancelRequest() {
    axios.post('/cancel-request/'+ this.props.otherId).then(({data}) => {
      if(data.success) {
        this.setState({
          pendingRequest: false,
          cancelRequest: false,
          terminateRequest: false,
          noStatus: true
        })
      }
    })

  }


  componentDidMount() {

    axios.get('/friend-status/' + this.props.otherId).then(({data}) => {


      if (data.status == 0 && data.sender != this.props.otherId) {
        this.setState({
          pendingRequest: true,
          cancelRequest: true
        })
      }

      if (data.status == 0 && data.sender == this.props.otherId) {
        this.setState({
          acceptRequest: true,
          deleteRequest: true,
        })
      }

      if (data.status == 1) {
        this.setState({
          terminateRequest: true,
          privateChat: true
        })
      }

      if (data.none || data.status == null || data.status == 2) {
        this.setState({
          noStatus: true
        })
      }


    })
  }

  render() {

    const { noStatus, acceptRequest, pendingRequest, cancelRequest, terminateRequest, deleteRequest, privateChat } = this.state;

    return (
      <div className="request-button">
        { noStatus && <button type="submit" onClick={this.sendRequest} > Ask them to collab </button> }
        { acceptRequest && <button type="submit" onClick={this.acceptRequest}> Accept an invite to collab </button>}
        { pendingRequest && <div> Your request is pending... </div> }
        { cancelRequest && <button type="submit" onClick={this.cancelRequest} > Cancel offer to collab </button> }
        { deleteRequest && <button type="submit" onClick={this.cancelRequest} > Delete request </button> }
        { terminateRequest && <button type="submit" onClick={this.cancelRequest} > End collab </button> }
        { privateChat && <div><Link to={`/messages/${this.props.otherId}`}>Message {this.props.firstname}</Link></div>
 }
      </div>
    )
  }
}
