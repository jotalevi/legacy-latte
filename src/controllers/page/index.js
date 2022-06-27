const api = require('../api')

//com/scrape-query/popular/:page_no
const popular = async (req, res) => {
    api.popular(req, res)
}

//com/scrape-query/anime/:anime_id
const anime = async (req, res) => {
    api.anime(req, res)
}

//com/scrape-query/episode/:episode_id
const episode = async (req, res) => {
    api.episode(req, res)
}

//com/scrape-query/search/:query
const search = async (req, res) => {
    api.search(req, res)
}

//:/register
const register = async (req, res) => {
    res.render('register')
}

//:/login
const login = async (req, res) => {
    res.render('login')
}

//:/profile
const profile = async (req, res) => {
    api.profile(req, res)
}

//:/share/:episode_id
const share = async (req, res) => {
    api.share(req, res)
}

//:/trx
const trxInput = async (req, res) => {
    api.trxInput(req, res)
}

//:/trx/:token
const trxRedir = async (req, res) => {
    api.trxRedir(req, res)
}

module.exports = {
    popular,
    anime,
    episode,
    search,
    register,
    login,
    profile,
    share,
    trxInput,
    trxRedir,
}