/*
    NOTES:
    I'd like to have an object which will hold routes, and the level of access
    for each route. The checkAuth function will check the route, and check the
    routes object and check to see which level of access is required. If they
    are good, send them on their way.

    0: Admin - everything, add/delete users,delete items
    1: Manager - update all project,remove item
    2: Project Manager - can create project, update/reassign their project
    3: Power User? - can add items, update qty, change item info
    4: Basic User - can only view

*/

const knex = require('./dbconnection').knex;

module.exports.reserveItem = async function(pid,iid,reserveAmt){
    const item = await knex('project_items')
    .select('*')
    .where('proj_id','=',pid)
    .andWhere('inv_id','=',iid);
    // console.log(item);

    if(item.length > 0)
        //this item and project combo exists
        return oldItemReserve(pid,iid,reserveAmt);
    else
        //item project combo doesn't exist
        return newItemReserve(pid,iid,reserveAmt);
}

async function newItemReserve(pid,iid,reserveAmt){
    console.log('new');
    //
}

async function oldItemReserve(pid,iid,reserveAmt){
    // this function updates the reserved amount for an
    // item/project combo existing in db

    // this gets the total amount of this item reserved by all projects
    const totalReserved = await knex('project_items')
        .sum('reserved')
        .where('inv_id','=',iid)
        .then(result => {
            // console.log(result[0].sum)
            return result[0].sum
    });

    // this gets the total amount of this item reserved by this project
    const reservedForThisProject = await knex('project_items')
        .select('reserved')
        .where('inv_id','=',iid)
        .andWhere('proj_id','=',pid)
        .then(result => {
            console.log(result[0].reserved)
            return result[0].reserved;
    });

    // this gets the available amount of quantity that can be reserved
    const available = await knex('inventory')
        .select('quantity')
        .where('inv_id','=',iid)
        .then(result =>{
            return Number(result[0].quantity)
    })

    // this is the total reserved by all projects if we were
    // to allow this reservation
    const reservedAfterUpdate = Number(reserveAmt) + Number(totalReserved);

    // if the total quantity is more than the total reserved if we allow
    // this reservation, then the db is updated
    console.log(reservedAfterUpdate);
    if(available >= reservedAfterUpdate){
        console.log('Can update');
        const newReserved = Number(reserveAmt) + Number(reservedForThisProject)
        await knex('project_items')
            .where('proj_id','=',pid)
            .andWhere('inv_id','=',iid)
            .update({reserved:newReserved})
            .then(result =>{
                return true
            })
        knex('inventory')
            .where('inv_id','=',iid)
            .update({available:(available - reservedAfterUpdate)})
            .returning('*')
            .then(result => {
                console.log(result);
            })
    // else we do not allow the db to be updated
    } else {
        console.log('Cannot update');
        return false;
    }
}

module.exports.checkAuth = function(req, res, next){
    // TODO: SEE NOTES
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/login');
    }
}
module.exports.logger = function(req,res,next){
    console.log(`User: ${req.user.id} visited "${req.originalUrl}"`);
    // console.log(req);
    next();
}
