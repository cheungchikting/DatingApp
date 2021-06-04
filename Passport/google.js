const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

require("dotenv").config()

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CONSUMER_KEY,
  clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
  callbackURL: "http://localhost:8000/auth/google/callback",
  profileFields: ['email']

}, function (accessToken, refreshToken, profile, done) {
  knex('users').where('googleid', profile.id).then((data) => {
    if (data == 0) {
      let user = {
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        googleid: profile.id,
        accessToken: accessToken,
      }
      return knex('users').insert(user).returning('id').then((id)=>{
        user.id = id[0]
        return done(null,user)
      })
    }
    return done(null, data[0])
  })
}))


module.exports = passport