let { UserNotFoundError } = require ('./error')

let model = {
    user: {
        getUser: null,
        getToken: null
    },
    users: [
        {
            username: "jotalevi",
            token: "5713734636771282",
            mail: "talevineto@gmail.com"
        },
        {
            username: "thepicox",
            token: "2358954131696898",
            mail: "test.s@gmail.com"
        }
    ]
}

model.user.getUser = function (username){
    model.users.forEach(user => {
        if (user.username === username) return user;
    })
    throw UserNotFoundError
}

model.user.getToken = function (username){
    return model.user.getUser(username).token
}

module.exports = {
    model
}