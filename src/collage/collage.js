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
      filters: ['invert', 'sepia','brightness', 'contrast', 'saturation', 'gamma', 'brightness']
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.handleImg = this.handleImg.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.filterValue = this.filterValue.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.applyImageFilter = this.applyImageFilter.bind(this);
    this.applyFilterValue = this.applyFilterValue.bind(this);
    this.saveCanvas = this.saveCanvas.bind(this);
    this.submitCanvas = this.submitCanvas.bind(this);
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
        console.log('image uploaded: ', results.data.image)
        fabric.Image.fromURL(results.data.image, (oImg) => {
          canvas.add(oImg)
        })
      }
    }).catch((err) => {
      console.log('err in collage upload:', err)
    })

  }

  saveCanvas(e) {
    e.preventDefault()
    const { canvas } = this.state

    var data = canvas.toDataURL()

    let transfer = {
      data: data
    }

    axios.post('/saveCanvas', transfer).then((results) => {
      if(results.data.success) {
        console.log('success')

      }
    }).catch((err) => {
      console.log('err in collage save:', err)
    })
  }

  submitCanvas(e) {
    e.preventDefault()
    const { canvas } = this.state

    var data = canvas.toDataURL()

    var transfer = {
      data: data
    }

    axios.post('/submitCanvas', transfer).then((results) => {
      if(results.data.success) {
        console.log('success')
      }
    }).catch((err) => {
      console.log('err in collage submit:', err)
    })
  }

  applyImageFilter(index, filterName) {
    const { canvas } = this.state;
    var obj = canvas.getActiveObject();
    obj.filters[index] = filterName;
    obj.applyFilters();
    canvas.renderAll();
  }

  handleFilter(e) {
    let f = fabric.Image.filters;
    const { filters } = this.state
    const index = filters.indexOf(e.target.id);

    if (index == 0) {
      this.applyImageFilter(index, this.checked && new f.Invert())
    } else if (index == 1) {
      this.applyImageFilter(index, this.checked && new f.Sepia())
    } else if (index == 2) {
      console.log('in handleFilter')
      this.applyImageFilter(index, e.target.id && new f.Brightness({
        brightness: parseFloat($('#brightness-value').value)
      }));
    }
  }

  applyFilterValue(index, prop, value) {
    const { canvas } = this.state
    var obj = canvas.getActiveObject();
    obj.filters[index][prop] = value;
    obj.applyFilters();
    canvas.renderAll();
  }

  filterValue(e) {
    const { filters } = this.state
    const index = filters.indexOf(e.target.name);
    if (index == 2) {
      console.log('index: ', e.target.value)
      this.applyFilterValue(2, e.target.name, e.target.value);
    }
  }


  render() {

    const { showChat, clipboard } = this.state
    const { chatMessages, handleChange, sendMessage } = this.props

    const styleCanv1 = {
      border: '1px solid rgb(204, 204, 204)',
      position: 'absolute',
      width: '500px',
      height: '500px',
      left: '15px',
      touchAction: 'none',
      cursor: 'default'
    }

    if (!this.props) {
      return <div>Loading....</div>
    }

    return (
      <div id="canvas">
        <div id="collage-container">


          <div id="canvas-container">

            <canvas width="800" height="600" ref="canvasEl" style={styleCanv1} className="lower-canvas"></canvas>
            <div id="save">
              <button className="save-button" type="submit" onClick={(e)=> this.saveCanvas(e)}>Save Image!</button>
              <button className="save-button" type="submit" onClick={(e)=> this.submitCanvas(e)}>Submit Image!</button>
            </div>

          </div>

          <div id="panel-container">

            <div className="controls">
              <br/>
              <h3>Copy/Paste Images:</h3>
              <button onClick={this.handleCopy}>Copy Selected Object</button>
              <button onClick={() => this.handlePaste()}>Paste Selected Object</button>
              <button onClick={this.removeItem}>Remove Selected Object</button>
              <h3>Filters: </h3>
              <p>
                <span>Invert: </span>
                <input onChange={(e)=> this.handleFilter(e)} id="invert" type="checkbox" />
              </p>
              <p>
                <span>Sepia: </span>
                <input onChange={(e)=> this.handleFilter(e)} id="sepia" type="checkbox" />
              </p>

              <p>
                  <span>Brightness:</span>
                  <input onClick={(e)=> this.handleFilter(e)} id="brightness" type="checkbox" />
                <label> <br/>
                  Value:
                  <input onChange={(e)=> this.filterValue(e)} id="brightness-value" name="brightness" value="1" min="0.2" max="2.2" step="0.003921" type="range" />
                </label>
              </p>


            <input onChange={(e) => this.handleImg(e)} type="file" name="file" />
          </div>
          <div id="public-chat">
            <h1 onClick={()=> this.toggleChat()}>Need Help?</h1>
            {!!showChat && <Chat chatMessages={chatMessages} handleChange={handleChange} sendMessage={sendMessage} />}
          </div>

        </div>


      </div>
    </div>
  )
}
}
