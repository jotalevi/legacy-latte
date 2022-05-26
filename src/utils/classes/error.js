
class UserNotFoundError extends Error {
    constructor(message = 'Could not find this user') {
        super(message)
        this.name = "UserNotFoundError"
    }
}

module.exports = {
    UserNotFoundError,
}