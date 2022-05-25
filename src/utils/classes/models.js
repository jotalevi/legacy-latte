const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://neto:412675@cluster0.g3gwc.mongodb.net/?retryWrites=true&w=majority')

const User = mongoose.model('User',
    {
        username: String,
        token: String,
        mail: String,
    }
)

const SeenBy = mongoose.model('SeenBy',
    {
        _user_id: String,
        anime_id: String,
        episd_id: String
    }
)

const models = {
    User: User,
    SeenBy: SeenBy,
}

module.exports = {
    models
}