const express = require("express");
const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const paymentsession = require('./stripe')
const redis = require("redis");
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

let user_id;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        user_id = req.user.id
        return next();
    }
    res.redirect("/login");
}

function isPaid(req, res, next) {
    return knex('points')
        .where('points.user_id', user_id).then((data) => {
            if (req.isAuthenticated() === true && data[0].likeMePage === true) {
                return next()
            }
            res.redirect("/browse");
        })
}

class Router {
    constructor(Method) {
        this.Method = Method;
    }

    router() {
        let router = express.Router();
        router.get("/", this.start.bind(this))
        //profile

        router.get('/profile', isLoggedIn, this.profile.bind(this))
        router.get('/profilesetup', isLoggedIn, this.profileSetup.bind(this))
        router.post('/setup', isLoggedIn, this.setup.bind(this))
        router.put('/edit', isLoggedIn, this.editProfile.bind(this))
        //filter
        router.get('/filter', isLoggedIn, this.filter.bind(this))
        router.post('/editfilter', isLoggedIn, this.editFilter.bind(this))
        //browse
        router.get('/browse', isLoggedIn, this.browse.bind(this));
        router.get('/likeme', isPaid, this.likeMe.bind(this))
        router.get('/like/:id', isLoggedIn, this.like.bind(this))
        router.post('/dislike/:id', isLoggedIn, this.dislike.bind(this))
        //chatlist
        router.get('/chatlist', this.chatlist.bind(this))
        router.post('/unlike/:id', isLoggedIn, this.unlike.bind(this))
        router.get('/chatroom/:id', this.chatroom.bind(this));
        //stripe
        router.post('/create-checkout-session', isLoggedIn, this.checkoutsession.bind(this))
        router.get('/success', isLoggedIn, this.success.bind(this))
        router.get('/cancel', isLoggedIn, this.cancel.bind(this))
        router.post('/addpoints', isLoggedIn, this.addpoints.bind(this))
        // login/Reg
        router.get('/login', this.login.bind(this));
        router.get('/signup', this.signup.bind(this))
        router.get('/done', this.done.bind(this))
        router.get("/err", this.err.bind(this));
        router.get('/logout', this.logout.bind(this));

        //caspar added
        router.get('/myprofile', isLoggedIn, this.myprofile.bind(this))
        router.get('/match', isLoggedIn, this.myMatch.bind(this))
        router.get('/profiles', isLoggedIn, this.profiles.bind(this))

        return router;
    }

    start(req, res) {
        res.redirect("/login")
    }

    // profile

    profile(req, res) {
        let object
        this.Method.MyProfile(user_id).then((data) => {
            object = {
                'data': data
            }
            res.render('profile', object)
        })
    }

    profileSetup(req, res) {
        res.render('profilesetup')
    }

    setup(req, res) {
        console.log(req.files)
        let profilepic = new Date().getTime().toString()
        let profilepicData = req.files.upload.data
        let gender = req.body.gender
        let birthday = req.body.birthday
        let height = req.body.height
        let work = req.body.work
        let education = req.body.education
        let ethnicity = req.body.ethnicity
        let religion = req.body.religion
        let hometown = req.body.hometown
        let location = req.body.location
        let aboutme = req.body.aboutme
        this.Method.addProfile(user_id, profilepic, gender, birthday, height, work, education, ethnicity, religion, hometown, location, aboutme).then(() => {
            this.Method.writefile(profilepic, profilepicData).then(() => {
                res.redirect("/filter")
            })
        })
    }

    editProfile(req, res) {
        let profilepic = new Date().getTime().toString()
        let profilepicData = req.files.upload.data
        let height = req.body.height
        let work = req.body.work
        let education = req.body.education
        let religion = req.body.religion
        let location = req.body.location //need to get coordinates
        let aboutme = req.body.aboutme
        this.Method.editProfile(user_id, profilepic, height, work, education, religion, location, aboutme).then(() => {
            this.Method.writefile(profilepic, profilepicData).then(() => {
                res.redirect("/profile")
            })
        })
    }

