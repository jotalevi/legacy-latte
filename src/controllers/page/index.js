const api = require('../api')

//com/scrape-query/popular/:page_no
const popular = async function (req, res) {
    api.popular(req, res, true)
}

//com/scrape-query/anime/:anime_id
const anime = async function (req, res) {
    api.anime(req, res, true)
}

//com/scrape-query/episode/:episode_id
const episode = async function (req, res) {
    api.episode(req, res, true)
}

//com/scrape-query/search/:query
const search = async function (req, res) {
    api.search(req, res, true)
}

//:/register
const register = async function (req, res) {
    res.render('register')
}

//:/login
const login = async function (req, res) {
    res.render('login')
}

module.exports = {
    popular,
    anime,
    episode,
    search,
    register,
    login,
}