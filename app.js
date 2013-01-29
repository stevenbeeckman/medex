
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , admin = require('./routes/admin')
  , http = require('http')
  , mongoose = require('mongoose')
  , db
  , User
  , UserEvent
 // , https = require('https')
//  , fs = require('fs')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  

var app = express();
var MongoStore = require('connect-mongo')(express);

//var privateKey = fs.readFileSync('privatekey.pem').toString();
//var certificate = fs.readFileSync('certificate.pem').toString();

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Finding user ");
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        console.dir(err);
        return done(err);
      }
      if (!user) {
        console.log("Unknown user " + username);
        return done(null, false, { message: "Unknown user"});
      }
      if (!user.authenticate(password)) {
        console.log("Invalid password for user " + username);
        return done(null, false, { message: 'Invalid password'});
      }
      console.log(username + " logged in.");

      // logging UserEvent to database
      UserEvent = require('./models/userevent').Userevent(db);
      var uevent = new Object();
      uevent.username = username;
      uevent.eventtype = "Login";
      var ue = new UserEvent(uevent);
      ue.save();

      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  //console.log("Serializing user" + user.id + " " + user.username);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //console.log("Deserializing user " + id);
  User.findOne({_id: id}, function (err, user) {
    if(err) {
      console.log("An error happened while deserializing user id " + id);
      console.dir(err);
    }
    //console.dir(user);
    done(err, user);
  });
});


setupApp();

function setupApp() {
  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.logger('dev'));
    app.use(express.cookieParser()); // per http://passportjs.org/guide/configuration.html
    app.use(express.bodyParser());
    app.use(express.methodOverride());
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('db-uri', 'localhost:27017/medex');
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('db-uri', process.env.MONGOLAB_URI);
  });

  db = mongoose.createConnection(app.set('db-uri'));
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function () {
    console.log("Connected to the database.");
    // sessions http://stackoverflow.com/a/10175827
    app.use(express.session({
      secret: 'MedexForNothing23262YT924Y924GHEGZD923T2332EG',
      maxAge: new Date(Date.now() + 3600000),
      store: new MongoStore({
        mongoose_connection: db
      })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    
    // get models
    User = require('./models/user').User(db);
    UserEvent = require('./models/userevent').Userevent(db);

    setupRoutes();
    startServer();
  });

}

function addDb(req, res, next){
  req.db = db;
  next();
}

function setupRoutes() {
  app.get('/', routes.index);

  app.get('/login', addDb, routes.login); // apparently stored in /routes/index.js
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin/deaths',
    failureRedirect: '/login'
  }));

  app.get('/admin', addDb, checkIfLoggedIn, admin.admin);
  app.get('/admin/login', addDb, admin.login);
  app.get('/logout', addDb, function(req, res){
    // logging UserEvent to database
    UserEvent = require('./models/userevent').Userevent(req.db);
    var uevent = new Object();
    uevent.username = req.user.username;
    uevent.eventtype = "Logout";
    var ue = new UserEvent(uevent);
    ue.save();
    console.log(req.user.username + " logged out.");

    req.logOut();
    res.redirect('/login');
  });

  app.get('*', function(req, res) {
    console.log("Page not found: " + req.originalUrl);
    res.render('404');
  })

}

function checkIfLoggedIn(req, res, next) {
  console.log("Checking whether or not user is logged in.");
  if(req.user) {
    //console.log("req.user exists");
    //console.dir(req.user);
    next();
  } else {
    console.log("req.user does not exist");
    res.redirect('/login');
  }
  
}

function startServer() {
  http.createServer(app).listen(app.get('port'), function() {
    console.log("Express http server listening on port " + app.get('port'));
  });
}

