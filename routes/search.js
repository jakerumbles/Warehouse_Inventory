const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const knex = require('../dbconnection').knex;

// --------------
// SEARCH routes
// --------------
// Show search form
router.get('/search/new', checkAuth, function(req, res) {
    knex.select('category').from('inventory')
    .distinct('category')
    .where('remove','=','false')
    .then(categories => {
        res.render('search', {categories: categories})
    })
    .catch(err => {
        console.log(err)
    })
});

// Query the database
router.post('/search', checkAuth, function(req, res) {
    var query = req.body.query;
    if(query.category === 'Any'){
        var q = knex.select('*').from('inventory')
        .where('description', 'like', `%${query.description}%`)
        .andWhere('remove','=','false')
        .orderBy('inv_id', 'asc')
        .then(results => {
            res.render('inventory/inventory', {
                items: results,
                reserving:false,
                access:req.user.access
            });
        })
        .catch(err => {
            console.log(err)
        })
    }else{
        knex.select('*').from('inventory')
        .where('description', 'like', `%${query.description}%`)
        .andWhere('category', query.category)
        .andWhere('remove','=','false')
        .orderBy('inv_id','asc')
        .then(results => {
            res.render('inventory/inventory', {
                items: results,reserving:false,
                access: req.user.access
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

});
module.exports = router;
