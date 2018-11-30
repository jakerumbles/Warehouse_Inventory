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
const dotenv = require('dotenv').config();
const logger = require('./logging').logger;

const restrictedRoutes = [
    // INVENTORY ROUTES
    {route: '/inventory', access: 4, response: 'redirect'},
    //probably have to change where it POSTS
    {route: '/inventory/new', access: 3, response: 'redirect'},
    {route: '/inventory/all', access: 0, response: 'redirect'},

    //testing to see if only admiN
    {route: '/auth/user_accounts',access: 0, response: 'redirect'},

    // PROJECT ROUTES
    {route: '/projects', access: 3, response: 'redirect'},
    {route: '/projects/new', access: 2, response: 'redirect'},
    {route: '/projects/:id/reserve', access: 2, response: 'redirect'},

    // STATISTICS ROUTES
    {route: '/statistics', access: 4, response: 'redirect'},

    // API ROUTES
    {route: '/api/inventory/:id/history', access: 4, response: 'json'},
    {route: '/api/inventory/:id',access: 3, response: 'json'},
    {route: '/api/projects/:id/items',access: 2, response: 'json'},
    {route: '/api/projects/:id/',access: 2, response: 'json'},
    {route: '/api/projects/:id',access: 2, response: 'json'},
    {route: '/api/projects/:pid/reserve/:iid',access: 2, response: 'json'},



]

module.exports.checkAccess = (req,res,next) => {
    //might want to use lodash for this 'npm lodash'

    // const routeToCheck = req.route.path;
    const routeToCheck = req.route.path;

    routeAccessArray = restrictedRoutes.map(route => {
        return Object.values(route);
    })
    found = false;
    for(var i = 0; i < routeAccessArray.length;i++){
        // logger(routeAccessArray[i][0]);
        if(routeAccessArray[i][0] === routeToCheck){
            logger('Access required: ', routeAccessArray[i][1])
            if(routeAccessArray[i][1] >= req.user.access){
                found = true;
                next();
            } else {
                if(routeAccessArray[i][2] === 'json'){
                    res.status(403)
                    res.send({error: 'Unauthorized. Please contact an administrator.'})
                    return;
                }
                else{
                    req.session.message = 'Unauthorized. Please contact an administrator.';
                    res.redirect('/login');
                    return;
                }
            }
        }
    }
    // return;
    // if(!found){
    //     req.session.message = 'Unauthorised. Please refer to an administrator.';
    //     res.redirect('/login');
    //     return;
    // }

}

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

    logger("New Item")

    // this function updates the reserved amount for an
    // item/project combo that does not exist in db

    // this gets the available amount of quantity that can be reserved
    const available = await knex('inventory')
        .select('quantity')
        .where('inv_id','=',iid)
        .then(result =>{
            return Number(result[0].quantity)
    })

    // this is the total reserved by all projects if we were
    // to allow this reservation
    const reservedAfterUpdate = Number(reserveAmt);

    // if the total quantity is more than the total reserved were we to allow
    // this reservation, then the db is updated
    // console.log(reservedAfterUpdate);
    // logger('reservedAfterUpdate',reservedAfterUpdate);
    logger(available, reservedAfterUpdate, (available >= reservedAfterUpdate))
    if(available >= reservedAfterUpdate){
        const newReserved = reservedAfterUpdate;
        await knex('project_items')
            .where('proj_id','=',pid)
            .andWhere('inv_id','=',iid)
            .insert({proj_id: pid,
                    inv_id: iid,
                    reserved:newReserved})
        knex('inventory')
            .where('inv_id','=',iid)
            .update({available:(available - reservedAfterUpdate)})
            .returning('*')
            .then(result => {
                // console.log(result);
                logger(result);
            })
    // else we do not allow the db to be updated
    } else {
        // console.log('Cannot update');
        return false;
    }
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
            // console.log(result[0].reserved)
            logger(result[0].reserved);
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
    // console.log(reservedAfterUpdate);
    logger('reservedAfterUpdate',reservedAfterUpdate);
    if(available >= reservedAfterUpdate){
        const newReserved = Number(reserveAmt) + Number(reservedForThisProject)
        await knex('project_items')
            .where('proj_id','=',pid)
            .andWhere('inv_id','=',iid)
            .update({reserved:newReserved})
        knex('inventory')
            .where('inv_id','=',iid)
            .update({available:(available - reservedAfterUpdate)})
            .returning('*')
            .then(result => {
                // console.log(result);
                logger(result);
            })
    // else we do not allow the db to be updated
    } else {
        // console.log('Cannot update');
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
    if(process.env.NODE_ENV === 'development'){
        if(req.user){
            // console.log(`User: ${req.user.id} visited "${req.originalUrl}"`);
            logger(`User: ${req.user.id} visited "${req.originalUrl}"`);
        } else {
            // console.log(`Anon User visited "${req.originalUrl}"`);
            logger(`Anon User visited "${req.originalUrl}"`);
        }
    }
    // console.log(req);
    next();
}
