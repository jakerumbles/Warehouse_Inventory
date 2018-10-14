/*
Authors: Jake Edwards & David Hamilton & John Carvajal
Class: CSC 425-001
Professor: Dr. Sawadpong
Project:
Team: TeamIDK
*/

var express    = require('express');
var app = express();
var passport = require('passport');
var request = require('request');
const { Pool, Client } = require('pg');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const LocalStrategy = require('passport-local').Strategy;

//Testing pool Setup
const pool = new Pool({
  user: 'hsyfhnwfejbulk',
  host: 'ec2-54-83-50-145.compute-1.amazonaws.com',
  database: 'd1mt5sv8e5tqvu',
  password: 'c2edbd81c31729e5257db5e44cbad188e9c6d520e579209d62b559f5e3747353',
  port: 5432,
  ssl: true
});

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const pg = require('pg');
const parseDbUrl = require('parse-database-url');

//Setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const session = require('express-session');
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




const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

connection.connect();

/*connection.query('CREATE TABLE inventory', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  connection.end();
});
*/

//ROUTES
//Home
app.get('/', function(req, res) {
  res.render("home");
  console.log("you visited the home page");
});

//New Item page
app.get('/inventory/new', function(req, res) {
  res.render("newItem");
  console.log("you visited the new item page");
});

//Add new item to DB
app.post('/inventory', function(req, res) {
  var item = req.body.item;
  console.log("inventory post route...now adding new item to DB");
  var q = insertQuery(item);
  console.log(q);
  connection.query(q, function(err, results) {
    if(err) throw err;
  });
  res.redirect("/inventory");
});

//eventually a login page

app.get('/login', function(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    res.render('login', {title: "Log In", userData: req.user});
  }
});
/*
app.get('/login', passport.authenticate('local', {failureRedirect: '/login'}),function(req, res, next){
  res.redirect('/');
});*/

//Testing
/*
app.get('/login', checkAuth,function(req, res, next){
  res.redirect('/');
});

function checkAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect('/login');
  }
}
*/

app.post('/login', passport.authenticate('local', {
  successRedirect: '/user_accounts',
  failureRedirect: '/login',
  }),function(req, res){
    if(req.body.remember){
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      rea.session.cookie.expires = false;
    }
    res.redirect('/');
    }
);

passport.use('local', new  LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {

	loginAttempt();
	async function loginAttempt() {


		const client = await pool.connect()
		try{
			await client.query('BEGIN')
			var currentAccountsData = await JSON.stringify(client.query('SELECT id, "firstName", "email", "password" FROM "users" WHERE "email"=$1', [username], function(err, result) {
        //console.log(result);
				if(err) {
          console.log('error with client query');
					return done(err)
				}
				if(result.rows[0] == null){
					return done(null, false);
				}
				else{
					bcrypt.compare(password, result.rows[0].password, function(err, check) {
						if (err){
							console.log('Error while checking password');
							return done();
						}
						else if (check){
							return done(null, [{id: result.rows[0].id}]);
						}
						else{
              console.log('null false')
							return done(null, false);
						}
					});
				}
			}))
		}

		catch(e){throw (e);}
	};

}
))

//eventually a signup page
app.get('/signup', function(req, res, next){
  res.render("signup", {title: "Register", userData: req.user});
});

app.post('/signup', async function(req, res){
  try{
    const dbclient = await pool.connect()
    await dbclient.query('BEGIN')
    var pwd = await bcrypt.hash(req.body.password, 5);
    await JSON.stringify(dbclient.query('SELECT id FROM "users" WHERE "email"=$1',
  [req.body.username], function(err, result){
    if(result.rows[0]){
      res.redirect('/register');
    }
    else{
      dbclient.query('INSERT INTO users (id, "firstName", "lastName", email, password) VALUES ($1, $2, $3, $4, $5)',
    [uuidv4(), req.body.firstName, req.body.lastName, req.body.username, pwd],
  function(err, result){
    if(err){
      console.log(err);
    }
    else{
      dbclient.query('COMMIT')
      console.log(result)
      res.redirect('/login');
      return;
    }
  });
    }
  }));
  dbclient.release();

}
  catch(e){throw(e)}
});

