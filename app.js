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
//socket
const http = require("http").Server(app);
const io = require("socket.io")(http)
require('./socket')(io)

const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const Method = require("./Method")
const Router = require("./Router")
const method = new Method(knex)
const router = new Router(method)
require('./randomlist')


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

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main'
}));
const hbs = hb.create({});
hbs.handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.set('view engine', 'handlebars');

app.post('/signup', signup.authenticate('local-signup', {
    successRedirect: '/profilesetup',
    failureRedirect: '/signupfail',
}));

app.post('/login', login.authenticate('local-login', {
    successRedirect: '/findmatches',
    failureRedirect: '/loginfail'
}));

app.get("/auth/facebook", passport.authenticate("facebook", {
    scope: "email"
}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
        failureRedirect: "/err"
    }),
    async function (req, res) {
        let data = await knex('usersProfile').where('user_id', req.user.id)
        let data1 = await knex('filter').where('user_id', req.user.id)
        if (data[0] && data1[0]) {
            res.redirect('/findmatches');
        } else {
            res.redirect('/profilesetup');
        }

    }
);

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/err'
    }),
    async function (req, res) {
        let data = await knex('usersProfile').where('user_id', req.user.id)
        if (data[0]) {
            res.redirect('/findmatches');
        } else {
            res.redirect('/profilesetup');
        }
    }
);

app.use("/", router.router())












http.listen(8000, () => {
    console.log("Application started at port:8000");
});