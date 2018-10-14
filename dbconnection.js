const {Pool, Client} = require('pg');
const pg = require('pg');

const pool = new Pool({
  user: 'hsyfhnwfejbulk',
  host: 'ec2-54-83-50-145.compute-1.amazonaws.com',
  database: 'd1mt5sv8e5tqvu',
  password: 'c2edbd81c31729e5257db5e44cbad188e9c6d520e579209d62b559f5e3747353',
  port: 5432,
  ssl: true
});

const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

connection.connect();

module.exports.connection = connection;
module.exports.pool = pool;
