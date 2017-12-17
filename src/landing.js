import React from "react";
import Login from "./login";
import { Link } from "react-router";


export default class Landing extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render(){
    return  (
      <div>
        <div id="smashed">
          <Link to="/login"><h1>s_(MASHED)</h1></Link>
          <p>[s<i>MASHED</i>]: a collaborative space for combining or mixing content from different sources. A <strong>remix</strong> that combines print and digital media from two or more sources, to create a new imaginary sensation</p>
        </div>
      </div>
    )
  }

}
