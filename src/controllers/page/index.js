const config = require('../../config')
const axios = require('axios')
const cheerio = require('cheerio')
const utils = require('../../utils')
const api = require('../api')

//com/scrape-query/popular/:page_no
const popular = async function (req, res){
    api.popular(req, res, true)
}

//com/scrape-query/anime/:anime_id
const anime = async function (req, res){
    api.anime(req, res, true)
}

//com/scrape-query/episode/:episode_id
const episode = async function (req, res){
    api.episode(req, res, true)
}

//com/scrape-query/search/:query
const search = async function (req, res){
    api.search(req, res, true)
}

module.exports = {
    popular,
    anime,
    episode,
    search,
}