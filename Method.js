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

    async editProfile(user_id, profilepic, height, education, religion, work, location, hometown, aboutme) {
        await knex('usersProfile')
            .update({
                profilepic: profilepic,
                height: height,
                education: education,
                religion: religion,
                work: work,
                location: location,
                hometown: hometown,
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

    async photoUpload(user_id, foto1, foto2, foto3, foto4, foto5, foto6) {
        let data = await knex('photos').where('photos.user_id', user_id)
        if (data[0]) {
            await knex('photos')
                .update({
                    pc1: foto1,
                    pc2: foto2,
                    pc3: foto3,
                    pc4: foto4,
                    pc5: foto5,
                    pc6: foto6,
                }).where('photos.user_id', user_id)
        } else {
            await knex.insert({
                pc1: foto1,
                pc2: foto2,
                pc3: foto3,
                pc4: foto4,
                pc5: foto5,
                pc6: foto6,
                user_id: user_id
            }).into('photos')
        }
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

    async refresh(user_id) {
        let data = await this.random(user_id)
        await knex('matches').update({
            randomlist: JSON.stringify(data)
        }).where('matches.user_id', user_id)
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

            let data4 = await knex('matches').where('matches.user_id', user_id)
            let seen
            if (data4[0]) {
                if (!data4[0].like) {
                    data4[0].like = []
                }
                if (!data4[0].dislike) {
                    data4[0].dislike = []
                }
                seen = [...data4[0].like, ...data4[0].dislike]
            } else {
                seen = []
            }
    
            if (result[0]) {

                let filterList = result.filter((x) => {
                    return !seen.includes(x.id)
                })

                for (let i = 0; i < 10; i++) {
                    if (filterList[0]) {
                        let randomIndex = Math.floor(Math.random() * filterList.length)
                        let randomItem = filterList[randomIndex]
                        filterList.splice(randomIndex, 1)
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
                    let findmatcheslist = randomList.filter((x) => {
                        return x.id !== user_id
                    })
                    return findmatcheslist
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

            let data4 = await knex('matches').where('matches.user_id', user_id)
            let seen
            if (data4[0]) {
                if (!data4[0].like) {
                    data4[0].like = []
                }
                if (!data4[0].dislike) {
                    data4[0].dislike = []
                }
                seen = [...data4[0].like, ...data4[0].dislike]
            } else {
                seen = []
            }

            if (result[0]) {

                let filterList = result.filter((x) => {
                    return !seen.includes(x.id)
                })

                if (filterList[0]) {
                    for (let each of filterList) {
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

    async checklike(user_id, target_id) {
        let data = await knex('matches').where('matches.user_id', target_id)
        if (data[0] && data[0].like && data[0].like[0]) {
            if (data[0].like.indexOf(JSON.parse(user_id)) > -1) {
                return true
            }
            return false
        }
        return false
    }

    async iflike(user_id, target_id) {
        let data = await knex('matches').where('matches.user_id', user_id)
        if (data[0] && data[0].like && data[0].like[0]) {
            if (data[0].like.indexOf(JSON.parse(target_id)) > -1) {
                return true
            }
            return false
        }
        return false
    }

    //chat

    async createRoom(user_id) {
        let data = await knex.select('*').from('matches').where('matches.user_id', user_id);
        if (data[0] && data[0].like && data[0].like[0]) {
            let chatrooms = []
            let profiles = []

            for (let each of data[0].like) {
                let room = []
                let data1 = await knex('matches').where('matches.user_id', each)
                if (data1[0] && data1[0].like && data1[0].like[0]) {
                    if (data1[0].like.indexOf(user_id) > -1) {
                        room.push(user_id)
                        room.push(each)
                        let sortRoom = room.sort((a, b) => a - b)
                        chatrooms.push(sortRoom)
                        let data2 = await knex('chatroom').where('matchedPair', sortRoom.toString());
                        if (!data2[0]) {
                            await knex.insert({
                                'matchedPair': sortRoom.toString()
                            }).into('chatroom')
                        }
                        let profile = await this.GetProfile(each)
                        profiles.push(profile)
                    }
                }

            }

            for (let item of chatrooms) {
                let data3 = await knex('chatroom').where('matchedPair', item.toString());
                for (let x of profiles) {
                    if (data3[0].matchedPair.split(',').indexOf(x.id.toString()) > -1) {
                        x.chatroom = data3[0].id
                    }
                }
            }
            return profiles
        }
        return []
    }

    async GetChatInfo(roomId, user_id) {
        let data = await knex('chatroom').where('id', roomId)
        let targetId = data[0].matchedPair.split(',').filter((x) => {
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

    async unlike(user_id, unlike_id, roomId) {
        let data = await knex("matches")
            .where('matches.user_id', user_id)

        let like = data[0].like
        let newLike = like.filter((x)=>{
            return x != unlike_id
        })
    
        await knex('matches')
            .update({
                like: JSON.stringify(newLike)
            })
            .where('matches.user_id', user_id)

        await knex('chatroom').where('id', roomId).del()
    }

    //Coins

    async GetCoins(user_id) {
        let data = await knex('coins').where('coins.user_id', user_id)
        if (data[0]) {
            return data[0]
        } else {
            await knex.insert({
                balance: 0,
                transactions: JSON.stringify([]),
                user_id: user_id
            }).into('coins')
            let data = await knex('coins').where('coins.user_id', user_id)
            return data
        }
    }

    async AddCoins(user_id, addPoints) {
        let data = await knex('coins').where('coins.user_id', user_id)
        if (data[0]) {
            let balance = data[0].balance
            balance += addPoints
            let transactions = data[0].transactions
            let cur_date = new Date();
            let time = cur_date.toLocaleString()
            transactions.push({
                'amount': `+${addPoints.toString()}`,
                'item': 'New Purchase',
                'data': time
            })
            let object = {
                'balance': balance,
                'transactions': JSON.stringify(transactions),
            }
            await knex('coins')
                .update(object)
                .where('coins.user_id', user_id)
        } else {
            let balance = 0
            balance += addPoints
            let transactions = []
            let cur_date = new Date();
            let time = cur_date.toLocaleString()
            transactions.push({
                'amount': `+${addPoints.toString()}`,
                'item': 'New Purchase',
                'data': time
            })
            let object = {
                'user_id': user_id,
                'balance': balance,
                'transactions': JSON.stringify(transactions),
            }
            await knex.insert(object).into('coins')
        }
    }

    async viewMore(user_id, amount) {
        let data = await knex('coins').where('coins.user_id', user_id)
        if (data[0]) {
            if (data[0].balance >= amount) {
                let balance = data[0].balance
                balance -= parseInt(amount)
                let transactions = data[0].transactions
                let cur_date = new Date();
                let time = cur_date.toLocaleString()
                transactions.push({
                    'amount': `-${amount.toString()}`,
                    'item': 'View Extra Matches',
                    'data': time
                })
                let object = {
                    'balance': balance,
                    'transactions': JSON.stringify(transactions),
                }
                await knex('coins')
                    .update(object)
                    .where('coins.user_id', user_id)
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    async getToken(user_id, amount) {
        let data = await knex('coins').where('coins.user_id', user_id)
        if (data[0]) {
            if (data[0].balance >= amount) {
                let balance = data[0].balance
                balance -= parseInt(amount)
                let transactions = data[0].transactions
                let cur_date = new Date();
                let time = cur_date.toLocaleString()
                transactions.push({
                    'amount': `-${amount.toString()}`,
                    'item': 'View who liked me',
                    'data': time
                })
                let object = {
                    'balance': balance,
                    'transactions': JSON.stringify(transactions),
                }
                await knex('coins')
                    .update(object)
                    .where('coins.user_id', user_id)
                let token = await knex('token').where('token.user_id', user_id)
                if (token[0]) {
                    await knex('token').update({
                        'likeme': true
                    }).where('token.user_id', user_id)
                } else {
                    await knex.insert({
                        'likeme': true,
                        'user_id': user_id
                    }).into('token')
                }
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

module.exports = Method;