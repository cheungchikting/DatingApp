const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

require("dotenv").config()

passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FacebookAppId,
  clientSecret: process.env.FacebookAppSecret,
  callbackURL: "http://localhost:8000/auth/facebook/callback",
  profileFields: ['email', 'displayName', 'name']

}, function (accessToken, refreshToken, profile, done) {
  knex('users').where('facebookid', profile.id).then((data) => {
    if (data == 0) {
      let user = {
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        facebookid: profile.id,
        accessToken: accessToken,
      }
      return knex('users').insert(user).returning('id').then((id)=>{
        user.id = id[0]
        done(null,user)
      })
    }
    done(null, data[0])
  })
}))

module.exports = passport