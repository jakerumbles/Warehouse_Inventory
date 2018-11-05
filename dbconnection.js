const {Pool, Client} = require('pg');
const pg = require('pg');

// SQL Query builder library for ease of searching
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PW,
    database : process.env.DB_DATABASE
  }
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PW,
    port: 5432,
    ssl: true
});

const connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

module.exports.itemHistoryInsert = function(item, username){
    knex.select('last_value','log_cnt').from('inventory_inv_id_seq')
    .then(results => {
        let itemid = -1;
        if(results[0].last_value === '1' && results[0].log_cnt === '0'){
            itemid = Number(results[0].last_value);
        } else {
            itemid = Number(results[0].last_value) + 1;
        }
        const data = {
            inv_id: itemid,
            description: item.description,
            category: item.category,
            date_modified: 'NOW()',
            storage_location: item.storage_location,
            history: `${username.trim()} created item.`
        }
        knex('inventory_history')
        .insert(data)
        .catch(err => console.log(err, 'Error inserting into history db.'))
    })
    .catch(err => console.log(err, 'Error receiving most recent item id.'))
}

connection.connect();



module.exports.connection = connection;
module.exports.knex = knex;
module.exports.pool = pool;
