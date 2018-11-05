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

module.exports.itemHistoryInsert = function(item, username,histText){
    const data = {
        inv_id: item[0].inv_id,
        description: item[0].description,
        category: item[0].category,
        date_modified: 'NOW()',
        quantity: item[0].quantity,
        storage_location: item[0].storage_location,
        history: `${username.trim()} ${histText}.`
    }

    knex('inventory_history')
    .insert(data)
    .catch(err => console.log(err, 'Error inserting into history db.'))
}

connection.connect();



module.exports.connection = connection;
module.exports.knex = knex;
module.exports.pool = pool;
