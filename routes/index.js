const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const knex = require('../dbconnection').knex;

//Home
router.get('/', function(req, res) {
    let errMessage = req.session.message;
    req.session.message = '';
    res.render("home",{
        message: errMessage
    });
    // console.log("you visited the home page");
});

module.exports = router;
