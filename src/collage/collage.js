import React from 'react';
import {dealWithCanvas} from './canvas';

class Collage extends React.Component {
  componentDidMount() {

  }

  componentShouldUpdate() {
    return false
  }

  render() {

    return (
      <div id="collage-container">
      <canvas id="canvas" ref={elem => dealWithCanvas(elem)} width="700" height="500"></canvas>
      <div class="controls">
        <button>Copy Selected Object</button>
        <button>Paste Selected Object</button>
        <h3>Filters: </h3>
        <p>
          <span>Invert: </span>
          <input id="invert" type="checkbox" />
        </p>
        <p>
          <span>Sepia: </span>
          <input id="sepia" type="checkbox" />
        </p>
        <p>
          <span>Black/White: </span>
          <input id="black-white" type="checkbox" />
        </p>
        <p>
          <span>Brownie: </span>
          <input id="brownie" type="checkbox" />
        </p>
        <p>
          <span>Vintage: </span>
          <input id="vintage" type="checkbox" />
        </p>
        <p>
          <span>Kodachrome: </span>
          <input id="kodachrome" type="checkbox" />
        </p>
        <p>
          <span>Technicolor: </span>
          <input id="technicolor" type="checkbox" />
        </p>
        <p>
          <span>Polaroid: </span>
          <input id="polaroid" type="checkbox" />
        </p>
      </div>
      </div>
    )
  }
}
