const bcrypt = require("bcrypt");

function hash(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

function checkpassword(password, hashpassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashpassword, (err, match) => {
            if (err) {
                reject(err)
            }
            resolve(match)
        })
    })
}

module.exports = {
    hash: hash,
    checkpassword: checkpassword,
  };