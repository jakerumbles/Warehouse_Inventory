(function(config){

  //main dependencies
  var passport = require('passport');
  var request = require('request');
  //const { Pool, Client } = require('pg');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser')
  //const pg = require('pg');
  const session = require('express-session');
  const parseDbUrl = require('parse-database-url'); //is this needed?

  config.init = function(app,express, passport){
    //Setup
    app.use(express.static("public"));
    app.set("view engine", "ejs");
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    //app.use(require('cookie-parser')());
    app.use(cookieParser('keyboard cat'));
    //app.use(session({secret: 'mySecretKey'}));
    app.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      cookie: {
        //secure: true,
        maxAge: 3600000
      }
    }));

    

    app.use(passport.initialize());
    app.use(passport.session());
  }

})(module.exports);
