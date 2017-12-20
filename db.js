(function(){
  var spicedPg = require('spiced-pg');
  var db = spicedPg('postgres:postgres:postgres@localhost:5432/snetwork');
  var bcrypt = require('bcryptjs');

  exports.newUser = (data) => {
    const params = [data.firstname, data.lastname, data.email];
    const q = `INSERT INTO users (firstname, lastname, email) VALUES ($1, $2, $3) RETURNING id;`;
    return db.query(q, params).then((results) => {
      return results.rows[0].id;
    }).catch((err) =>
    console.log('you fucked up the registration insert: ', err))
  };

  exports.hashPassword = (userPassword, id) => {
    return new Promise((resolve, reject) => {
      const q = `UPDATE users SET hashed_pass = $1 WHERE id = $2 RETURNING hashed_pass`;
      const params = [];
      bcrypt.genSalt((err, salt) => {
        if (err) {
          return reject(err);
        }
        bcrypt.hash(userPassword, salt, (err, hash) => {
          if (err) {
            return reject(err);
          }
          params.push(hash);
          params.push(id);
          db.query(q, params).then((results) => {
            return resolve(results.rows[0].hashed_pass);
          }).catch((err) => {
            console.log('This is inside the db hashPassword:', err)
          })
        })
      })
    })
  }

  exports.checkPassword = (textEntered, hashedPass) => {
    return new Promise ((resolve, reject) => {
      bcrypt.compare(textEntered, hashedPass, (err, doesMatch) => {
        if(err) {
          reject(err);
        }
        resolve(doesMatch);
      })
    })
  }

  exports.checkEmail = (enteredEmail) => {
    const q = `SELECT * FROM users WHERE email = $1;`
    const params = [enteredEmail];
    return db.query(q, params).then((results) => {
      return results.rows[0];
    }).catch((err) =>{
      console.log('this is username error', err);
    })
  }

  exports.userInfo = (id) => {
    const q = `SELECT * FROM users WHERE id=$1;`
    const params = [id];
    return db.query(q,params).then((results) => {
      return results.rows[0];
    }).catch((err) => {
      console.log('userInfo db err: ', err);
    })
  }

  exports.getAlbums = (id) => {
    const  q = `SELECT * FROM albums WHERE user_id = $1;`
    const params = [id];
    return db.query(q,params).then((results) => {
      console.log('getAlbums res: ', results.rows)
      return results.rows
    })
  }

  exports.insertPic = (file, id) => {
    const q = `UPDATE users SET profile_pic = $1 WHERE id = $2;`;
    const params = [file, id];
    return db.query(q,params)
  }

  exports.insertCover = (file, id) => {
    const q = `UPDATE users SET cover_photo = $1 WHERE id = $2;`;
    const params = [file, id];
    return db.query(q,params)
  }

  exports.updateBio = (bio, id) => {
    const q = `UPDATE users SET bio = $1 WHERE id = $2`;
    const params = [bio, id];
    return db.query(q, params).then((results) => {
      return results.rows[0];
    }).catch((err) => {
      console.log('UpdateBio error: ', err)
    })
  }

  exports.getUsers = (id) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, status
    FROM friend_requests
    JOIN users
    ON (status = 0 AND recipient_id = $1 AND sender_id = users.id)
    OR (status = 1 AND recipient_id = $1 AND sender_id = users.id)
    OR (status = 1 AND sender_id = $1 AND recipient_id = users.id)`
    const params = [id];
    return db.query(q,params).then((results) => {
      return results.rows
    })
  }

  exports.getAllUsers = () => {
    const q = `SELECT * from users`
    return db.query(q).then((results) => {
      return results.rows
    })
  }

  exports.checkStatus = (currUser, otherUser) => {
    const q = `SELECT status, sender_id
    FROM friend_requests
    WHERE ( sender_id = $1 AND recipient_id = $2 )
    OR ( sender_id = $2 AND recipient_id = $1 )
    ORDER BY updated_at DESC;`
    const params = [currUser, otherUser];
    return db.query(q,params).then((results) => {
      return results.rows[0];
    }).catch((err) => [
      console.log('friend status check fail: ', err)
    ])
  }

  exports.sendRequest = (currUser, otherUser) => {
    const q = `INSERT INTO friend_requests (sender_id, recipient_id, status, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING id;`
    const params = [currUser, otherUser, 0];
    return db.query(q,params).then((results) => {
      return results.rows[0];
    }).catch((err) => {
      console.log('updateStatus err: ', err)
    })
  }

  exports.acceptRequest = (currUser, otherUser) => {
    const q = `UPDATE friend_requests
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE ( sender_id = $2 AND recipient_id = $3 )
    OR  ( recipient_id = $2 AND sender_id = $3 );`
    const params = [1, currUser, otherUser];
    return db.query(q,params).then((results) => {
      return results.rows[0]
    }).catch((err) => {
      console.log('accept db err: ', err)
    })
  }

  exports.cancelRequest = (currUser, otherUser) => {
    const q = `UPDATE friend_requests
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE ( sender_id = $2 AND recipient_id = $3 )
    OR  ( recipient_id = $2 AND sender_id = $3 );`
    const params = [2, currUser, otherUser];
    return db.query(q,params).then((results) => {
      return results.rows[0]
    }).catch((err) => {
      console.log('cancel db err: ', err)
    })
  }

  exports.getOnlineUserFriendsByIds = (userId, arrayOfUserIds) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, status
    FROM users
    LEFT JOIN friend_requests
    ON status = 1
    AND (
      (recipient_id = users.id AND sender_id = ANY($2))
    OR
      (sender_id = users.id AND recipient_id = $1)
    )
    WHERE users.id = ANY($2)`
    const params = [userId, arrayOfUserIds]
    return db.query(q,params).then((results)=> {
      return results.rows
    }).catch((err) => {
      console.log('getUsersByIds db err: ', err)
    })
  }

  exports.getMessages = () => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, chat.created_at, chat.sender_id, chat.message
    FROM users
    JOIN chat
    ON (sender_id = users.id)
    AND (recipient_id IS NULL)
    ORDER BY chat.created_at ASC;`
    return db.query(q).then((results) => {
      return results.rows
    }).catch((err) => {
      console.log('getMessages err: ', err)
    })
  }

  exports.chatMessage = (userId, message) => {
    const q = `INSERT INTO chat (sender_id, message)
    VALUES ($1, $2);`
    const params = [userId, message];
    return db.query(q,params).then((results)=> {
      return results.rows
    }).catch((err) => {
      console.log('chatMessage err: ', err)
    })
  }

  exports.userMessage = (userId) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, chat.created_at, sender_id, message
    FROM users
    JOIN chat
    ON sender_id = users.id
    WHERE sender_id = $1
    ORDER BY chat.created_at DESC
    LIMIT 1;`
    const params = [userId]
    return db.query(q,params).then((results) => {
      console.log('results', results.rows)
      return results.rows
    }).catch((err)=> {
      console.log('userMessage pic err: ', err)
    })
  }
  
  exports.directMessage = (userId, otherId, message) => {
    const q = `INSERT INTO chat (sender_id, recipient_id, message)
    VALUES ($1, $2, $3);`
    const params = [userId, otherId , message];
    return db.query(q,params).then((results) => {
      return results.rows
    }).catch((err) => {
      console.log('DM insert err: ', err)
    })
  }

  exports.userDMessage = (userId, otherId) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, chat.created_at, sender_id, message
    FROM users
    JOIN chat
    ON sender_id = users.id
    WHERE (
      sender_id = $1 AND recipient_id = $2
    )
    ORDER BY chat.created_at DESC
    LIMIT 1;`
    const params = [userId, otherId]
    return db.query(q,params).then((results) => {
      console.log('results', results.rows)
      return results.rows
    }).catch((err)=> {
      console.log('userMessage pic err: ', err)
    })
  }

  exports.getDMs = (userId, otherId) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, chat.created_at, sender_id, message
    FROM users
    JOIN chat
    ON sender_id = users.id
    WHERE (
      sender_id = $1 AND recipient_id = $2
    ) OR (
      sender_id = $2 AND recipient_id = $1
    )
    ORDER BY chat.created_at ASC;`
    params = [userId, otherId]
    return db.query(q, params).then((results) => {
      return results.rows
    }).catch((err) => {
      console.log('getDMs err: ', err)
    })
  }

  exports.getAllDMs = (id) => {
    const q = `SELECT users.id, firstname, lastname, profile_pic, chat.created_at, sender_id, message
    FROM users
    JOIN chat
    ON users.id
    WHERE (
      sender_id = $1 AND recipient_id IS NOT NULL
    ) OR (
      recipient_id = $1
    )
    ORDER BY users.id, chat.created_at ASC;`
    const params = [id]
    return db.query(q,params).then((results) => {
      console.log('getAllDms res: ', results.rows)
      return results.rows
    }).catch((err)=> {
      console.log('getAllDms err: ', err)
    })
  }

  exports.accessInfo = (socketId, browser, address, time) => {
    const q = `INSERT INTO user_info (socket_id, user_agent, remote_address, accessed_at)
    VALUES ($1, $2, $3, $4);`
    const params = [socketId, browser, address, time]
    return db.query(q, params).then((results) => {
      return results.rows[0]
    }).catch((err)=> {
      console.log('access insert err: ', err)
    })
  }

  exports.addUserId = (id, socketId) => {
    const q = `UPDATE user_info SET user_id = $1 WHERE (socket_id = $2);`
    const params = [id, socketId]
    return db.query(q,params).then((results) => {
      return results.rows[0]
    })
  }

  exports.userLeft = (socketId) => {
    const q = `UPDATE user_info SET left_at = CURRENT_TIMESTAMP WHERE (socket_id = $1);`
    const params = [socketId];
    return db.query(q,params).then((results) => {
      return results.rows[0]
    })
  }



})();
