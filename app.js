/*
Authors: Jake Edwards & John Carvajal
Class: CSC 425-001
Professor: Dr. Sawadpong
Project: 
Team: TeamIDK
*/

var express = require('express');
var mysql   = require('mysql');
var faker   = require('faker');

var app = express();

//Setup
app.use(express.static("public"));
app.set("view engine", "ejs");

//Connect to MySQL database with the correct user info and which database is to be used
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'jakejohn',
  database  : 'warehouse_inventory'
});

//Connect to warehouse_inventory DB
connection.connect();

//ROUTES
//Home
app.get('/', function(req, res) {
  res.render("home");
  console.log("you visited the home page");
});

//Query page
app.get('/query', function(req, res) {
  res.render("query");
  console.log("you visited the query page");
});

//The inventory page where the database will be shown
app.get('/inventory', function(req, res) {
  //Query to get the data
  var q = 'SELECT * FROM inventory LIMIT 100';
  connection.query(q, function(err, results) {
    if(err) throw err;
    
    //Send the rendered page
    res.render("inventory", {items: results});
  });  
});


//The server
app.listen(3000, function() {
  console.log("The server has started");
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