    // filter

    filter(req, res) {
        let object
        this.Method.myFilter(user_id).then((data) => {
            object = {
                'data': data
            }
            res.render('filter', object)
        })
    }

    editFilter(req, res) {
        let preferredGender = req.body.preferredGender
        let min_age = req.body.min_age
        let max_age = req.body.max_age
        let min_height = req.body.min_height
        let max_height = req.body.max_height
        let distance = req.body.distance
        let preferredEthnicity = req.body.preferredEthnicity
        let preferredEducation = req.body.preferredEducation
        this.Method.editFilter(user_id, preferredGender, min_age, max_age, min_height, max_height, distance, preferredEthnicity, preferredEducation).then(() => {
            let object
            this.Method.myFilter(user_id).then((data) => {
                object = {
                    'data': data
                }
                res.render('filter', object)
            })
        })
    }

    // browse potential matches    

    browse(req, res) {
        this.Method.grabRandomList(user_id).then((data) => {
            if (data) {
                if (data[0]) {
                    res.render('browse')
                } else {
                    res.render('noResult')
                }
            } else {
                res.render('noResult')
            }
        })
    }

    likeMe(req, res) {
        let object
        this.Method.likeMe(user_id).then((data) => {
            object = {
                'data': data
            }
            res.render('likeMe', object)
        })
    }

    like(req, res) {
        let object
        let like_id = req.params.id;
        this.Method.like(user_id, like_id).then((data) => {
            object = {
                'user_id': user_id,
                'checkMatch': data
            }
            res.send(object)
        })
    }

    dislike(req, res) {
        let dislike_id = req.params.id;
        this.Method.dislike(user_id, dislike_id).then(() => {
            res.end()
        })
    }

    unDislike(req, res) {
        this.Method.unDislike(user_id).then(() => {
            res.end()
        })
    }

    // chatlist

    chatlist(req, res) {
        this.Method.ChatList(user_id).then((data) => {
            let object = {
                'data': data
            }
            console.log(object)
            res.render('chatlist', object)
        })
    }

    chatroom(req, res) {
        this.Method.GetChatInfo(req.params.id, user_id).then((data) => {
            client.lrange(req.params.id, 0, -1, (err, msg) => {
                let parseMsg = msg.map(x => x = JSON.parse(x))
                let object = {
                    'roomid': req.params.id,
                    'data': data,
                    'msg': parseMsg
                }
                console.log(object)
                res.render('chatroom', object)
            })
        })


    }

    unlike(req, res) {
        let unlike_id = req.params.id;
        this.Method.unlike(user_id, unlike_id).then(() => {
            res.redirect("/chat")
        })
    }

    //stripe

    async checkoutsession(req, res) {
        const session = await paymentsession
        res.json({
            id: session
        });
    }

    success(req, res) {
        res.render('success')
    }

    cancel(req, res) {
        res.render('cancel')
    }

    addpoints(req, res) {
        let addPoints = req.body.points
        this.Method.AddPoint(user_id, addPoints).then(() => {
            res.redirect('/profile')
        })
    }

    viewLikeMeToken(req, res) {
        let usePoints = req.body.points
        this.Method.usePoint(user_id, usePoints).then(() => {
            this.Method.viewLikeMeToken(user_id).then(() => {
                res.redirect('/profile')
            })
        })
    }

    // login & Reg

    login(req, res) {
        res.render("login");
    }

    signup(req, res) {
        res.render("signup");
    }

    done(req, res) {
        res.render("done");
    }


    err(req, res) {
        res.render("err");
    }

    logout(req, res) {
        req.logout();
        res.redirect("/login")
    }

    //caspar added
    myprofile(req, res) {
        res.render('myprofile')
    }

    myMatch(req, res) {
        res.render('match')
    }

    profiles(req, res) {
        res.render('profiles')
    }

}

module.exports = Router;