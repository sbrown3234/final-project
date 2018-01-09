import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./landing/welcome";
import Register from "./landing/register";
import Landing from "./landing/landing"
import Login from "./landing/login";
import About from './landing/about';
import Profile from "./profiles/profile";
import OP from "./profiles/op";
import SelectedImage from "./profiles/selected"
import Chat from "./messages/chat";
import PrivateChat from "./messages/privateChat";
import Collage from './collage/collage';
import App from "./app";
import Online from "./online";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { Router, Route, IndexRoute, browserHistory, hashHistory } from "react-router";
import * as io from "socket.io-client";
import { composeWithDevTools } from 'redux-devtools-extension';

let router;

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome} >
        <Route path="/login" component={Register} />
        <IndexRoute component={Landing} />
  	    </Route>
    </Router>
);

const loggedInRouter = (
  <Provider store={ store }>
    <Router history={browserHistory}>
        <Route path="/" component={App}>
        <Route path="/about" component={About}/>
        <Route path="/user/profile/:id" component={OP} />
        <Route path="/image/:id" component={SelectedImage} />
        <Route path="/online" component={Online} />
        <Route path="/public-chatroom" component={Chat} />
        <Route path="/collage" component={Collage} />
        <Route path="/messages/:id" component={PrivateChat} />
        <IndexRoute component={Profile} />
  	    </Route>
    </Router>
  </Provider>
);

if (location.pathname == "/welcome") {
    router = notLoggedInRouter;
} else {
  router = loggedInRouter;
}

ReactDOM.render(router, document.querySelector("main"));
