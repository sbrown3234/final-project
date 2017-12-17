import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Register from "./register";
import Landing from "./landing"
import Login from "./login";
import Profile from "./profile";
import App from "./app";
import OP from "./op";
import Online from "./online";
import Chat from "./chat";
import PrivateChat from "./privateChat";
// import Messages from "./messages"
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
        <Route path="/user/profile/:id" component={OP} />
        <Route path="/online" component={Online} />
        <Route path="/public-chatroom" component={Chat} />
        {/* <Route path="/messages/" component={Messages} /> */}
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
