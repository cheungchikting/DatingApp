const express = require("express");
const path = require("path")
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
        router.get('/myprofile', isLoggedIn, this.myprofile.bind(this))
        router.get('/profilesetup', isLoggedIn, this.profileSetup.bind(this))
        router.post('/setup', isLoggedIn, this.setup.bind(this))
        router.post('/editprofile', isLoggedIn, this.editProfile.bind(this))
        //filter
        router.get('/filter', isLoggedIn, this.filter.bind(this))
        router.post('/editfilter', isLoggedIn, this.editFilter.bind(this))
        //browse
        router.get('/findmatches', isLoggedIn, this.findMatches.bind(this));
        router.get('/likeme', isPaid, this.likeMe.bind(this))
        router.post('/like/:id', isLoggedIn, this.like.bind(this))
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

        router.get('/match', isLoggedIn, this.myMatch.bind(this))
        router.get('/profiles', isLoggedIn, this.profiles.bind(this))
        router.get('/fotosetup', isLoggedIn, this.fotosetup.bind(this))
        router.get('/userchat', isLoggedIn, this.userchat.bind(this))
        return router;
    }

    start(req, res) {
        res.redirect("/login")
    }

    // profile

    async myprofile(req, res) {
        let data = await this.Method.GetProfile(user_id)
        let bday = data.birthday.toISOString().split('T')[0]
        data.birthday = bday
        switch (data.education) {
            case 1:
                data.educationName = "Secondary";
                break;
            case 2:
                data.educationName = "Associate";
                break;
            case 3:
                data.educationName = "Bachelor";
                break;
            case 4:
                data.educationName = "Master";
                break;
            case 5:
                data.educationName = "Doctor";
                break;
        }
        let object = {
            'data': data
        }
        console.log(object)
        res.render('myprofile', object)
    }

    profileSetup(req, res) {
        res.render('profilesetup')
    }

    async setup(req, res) {
        let profilepic = `${new Date().getTime().toString()}${req.files.upload.name}`
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
        await this.Method.addProfile(user_id, profilepic, gender, birthday, height, work, education, ethnicity, religion, hometown, location, aboutme)
        await this.Method.writefile(profilepic, profilepicData)
        res.redirect("/filter")
    }

    async editProfile(req, res) {
        let profilepic = `${new Date().getTime().toString()}${req.files.upload.name}`
        let profilepicData = req.files.upload.data
        let height = req.body.height
        let education = req.body.education
        let religion = req.body.religion
        let work = req.body.work
        let location = req.body.location
        let hometown = req.body.hometown
        let aboutme = req.body.aboutme
        await this.Method.editProfile(user_id, profilepic, height, education, religion, work, location, hometown, aboutme)
        await this.Method.writefile(profilepic, profilepicData)
        res.redirect("/myprofile")
    }

    // filter

    async filter(req, res) {
        let data = await this.Method.myFilter(user_id)
        let user = await this.Method.GetProfile(user_id)
        let object = {
            'data': data,
            'user': user
        }
        res.render('filter', object)
    }

    async editFilter(req, res) {
        let preferredGender = req.body.preferredGender
        let min_age = req.body.min_age
        let max_age = req.body.max_age
        let min_height = req.body.min_height
        let max_height = req.body.max_height
        let distance = req.body.distance
        let preferredEthnicity = req.body.preferredEthnicity
        let preferredEducation = req.body.preferredEducation
        await this.Method.editFilter(user_id, preferredGender, min_age, max_age, min_height, max_height, distance, preferredEthnicity, preferredEducation)
        let data = await this.Method.myFilter(user_id)
        let user = await this.Method.GetProfile(user_id)
        let object = {
            'data': data,
            'user': user
        }
        res.redirect('/findmatches')
    }

    // browse potential matches    

    async findMatches(req, res) {
        let data = await this.Method.grabRandomList(user_id)
        let user = await this.Method.GetProfile(user_id)
        if (data[0]) {
            let object = {
                'data': data,
                'user': user
            }
            res.render('findMatches', object)
        } else {
            res.render('noResult')
        }
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

    async like(req, res) {
        let like_id = req.params.id;
        let data = await this.Method.like(user_id, like_id)
        let object = {
            'user_id': user_id,
            'checkMatch': data
        }
        console.log(object)
        res.send(JSON.stringify(object))
    }

    async dislike(req, res) {
        let dislike_id = req.params.id;
        await this.Method.dislike(user_id, dislike_id)
        res.redirect('/findmatches')
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

    myMatch(req, res) {
        res.render('match')
    }

    profiles(req, res) {
        res.render('profiles')
    }

    fotosetup(req, res) {
        res.render('fotosetup')
    }

    userchat(req, res) {
        res.render('userchat')
    }

}

module.exports = Router;