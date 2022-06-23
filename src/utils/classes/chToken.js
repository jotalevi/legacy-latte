const jwt = require('jsonwebtoken')
const { models } = require('./models')

const chToken = function (req, res, next) {
    let token = ''

    if (req.headers.cookie != null && req.headers.cookie != undefined) {
        req.headers.cookie.split(';').forEach(v => {
            if (v.split('=')[0] === 'token')
                token = v.split('=')[1]
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
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