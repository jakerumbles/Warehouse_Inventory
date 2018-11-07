const knex = require('./dbconnection').knex;

module.exports.reserveItem = async function(pid,iid,reserveAmt){
    const item = await knex('project_items')
    .select('*')
    .where('proj_id','=',pid)
    .andWhere('inv_id','=',iid);
    // console.log(item);

    if(item.length > 0)
        return oldItemReserve(pid,iid,reserveAmt);
    else
        return newItemReserve(pid,iid,reserveAmt);
}

async function newItemReserve(pid,iid,reserveAmt){
    console.log('new');
}

async function oldItemReserve(pid,iid,reserveAmt){
    // this function updates the reserved amount for an item existing in db

    const totalReserved = await knex('project_items')
        .sum('reserved')
        .where('inv_id','=',iid)
        .then(result => {
            // console.log(result[0].sum)
            return result[0].sum
    });

    const reservedForThisItem = await knex('project_items')
        .select('reserved')
        .where('inv_id','=',iid)
        .andWhere('proj_id','=',pid)
        .then(result => {
            console.log(result[0].reserved)
            return result[0].reserved;
    });

    const available = await knex('inventory')
        .select('quantity')
        .where('inv_id','=',iid)
        .then(result =>{
            return Number(result[0].quantity)
    })

    const reservedAfterUpdate = Number(reserveAmt) + Number(totalReserved);

    console.log(reservedAfterUpdate);
    if(available >= reservedAfterUpdate){
        console.log('Can update');
        const newReserved = Number(reserveAmt) + Number(reservedForThisItem)
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
    } else {
        console.log('Cannot update');
        return false;
    }


}
