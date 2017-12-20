import React from 'react';
import {dealWithCanvas} from './canvas';

export default class Collage extends React.Component {
  componentShouldUpdate() {
    return false
  }

  render() {

    const { images } = this.props

    const displayImages = (
        {(images.length > 0) && images.map(image => <img className="collage-thumb" src={`${image.imgUrl}`}/>)}
    )

    if (!images) {
      return
    }

    const styleCanv1 = {
      border: '1px solid rgb(204, 204, 204)',
      position: 'absolute',
      width: '500px',
      height: '500px',
      left: '15px',
      touchAction: 'none',
      cursor: 'default'
    }

    const styleCanv2 = {
      border: '1px solid rgb(204, 204, 204)',
      position: 'absolute',
      width: '500px',
      height: '500px',
      left: '15px',
      touchAction: 'none',
      cursor: 'default'
    }

    return (
      <div id="collage-container">
        <div className="canvas-container">
          <canvas style={styleCanv1} ref={elem => this.elem = elem} width={500} height={500} className="lower-canvas"></canvas>
          <canvas style={styleCanv2} className="upper-canvas" width={500} height={500}></canvas>
        </div>
        <div className="controls">
          <button id="copy">Copy Selected Object</button>
          <button id="paste">Paste Selected Object</button>
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

        <div className="canvas-images">
          {displayImages}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    images : state.images
  }
}

const mapDispatchToProps = (dispatch) {
  return {
    getImages: (id) => dispatch(getUserImages(id))
  }
}
