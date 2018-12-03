const passport = require('passport');
const connection = require('./dbconnection').connection;

// these functions are required by passport-js to store session information
module.exports = () => {
  passport.serializeUser(function(user, done) {
    //console.log('Called SerializeUser function ', user)
  	done(null, user[0]);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('Called deserializeUser function ', id)
    var q = 'SELECT "id" FROM "users" WHERE "id"=$1';

    connection.query(q, [id.id], function(err, results) {
      //console.log(results);
      if(err) throw err;
    });
  	done(null, id);
  });
};
