const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const knex = require('../dbconnection').knex;

//Home
router.get('/', function(req, res) {
    res.render("home");
    console.log("you visited the home page");
});

//Login page
router.get('/login', function(req, res, next){
    //Special Case: If user is already logged in, redirect to the home page.
    if(req.isAuthenticated()){
        res.redirect('/');
    } else {
        res.render('users/login');
    }
});

//signup page
router.get('/signup', function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/account');
    } else {
        res.render("users/signup", {title: "Register", userData: req.user});
    }
});

module.exports = router;
