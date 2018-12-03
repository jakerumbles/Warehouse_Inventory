/*
Authors: Jake Edwards & David Hamilton & John Carvajal
Class: CSC 425-001
Professor: Dr. Sawadpong
Project: HFH Database
Team: TeamIDK
*/

//app depenedencies
var express    = require('express');
var app = express();
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const bcrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');

//database connection
const dbconnection = require('./dbconnection')
const connection = dbconnection.connection;
const pool = dbconnection.pool;

//app Setup
config.init(app, express,passport);
//Make currentUser avaliable in every page so I don't have to pass it in the render function for every single route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//routes setup
const routeConfig = require('./routes');
app.use(routeConfig);

//passport stuff
const passportinit = require('./passport-serialize');
passportinit();

passport.use('local', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {

    loginAttempt();
    async function loginAttempt() {


        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            var currentAccountsData = await JSON.stringify(client.query('SELECT id, "firstname", "email", "password","access" FROM "users" WHERE "email"=$1', [username], function(err, result) {
                //console.log(result);
                if (err) {
                    console.log('error with client query');
                    return done(err)
                }
                if (result.rows[0] == null) {
                    return done(null, false);
                } else {
                    bcrypt.compare(password, result.rows[0].password, function(err, check) {
                        if (err) {
                            console.log('Error while checking password');
                            return done();
                        } else if (check) {
                            return done(null, [{
                                id: result.rows[0].id,
                                username: result.rows[0].email,
								access: result.rows[0].access
                            }]);
                        } else {
                            console.log('null false')
                            return done(null, false);
                        }
                    });
                }
            }))
        } catch (e) {
            throw (e);
        }
    };

}))

//The server
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
