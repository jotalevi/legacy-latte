const model = require('../classes/model')

const chToken = function(token, username) {
    return (model.user.getToken(username) ?? '') === token
}

module.exports = {
    chToken
}