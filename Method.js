const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const geolib = require('geolib')
const fs = require("fs")
const path = require("path")
const uploadDir = path.join(__dirname, "public", "upload")

class Method {
    constructor(knex) {
        this.knex = knex;
    }

    // Profile

    MyProfile(user_id) {
        return knex.select('*')
            .from('usersProfile')
            .innerJoin('users', 'users.id', 'usersProfile.user_id')
            .innerJoin('photos', 'users.id', 'photos.user_id')
            .innerJoin('points', 'users.id', 'points.user_id')
            .innerJoin('inventory', 'users.id', 'inventory.user_id')
            .where('usersProfile.user_id', user_id)
            .then((data) => {
                return data
            })
    }

    addProfile(user_id, profilepic, gender, birthday, height, work, education, ethnicity, religion, hometown, location, aboutme) {
        return knex('usersProfile').where('usersProfile.user_id', user_id).then((data) => {
            if (!data[0]) {
                return knex.insert({
                        user_id: user_id,
                        profilepic: profilepic,
                        gender: gender,
                        birthday: birthday,
                        height: height,
                        work: work,
                        education: education,
                        ethnicity: ethnicity,
                        religion: religion,
                        hometown: hometown,
                        location: location,
                        aboutme: aboutme
                    })
                    .into('usersProfile')
            }
        })
    }

    editProfile(user_id, profilepic, height, work, education, religion, location, aboutme) {
        return knex('usersProfile')
            .update({
                profilepic: profilepic,
                height: height,
                work: work,
                education: education,
                religion: religion,
                location: location,
                aboutme: aboutme
            })
            .where('usersProfile.user_id', user_id)
    }

