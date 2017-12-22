import React from 'react';
import $ from 'jquery';
import Chat from '../messages/chat';
import axios from 'axios';

export default class Collage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showChat: false,
      clipboard: null,
      filters: ['invert', 'sepia', 'brownie','brightness', 'contrast', 'saturation', 'vintage','technicolor', 'polaroid', 'gamma', 'brightness', 'kodachrome', 'blackwhite']
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.handleImg = this.handleImg.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleFigure = this.handleFigure.bind(this);
    this.applyImageFilter = this.applyImageFilter.bind(this);
  }



  componentDidMount() {
    console.log('in comp mount')
    var canvas = new fabric.Canvas(this.refs.canvasEl);


    this.setState({
      canvas: canvas
    })
  }

  toggleChat(){
    this.setState({
      showChat: !this.state.showChat
    })
  }

  handleImg(e) {
    e.persist()
    this.setState({
      file : e.target.files[0]
    }, () => {
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


    axios.post('/uploadCanvasImage', imgData).then((results) => {
      if(results.data.success) {
        fabric.Image.fromURL(results.data.image, (oImg) => {
          canvas.add(oImg)
        })
      }
    }).catch((err) => {
      console.log('err in collage:', err)
    })

  }

  applyImageFilter(index, filterName) {
    const { canvas } = this.state;
     var obj = canvas.getActiveObject();
     obj.filters[index] = filterName;
     obj.applyFilters();
     canvas.renderAll();
  }

  handleFigure(e) {
    let f = fabric.Image.filters;
    const { filters } = this.state
    const index = filters.indexOf(e.target.id);

    if (index == 0) {
      console.log('in apply image: ', f)
      this.applyImageFilter(index, e.target.id && new f.Invert())
    }
    else if (index == 1) {
      this.applyImageFilter(index, e.target.id && new f.Sepia())
    } else {
      console.log('something went wrong', index, filters, f);
    }
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
            <input onChange={(e)=> this.handleFigure(e)} id="invert" type="checkbox" />
          </p>
          <p>
            <span>Sepia: </span>
            <input onChange={(e)=> this.handleFigure(e)} id="sepia" type="checkbox" />
          </p>
          <p>
            <span>Gamma:</span>
            <input id="gamma" type="checkbox" />
            <label>
              Red:
              <input id="gamma-red" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
            <br />
            <label>
              Green:
              <input id="gamma-red" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
            <br />
            <label>
              Blue:
              <input id="gamma-red" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
            <br />
          </p>
          <p>
            <span>Brightness:</span>
            <input id="brightness" type="checkbox" />
            <label>
              Value:
              <input id="brightness-value" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
          </p>
          <p>
            <span>Contrast:</span>
            <input id="contrast" type="checkbox" />
            <label>
              Value:
              <input id="contrast-value" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
          </p>
          <p>
            <span>Saturation:</span>
            <input id="saturation" type="checkbox" />
            <label>
              Value:
              <input id="saturation-value" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
            </label>
          </p>

          <input onChange={(e) => this.handleImg(e)} type="file" name="file" />
          <div id="public-chat">
            <h1 onClick={()=> this.toggleChat()}>Need Help?</h1>
            {!!showChat && <Chat chatMessages={chatMessages} handleChange={handleChange} sendMessage={sendMessage} />}
          </div>

        </div>
      </div>
    )
  }
}
