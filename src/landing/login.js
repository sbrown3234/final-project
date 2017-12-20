import React from "react";
import axios from 'axios';

export default class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
  this.setState({
    [e.target.name]: e.target.value
  })
  }

  handleSubmit(e) {
  const {email, password} = this.state;

  const data = {email, password};


  axios.post('/login', data).then((results) => {
    console.log('in login post')
    if (results.data.success) {
      location.replace("/");
    } else {
      this.setState({
        error: true
      })
    }
  }).catch((err) => {
    console.log('aXIOS login post err: ', err)
  })
  e.preventDefault();
  }

  render(){
    return  (
      <div id="login">
        <p> Already registered? <br/> Login here: </p>
        <form>
          {this.state.error && <div>Are you sure about that Username and Password? 'Cause I'm not...</div>}
          <input name="email" type="email" placeholder="Email / Username" onChange={this.handleChange}/>
          <input name="password" type="password" placeholder="Password"  onChange={this.handleChange}/>
          <button type="submit" onClick={this.handleSubmit} > Submit </button>
        </form>
      </div>
    )
  }

}
