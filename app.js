const express = require("express")
const expressFileUpload = require("express-fileupload")
const session = require("express-session");
const methodOverride = require('method-override')

const app = express();
app.use(expressFileUpload())
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride('_method'))
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const Method = require("./Method")
const Router = require("./Router")
const method = new Method(knex)
const router = new Router(method)
const job = require('./randomlist')


const serializeUser = require("./Passport/cookie").serializeUser;
const deserializeUser = require("./Passport/cookie").deserializeUser;
const passport = require('passport');

const signup = require("./Passport/signup")
const login = require("./Passport/login")
const facebook = require('./Passport/facebook');
const google = require('./Passport/google');
app.use(signup.initialize());
app.use(signup.session());
app.use(login.initialize());
app.use(login.session());
app.use(facebook.initialize());
app.use(facebook.session());
app.use(google.initialize());
app.use(google.session());

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.post('/signup', signup.authenticate('local-signup', {
    successRedirect: '/profilesetup',
    failureRedirect: '/err',
}));

app.post('/login', login.authenticate('local-login', {
    successRedirect: '/done',
    failureRedirect: '/err'
}));

app.get("/auth/facebook", passport.authenticate("facebook", {
    scope: "email"
}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/done",
    failureRedirect: "/err"
}));

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/err'
    }),
    function (req, res) {
        res.redirect('/done');
    });


app.use("/", router.router())

app.listen(8000, () => {
    console.log("Application started at port:8000");
});