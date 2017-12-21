import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getAllUsers } from '.././actions'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state={}
    this.search = this.search.bind(this)
  }
  componentDidMount () {
    this.props.getAllUsers()
  }

  search(e) {
    var input = e.target.value;

    let {allUsers} = this.props


    const matches = allUsers.filter(user => user.firstname.toLowerCase() == input).slice(0,4)

    this.setState({
      matches: matches
    })

  }

  render () {

    const { allUsers } = this.props

    const displayMatches = (
        <ul className="result-list">
        {!!this.state.matches && this.state.matches.map(match => <li className="results"><Link to={`/user/profile/${match.id}`}><img className="search-pic" src={`${match.profile_pic}`}/>{match.firstname} {match.lastname}</Link></li>)}
        </ul>
    )



    return (
      <div id="search">
        <input id="search-bar" type="text" onChange={this.search}></input>
        {displayMatches}
      </div>
    )
  }
}

const  mapStateToProps = (state) =>  {
  return {
      allUsers: state.allUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      getAllUsers : () => dispatch(getAllUsers())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
