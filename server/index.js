var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('server:server');
var http = require('http');
var cors = require('cors');
var neo4j = require('neo4j-driver');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','1234'));
var session = driver.session();

const indexRouter = express.Router();
app.use('/', indexRouter);

indexRouter.get('/', function(req, res){
    session
        .run('MATCH(n:Game) RETURN n LIMIT 25')
        .then(function(result){
            result.records.forEach(function(record){
                console.log(record._fields[0].properties);
            });
        })
        .catch(function(err){
            console.log(err)
        });
    res.send('works');
});


//USERS
const usersRouter = express.Router();

app.use('/users', usersRouter);

//GET USER
usersRouter.get('/',function(req,res){
    const username = req.body.username;

    session
    .run(`MATCH (u:User {username: '${username}'}) return u`)
    .then(function(result){
        if(result.records.length == 0)
            res.send('No user with that username.');
        else{
            let user = result.records[0]._fields[0].properties;
            user = {'name':user.name,'username':user.username};
            res.send(user);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//SEARCH USERS
usersRouter.get('/search',function(req,res){
    const page = req.body.page - 1;
    const searchTerm = req.body.searchTerm;

    session
    .run(`MATCH (u:User)
            WHERE u.name =~ '(?i)${searchTerm}.*'
            return u
            ORDER BY u.id DESC
            SKIP ${page*20}
            LIMIT 20`)
    .then(function(result){
        if(result.records.length == 0)
            res.send('No more users');
        else{
            let usersArr = result.records.map(function(record){
                let user = record._fields[0].properties;
                return {'name':user.name,'username':user.username};
            });
            res.send(usersArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//CREATE ACCOUNT
usersRouter.post('/createAccount',function(req,res){
    const name = req.body.name;
    const username = req.body.username;
    const pass = req.body.password;

    session
        .run(`CREATE (u:User {name:'${name}', username: '${username}', password: '${pass}'})`)
        .then(function(result){
            res.send({'name':name,'username':username,pass:'pass'});
        })
        .catch(function(err){
            res.send(err);
        });
});

//LOGIN
usersRouter.post('/login',function(req, res){
    const username = req.body.username;
    const pass = req.body.password;

    session
        .run(`MATCH (u:User {username: '${username}'}) return u`)
        .then(function(result){
            if(result.records.length == 0){
                res.send('Invalid username');
            }else{
                const user = result.records[0]._fields[0].properties;
                if(user.password == pass){
                    res.send({'name':user.name,'username':username});
                }else{
                    res.send('Incorrect password');
                }
            }
        })
        .catch(function(err){
            res.send(err);
        });
});

//FOLLOW
usersRouter.post('/follow',function(req,res){
    const username = req.body.username;
    const follow = req.body.follow;

    session
        .run(`MATCH (u:User {username:'${username}'})
                MATCH (f:User {username:'${follow}'})
                MERGE (u)-[:FOLLOWS]->(f)
                return u,f`)
        .then(function(result){
            if(result.records.length == 0)
                res.send('Invalid request. Wrong username provided');
            else
                res.send(`${username} now follows ${follow}`);
        })
        .catch(function(err){
            res.send(err);
        });
});

//UNFOLLOW
usersRouter.post('/unfollow',function(req,res){
    const username = req.body.username;
    const unfollow = req.body.unfollow;

    session
        .run(`MATCH (u:User)-[r:FOLLOWS]->(f:User)
                WHERE u.username = '${username}'
                AND f.username = '${unfollow}'
                DELETE r
                return u,f`)
        .then(function(result){
            if(result.records.length == 0)
                res.send('Invalid request. Wrong username provided or relationship does not exist');
            else
                res.send(`${username} stopped following ${unfollow}`);
        })
        .catch(function(err){
            res.send(err);
        });
});

//GET FOLLOWERS
usersRouter.get('/followers',function(req,res){
    const username = req.body.username;

    session
    .run(`MATCH (u:User {username:'${username}'})
            MATCH (u)<-[:FOLLOWS]-(f:User)
            return f`)
    .then(function(result){
        if(result.records.length == 0)
            res.send(`Nobody follows User ${username} yet`);
        else{
            let usersArr = result.records.map(function(record){
                let user = record._fields[0].properties;
                delete user.password;
                return user;
            });
            res.send(usersArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//GET FOLLOWING
usersRouter.get('/following',function(req,res){
    const username = req.body.username;

    session
    .run(`MATCH (u:User {username:'${username}'})
            MATCH (u)-[:FOLLOWS]->(f:User)
            return f`)
    .then(function(result){
        if(result.records.length == 0)
            res.send(`User ${username} does not follow anybody yet`);
        else{
            let usersArr = result.records.map(function(record){
                let user = record._fields[0].properties;
                delete user.password;
                return user;
            });
            res.send(usersArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//GAMES
const gamesRouter = express.Router();

app.use('/games', gamesRouter);

//GET ALL GAMES
gamesRouter.get('/',function(req,res){
    const page = req.body.page - 1;
    
    session
    .run(`MATCH (g:Game)
            return g
            ORDER BY g.rating DESC
            SKIP ${page*20}
            LIMIT 20`)
    .then(function(result){
        if(result.records.length == 0)
            res.send('No more games');
        else{
            let gamesArr = result.records.map(function(record){
                return record._fields[0].properties;
            });
            res.send(gamesArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//SEARCH GAMES
gamesRouter.get('/search',function(req,res){
    const page = req.body.page - 1;
    const searchTerm = req.body.searchTerm;

    session
    .run(`MATCH (g:Game)
            WHERE g.name =~ '(?i)${searchTerm}.*'
            return g
            ORDER BY g.rating DESC
            SKIP ${page*20}
            LIMIT 20`)
    .then(function(result){
        if(result.records.length == 0)
            res.send('No more games');
        else{
            let gamesArr = result.records.map(function(record){
                return record._fields[0].properties;
            });
            res.send(gamesArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//GET LIKED GAMES BY USER
gamesRouter.get('/liked',function(req,res){
    const username = req.body.username;

    session
    .run(`MATCH (u:User {username:'${username}'})
            MATCH (u)-[:LIKES]->(g:Game)
            return g
            ORDER BY g.rating DESC`)
    .then(function(result){
        if(result.records.length == 0)
            res.send(`User ${username} did not like any games yet`);
        else{
            let gamesArr = result.records.map(function(record){
                return record._fields[0].properties;
            });
            res.send(gamesArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//GET RECOMMENDED GAMES FOR USER
gamesRouter.get('/recommended',function(req,res){
    const username = req.body.username;
    const free = req.body.free;

    session
    .run(`MATCH (u:User {username:'${username}'})
            MATCH (u)-[:FOLLOWS]->(:User)-[:LIKES]->(g:Game)
            return g
            ORDER BY g.rating DESC`)
    .then(function(result){
        if(result.records.length == 0)
            res.send(`We have no recommendations for User ${username} yet`);
        else{
            let gamesArr = result.records.map(function(record){
                return record._fields[0].properties;
            });
            
            if(free == 'true'){
                gamesArr = gamesArr.filter(function(curr){
                    if(curr.price == 0) return true;
                    else return false;
                });
            }

            let finalArr = orderByLikes(gamesArr);

            res.send(finalArr);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

orderByLikes = function(gamesArr){
    var allTypesArray = [...gamesArr];
    var map = allTypesArray.reduce(function(p, c) {
      p[c.id] = (p[c.id] || 0) + 1;
      return p;
    }, {});
    
    var sortedIds = Object.keys(map).sort(function(a, b) {
      return map[b] - map[a];
    });
    
    let finalArr = sortedIds.map(function(curr){
          let game;
        allTypesArray.forEach(function(current){
            if(current.id == curr)
              game = current
        });
          return game;
    });

    return finalArr
};

//LIKE GAME
gamesRouter.post('/like',function(req, res){
    const gameId = req.body.gameId;
    const username = req.body.username;

    session
    .run(`MATCH (u:User {username:'${username}'})
            MATCH (g:Game {id:'${gameId}'})
            MERGE (u)-[:LIKES]->(g)
            return u,g`)
    .then(function(result){
        if(result.records.length == 0)
            res.send('Invalid request. Wrong username or gameId provided');
        else{
            const gameName = result.records[0]._fields[1].properties.name;
            res.send(`${username} now likes ${gameName}`);
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//DISLIKE GAME
gamesRouter.post('/dislike', function(req, res){
    const gameId = req.body.gameId;
    const username = req.body.username;

    session
        .run(`MATCH (u:User)-[r:LIKES]->(g:Game)
                WHERE u.username = '${username}'
                AND g.id = '${gameId}'
                DELETE r
                return u,g`)
        .then(function(result){
            if(result.records.length == 0)
                res.send('Invalid request. Wrong username provided or relationship does not exist');
            else{
                const gameName = result.records[0]._fields[1].properties.name;
                res.send(`${username} now dislikes ${gameName}`);
            }  
        })
        .catch(function(err){
            res.send(err);
        });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

//SERVER


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

console.log(`Server listening on PORT: ${port}`);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
