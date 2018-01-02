(function() {
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  const compression = require('compression');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const cookieSession = require('cookie-session');
  const multer = require('multer');
  const uidSafe = require('uid-safe');
  const path = require('path');
  const config = require('./config.json')
  const dbModule = require('./db');
  const s3 = require('./s3');

  app.use(compression());

  if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({target: 'http://localhost:8081/'}));
  }

  app.use(express.static(__dirname + '/uploads'));

  var diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, __dirname + '/uploads');
    },
    filename: (req, file, callback) => {
      uidSafe(24).then((uid) => {
        callback(null, uid + path.extname(file.originalname))
      })
    }
  })

  var uploader = multer({
    storage: diskStorage,
    limits: {
      fileSize: 2097152
    }
  });

  app.use(express.static('./public'));

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({limit: 2097152}))

  app.use(cookieSession({
    name: 'session',
    secret: 'I was made to believe there was something wrong with me',
    maxAge: 1000 * 60 * 60 * 24 * 14
  }));


  app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/')
  })

  app.get('/get-all-dms', (req, res) => {
    let userId = req.session.user.id

    dbModule.getAllDMs(userId).then((results) => {
      res.json({messages: results})
    }).catch((err) => {
      console.log('get-all-dms index err: ', err)
    })
  })

  app.get('/dm/:id', (req, res) => {
    let userId = req.session.user.id
    let otherId = req.params.id;

    dbModule.getDMs(userId, otherId).then((results) => {
      res.json({messages: results})
    }).catch((err) => {
      console.log('getDMs index err: ', err)
    })
  })

  app.get('/friends-friends-list/:id', (req, res) => {
    dbModule.getUsers(req.params.id).then((results) => {
      res.json(results)
    })
  })


  app.get('/user-friend-list', (req, res) => {
    dbModule.getUsers(req.session.user.id).then((results) => {
      res.json(results)
    })
  })

  io.on('connect', (socket) => {
    let socketId = socket.id;
    let userId;
    let otherId;

    let timeAccessed = socket.handshake.time
    let userAddress = socket.handshake.address
    let browser = socket.handshake.headers['user-agent']


    dbModule.accessInfo(socketId, browser, userAddress, timeAccessed)

    dbModule.getMessages().then((results) => {
      if (results.length > 10) {
        const newResults = results.slice(-10)
        io.sockets.sockets[socketId].emit('chatMessages', {messages: newResults})
      } else {
        io.sockets.sockets[socketId].emit('chatMessages', {messages: results})
      }
    }).catch((err) => {
      console.log('getMessages index err: ', err)
    })


    socket.on('newMessage', ({message, user}) => {
      console.log("in new message")
      userId = user;

        dbModule.chatMessage(userId, message).then( () => {
          dbModule.userMessage(userId).then((results) => {
              io.sockets.emit('chatMessage', {message: results})
        })
      }).catch((err) => {
        console.log('chatMessage post err: ', err)
      })
    })

    socket.on('newDM', ({message, otherId, user}) => {
      userId = user;
      otherId = otherId;

      let otherUser = onlineUsers.filter(onlineUser => onlineUser.userId == otherId)
      let otherUserSockets = otherUser.find(otherUsers => otherUsers.socketId)

      let currUser = onlineUsers.filter(onlineUser => onlineUser.userId == userId)
      let currUserSocket = otherUser.find(otherUsers => otherUsers.socketId)


      dbModule.directMessage(userId, otherId, message).then( () => {
        dbModule.userDMessage(userId, otherId).then((results) => {
          console.log('res: ', results.profile_pic)
        io.sockets.sockets[socketId].emit('directMessage', {message: results})
      })
    }).catch((err) => {
        console.log('newDM post err: ', err)
      })
    })

    socket.on('disconnect', (socket) => {


      dbModule.userLeft(socketId)

      for(var i = 0; i < onlineUsers.length; i++) {
        if(onlineUsers[i].socketId == socketId) {
          io.sockets.emit('userLeft', {data: {userId, socketId}})
          onlineUsers.splice(i,1);
        }
      }
    })
  })


  let onlineUsers = [];


  app.get('/connected/:socketId', (req, res, next) => {
    let socketId = req.params.socketId;
    let userId = req.session.user.id;


    if (!req.session.user) {
      return res.json(null);
    }
    const userDidJoin = !onlineUsers.find(obj => obj.userId == userId);

    dbModule.addUserId(userId, socketId)

    if (userDidJoin) {

      onlineUsers.push({
        userId: userId,
        socketId: socketId
      });

      dbModule.userInfo(userId).then((results) => {
        io.sockets.emit('userJoined', {data: results});
      })
    }


    const ids = onlineUsers.map(function(item,index) {
      let userIds = item.userId;
      return userIds
    })

    dbModule.getOnlineUserFriendsByIds(userId, ids).then((results) => {
      io.sockets.sockets[socketId].emit('onlineUsers', {data: results})
    }).catch((err) => {
      console.log('getUsersByIds db err: ', err)
    })
    res.json(null)
  })


  app.post('/cancel-request/:otherId', (req, res) => {
    let otherId = req.params.otherId;

    dbModule.cancelRequest(req.session.user.id, otherId).then((results)=> {
      res.json({success: true, results})
    }).catch((err) => {
      console.log('cancelRequest err: ', err);
    })
  })


  app.post('/accept-request/:otherId', (req, res) => {
    let otherId = req.params.otherId;

    dbModule.acceptRequest(req.session.user.id, otherId).then((results)=> {
      res.json({success: true, results})
    }).catch((err) => {
      console.log('acceptRequest err: ', err);
    })
  })


  app.post('/send-request/:otherId', (req, res) => {
    let otherId = req.params.otherId;

    dbModule.sendRequest(req.session.user.id, otherId).then((results)=> {
      res.json({success: true, results})
    }).catch((err) => {
      console.log('sendRequest err: ', err);
    })
  })


  app.get('/friend-status/:otherId', (req, res) => {
    let otherId = req.params.otherId;

    dbModule.checkStatus(req.session.user.id, otherId).then((results) => {
      let status = results.status
      let sender = results.sender_id;

      res.json({status, sender})
    }).catch((err) => {
      console.log('checkStatus err: ', err)
      res.json({none: true})
    })
  })


  app.get('/getUser/:id', (req, res) => {
    let id = req.params.id;

    if (id == req.session.user.id) {
      res.json({
        currUser: true
      })
    } else {
      dbModule.userInfo(id).then((results) => {
        console.log('results getUser: ', results)
        if (!results.cover_photo) {
          results.cover_photo = "http://panoramastudio-international.com/wp-content/uploads/2014/02/placeholder_image1.png"
        }

        res.json({
          success: true,
          otherProf: results
        })
    }).catch((err) => {
      console.log('get opp user err: ', err)
    })
  }
})

