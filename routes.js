const express = require('express');
// const passport = require('passport');
// const connection = require('./dbconnection').connection;
// const pool = require('./dbconnection').pool;
// const itemHistoryInsert = require('./dbconnection').itemHistoryInsert;
const router = express.Router();
// const bcrypt = require('bcrypt-nodejs');
// const uuidv4 = require('uuid/v4');
// const knex = require('./dbconnection').knex;
// const reserveItem = require('./reserveHelper').reserveItem;

// middleware for all routes
router.use('*', require('./helpers').logger);

//ROUTES
//index routes
const index = require('./routes/index');
router.use('/', index);

//inventory routes
const inventory = require('./routes/inventory');
router.use('/', inventory);

//api routes
const api = require('./routes/api');
router.use('/', api);

//search routes
const search = require('./routes/search');
router.use('/', search);

//projects routes
const projects = require('./routes/projects');
router.use('/', projects);

//statistics routes
const statistics = require('./routes/statistics');
router.use('/', statistics);

//auth routes
const auth = require('./routes/auth');
router.use('/', auth);

router.use(function(req,res,next){
    let err = new Error('Error 404: Page Not Found')
    err.status = 404;
    next(err);
})

router.use(function(err,req,res,next){
    console.error('Oops! Encountered an error\nStack Trace: \n   ',err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err,
    })
})

module.exports = router;
