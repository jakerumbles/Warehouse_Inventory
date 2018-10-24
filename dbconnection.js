const {Pool, Client} = require('pg');
const pg = require('pg');

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
    var itemq = 'SELECT last_value,log_cnt FROM inventory_inv_id_seq';
    var histq = 'INSERT INTO inventory_history(inv_id, description, category, date_modified, storage_location, history)' +
    'VALUES('

    connection.query(itemq, function(err, results) {
        if(results){
            var itemid;
            //console.log(results.rows[0].last_value, results.rows[0].log_cnt);

            if(results.rows[0].last_value == 1 && results.rows[0].log_cnt == 0){
                itemid = Number(results.rows[0].last_value);
            } else {
                itemid = Number(results.rows[0].last_value) + 1;
            }

            histq += itemid + ',';
            histq += '\'' + item.description + '\', ';
            histq += '\'' + item.category + '\', ';
            histq += 'NOW(), ';
            histq += item.storage_location + ', ';
            histq += '\'' + username.trim() + ' Created Item\'';
            histq += ');';
            connection.query(histq, function(err, results){
                if(err){
                    console.log(err);
                    next();
                } else {
                    console.log("inventory post route... now adding new item history to DB");
                }
            });
        } else {
            console.log(err);
            next();
        }
    });
}

connection.connect();

module.exports.connection = connection;
module.exports.pool = pool;