    writefile(name, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(uploadDir, name), data, (err) => {
                if (err) {
                    console.log("Error", err)
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }


    // Filter

    myFilter(user_id) {
        return knex('filter')
            .where('filter.user_id', user_id)
    }

    editFilter(user_id, preferredGender, min_age, max_age, min_height, max_height, distance, preferredEthnicity, preferredEducation) {
        return knex('filter')
            .where('filter.user_id', user_id).then((data) => {
                if (data[0]) {
                    return knex('filter')
                        .update({
                            preferredGender: preferredGender,
                            min_age: min_age,
                            max_age: max_age,
                            min_height: min_height,
                            max_height: max_height,
                            distance: distance,
                            preferredEthnicity: preferredEthnicity,
                            preferredEducation: preferredEducation
                        })
                        .where('filter.user_id', user_id)
                } else {
                    return knex.insert({
                            user_id: user_id,
                            preferredGender: preferredGender,
                            min_age: min_age,
                            max_age: max_age,
                            min_height: min_height,
                            max_height: max_height,
                            distance: distance,
                            preferredEthnicity: preferredEthnicity,
                            preferredEducation: preferredEducation
                        })
                        .into('filter')
                }
            })
    }

    //browse

    grabRandomList(user_id) {
        return knex('matches').where('matches.user_id', user_id)
            .then((data) => {
                if (data[0]) {
                    if (data[0].randomlist) {
                        if (data[0].randomlist[0]) {
                            return data[0].randomlist
                        } //else stays at empty []

                    } else {
                        this.random(user_id).then((data3) => {
                            return knex('matches').update({
                                randomlist: JSON.stringify(data3)
                            }).where('matches.user_id', user_id)
                        })
                    }
                } else {
                    return knex.insert({
                        user_id: user_id
                    }).into('matches').then(() => {
                        this.random(user_id).then((data4) => {
                            return knex('matches').update({
                                randomlist: JSON.stringify(data4)
                            }).where('matches.user_id', user_id)
                        })
                    })
                }
            }).then(() => {
                return knex('matches').where('matches.user_id', user_id)
            }).then((data5) => {
                return data5[0].randomlist
            })
    }

    random(user_id) {
        let randomList = []
        return knex.select('*')
            .from('filter')
            .innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id')
            .where('filter.user_id', user_id)
            .then((data) => {
                let reqMinyear = new Date().getFullYear() - data[0].max_age
                let reqMaxyear = new Date().getFullYear() - data[0].min_age
                return knex.select('*')
                    .from('usersProfile')
                    .innerJoin('users', 'users.id', 'usersProfile.user_id')
                    .where('usersProfile.gender', data[0].preferredGender)
                    .where('usersProfile.ethnicity', data[0].preferredEthnicity)
                    .where('usersProfile.height', ">=", data[0].min_height)
                    .where('usersProfile.height', "<=", data[0].max_height)
                    .whereBetween('usersProfile.education', [data[0].preferredEducation, 5])
                    .whereBetween('usersProfile.birthday', [new Date(new Date().setFullYear(reqMinyear)), new Date(new Date().setFullYear(reqMaxyear))])
                    .then((data2) => {
                        if (data2[0]) {
                            let result = data2.filter((x) => {
                                return geolib.getDistance(data[0].location, x.location) / 1000 < data[0].distance
                            })
                            return result
                        } else {
                            return data2
                        }
                    }).then((data3) => {
                        if (data3) {
                            if (data3[0]) {
                                let result
                                for (let each of data3) {
                                    result = knex('matches').where('matches.user_id', user_id).then((data4) => {
                                        if (data4[0]) {
                                            let seen = [...data4[0].like, ...data4[0].dislike]
                                            for (let x of seen) {
                                                if (each.id == x) {
                                                    let index = data3.indexOf(each)
                                                    data3.splice(index, 1)
                                                }
                                            }
                                            return data3
                                        } else {
                                            return data3
                                        }
                                    })
                                }
                                return result
                            } else {
                                return data3
                            }
                        } else {
                            return randomList
                        }
                    }).then((data5) => {
                        if (data5) {
                            for (let i = 0; i < 10; i++) {
                                if (data5[0]) {
                                    let randomIndex = Math.floor(Math.random() * data5.length)
                                    let randomItem = data5[randomIndex]
                                    data5.splice(randomIndex, 1)
                                    randomList.push(randomItem)
                                }
                            }
                            return randomList

                        } else {
                            return randomList
                        }
                    }).then((data6) => {
                        if (data6) {
                            if (data6[0]) {
                                for (let each of data6) {
                                    if (each) {
                                        switch (each.education) {
                                            case 1:
                                                each.education = "Secondary";
                                                break;
                                            case 2:
                                                each.education = "Associate";
                                                break;
                                            case 3:
                                                each.education = "Bachelor";
                                                break;
                                            case 4:
                                                each.education = "Master";
                                                break;
                                            case 5:
                                                each.education = "Doctor";
                                                break;
                                        }
                                    }
                                }
                                return data6
                            } else {
                                return data6
                            }
                        } else {
                            return randomList
                        }
                    }).then((result) => {
                        return result
                    })
            })
    }

    likeMe(user_id) {
        let likeme = []
        return knex.select('*')
            .from('filter')
            .innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id')
            .where('filter.user_id', user_id)
            .then((data) => {
                let reqMinyear = new Date().getFullYear() - data[0].max_age
                let reqMaxyear = new Date().getFullYear() - data[0].min_age
                return knex.select('*')
                    .from('usersProfile')
                    .innerJoin('users', 'users.id', 'usersProfile.user_id')
                    .where('usersProfile.gender', data[0].preferredGender)
                    .where('usersProfile.ethnicity', data[0].preferredEthnicity)
                    .where('usersProfile.height', ">=", data[0].min_height)
                    .where('usersProfile.height', "<=", data[0].max_height)
                    .whereBetween('usersProfile.education', [data[0].preferredEducation, 5])
                    .whereBetween('usersProfile.birthday', [new Date(new Date().setFullYear(reqMinyear)), new Date(new Date().setFullYear(reqMaxyear))])
                    .then((data2) => {
                        if (data2[0]) {
                            let result = data2.filter((x) => {
                                return geolib.getDistance(data[0].location, x.location) / 1000 < data[0].distance
                            })
                            return result
                        } else {
                            return data2
                        }
                    }).then((data3) => {
                        if (data3) {
                            if (data3[0]) {
                                let result
                                for (let each of data3) {
                                    result = knex('matches').where('matches.user_id', user_id).then((data4) => {
                                        if (data4[0]) {
                                            let seen = [...data4[0].like, ...data4[0].dislike]
                                            for (let x of seen) {
                                                if (each.id == x) {
                                                    let index = data3.indexOf(each)
                                                    data3.splice(index, 1)
                                                }
                                            }
                                            return data3
                                        } else {
                                            return data3
                                        }
                                    })
                                }
                                return result
                            } else {
                                return data3
                            }
                        } else {
                            return likeme
                        }
                    }).then((data5) => {
                        if (data5) {
                            if (data5[0]) {
                                let result
                                for (let each of data5) {
                                    result = knex('matches').where('matches.user_id', each.id).then((data6) => {
                                        if (data6[0].like) {
                                            if (data6[0].like.indexOf(user_id) > -1) {
                                                likeme.push(each)
                                                return likeme
                                            }
                                        }
                                    })
                                }
                                return result
                            } else {
                                return data5
                            }
                        } else {
                            return likeme
                        }
                    }).then((data7) => {
                        if (data7[0]) {
                            for (let each of data7) {
                                if (each) {
                                    switch (each.education) {
                                        case 1:
                                            each.education = "Secondary";
                                            break;
                                        case 2:
                                            each.education = "Associate";
                                            break;
                                        case 3:
                                            each.education = "Bachelor";
                                            break;
                                        case 4:
                                            each.education = "Master";
                                            break;
                                        case 5:
                                            each.education = "Doctor";
                                            break;
                                    }
                                }

                            }
                            return data7
                        } else {
                            return data7
                        }
                    })
            })
    }

    like(user_id, like_id) {
        return knex("matches")
            .where('matches.user_id', user_id)
            .then((data) => {
                if (data[0]) {
                    if (data[0].like) {
                        let like = data[0].like
                        like.push(like_id)
                        return like
                    } else {
                        let like = []
                        like.push(like_id)
                        return like
                    }
                } else {
                    return knex.insert({
                        user_id: user_id
                    }).into('matches').then(() => {
                        let like = []
                        like.push(like_id)
                        return like
                    })
                }
            }).then((data1) => {
                return knex('matches')
                    .update({
                        like: JSON.stringify(data1)
                    })
                    .where('matches.user_id', user_id)
            }).then(() => {
                return knex('matches')
                    .where('matches.user_id', user_id)
            }).then((data2) => {
                let list = data2[0].randomlist
                if (list) {
                    let newlist = list.filter((x) => {
                        if (x) {
                            return x.id != like_id
                        }
                    })
                    return knex('matches')
                        .update({
                            randomlist: JSON.stringify(newlist)
                        })
                        .where('matches.user_id', user_id)
                }
            }).then(() => {
                return knex('matches')
                    .where('matches.user_id', like_id)
            })
    }

    dislike(user_id, dislike_id) {
        return knex("matches")
            .where('matches.user_id', user_id)
            .then((data) => {
                if (data[0]) {
                    if (data[0].dislike) {
                        let dislike = data[0].dislike
                        dislike.push(dislike_id)
                        return dislike
                    } else {
                        let dislike = []
                        dislike.push(dislike_id)
                        return dislike
                    }
                } else {
                    return knex.insert({
                        user_id: user_id
                    }).into('matches').then(() => {
                        let dislike = []
                        dislike.push(dislike_id)
                        return dislike
                    })
                }
            }).then((data1) => {
                return knex('matches')
                    .update({
                        dislike: JSON.stringify(data1)
                    })
                    .where('matches.user_id', user_id)
            }).then(() => {
                return knex('matches')
                    .where('matches.user_id', user_id)
            }).then((data2) => {
                let list = data2[0].randomlist
                if (list) {
                    let newlist = list.filter((x) => {
                        if (x) {
                            return x.id != dislike_id
                        }
                    })
                    return knex('matches')
                        .update({
                            randomlist: JSON.stringify(newlist)
                        })
                        .where('matches.user_id', user_id)
                }
            })
    }

    unDislike(user_id) {
        return knex("matches")
            .where('matches.user_id', user_id)
            .then((data) => {
                let dislike = data[0].dislike
                dislike.pop()
                return dislike
            }).then((data) => {
                return knex('matches')
                    .update({
                        dislike: JSON.stringify(data)
                    })
                    .where('matches.user_id', user_id)
            })
    }

    //chat
    async ChatList(user_id) {
        let data = await knex.select('*').from('matches').where('matches.user_id', user_id);
        if (data[0]) {
            if (data[0].like) {
                if (data[0].like[0]) {
                    let matches = []
                    let chatrooms = []
                    for (let each of data[0].like) {
                        let room = []
                        let data1 = await knex('matches').where('matches.user_id', each)
                        if (data1[0]) {
                            if (data1[0].like) {
                                if (data1[0].like[0]) {
                                    if (data1[0].like.indexOf(user_id) > -1) {
                                        matches.push(each)
                                        room.push(user_id)
                                        room.push(each)
                                        room.sort()
                                        chatrooms.push(JSON.stringify(room))
                                    }
                                }
                            }
                        }
                    }

                    let profiles = []
                    if (matches[0]) {
                        for (let item of matches) {
                            let data2 = await knex('usersProfile').innerJoin('users', 'users.id', 'usersProfile.user_id').where('usersProfile.user_id', item)
                            profiles.push(data2[0])
                        }
                    }

                    let roomId = []
                    if (chatrooms[0]) {
                        for (let every of chatrooms) {
                            let data3 = await knex('chatroom').where('matchedPair', every);
                            if (!data3[0]) {
                                await knex.insert({
                                    'matchedPair': every
                                }).into('chatroom')
                            }
                            roomId.push(data3[0])
                        }
                    }

                    for (let x of profiles) {
                        for (let y of roomId) {
                            if (JSON.parse(y.matchedPair).indexOf(x.id) > -1) {
                                x.chatroom = y.id
                            }
                        }
                    }
                    return profiles
                }
                return []
            }
            return []
        }
        return []
    }

    async GetChatInfo(roomId, user_id) {
        let data = await knex('chatroom').where('id', roomId)
        let targetId = JSON.parse(data[0].matchedPair).filter((x) => {
            return x != user_id
        })
        let user = await knex('users').where('id', user_id)
        let target = await knex('users').where('id', targetId[0])
        let result = {
            'user': user,
            'target': target
        }
        return result
    }

    unlike(user_id, unlike_id) {
        return knex("matches")
            .where('matches.user_id', user_id)
            .then((data) => {
                let like = data[0].like
                like.splice(like.indexOf(unlike_id), 1)
                return like
            }).then((data) => {
                return knex('matches')
                    .update({
                        like: JSON.stringify(data)
                    })
                    .where('matches.user_id', user_id)
            })
    }

    //points

    AddPoint(user_id, addPoints) {
        return knex('points')
            .where('points.user_id', user_id).then((data) => {
                if (data[0]) {

                    let balance = data[0].balance
                    balance += addPoints
                    let transactions = data[0].transactions
                    transactions.push(addPoints)

                    let object = {
                        'balance': balance,
                        'transactions': JSON.stringify(transactions),
                    }
                    return knex('points')
                        .update(object)
                        .where('points.user_id', user_id)
                } else {
                    let balance = 0
                    balance += addPoints
                    let transactions = []
                    transactions.push(addPoints)

                    let object = {
                        'user_id': user_id,
                        'balance': balance,
                        'transactions': JSON.stringify(transactions),
                    }
                    return knex.insert(object).into('points')
                }
            })
    }

    usePoint(user_id, usePoints) {
        return knex('points')
            .where('points.user_id', user_id).then((data) => {
                if (data[0]) {
                    if (data[0].balance >= usePoints) {
                        let balance = data[0].balance
                        balance -= usePoints
                        let transactions = data[0].transactions
                        transactions.push(-usePoints)
                        let object = {
                            'balance': balance,
                            'transactions': JSON.stringify(transactions),
                        }
                        return knex('points')
                            .update(object)
                            .where('points.user_id', user_id)
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            })
    }

    viewLikeMeToken(user_id) {
        return knex('points')
            .update({
                viewLikeMeToken: true
            })
            .where('points.user_id', user_id)
    }




}

module.exports = Method;