//The inventory page where the database will be shown

app.get('/inventory', passport.authenticate('local', {failureRedirect: '/'}),function(req, res, next){
  var passedStuff = req.params.description;
  var q = 'SELECT * FROM inventory LIMIT 100';
  connection.query(q, function(err,results){
    if(err) throw err;
    res.render("inventory", {items: results});
  });
});
/*
app.get('/inventory', function(req, res) {
  if(req.isAuthenticated()){
    var passedStuff = req.params.description;
    var q = 'SELECT * FROM inventory LIMIT 100';

    connection.query(q, function(err, results) {
      if(err) throw err;
      res.render("inventory", {items: results});
    });
  } else {
    res.redirect('/');
  }
});*/

/*
app.get('/user_accounts', function(req, res) {

  if(req.isAuthenticated()){
    var passedStuff = req.params.description;
    //Query to get the data
    var q = 'SELECT * FROM user_account ORDER BY user_id';
    connection.query(q, function(err, results) {
      if(err) throw err;

      //Send the rendered page
      //console.log(results);
      res.render("user_accounts", {items: results});
    });
  } else {
    res.redirect('/');
  }
});*/

app.get('/user_accounts',
  passport.authenticate('local', {failureRedirect: '/'}),
    function(req, res) {
    var passedStuff = req.params.description;
    //Query to get the data
    var q = 'SELECT * FROM user_account ORDER BY user_id';
    connection.query(q, function(err, results) {
      if(err) throw err;
      //Send the rendered page
      //console.log(results);
      res.render("user_accounts", {items: results});
    });
});

app.get('/items', function(req, res) {
  var passedStuff = req.params.description;
  //console.log(passedStuff);
  //Query to get the data
  var q = 'SELECT * FROM item ORDER BY item_id';
  connection.query(q, function(err, results) {
    if(err) throw err;

    //Send the rendered page
    //console.log(results);
    res.render("items", {items: results});
  });
});

app.get('/projects', function(req, res) {
  var passedStuff = req.params.description;
  //console.log(passedStuff);
  //Query to get the data
  var q = 'SELECT * FROM project ORDER BY project_id';
  connection.query(q, function(err, results) {
    if(err) throw err;

    //Send the rendered page
    //console.log(results);
    res.render("projects", {items: results});
  });
});

//The server
app.set('port', (process.env.PORT || 5000));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Query generator functions
//Generates a query for inserting a new item
function insertQuery(item) {
  var q = 'INSERT INTO inventory(description, category, date_recieved, storage_location, present, reserved)' +
          'VALUES(';
  q += '\'' + item.description + '\', ';
  q += '\'' + item.category + '\', ';
  q += 'NOW(), ';
  q += item.storage_location + ', ';

  if(item.present === 'on') {
    q += '\'yes\', ';
  } else {
    q += '\'no\', ';
  }

  if(item.reserved === 'on') {
    q += '\'yes\');';
  } else {
    q += '\'no\');';
  }

  return q;
}

passport.serializeUser(function(user, done) {
  console.log('Called SerializeUser function ', user)
	done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  //console.log('Called deserializeUser function ', id)
  var q = 'SELECT "id" FROM "users" WHERE "id"=$1';

  connection.query(q, [id], function(err, results) {
    //console.log(results);
    if(err) throw err;
  });
	done(null, id);
});








//Generate fake data
// var fake_data = [];
// for(var i = 0; i < 1000; i++) {
//   fake_data.push([
//     faker.commerce.productName(),
//     faker.commerce.productAdjective(),
//     faker.date.past(),
//     faker.random.number(),
//     faker.random.boolean(),
//     faker.random.boolean()
//   ]);
// }

//Load warehouse_inventory DB with fake_data as provided by faker.js
// var q = 'INSERT INTO inventory(description, category, date_recieved, storage_location, present, reserved) VALUES ?';
// connection.query(q, [fake_data], function(err, result) {
//   console.log('Error is ' + err);
//   console.log(result);
// });

//Test query
// connection.query('SELECT date_recieved FROM inventory AS date', function(error, results, fields) {
//   if(error) throw error;
//   console.log(results[0]);
// });

//Close the DB connection
//connection.end();
