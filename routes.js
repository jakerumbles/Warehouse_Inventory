const express = require('express');
const passport = require('passport');
const connection = require('./dbconnection').connection;
const pool = require('./dbconnection').pool;
const app = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

//ROUTES
//Home
app.get('/', function(req, res) {
  if(req.isAuthenticated()){
    res.render("auth/home");
  } else {
    res.render("home");
  }
  console.log("you visited the home page");
});

app.get('/logout', function(req, res) {
  //
  req.session.destroy(function() {
    res.redirect('/');
  });
  console.log("User Logs Out");
});

//New Item page
app.get('/inventory/new', function(req, res) {
  res.render("auth/newItem");
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

//passport.authenticate works here for some reason but not others
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


app.get('/user_accounts', function(req, res) {

  if(req.isAuthenticated()){
    var passedStuff = req.params.description;
    //Query to get the data
    var q = 'SELECT * FROM users ORDER BY id';
    connection.query(q, function(err, results) {
      if(err) throw err;

      //Send the rendered page
      //console.log(results);
      res.render("auth/user_accounts", {items: results});
    });
  } else {
    res.redirect('/');
  }
});

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
      res.redirect('/signup');
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
      //console.log(result)
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
/*
app.get('/inventory', passport.authenticate('local', {failureRedirect: '/'}),function(req, res, next){
  var passedStuff = req.params.description;
  var q = 'SELECT * FROM inventory LIMIT 100';
  connection.query(q, function(err,results){
    if(err) throw err;
    res.render("inventory", {items: results});
  });
});*/

app.get('/inventory', function(req, res) {
  if(req.isAuthenticated()){
    var passedStuff = req.params.description;
    var q = 'SELECT * FROM inventory LIMIT 100';

    connection.query(q, function(err, results) {
      if(err) throw err;
      res.render("auth/inventory", {items: results});
    });
  } else {
    res.redirect('/');
  }
});

/*
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
});*/

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

module.exports = app;
