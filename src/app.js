import React from 'react';
import axios from 'axios';
import Icon from './icon';
import Nav from './nav';
import Pic from './pic';
import { getSocket } from './socket'


export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showUploader: false,
      showBio: false
    };
    this.sendDM = this.sendDM.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePic = this.handlePic.bind(this);
    this.toggleBio = this.toggleBio.bind(this);
    this.upload = this.upload.bind(this);
    this.update = this.update.bind(this);

  }

  handlePic(e) {
    this.setState({
      [e.target.name]: e.target.files[0]
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  sendMessage(e) {
    console.log('in send message')
    getSocket().emit('newMessage', {message: this.state.message, user: this.state.id })
    e.preventDefault()
  }

  sendDM(e) {
    console.log('in send message')
    getSocket().emit('newDM', {message: this.state.dm, otherId: this.props.params.id, user: this.state.id})
    e.preventDefault()
  }

  toggleBio() {
    console.log('hallo')
    this.setState({
      showBio : !this.state.showBio
    })
  }

  toggleUpload() {
    this.setState({
      showUploader: !this.state.showUploader
    })
  }

  update(e) {

    axios.post('/update', this.state).then(({ data }) => {
      if (data.success) {
        this.setState({
          bio: data.bio
        })
      }

    }
  ).catch((err) => {
      console.log('axios bio post err: ', err)
    })
    this.toggleBio()
    e.preventDefault();
  }

  upload(e) {
    this.toggleUpload()
    const { file, coverPhoto } = this.state;
    if (!!file) {
      let formData = new FormData();
      formData.append("file", file);


      axios.post('/uploadImage', formData).then((results) => {


        if (results.data.success) {
          this.setState({
            profile_pic : results.data.image
          })
        }
      }).catch((err) => {
        console.log('aXIOS upload post err: ', err)
      })
      e.preventDefault();
    }

    if (!!coverPhoto) {
      let formData = new FormData();
      formData.append("file", coverPhoto);
      console.log('running upload, file state: ', coverPhoto)


      axios.post('/uploadCover', formData).then((results) => {


        if (results.data.success) {
          this.setState({
            cover_photo : results.data.image
          })
        }
      }).catch((err) => {
        console.log('aXIOS upload post err: ', err)
      })
      e.preventDefault();
    }

  }

  componentDidMount(){
    axios.get('/userInfo').then(({data}) => {
      this.setState({
        firstname: data.firstname,
        lastname: data.lastname,
        profile_pic: data.profile_pic,
        cover_photo: data.cover_photo,
        bio: data.bio,
        id: data.id
      })
    }).catch((err) => {
      console.log('axios get userInfo err: ', err)
    })
  }


  render() {
    console.log('rendering app')

    const { firstname, lastname, profile_pic, cover_photo, bio, id, showBio, showUploader } = this.state;

    const children = React.cloneElement(this.props.children, {
      firstname,
      lastname,
      profile_pic,
      cover_photo,
      bio,
      id,
      showBio,
      showUploader,
      sendDM: this.sendDM,
      sendMessage: this.sendMessage,
      toggleUpload : this.toggleUpload,
      toggleBio : this.toggleBio,
      update: this.update,
      upload : this.upload,
      handleChange : this.handleChange,
      handlePic: this.handlePic
    });

    if(!this.state) {
      return (
        <div>Loading..... </div>
      )

    }
    return (
      <div id="app">
        <Icon />
        <Nav profile_pic = {profile_pic} />
        {children}
      </div>
    )
  }

}
