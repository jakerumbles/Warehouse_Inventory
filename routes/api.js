const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const checkAccess = require('../helpers').checkAccess;
const knex = require('../dbconnection').knex;
const reserveItem = require('../helpers').reserveItem;
const itemHistoryInsert = require('../dbconnection').itemHistoryInsert;
const logger = require('../logging').logger;

// Get item history
router.get('/api/inventory/:id/history', checkAuth, checkAccess,function(req, res) {
    var projID = req.params.id;
    knex.select('description', 'category', 'quantity', 'date_modified', 'storage_location', 'history')
    .from('inventory_history')
    .where('inv_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

// Get item info
router.get('/api/inventory/:id', checkAuth, function(req, res) {
    var projID = req.params.id;
    knex.select('*').from('inventory')
    .where('inv_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

// Update item info
router.put('/api/inventory/:id', checkAuth, checkAccess,function(req, res) {
    var itemID = req.params.id;
    // console.log(itemID);
    let itemData = {
        description: res.req.body.description,
        category: res.req.body.category,
        storage_location: res.req.body.storage,
        quantity: res.req.body.quantity,
        available: res.req.body.available,
        remove: res.req.body.remove
    }

    // console.log(projData);

    // if(itemData.available >= itemData.quantity){
    //
    // }

    knex('project_items')
    // .select('reserved')
    .sum('reserved')
    .where('inv_id','=',itemID)
    .then(result =>{
        let sum = parseInt(result[0].sum)
        let quantity = parseInt(itemData.quantity);
        logger(sum,quantity);
        if(result[0].sum){
            if(sum <= quantity){
                itemData.available = quantity - sum;
                knex('inventory')
                .where('inv_id','=',itemID)
                .update(itemData)
                .returning('*')
                .then(result => {
                    itemHistoryInsert(result, req.user.username,'modified item');
                    res.send({response: "Good"})
                })
            } else {
                res.status(500).send({error: 'Quantity is less than available.'})
            }
        } else {
            itemData.available = quantity;
            if(quantity >= 0){
                knex('inventory')
                .where('inv_id','=',itemID)
                .update(itemData)
                .returning('*')
                .then(result => {
                    itemHistoryInsert(result, req.user.username,'modified item');
                    res.send({response: "Good"})
                })
            } else {
                res.status(500).send({error: 'Quantity cannot be less than 0.'})
            }
        }

    })

});

// Shows inventory(reserved items) for specific project
router.get('/api/projects/:id/items', checkAuth, checkAccess, function(req, res) {
    var projID = req.params.id;
    knex('project_items')
    .join('inventory','project_items.inv_id','=','inventory.inv_id')
    .select('description', 'category', 'storage_location',
    'quantity', 'reserved', 'available')
    .where('project_items.proj_id','=',projID)
    .andWhere('inventory.remove','=','false')
    // .select('inventory.description','inventory.category','inventory.quantity',
    // 'inventory.quantity','project_items.reserved')
    .then(results => {
        res.send({results});
    })
});

// Get project information
router.get('/api/projects/:id/', checkAuth, checkAccess, function(req, res) {
    var projID = req.params.id;
    knex.select('*').from('project')
    .where('proj_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

// Add new project to database and redirect to list of all projects
router.put('/api/projects/:id',checkAuth,checkAccess,function(req,res){
    let projID = req.params.id;

    let projData = {
        manager_id: res.req.body.manager,
        name: res.req.body.name
    }

    knex('project')
    .where('proj_id','=',projID)
    .update(projData)
    .returning('*')
    .then(result => {
        // console.log(result);
        // res.redirect(303, '/inventory')
        res.send({response:'Good'})
    })
    .catch(err => {
        console.log(err, 'Error updating project.')
        res.status(500).send({error: 'Error updating project information.'})
    })
})

//Reserve specific item qty for a specific project
router.put('/api/projects/:pid/reserve/:iid',checkAuth,function(req,res){
    // console.log('ProjectID: ',req.params.pid);
    // console.log('ItemID: ',req.params.iid);
    // console.log('ReserveAmt: ',res.req.body.reserve);

    const reserveItemIfPossible = reserveItem(req.params.pid,
        req.params.iid,res.req.body.reserve)

    if(reserveItemIfPossible)
        res.send({response:'Good'})
    else
        res.status(500).send({error:'Something went wrong.'})

})

module.exports = router;
