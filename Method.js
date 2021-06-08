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

    async GetProfile(user_id) {
        let data = await knex.select('*')
            .from('usersProfile')
            .innerJoin('users', 'users.id', 'usersProfile.user_id')
            // .innerJoin('inventory', 'users.id', 'inventory.user_id')
            .where('usersProfile.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            return []
        }
    }

    async GetPhotos(user_id) {
        let data = await knex('photos').where('photos.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            return []
        }
    }

    async GetPoints(user_id) {
        let data = await knex('points').where('points.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            return []
        }
    }

    async GetInventory(user_id) {
        let data = await knex('inventory').where('inventory.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            return []
        }
    }

    async addProfile(user_id, profilepic, gender, birthday, height, work, education, ethnicity, religion, hometown, location, aboutme) {
        let data = await knex('usersProfile').where('usersProfile.user_id', user_id)
        if (!data[0]) {
            await knex.insert({
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
    }

    async editProfile(user_id, profilepic, height, work, education, religion, location, aboutme) {
        await knex('usersProfile')
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

    async writefile(name, data) {
        await fs.writeFile(path.join(uploadDir, name), data, (err) => {
            if (err) {
                console.log(err)
            } else {
                return data
            }
        })
    }


    // Filter

    async myFilter(user_id) {
        let data = await knex('filter').where('filter.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            return []
        }
    }

    async editFilter(user_id, preferredGender, min_age, max_age, min_height, max_height, distance, preferredEthnicity, preferredEducation) {
        let data = await knex('filter')
            .where('filter.user_id', user_id)
        if (data[0]) {
            await knex('filter')
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
            await knex.insert({
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
    }

    //browse

    async grabRandomList(user_id) {
        let data = await knex('matches').where('matches.user_id', user_id)
        if (data[0]) {
            if (data[0].randomlist) {
                if (data[0].randomlist[0]) {
                    return data[0].randomlist
                } //else stays at empty []
            } else {
                let data2 = await this.random(user_id)
                await knex('matches').update({
                    randomlist: JSON.stringify(data2)
                }).where('matches.user_id', user_id)

            }
        } else {
            await knex.insert({
                user_id: user_id
            }).into('matches')
            let data3 = await this.random(user_id)
            await knex('matches').update({
                randomlist: JSON.stringify(data3)
            }).where('matches.user_id', user_id)
        }

        let data4 = await knex('matches').where('matches.user_id', user_id)
        return data4[0].randomlist
    }

    async random(user_id) {
        let randomList = []
        let data = await knex.select('*').from('filter').innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id').where('filter.user_id', user_id)
        let reqMinyear = new Date().getFullYear() - data[0].max_age
        let reqMaxyear = new Date().getFullYear() - data[0].min_age
        let data2 = await knex.select('*')
            .from('usersProfile')
            .innerJoin('users', 'users.id', 'usersProfile.user_id')
            .where('usersProfile.gender', data[0].preferredGender)
            .where('usersProfile.ethnicity', data[0].preferredEthnicity)
            .where('usersProfile.height', ">=", data[0].min_height)
            .where('usersProfile.height', "<=", data[0].max_height)
            .whereBetween('usersProfile.education', [data[0].preferredEducation, 5])
            .whereBetween('usersProfile.birthday', [new Date(new Date().setFullYear(reqMinyear)), new Date(new Date().setFullYear(reqMaxyear))])
        if (data2[0]) {
            let result = data2.filter((x) => {
                return geolib.getDistance(data[0].location, x.location) / 1000 < data[0].distance
            })
            if (result[0]) {

                for (let each of result) {
                    let data4 = await knex('matches').where('matches.user_id', user_id)
                    if (data4[0]) {
                        if (data4[0].like && data4[0].dislike) {
                            let seen = [...data4[0].like, ...data4[0].dislike]
                            for (let x of seen) {
                                if (each.id == x) {
                                    let index = result.indexOf(each)
                                    result.splice(index, 1)
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < 10; i++) {
                    if (result[0]) {
                        let randomIndex = Math.floor(Math.random() * result.length)
                        let randomItem = result[randomIndex]
                        result.splice(randomIndex, 1)
                        randomList.push(randomItem)
                    }
                }

                if (randomList[0]) {
                    for (let each of randomList) {
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
                    return randomList
                } else {
                    return []
                }
            }
            return []
        }
        return []
    }

    async likeMe(user_id) {
        let likeme = []
        let data = await knex.select('*').from('filter').innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id').where('filter.user_id', user_id)
        let reqMinyear = new Date().getFullYear() - data[0].max_age
        let reqMaxyear = new Date().getFullYear() - data[0].min_age
        let data2 = await knex.select('*')
            .from('usersProfile')
            .innerJoin('users', 'users.id', 'usersProfile.user_id')
            .where('usersProfile.gender', data[0].preferredGender)
            .where('usersProfile.ethnicity', data[0].preferredEthnicity)
            .where('usersProfile.height', ">=", data[0].min_height)
            .where('usersProfile.height', "<=", data[0].max_height)
            .whereBetween('usersProfile.education', [data[0].preferredEducation, 5])
            .whereBetween('usersProfile.birthday', [new Date(new Date().setFullYear(reqMinyear)), new Date(new Date().setFullYear(reqMaxyear))])
        if (data2[0]) {
            let result = data2.filter((x) => {
                return geolib.getDistance(data[0].location, x.location) / 1000 < data[0].distance
            })
            if (result[0]) {
                for (let each of result) {
                    let data3 = await knex('matches').where('matches.user_id', user_id)
                    if (data3[0]) {
                        if (data3[0].like && data3[0].dislike) {
                            let seen = [...data3[0].like, ...data3[0].dislike]
                            for (let x of seen) {
                                if (each.id == x) {
                                    let index = result.indexOf(each)
                                    result.splice(index, 1)
                                }
                            }
                        }
                    }
                }
                if (result[0]) {
                    for (let each of result) {
                        let data4 = await knex('matches').where('matches.user_id', each.id)
                        if (data4[0].like) {
                            if (data4[0].like.indexOf(user_id) > -1) {
                                likeme.push(each)
                            }
                        }
                    }
                } else {
                    return []
                }
                if (likeme[0]) {
                    for (let each of likeme) {
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
                    return likeme
                } else {
                    return []
                }
            }
            return []
        }
        return []
    }


    async like(user_id, like_id) {
        let data = await knex("matches").where('matches.user_id', user_id)
        let like
        if (data[0]) {
            if (data[0].like) {
                like = data[0].like
                like.push(like_id)
            } else {
                like = []
                like.push(like_id)
            }
        } else {
            await knex.insert({
                user_id: user_id
            }).into('matches')
            like = []
            like.push(like_id)
        }
        await knex('matches')
            .update({
                like: JSON.stringify(like)
            })
            .where('matches.user_id', user_id)

        let data1 = await knex('matches').where('matches.user_id', user_id)
        let list = data1[0].randomlist
        if (list) {
            let newlist = list.filter((x) => {
                if (x) {
                    return x.id != like_id
                }
            })
            await knex('matches')
                .update({
                    randomlist: JSON.stringify(newlist)
                })
                .where('matches.user_id', user_id)
        }

        return await knex('matches').where('matches.user_id', like_id)
    }

    async dislike(user_id, dislike_id) {
        let dislike
        let data = await knex("matches").where('matches.user_id', user_id)
        if (data[0]) {
            if (data[0].dislike) {
                dislike = data[0].dislike
                dislike.push(dislike_id)
            } else {
                dislike = []
                dislike.push(dislike_id)
            }
        } else {
            await knex.insert({
                user_id: user_id
            }).into('matches')
            dislike = []
            dislike.push(dislike_id)
        }

        await knex('matches').update({
            dislike: JSON.stringify(dislike)
        }).where('matches.user_id', user_id)

        let data2 = await knex('matches').where('matches.user_id', user_id)
        let list = data2[0].randomlist
        if (list) {
            let newlist = list.filter((x) => {
                if (x) {
                    return x.id != dislike_id
                }
            })
            await knex('matches')
                .update({
                    randomlist: JSON.stringify(newlist)
                })
                .where('matches.user_id', user_id)
        }
    }

    async unDislike(user_id) {
        let data = await knex("matches")
            .where('matches.user_id', user_id)

        let dislike = data[0].dislike
        dislike.pop()

        await knex('matches')
            .update({
                dislike: JSON.stringify(dislike)
            })
            .where('matches.user_id', user_id)
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

    async unlike(user_id, unlike_id) {
        let data = await knex("matches")
            .where('matches.user_id', user_id)

        let like = data[0].like
        like.splice(like.indexOf(unlike_id), 1)

        await knex('matches')
            .update({
                like: JSON.stringify(like)
            })
            .where('matches.user_id', user_id)
    }

    //points

    async AddPoint(user_id, addPoints) {
        let data = await knex('points').where('points.user_id', user_id)
        if (data[0]) {
            let balance = data[0].balance
            balance += addPoints
            let transactions = data[0].transactions
            transactions.push(addPoints)
            let object = {
                'balance': balance,
                'transactions': JSON.stringify(transactions),
            }
            await knex('points')
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
            await knex.insert(object).into('points')
        }
    }

    async usePoint(user_id, usePoints) {
        let data = await knex('points').where('points.user_id', user_id)
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
                await knex('points')
                    .update(object)
                    .where('points.user_id', user_id)
            } else {
                return null
            }
        } else {
            return null
        }
    }

    async viewLikeMeToken(user_id) {
        await knex('points')
            .update({
                viewLikeMeToken: true
            })
            .where('points.user_id', user_id)
    }
}

module.exports = Method;