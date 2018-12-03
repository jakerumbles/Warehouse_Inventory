const faker = require('faker');
const knex = require('./dbconnection').knex;
const itemHistoryInsert = require('./dbconnection').itemHistoryInsert;

async function seedDB() {
    for (var i = 0; i < 1000; i++) {
        //Insert item into Database
        knex('inventory')
        .insert({description: faker.commerce.productName(),
                 category: faker.commerce.department(),
                 date_recieved: faker.date.past(),
                 storage_location: faker.random.number() % 2000,
                 quantity: faker.random.number()})
         .returning('*')
        .then(result => {
            itemHistoryInsert(result, "fred@fred.com", 'created item');
        })
        .catch(err => {
            console.log(err);
        });

        //console.log(item);
    }
}


module.exports = seedDB;
