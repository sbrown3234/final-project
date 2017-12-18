const defaultState = {
  dms: [],
  othersFriends: [],
  messages: [],
  everyDM: []
}

export default function(state = defaultState, action) {
  if (action.type == 'RECEIVE_USERS') {
    state = Object.assign({}, state, {
      users: action.users
    });
  }

  if (action.type == 'RECEIVE_THEIR_FRIENDS') {
    state = Object.assign({}, state, {
      othersFriends: action.users
    });
  }

  if (action.type == 'ADD_FRIEND') {
    state = Object.assign({}, state, {
      users: state.users.map(user=> {
        if (user.id == action.user) {
          return Object.assign({}, user, {
            status: 1
          })
        }
      })
    })
  }

  if (action.type == 'END_FRIEND') {
    state = Object.assign({}, state, {
      users: state.users.map(user=> {
        if (user.id == action.user) {
          return Object.assign({}, user, {
            status: 2
          })
        }
      })
    })
  }


  if (action.type == 'ONLINE_USERS') {
    state = Object.assign({}, state, {
      onlineUsers: action.users
    })
  }

  if (action.type == 'USER_JOINED') {
    if (!state.onlineUsers) {
      return state;
    } else {
      state = Object.assign({}, state, {
        onlineUsers: state.onlineUsers.concat(action.user)
      })
    }
  }

  if (action.type == 'CHAT_MESSAGES') {
    state = Object.assign({}, state, {
      messages: action.messages
    })
  }

  if (action.type == 'NEW_MESSAGE') {
    state = Object.assign({}, state, {
      messages: [...state.messages, action.message]
    })
  }

  if (action.type == 'GET_ALL_DM') {
    console.log('running dm reducer')
    state = Object.assign({}, state, {
      everyDM: action.DMs
    })
  }

  if (action.type == 'DIRECT_MESSAGES') {
    state = Object.assign({}, state, {
      dms: action.DMs
    })
  }

  if (action.type == 'DIRECT_MESSAGE') {
    state = Object.assign({}, state, {
      dms: [...state.dms, action.message]
    })
  }

  if (action.type == 'USER_LEFT') {
    if (!state.onlineUsers) {
      return state;
    } else {
      state = Object.assign({}, state, {
        onlineUsers: state.onlineUsers.filter(userLeft => {
          return userLeft.id != action.userId;
        })
      });
    }
  }
console.log('state: ', state)
return state;
}