app.get('/all-users', (req, res) => {
  dbModule.getAllUsers().then((results) => {
    res.json({data: results})
  }).catch((err) => {
    console.log('all users err: ', err)
  })
})


app.post('/update', (req, res) => {
  console.log(req.body.bio)
  dbModule.updateBio(req.body.bio, req.session.user.id).then(() => {
    res.json({success: true, bio: req.body.bio})
  }).catch((err) => {
    console.log('server update bio err: ', err)
  })
})

app.post('/uploadCover', uploader.single('file'), (req, res) => {

  s3.upload(req.file).then(() => {
    let cover_photo = config.s3Url + req.file.filename
    return dbModule.insertCover(cover_photo, req.session.user.id).then(() => {
      res.json({success: true, image: cover_photo})
    })
  }).catch((err) => {
    console.log('uploadCover err: ', err);
    res.json({error: true})
  })
})


app.post('/uploadImage', uploader.single('file'), (req, res) => {

  s3.upload(req.file).then(() => {
    let profile_pic = config.s3Url + req.file.filename
    return dbModule.insertPic(profile_pic, req.session.user.id).then(() => {
      res.json({success: true, image: profile_pic})
    })
  }).catch((err) => {
    console.log('upload err: ', err);
    res.json({error: true})
  })
})

app.post('/uploadCanvasImage', uploader.single('file'), (req, res) => {
  return dbModule.saveCanv(req.file.filename, req.session.user.id).then(() => {
    let image = req.file.filename
      res.json({success: true, image})
  }).catch((err) => {
    console.log('uploadCanvasImg err: ', err);
    res.json({error: true})
  })
})

app.post('/saveCanvas', (req, res) => {
    let userId = req.session.user.id
    let canvas = req.body.data

    dbModule.saveCanv(canvas, userId).then(() => {
      dbModule.getAllCanv(userId).then((results) => {
        console.log('results: ', results)
      })
      res.json({success: true})
    }).catch((err) => {
      console.log('insertCavn error: ', err)
    })
});

app.post('/submitCanvas', (req, res) => {
    let userId = req.session.user.id
    let canvas = req.body.data

    console.log('in submit: ', canvas)

    dbModule.submitCanvas(userId, canvas).then(() => {
      console.log('in success')
      res.json({success: true})
    }).catch((err) => {
      console.log('saveImg error: ', err)
    })
});

app.get('/canvasImages', (req,res) => {
  let userId = req.session.user.id
  dbModule.getAllCanv(userId)
})


app.get('/userInfo', (req, res) => {
  dbModule.userInfo(req.session.user.id).then((results) => {
     if (!results.cover_photo) {
      results.cover_photo = "http://panoramastudio-international.com/wp-content/uploads/2014/02/placeholder_image1.png"
    }

      res.json(results)
    }).catch((err) => {
      console.log('userInfo err: ', err)
    })
  })

  app.get('/their-images/:otherId', (req, res) => {
    let otherId = req.params.otherId
    dbModule.getAllCanv(otherId).then((results) => {
      res.json({data: results})
    }).catch((err)=> {
      console.log("err in getAllCanv req:", err)
    })
  })

  app.get('/images', (req, res) => {
    let id = req.session.user.id

    dbModule.getAllCanv(id).then((results) => {
      res.json({data: results})
    }).catch((err)=> {
      console.log("err in getAllCanv req:", err)
    })
  })


app.post('/login', (req, res) => {
  dbModule.checkEmail(req.body.email).then((results) => {
    let hash = results.hashed_pass;
    let id = results.id;
    dbModule.checkPassword(req.body.password, hash).then((match) => {
      if (match == true) {
        req.session.user = {
          id: id,
          login: true
        }
        res.json({success: true});
      } else {
        res.redirect('/')
      }
    })
  }).catch((err) => {
    res.json({success: false})
    console.log('login post err: ', err);
  })
})


app.post('/register', (req, res) => {

  if(!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
    res.json({success: false})
  }

  let profilePic = "https://api.adorable.io/avatars/200/abott@adorable.png"

  dbModule.newUser(req.body, profilePic).then((id) => {
    dbModule.hashPassword(req.body.password, id)
    req.session.user = {
      id: id,
      login: true
    }
    res.json({success: true})
  })
})


app.get('/welcome', function(req, res) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});


app.get('*', function(req, res) {
  if (!req.session.user) {
    res.redirect('/welcome')
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});


server.listen(process.env.PORT || 8080)

})();
