const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const checkAccess = require('../helpers').checkAccess;
const knex = require('../dbconnection').knex;
const passport = require('passport');
const connection = require('../dbconnection').connection;
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');

// --------------
// AUTH routes
// --------------

// post for login
router.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/auth/account',
    failureRedirect: '/'
}));

// Logout
router.get('/auth/logout', checkAuth, function(req, res) {
    req.session = null;
    res.redirect("/");
});

//Users Table. TODO: take at least some data out of production
router.get('/auth/user_accounts', checkAuth, checkAccess, function(req, res) {

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

// account info page
router.get('/auth/account', checkAuth,function(req, res, next){
    var q = 'SELECT * FROM users WHERE "id"=$1';
    connection.query(q, [req.user.id], function(err, results) {
        res.render("users/account", {info: results});
    });
});

// post for signup
router.post('/auth/signup', async function(req, res){
    const data = {
        id: uuidv4(),
        email: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    await bcrypt.hash(req.body.password, null, null, async function(err,hash){
        knex('users')
        .select('id')
        .where('email','=',data.email)
        .then(result => {
            if(result[0]){
                req.session.message = "User already exists."
                res.redirect('/')
            } else {
                data.password = hash;
                knex('users')
                .insert(data)
                .then(res.redirect('/')) //Redirect to homepage after account is created.  User then needs to log in
                .catch(err => console.log(err, 'Error creating new user'))
            }
        })
    })
});
module.exports = router;
