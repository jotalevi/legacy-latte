const jwt = require('jsonwebtoken')
const config = require('../../config')
const { models } = require('./models')

const chToken = function (req, res, next) {
    let token = ''

    if (req.headers.cookie != null && req.headers.cookie != undefine) {
        req.headers.cookie.split(';').forEach(v => {
            if (v.split('=')[0] === 'token')
                token = v.split('=')[1]
        })
    }

    jwt.verify(token, config.jwt_secret, async (err, data) => {
        if (err) {
            req.user = null
        } else {
            req.user = await models.User.findOne({ token: data.token })
        }

        next()
    })
}

module.exports = {
    chToken
}