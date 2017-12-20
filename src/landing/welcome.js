import React from "react";
import ReactDom from "react-dom";
import Register from "./register";
import Login from "./login";
import Logo from "./logo";


export default class Welcome extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render(){
    return  (
      <div>
        <Logo />
        <div id="welcome-content">
          {this.props.children}
        </div>
      </div>
    )
  }

}
