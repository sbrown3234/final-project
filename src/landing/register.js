import React from "react";
import axios from "axios";
import Login from "./login";
import {Link} from "react-router";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      error: false
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
    const {firstname, lastname, email, password} = this.state;

    if(!firstname || !lastname || !email || !password === "") {
      this.setState({
        error: true
      })
    } else {
      const data = {firstname, lastname, email, password};

      axios.post('/register', data).then((results) => {
        if (results.data.success) {
          location.replace("/");
        } else {
          this.setState({
            error: true
          })
        }
      }).catch((err) => {
        console.log('aXIOS register post err: ', err)
      })
    }
    e.preventDefault();
  }

  render() {
    return (
      <div id="welcome-container">
        <div id="register-inputs">
          <p>First time here? <br/> Don't worry, we'll be gentle:</p>

          <form>
            {this.state.error && <div>Oops! Looks like something went wrong with your registration. Try again!</div>}
            <input name="firstname" type="text" placeholder="First Name" onChange={this.handleChange} />
            <input name="lastname" type="text" placeholder="Last Name" onChange={this.handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={this.handleChange} />
            <input name="password" type="password" placeholder="New Password" onChange={this.handleChange} />
            <button type="submit" onClick={this.handleSubmit}>Create Account</button>
          </form>
        </div>
        <div id="login-container">
          <Login />
        </div>
      </div>
    )
  }

}
