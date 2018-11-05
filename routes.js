const express = require('express');
const passport = require('passport');
const connection = require('./dbconnection').connection;
const pool = require('./dbconnection').pool;
const itemHistoryInsert = require('./dbconnection').itemHistoryInsert;
const app = express.Router();
const bcrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');
const knex = require('./dbconnection').knex;



//ROUTES
//Home
app.get('/', function(req, res) {
    res.render("home");
    console.log("you visited the home page");
});

// Logout
app.get('/logout', checkAuth, function(req, res) {
    console.log(req.user.username + " Logs Out");
    req.session = null;
    res.redirect("/");
});

// ----------------
// INVENTORY routes
// ----------------

//Inventory Page
app.get('/inventory', checkAuth, function(req, res) {
    var passedStuff = req.params.description;
    // var q = 'SELECT * FROM inventory LIMIT 100';

    knex.select('*').from('inventory')
    .orderBy('inv_id','asc')
    .then(results => {
        res.render("inventory/inventory", {items: results});
    })
});

// testing really don't know if this will work.
app.get('/inv-history/:id', checkAuth, function(req, res) {
    var itemId = req.params.id;
    knex.select('*').from('inventory_history')
    .where('inv_id','=',itemId)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

app.get('/inv-items/:id', checkAuth, function(req, res) {
    var itemId = req.params.id;
    knex.select('*').from('inventory')
    .where('inv_id','=',itemId)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

app.put('/inv-items/:id', checkAuth, function(req, res) {
    var itemId = req.params.id;

    let itemData = {
        description: res.req.body.description,
        category: res.req.body.category,
        storage_location: res.req.body.storage,
        quantity: res.req.body.quantity
    }

    if(res.req.body.present){
        itemData.present = 'yes';
    } else {
        itemData.present = 'no';
    }

    if(res.req.body.reserved){
        itemData.reserved = 'yes';
    } else {
        itemData.reserved = 'no';
    }

    // console.log(itemData);

    knex('inventory')
    .where('inv_id','=',itemId)
    .update(itemData)
    .returning('*')
    .then(result => {
        // console.log(result);
        itemHistoryInsert(result, req.user.username,'modified item');
        res.redirect(303, '/inventory')
    })

    // console.log(itemData);
});


//New Item page
app.get('/inventory/new', checkAuth, function(req, res) {
    res.render("inventory/newItem");
    console.log("you visited the new item page");
});

//Add new item to DB
app.post('/inventory', checkAuth, function(req, res) {
    var item = req.body.item;
    console.log("inventory post route...now adding new item to DB");
    insertQuery(item,req.user.username);
    res.redirect("/inventory");
});

// --------------
// SEARCH routes
// --------------
// Show search form
app.get('/search/new', checkAuth, function(req, res) {
    knex.select('category').from('inventory')
    .distinct('category')
    .then(categories => {
        res.render('search', {categories: categories})
    })
    .catch(err => {
        console.log(err)
    })
});

// Query the database
app.post('/search', checkAuth, function(req, res) {
    var query = req.body.query;
    if(query.category === 'Any'){
        var q = knex.select('*').from('inventory')
        .where('description', 'like', `%${query.description}%`)
        .orderBy('inv_id', 'asc')
        .then(results => {
            res.render('inventory/inventory', {items: results});
        })
        .catch(err => {
            console.log(err)
        })
    }else{;
        knex.select('*').from('inventory')
        .where('description', 'like', `%${query.description}%`)
        .andWhere('category', query.category)
        .orderBy('inv_id','asc')
        .then(results => {
            res.render('inventory/inventory', {items: results})
        })
        .catch(err => {
            console.log(err)
        })
    }

});

// --------------
// AUTH routes
// --------------
//Login page
app.get('/login', function(req, res, next){
    //Special Case: If user is already logged in, redirect to the home page.
    if(req.isAuthenticated()){
        res.redirect('/');
    } else {
        res.render('users/login');
    }
});

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/login');
    }
}

app.post('/login', passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login'
}));

//Users Table. TODO: take at least some data out of production
app.get('/user_accounts', function(req, res) {

    if(req.isAuthenticated()){
        var passedStuff = req.params.description;
        //Query to get the data
        var q = 'SELECT * FROM users ORDER BY id';
        connection.query(q, function(err, results) {
            if(err) throw err;

            //Send the rendered page
            res.render("users/user_accounts", {items: results});
        });
    } else {
        res.redirect('/');
    }
});

//signup page
app.get('/signup', function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/account');
    } else {
        res.render("users/signup", {title: "Register", userData: req.user});
    }
});

app.get('/account', checkAuth, function(req, res, next){
    var q = 'SELECT * FROM users WHERE "id"=$1';
    connection.query(q, [req.user.id], function(err, results) {
        res.render("users/account", {info: results});
    });
});

app.post('/signup', async function(req, res){
    const data = {
        id: uuidv4(),
        email: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    await bcrypt.hash(req.body.password, null, null, async function(err,hash){
        knex('users')
        .select('id')
        .where('email','=',data.email)
        .then(result => {
            if(result[0]){
                res.redirect('/signup')
            } else {
                data.password = hash;
                knex('users')
                .insert(data)
                .then(res.redirect('/login'))
                .catch(err => console.log(err, 'Error creatign new user'))
            }
        })
    })
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
function insertQuery(item,user) {
    present = (item.present === 'on') ? 'yes' : 'no';
    reserved = (item.reserved === 'on') ? 'yes' : 'no';

    let data = {
        description: item.description,
        category: item.category,
        date_recieved: 'NOW()',
        storage_location: item.storage_location,
        present: present,
        reserved: reserved
    }

    knex('inventory')
    .insert(data)
    .returning('*')
    .then(result => {
        // console.log(result);
        itemHistoryInsert(result, user,'created item')
    })
    .catch(err => console.log(err, 'Error in item creation'))
}

module.exports = app;
