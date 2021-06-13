const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const schedule = require('node-schedule')
const geolib = require('geolib')

const job = schedule.scheduleJob('1 * * * *', async function () {
    let ids = await knex.select("id").from('users')
    for (let id of ids) {
        let randomList = []
        let data = await knex.select('*').from('filter').innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id').where('filter.user_id', id.id)
        if (data[0]) {
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

                let data4 = await knex('matches').where('matches.user_id', id.id)
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
                            return x.id !== id.id
                        })

                        await knex('matches').update({
                            randomlist: JSON.stringify(findmatcheslist)
                        }).where('matches.user_id', id.id)

                    } else {
                        return []
                    }
                }
                return []
            }
            return []

        }

    }







































    // return knex.select("id").from('users').then((ids) => {
    //     for (let id of ids) {
    //         let randomList = []
    //         knex.select('*')
    //             .from('filter')
    //             .innerJoin('usersProfile', 'usersProfile.user_id', 'filter.user_id')
    //             .where('filter.user_id', id.id)
    //             .then((data) => {
    //                 if (data[0]) {
    //                     let reqMinyear = new Date().getFullYear() - data[0].max_age
    //                     let reqMaxyear = new Date().getFullYear() - data[0].min_age
    //                     return knex.select('*')
    //                         .from('usersProfile')
    //                         .innerJoin('users', 'users.id', 'usersProfile.user_id')
    //                         .where('usersProfile.gender', data[0].preferredGender)
    //                         .where('usersProfile.ethnicity', data[0].preferredEthnicity)
    //                         .where('usersProfile.height', ">=", data[0].min_height)
    //                         .where('usersProfile.height', "<=", data[0].max_height)
    //                         .whereBetween('usersProfile.education', [data[0].preferredEducation, 5])
    //                         .whereBetween('usersProfile.birthday', [new Date(new Date().setFullYear(reqMinyear)), new Date(new Date().setFullYear(reqMaxyear))])
    //                         .then((data2) => {
    //                             if (data2[0]) {
    //                                 let result = data2.filter((x) => {
    //                                     return geolib.getDistance(data[0].location, x.location) / 1000 < data[0].distance
    //                                 })
    //                                 return result
    //                             } else {
    //                                 return data2
    //                             }
    //                         }).then((data3) => {
    //                             if (data3) {
    //                                 if (data3[0]) {
    //                                     let result
    //                                     for (let each of data3) {
    //                                         result = knex('matches').where('matches.user_id', id.id).then((data4) => {
    //                                             if (data4[0]) {
    //                                                 if (data4[0].like && data4[0].dislike) {
    //                                                     let seen = [...data4[0].like, ...data4[0].dislike]
    //                                                     for (let x of seen) {
    //                                                         if (each.id == x) {
    //                                                             let index = data3.indexOf(each)
    //                                                             data3.splice(index, 1)
    //                                                         }
    //                                                     }
    //                                                     return data3
    //                                                 }
    //                                                 return data3
    //                                             }
    //                                             return data3
    //                                         })
    //                                     }
    //                                     return result
    //                                 } else {
    //                                     return data3
    //                                 }
    //                             } else {
    //                                 return randomList
    //                             }
    //                         }).then((data5) => {
    //                             if (data5) {
    //                                 for (let i = 0; i < 10; i++) {
    //                                     if (data5[0]) {
    //                                         let randomIndex = Math.floor(Math.random() * data5.length)
    //                                         let randomItem = data5[randomIndex]
    //                                         data5.splice(randomIndex, 1)
    //                                         randomList.push(randomItem)
    //                                     }
    //                                 }
    //                                 return randomList

    //                             } else {
    //                                 return randomList
    //                             }
    //                         }).then((data6) => {
    //                             if (data6) {
    //                                 if (data6[0]) {
    //                                     for (let each of data6) {
    //                                         if (each) {
    //                                             switch (each.education) {
    //                                                 case 1:
    //                                                     each.education = "Secondary";
    //                                                     break;
    //                                                 case 2:
    //                                                     each.education = "Associate";
    //                                                     break;
    //                                                 case 3:
    //                                                     each.education = "Bachelor";
    //                                                     break;
    //                                                 case 4:
    //                                                     each.education = "Master";
    //                                                     break;
    //                                                 case 5:
    //                                                     each.education = "Doctor";
    //                                                     break;
    //                                             }
    //                                         }
    //                                     }
    //                                     return data6
    //                                 } else {
    //                                     return data6
    //                                 }
    //                             } else {
    //                                 return randomList
    //                             }
    //                         }).then((result) => {

    //                             return result
    //                         }).then((list) => {
    //                             return knex('matches').update({
    //                                 randomlist: JSON.stringify(list)
    //                             }).where('matches.user_id', id.id)

    //                         })
    //                 }
    //                 return data
    //             })
    //     }
    // })



})

module.exports = job;