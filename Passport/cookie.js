const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    knex.select("id").from("users").where("id", id)
        .then((data) => {
            if (data.length === 0) {
                return done(null, false)
            }
            return done(null, data[0])
        })
        .catch((err) => {
            return done(err, false);
        });
}

module.exports = {
    serializeUser: serializeUser,
    deserializeUser: deserializeUser,
  };