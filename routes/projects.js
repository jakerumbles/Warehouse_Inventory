const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const knex = require('../dbconnection').knex;

// -----------------------------
// PROJECT Routes
// -----------------------------
// Show list of all projects
router.get('/', function(req, res) {
    var passedStuff = req.params.description;
    knex('project')
    .select('*')
    .orderBy('proj_id','asc')
    .then(pResults =>{
        knex('users')
        .select('id')
        .then(uResults => {
            res.render('projects', {projects: pResults,id:req.user.id,managers:uResults})
        })
    })
});

// New project form
router.get('/new', function(req,res){
    res.render("newProject");
});

router.post('/', checkAuth, function(req,res){
    let data = {
        manager_id: req.user.id,
        name: req.body.name
    }
    // console.log(data);
    // console.log(req.body.name);

    knex('project')
    .insert(data)
    .then(result => {
        console.log(result);
        res.redirect('/projects')
    })
});

// allows reservation of items for a specific project
router.get('/:id/reserve',checkAuth,function(req,res){
    // knex.select('*').from('inventory')
    // .orderBy('inv_id','asc')
    // .where('remove','=','false')
    // .then(results => {
    //     res.render("reserve", {items: results,projectID: req.params.id});
    // })
    knex('project')
    .select('proj_id')
    .where('proj_id','=',req.params.id)
    .then(result => {
        if(result.length > 0){
            knex.select('*').from('inventory')
            .orderBy('inv_id','asc')
            .where('remove','=','false')
            .then(results => {
                res.render("reserve", {items: results,projectID: req.params.id});
            })
        } else {
            res.statusMessage = `Project ID: ${req.params.id} not found.`
            // res.status(404).end();
            res.send(404,`Project ID: ${req.params.id} not found.`)
        }
    })
    .catch(err =>{
        console.log('Error: ',err);
        res.redirect('/');
    })
});


module.exports = router;
