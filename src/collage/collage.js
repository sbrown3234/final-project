import React from 'react';
import $ from 'jquery';
import Chat from '../messages/chat';

export default class Collage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showChat: false,
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
  }

  componentShouldUpdate() {
    return false
  }

  componentDidMount() {

    var canvas = this.__canvas = new fabric.Canvas(this.refs.canvasEl);
    // create a rectangle object
    var rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: '#D81B60',
      width: 100,
      height: 100,
      strokeWidth: 2,
      stroke: "#880E4F",
      rx: 10,
      ry: 10,
      angle: 45,
      hasControls: true
    });

    canvas.add(rect);

    // create a rectangle object
    var rect2 = new fabric.Rect({
      left: 200,
      top: 50,
      fill: '#F06292',
      width: 100,
      height: 100,
      strokeWidth: 2,
      stroke: "#880E4F",
      rx: 10,
      ry: 10,
      angle: 45,
      hasControls: true
    });

    canvas.add(rect2);

    var circle1 = new fabric.Circle({
      radius: 65,
      fill: '#039BE5',
      left: 0
    });

    var circle2 = new fabric.Circle({
      radius: 65,
      fill: '#4FC3F7',
      left: 110,
      opacity: 0.7
    });

    var group = new fabric.Group([circle1, circle2, ], {
      left: 40,
      top: 250
    });

    canvas.add(group);
  }

  toggleChat(){
    this.setState({
      showChat: !this.state.showChat
    })
  }


  handleCopy() {
    canvas.getActiveObject().clone(function(cloned) {
      _clipboard = cloned;
    });
  }

  handlePaste() {
    _clipboard.clone(function(clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {

        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj) {
          canvas.add(obj);
        });

        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      _clipboard.top += 10;
      _clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }
  render() {

    const { showChat } = this.state
    const { chatMessages, handleChange, sendMessage } = this.props

    console.log("props: ", this.props)

    const styleCanv1 = {
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
        <canvas ref="canvasEl" className="lower-canvas"></canvas>
        <div className="controls">
          <button onClick={this.handleCopy}>Copy Selected Object</button>
          <button onClick={this.handlePaste}>Paste Selected Object</button>
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

        <button onClick={this.handleImage}>Upload an Image</button>
        </div>
        <div id="public-chat">
        <h1 onClick={this.toggleChat}>Public Chatroom</h1>
          {showChat && <Chat chatMessages={chatMessages} handleChange={handleChange} sendMessage={sendMessage} />}
        </div>
      </div>
    )
  }
}
