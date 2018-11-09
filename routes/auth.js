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

router.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/auth/account',
    failureRedirect: '/login'
}));

// Logout
router.get('/auth/logout', checkAuth, function(req, res) {
    console.log(req.user.username + " Logs Out");
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

router.get('/auth/account', checkAuth,function(req, res, next){
    var q = 'SELECT * FROM users WHERE "id"=$1';
    connection.query(q, [req.user.id], function(err, results) {
        res.render("users/account", {info: results});
    });
});

router.post('/auth/signup', async function(req, res){
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
module.exports = router;
