const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const checkAccess = require('../helpers').checkAccess;
const knex = require('../dbconnection').knex;
const logger = require('../logging').logger

// -----------------------------
// PROJECT Routes
// -----------------------------

// Show list of all projects
router.get('/projects', checkAuth,checkAccess,function(req, res) {
    var passedStuff = req.params.description;

    //If user is not an admin type, only show them projects they own
    if (req.user.access >= 2) {
        knex('project')
        .join('users','users.id','=','project.manager_id')
        .select('project.proj_id','users.id','project.name','users.email', 'project.manager_id')
        .where('users.id', '=', req.user.id)
        .orderBy('proj_id','asc')
        .then(pResults =>{
            knex('users')
            .select('email','id')
            .where('access', '<=', 2)
            .then(uResults => {
                res.render('projects', {
                    projects: pResults,
                    id:req.user.id,
                    access:req.user.access,
                    managers:uResults
                })
            })
        })
    } else {
        //If user is manager(1) or admin(0) type, show all projects
        knex('admin')
        .select('*')
        .then(pResults =>{
            knex('users')
            .select('email','id')
            .where('access', '<=', 2)
            .then(uResults => {
                res.render('projects', {
                    projects: pResults,
                    id:req.user.id,
                    access:req.user.access,
                    managers:uResults
                })
            })
        })
    }
});

// New project form
router.get('/projects/new', checkAuth,checkAccess,function(req,res){
    res.render("newProject");
});

// post new projects
router.post('/projects', checkAuth,checkAccess, function(req,res){
    let data = {
        manager_id: req.user.id,
        name: req.body.name
    }

    knex('project')
    .insert(data)
    .then(result => {
        logger(result);
        res.redirect('/projects')
    })
});

// page that allows reservation of items for a specific project
router.get('/projects/:id/reserve',checkAuth,checkAccess,function(req,res){
    knex('project')
    .select('proj_id')
    .where('proj_id','=',req.params.id)
    .then(result => {
        if(result.length > 0){
            knex.select('*')
            .from('inventory')
            .orderBy('inv_id','asc')
            .where('remove','=','false')
            .then(results => {
                res.render("reserve", {items: results, projectID: req.params.id});
            })
        } else {
            res.statusMessage = `Project ID: ${req.params.id} not found.`
            res.send(404,`Project ID: ${req.params.id} not found.`)
        }
    })
    .catch(err =>{
        logger('Error: ',err);
        res.redirect('/');
    })
});


module.exports = router;
