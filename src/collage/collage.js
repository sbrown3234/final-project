import React from 'react';
import $ from 'jquery';
import Chat from '../messages/chat';
import axios from 'axios';

export default class Collage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showChat: false,
      clipboard: null
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.handleImg = this.handleImg.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }



  componentDidMount() {
    console.log('in comp mount')
    var canvas = new fabric.Canvas(this.refs.canvasEl);

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

    this.setState({
      canvas: canvas
    })
  }

  toggleChat(){
    console.log("running toggle")
    this.setState({
      showChat: !this.state.showChat
    }, () => {
      console.log('state: ', this.state)
    })
  }

  handleImg(e) {
    e.persist()
    this.setState({
      file : e.target.files[0]
    }, () => {
      e.preventDefault()
      this.uploadImg()
    })
  }


  handleCopy() {
    this.state.canvas.getActiveObject().clone((cloned) => {
      this.setState({
        clipboard: cloned
      })
    });
  }

  removeItem() {
    const { canvas } = this.state
    var obj = canvas.getActiveObject()
    canvas.remove(obj)
    console.log('canvas: ', canvas, obj)
  }

  handlePaste() {
    const { clipboard, canvas } = this.state
    canvas.add(clipboard)
  }


  uploadImg() {
    const { canvas, file } = this.state
    var imgData = new FormData();
    imgData.append('file', file)

    console.log('form: ', imgData)

    axios.post('/uploadCanvasImage', imgData).then((results) => {
      console.log("fffs")
      if(results.data.success) {
        fabric.Image.fromURL(results.data.image, (oImg) => {
            canvas.add(oImg)
        })
      }
  }).catch((err) => {
    console.log('err in collage:', err)
  })

  }


  render() {

    const { showChat, clipboard } = this.state
    const { chatMessages, handleChange, sendMessage } = this.props

    const styleCanv1 = {
      border: '1px solid rgb(204, 204, 204)',
      position: 'relative',
      width: '500px',
      height: '500px',
      left: '15px',
      touchAction: 'none',
      cursor: 'default'
    }

    return (
      <div id="collage-container">
        <canvas width="500" height="500" ref="canvasEl" style={styleCanv1} className="lower-canvas"></canvas>
        <div className="controls">
          <br/>
          <h3>Handle Images:</h3>
          <button onClick={this.handleCopy}>Copy Selected Object</button>
          <button onClick={() => this.handlePaste()}>Paste Selected Object</button>
          <button onClick={this.removeItem}>Remove Selected Object</button>
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
          <form>
          <input onChange={(e) => this.handleImg(e)} type="file" name="file" />
          </form>
          <div id="public-chat">
            <h1 onClick={()=> this.toggleChat()}>Need Help?</h1>
            {!!showChat && <Chat chatMessages={chatMessages} handleChange={handleChange} sendMessage={sendMessage} />}
          </div>

        </div>
      </div>
    )
  }
}
