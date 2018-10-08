/*
Authors: Jake Edwards & John Carvajal
Class: CSC 425-001
Professor: Dr. Sawadpong
Project:
Team: TeamIDK
*/

var express    = require('express');
var mysql      = require('mysql');
var faker      = require('faker');
var bodyParser = require('body-parser');
var passport = require('passport');
require('./login.js');

var app = express();

//Setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Connect to MySQL database with the correct user info and which database is to be used
/*var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'jakejohn',
  database  : 'warehouse_inventory'
});

//Connect to warehouse_inventory DB
connection.connect();
*/

const { Client } = require('pg');

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

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

//eventually a login page
app.get('/login', function(req, res){
  res.render("login");
});

//eventually a signup page
app.get('/signup', function(req, res){
  res.render("signup");
});

//The inventory page where the database will be shown
app.get('/inventory', function(req, res) {
  var passedStuff = req.params.description;
  //console.log(passedStuff);
  //Query to get the data
  var q = 'SELECT * FROM inventory LIMIT 100';
  connection.query(q, function(err, results) {
    if(err) throw err;

    //Send the rendered page
    //console.log(results);
    res.render("inventory", {items: results});
  });
});

app.get('/user_accounts', function(req, res) {
  var passedStuff = req.params.description;
  //console.log(passedStuff);
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
