const {Pool, Client} = require('pg');
const pg = require('pg');
const dotenv = require('dotenv').config()

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

module.exports.insertQuery = function(item,user) {
    present = (item.present === 'on') ? 'yes' : 'no';
    reserved = (item.reserved === 'on') ? 'yes' : 'no';

    let data = {
        description: item.description,
        category: item.category,
        date_recieved: 'NOW()',
        storage_location: item.storage_location,
        present: present,
        reserved: reserved
    }

    knex('inventory')
    .insert(data)
    .returning('*')
    .then(result => {
        // console.log(result);
        module.exports.itemHistoryInsert(result, user,'created item')
    })
    .catch(err => console.log(err, 'Error in item creation'))
}


connection.connect();

module.exports.connection = connection;
module.exports.knex = knex;
module.exports.pool = pool;
