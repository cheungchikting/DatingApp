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
let paymentIntent;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        user_id = req.user.id
        return next();
    }
    res.redirect("/login");
}

async function hasToken(req, res, next) {
    let data = await knex('token').where('token.user_id', user_id)
    console.log(data)
    if (data[0]) {
        if (data[0].likeme === true) {
            return next()
        }
    } else {
        res.redirect("/likemetoken");
    }
}

function ageCal(birthday) {
    var birth_date = new Date(birthday);
    var birth_date_day = birth_date.getDate();
    var birth_date_month = birth_date.getMonth();
    var birth_date_year = birth_date.getFullYear();
    var today_date = new Date();
    var today_day = today_date.getDate(); //if getDay is Monday to Sunday
    var today_month = today_date.getMonth();
    var today_year = today_date.getFullYear();
    var calculated_age;
    if (today_month > birth_date_month) {
        calculated_age = today_year - birth_date_year;
    } else if (today_month == birth_date_month) {
        if (today_day >= birth_date_day) {
            calculated_age = today_year - birth_date_year;
        } else {
            calculated_age = today_year - birth_date_year - 1;
        }
    } else {
        calculated_age = today_year - birth_date_year - 1;
    }
    return calculated_age;
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
        router.get('/photosetup', isLoggedIn, this.photosetup.bind(this))
        router.post('/photoupload', isLoggedIn, this.photoupload.bind(this))
        router.get('/check/:id', isLoggedIn, this.checklike.bind(this))
        router.get('/iflike/:id', isLoggedIn, this.iflike.bind(this))
        //filter
        router.get('/filter', isLoggedIn, this.filter.bind(this))
        router.post('/editfilter', isLoggedIn, this.editFilter.bind(this))
        //browse
        router.get('/findmatches', isLoggedIn, this.findMatches.bind(this));
        router.get('/likeme', isLoggedIn, hasToken, this.likeMe.bind(this))
        router.get('/likemetoken', isLoggedIn, this.likeMeToken.bind(this))
        router.post('/like/:id', isLoggedIn, this.like.bind(this))
        router.post('/dislike/:id', isLoggedIn, this.dislike.bind(this))
        router.get('/profiles/:id', isLoggedIn, this.profiles.bind(this))
        //chatlist
        router.get('/chatroom', isLoggedIn, this.chatroom.bind(this))
        router.get('/unlike/:id/:roomid', isLoggedIn, this.unlike.bind(this))
        router.get('/chatroom/:id', isLoggedIn, this.chat.bind(this));
        //Coins
        router.get('/wallet', isLoggedIn, this.wallet.bind(this))
        router.post('/create-checkout-session/:amount', isLoggedIn, this.checkoutsession.bind(this))
        router.get('/success/:amount', isLoggedIn, this.checkstatus.bind(this))
        router.get('/cancel', isLoggedIn, this.cancel.bind(this))
        router.get('/viewmore/:amount', isLoggedIn, this.viewMore.bind(this))
        router.get('/gettoken/:amount', isLoggedIn, this.getToken.bind(this))
        // login/Reg
        router.get('/login', this.login.bind(this));
        router.get("/loginfail", this.loginfail.bind(this));
        router.get('/signup', this.signup.bind(this))
        router.get("/signupfail", this.signupfail.bind(this));
        router.get('/logout', this.logout.bind(this));

        return router;
    }

    start(req, res) {
        res.redirect("/login")
    }

    // profile

    profileSetup(req, res) {
        res.render('profilesetup')
    }

    async myprofile(req, res) {
        let data = await this.Method.GetProfile(user_id)
        let photos = await this.Method.GetPhotos(user_id)
        let coins = await this.Method.GetCoins(user_id)
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
            'data': data,
            'photos': photos,
            'coins': coins
        }
        res.render('myprofile', object)
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
        res.redirect("/photosetup")
    }

    async editProfile(req, res) {
        let profilepic
        let profilepicData
        let height = req.body.height
        let education = req.body.education
        let religion = req.body.religion
        let work = req.body.work
        let location = req.body.location
        let hometown = req.body.hometown
        let aboutme = req.body.aboutme
        if (req.files) {
            profilepic = `${new Date().getTime().toString()}${req.files.upload.name}`
            profilepicData = req.files.upload.data
            await this.Method.writefile(profilepic, profilepicData)
        } else {
            let data = await this.Method.GetProfile(user_id)
            profilepic = data.profilepic
        }
        await this.Method.editProfile(user_id, profilepic, height, education, religion, work, location, hometown, aboutme)

        res.redirect("/myprofile")
    }

    async photosetup(req, res) {
        let data = await this.Method.GetPhotos(user_id)
        let object
        if (data) {
            object = {
                data: data,
            }
        }
        res.render('fotosetup', object)
    }

    async photoupload(req, res) {
        let foto1
        let foto2
        let foto3
        let foto4
        let foto5
        let foto6
        let fotodata1
        let fotodata2
        let fotodata3
        let fotodata4
        let fotodata5
        let fotodata6
        if (req.files) {
            if (req.files.upload1) {
                foto1 = `${new Date().getTime().toString()}${req.files.upload1.name}`
                fotodata1 = req.files.upload1.data
                await this.Method.writefile(foto1, fotodata1)
            } else {
                let data = await this.Method.GetPhotos(user_id)
            
                    foto1 = data.pc1
            
            }
            if (req.files.upload2) {
                foto2 = `${new Date().getTime().toString()}${req.files.upload2.name}`
                fotodata2 = req.files.upload2.data
                await this.Method.writefile(foto2, fotodata2)
            } else {
                let data = await this.Method.GetPhotos(user_id)
      
                    foto2 = data.pc2
            
            }
            if (req.files.upload3) {
                foto3 = `${new Date().getTime().toString()}${req.files.upload3.name}`
                fotodata3 = req.files.upload3.data
                await this.Method.writefile(foto3, fotodata3)
            } else {
                let data = await this.Method.GetPhotos(user_id)
      
                    foto3 = data.pc3
              
            }
            if (req.files.upload4) {
                foto4 = `${new Date().getTime().toString()}${req.files.upload4.name}`
                fotodata4 = req.files.upload4.data
                await this.Method.writefile(foto4, fotodata4)
            } else {
                let data = await this.Method.GetPhotos(user_id)
        
                    foto4 = data.pc4
             
            }
            if (req.files.upload5) {
                foto5 = `${new Date().getTime().toString()}${req.files.upload5.name}`
                fotodata5 = req.files.upload5.data
                await this.Method.writefile(foto5, fotodata5)
            } else {
                let data = await this.Method.GetPhotos(user_id)
       
                    foto5 = data.pc5
          
            }
            if (req.files.upload6) {
                foto6 = `${new Date().getTime().toString()}${req.files.upload6.name}`
                fotodata6 = req.files.upload6.data
                await this.Method.writefile(foto6, fotodata6)
            } else {
                let data = await this.Method.GetPhotos(user_id)
          
                    foto6 = data.pc6
          
            }

        } else {
            foto1 = null
            foto2 = null
            foto3 = null
            foto4 = null
            foto5 = null
            foto6 = null
        }

        await this.Method.photoUpload(user_id, foto1, foto2, foto3, foto4, foto5, foto6)
        res.redirect("/filter")
    }

    async checklike(req, res) {
        let data = await this.Method.checklike(user_id, req.params.id)
        res.send(data)
    }

    async iflike(req, res) {
        let data = await this.Method.iflike(user_id, req.params.id)
        res.send(data)
    }

    // filter

    async filter(req, res) {
        let data = await this.Method.myFilter(user_id)
        let user = await this.Method.GetProfile(user_id)
        let coins = await this.Method.GetCoins(user_id)
        switch (data.preferredEducation) {
            case 1:
                data.preferredEducationName = "Secondary";
                break;
            case 2:
                data.preferredEducationName = "Associate";
                break;
            case 3:
                data.preferredEducationName = "Bachelor";
                break;
            case 4:
                data.preferredEducationName = "Master";
                break;
            case 5:
                data.preferredEducationName = "Doctor";
                break;
        }
        let object = {
            'data': data,
            'user': user,
            'coins': coins
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
        res.redirect('/findmatches')
    }

    // browse potential matches    

    async findMatches(req, res) {
        let data = await this.Method.grabRandomList(user_id)
        let user = await this.Method.GetProfile(user_id)
        let coins = await this.Method.GetCoins(user_id)
        if (data[0]) {
            for (let each of data) {
                let photos = await this.Method.GetPhotos(each.id)
                let age = ageCal(each.birthday)
                each.age = age
                each.photos = photos
            }

            let object = {
                'data': data,
                'user': user,
                'coins': coins
            }
            res.render('findMatches', object)
        } else {
            let object = {
                'user': user,

                'coins': coins
            }
            res.render('noResult', object)
        }
    }

    async profiles(req, res) {
        let id = req.params.id
        let data = await this.Method.GetProfile(id)
        let user = await this.Method.GetProfile(user_id)
        let photos = await this.Method.GetPhotos(id)
        let coins = await this.Method.GetCoins(user_id)
        let age = ageCal(data.birthday)
        data.age = age

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
            'data': data,
            'photos': photos,
            'user': user,
            'coins': coins

        }
        res.render('profiles', object)
    }

    async viewMore(req, res) {
        let amount = req.params.amount
        let data = await this.Method.viewMore(user_id, amount)
        if (data) {
            await this.Method.refresh(user_id)
            res.redirect('/findmatches')

        } else {
            res.redirect('/wallet')
        }
    }

    async likeMe(req, res) {
        let data = await this.Method.likeMe(user_id)
        let user = await this.Method.GetProfile(user_id)
        let coins = await this.Method.GetCoins(user_id)
        if (data[0]) {
            for (let each of data) {
                let photos = await this.Method.GetPhotos(each.id)
                let age = ageCal(each.birthday)
                each.age = age
                each.photos = photos
            }

            let object = {
                'data': data,
                'user': user,
                'coins': coins
            }
            res.render('likeme', object)
        } else {
            let object = {
                'user': user,
                'coins': coins
            }
            res.render('noResult', object)
        }
    }

    async likeMeToken(req, res) {
        let user = await this.Method.GetProfile(user_id)
        let coins = await this.Method.GetCoins(user_id)
        let object = {
            'user': user,
            'coins': coins
        }
        res.render('likeMeToken', object)
    }

    async getToken(req, res) {
        let amount = req.params.amount
        let result = await this.Method.getToken(user_id, amount)
        if (result) {
            res.redirect('/likeme')
        } else {
            res.redirect('/wallet')
        }
    }

    async like(req, res) {
        let like_id = parseInt(req.params.id)
        await this.Method.like(user_id, like_id)
        res.end()
    }

    async dislike(req, res) {
        let dislike_id = parseInt(req.params.id)
        await this.Method.dislike(user_id, dislike_id)
        res.end()
    }

    unDislike(req, res) {
        this.Method.unDislike(user_id).then(() => {
            res.end()
        })
    }

    // chatlist

    async chatroom(req, res) {
        let data = await this.Method.createRoom(user_id)
        let user = await this.Method.GetProfile(user_id)
        let coins = await this.Method.GetCoins(user_id)
        let promiseArray = []
        for (let i = 0; i < data.length; i++) {
            promiseArray[i] = new Promise((resolve, reject) => {
                client.lrange(data[i].chatroom, -1, -1, (err, msg) => {
                    if (msg[0]) {
                        data[i].lastmessage = JSON.parse(msg[0])
                        resolve()
                    } else {
                        data[i].lastmessage = null
                        resolve()
                    }
                })
            })
        }
        Promise.all(promiseArray).then(() => {
            let object = {
                'data': data,
                'user': user,
                'coins': coins
            }
            res.render('chatlist', object)
        })
    }

    async chat(req, res) {
        let user = await this.Method.GetProfile(user_id)
        let list = await this.Method.createRoom(user_id)
        let data = await this.Method.GetChatInfo(req.params.id, user_id)
        let promiseArray = []
        for (let i = 0; i < list.length; i++) {
            promiseArray[i] = new Promise((resolve, reject) => {
                client.lrange(list[i].chatroom, -1, -1, (err, msg) => {
                    if (msg[0]) {
                        list[i].lastmessage = JSON.parse(msg[0])
                        resolve()
                    } else {
                        list[i].lastmessage = null
                        resolve()
                    }
                })
            })
        }

        Promise.all(promiseArray).then(() => {
            client.lrange(req.params.id, 0, -1, (err, msg) => {
                let parseMsg = msg.map(x => x = JSON.parse(x))
                let object = {
                    'list': list,
                    'roomid': req.params.id,
                    'data': data,
                    'msg': parseMsg,
                    'user': user
                }

                res.render('chatroom', object)
            })
        })

    }

    async unlike(req, res) {
        let unlike_id = req.params.id;
        let roomid = req.params.roomid;
        await this.Method.unlike(user_id, unlike_id, roomid)
        res.redirect("/chatroom")
    
    }

    //Coin

    async wallet(req, res) {
        let coin = await this.Method.GetCoins(user_id)
        let user = await this.Method.GetProfile(user_id)
        let object = {
            'user': user,
            'coin': coin,
        }
        res.render('wallet', object)
    }

    async checkoutsession(req, res) {
        const session = await paymentsession[req.params.amount]
        paymentIntent = session.payment_intent
        res.json(session);

    }

    async checkstatus(req, res) {
        let amount = req.params.amount
        let result = await paymentsession.checkstatus(paymentIntent)
        if (result.status === 'succeeded') {
            await this.Method.AddCoins(user_id, parseInt(amount))
            res.render('success')
        }
    }

    cancel(req, res) {
        res.render('cancel')
    }

    // login & Reg

    login(req, res) {
        res.render("login");
    }

    loginfail(req, res) {
        res.render("loginfail");
    }

    signup(req, res) {
        res.render("signup");
    }

    signupfail(req, res) {
        res.render("signupfail");
    }

    logout(req, res) {
        req.logout();
        res.redirect("/login")
    }

}

module.exports = Router;