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

export function getAllDMs() {
  return axios.get('/get-all-dms').then(({data}) => {
    console.log('in getAllDMs action: ', data.messages)
    return {
      type: "GET_ALL_DM",
      messages: data.messages
    }
  })
}


export function getDMs(id) {
  return axios.get('/dm/'+id).then(({data})=> {
    console.log('in getDMS: ', data)
    return {
      type: "DIRECT_MESSAGES",
      DMs: data.messages
    }
  }).catch((err) => {
    console.log('getDMs action err: ', err)
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

export function chatMessage(message) {
  console.log('in chatMessage: ', message)
  return {
    type: "NEW_MESSAGE",
    message: message
  }
}

export function chatMessages(messages) {
  console.log('in chat messages: ', messages)
  return {
    type: "CHAT_MESSAGES",
    messages: messages
  }
}

export function directMessage(message) {
  console.log('in chatMessage: ', message)
  return {
    type: "DIRECT_MESSAGE",
    message: message
  }
}

export function userJoined(data) {
  console.log('in userJoined: ', data)
  return {
    type: "USER_JOINED",
    user: data,
  }
}

export function userLeft(data) {
  console.log('userLeft: ', data)
  return {
    type: "USER_LEFT",
    user: data,
    userId: data.id
  }
}
