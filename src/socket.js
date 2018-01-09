import * as io from 'socket.io-client';
import axios from 'axios';
import { userJoined, onlineUsers, userLeft, chatMessage, chatMessages, directMessages, directMessage, newComment } from './actions';
import { store } from './start';

let socket;


export function getSocket() {
  if (!socket) {
    socket = io.connect();

    socket.on('connect', () => {
      axios.get('/connected/' + socket.id).then((data) => {
        console.log('(socket.js) on connect: ', data)
      })

      socket.on('newComment', ({comment}) => {
        console.log('in newComment socket: ', comment)
        store.dispatch(newComment(comment))
      })

      socket.on('chatMessage', (data) => {
        store.dispatch(chatMessage(data))
      })

      socket.on('chatMessages', ({messages}) => {
        store.dispatch(chatMessages(messages))
      })

      socket.on('directMessage', ({message}) => {
        store.dispatch(directMessage(message))
      })

      socket.on('directMessages', ({messages}) => {
        store.dispatch(directMessages(messages))
      })

      socket.on('userJoined', ({data}) => {
        store.dispatch(userJoined(data))
      })

      socket.on('onlineUsers', ({ data }) => {
        store.dispatch(onlineUsers(data))
      })

      socket.on('userLeft', (data) => {
        store.dispatch(userLeft(data))
      })

    })
  }

  return socket;

}
