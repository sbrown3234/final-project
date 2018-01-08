import axios from 'axios';

export function getTheirFriends(id) {
  return axios.get('/friends-friends-list/' + id).then(({data}) => {
    return {
      type: "RECEIVE_THEIR_FRIENDS",
      users: data
    }
  })
}

export function getUserFriends() {
  return axios.get('/user-friend-list').then(({data}) => {
    return {
      type: "RECEIVE_USERS",
      users: data
    }
  })
}

export function getAllUsers() {
  return axios.get('/all-users').then(({data}) => {
    return {
      type: "GET_ALL_USERS",
      allUsers: data
    }
  })
}

export function addFriend(otherId) {
  return axios.post('/accept-request/' + otherId).then((results) => {
    return {
      type: "ADD_FRIEND",
      user: otherId,
      status: results.status
    }
  })
}

export function endFriend(otherId) {
  return axios.post('/cancel-request/' + otherId).then((results) => {
    return {
      type: "END_FRIEND",
      user: otherId,
      status: results.status
    }
  })
}


export function onlineUsers(data) {
  return {
    type: "ONLINE_USERS",
    users: data
  }
}

export function chatMessage({message}) {
  return {
    type: "NEW_MESSAGE",
    message: message
  }
}

export function chatMessages(messages) {
  return {
    type: "CHAT_MESSAGES",
    messages: messages
  }
}

export function getDMs(id) {
  return axios.get('/dm/'+id).then(({data})=> {
    return {
      type: "DIRECT_MESSAGES",
      DMs: data.messages
    }
  }).catch((err) => {
    console.log('getDMs action err: ', err)
  })
}

export function directMessage(message) {
  console.log('newDM: ', message)
  return {
    type: "DIRECT_MESSAGE",
    message: message
  }
}

export function insertComment(id) {
  return axios.post('/comment/'+id).then(({data}) => {
    console.log('in getImage: ', data)
    return {
      type: "GET_IMAGE",
      comment: data
    }
  })
}

export function getComments(id) {
  return axios.get('/comments/'+id).then(({data}) => {
    console.log('in getComments: ', data)
    return {
      type: "GET_COMMENTS",
      comments: data
    }
  })
}

export function getImage(id) {
  return axios.get('/image/'+id).then(({data}) => {
    console.log('in getImage: ', data)
    return {
      type: "GET_IMAGE",
      image: data
    }
  })
}

export function getImages() {
  return axios.get('/images').then(({data}) => {
    return {
      type: "GET_IMAGES",
      images: data
    }
  })
}

export function getTheirImages(otherId) {
  return axios.get('/their-images/' + otherId).then(({data}) => {
    console.log('in action: ', data)
    return {
      type: "GET_THEIR_IMAGES",
      theirImages: data
    }
  })
}

export function userJoined(data) {
  return {
    type: "USER_JOINED",
    user: data,
  }
}

export function userLeft(data) {
  return {
    type: "USER_LEFT",
    user: data,
    userId: data.id
  }
}
