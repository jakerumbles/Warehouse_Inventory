const express = require('express')
const router = express.Router();
const checkAuth = require('../helpers').checkAuth;
const knex = require('../dbconnection').knex;
const reserveItem = require('../helpers').reserveItem;

// testing really don't know if this will work.
router.get('/inventory/:id/history', checkAuth, function(req, res) {
    var projID = req.params.id;
    knex.select('*').from('inventory_history')
    .where('inv_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

router.get('/inventory/:id', checkAuth, function(req, res) {
    var projID = req.params.id;
    knex.select('*').from('inventory')
    .where('inv_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

router.put('/inventory/:id', checkAuth, function(req, res) {
    var itemID = req.params.id;
    // console.log(itemID);
    let itemData = {
        description: res.req.body.description,
        category: res.req.body.category,
        storage_location: res.req.body.storage,
        quantity: res.req.body.quantity,
        remove: res.req.body.remove
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

    // console.log(projData);

    knex('project_items')
    // .select('reserved')
    .sum('reserved')
    .where('inv_id','=',itemID)
    .then(result =>{
        // console.log(result);
        if(result[0].sum <= itemData.quantity){
            itemData.available = itemData.quantity - result[0].sum;
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

    })

});

// Shows inventory(reserved items) for specific project
router.get('/projects/:id/items', checkAuth, function(req, res) {
    var projID = req.params.id;
    knex('project_items')
    .join('inventory','project_items.inv_id','=','inventory.inv_id')
    .where('project_items.proj_id','=',projID)
    .andWhere('inventory.remove','=','false')
    // .select('inventory.description','inventory.category','inventory.quantity',
    // 'inventory.quantity','project_items.reserved')
    .then(results => {
        res.send({results});
    })
});

router.get('/projects/:id/', checkAuth, function(req, res) {
    var projID = req.params.id;
    knex.select('*').from('project')
    .where('proj_id','=',projID)
    .then(results => {
        res.send({results})
    })
    .catch(err => console.log(err))
});

// Add new project to database and redirect to list of all projects
router.put('/projects/:id',checkAuth,function(req,res){
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

router.put('/projects/:pid/reserve/:iid',checkAuth,function(req,res){
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
