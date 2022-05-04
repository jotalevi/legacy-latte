const fs = require('fs');
const config = require('../../config')
const axios = require('axios')
const cheerio = require('cheerio')
const utils = require('../../utils')

//com/scrape-query/popular/:page_no
const popular = async function (req, res){
    resContent = {
        page: req.params.page_no,
        results:[]
    }

    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.popular}${req.params.page_no}`)
    const $ = cheerio.load(data)

    const items = $('.items>li')
    items.each(function (idx, el) {
        let anime = {}
        anime.id = $(el).children().children().attr('href').replace('/category/', '')
        anime.thumbnail = $(el).children().children().children().attr('src')
        anime.title = $(el).children('.name').children().text()
        resContent.results.push(anime)
    })

    res.send(resContent)
}

//com/scrape-query/anime/:anime_id
const anime = async function (req, res){
    resContent = {
        anime: req.params.anime_id,
    }
    //https://www3.gogoanime.cm/category/naruto-shippuuden-dub
    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.anime}${req.params.anime_id}`)
    const $ = cheerio.load(data)

    const animeInfo = $('.anime_info_body_bg')
    
    resContent.title = animeInfo.children('h1').text()
    resContent.thumbnail = animeInfo.children('img').attr('src')
    
    const animeEpCounter = $('#episode_page')
    epCounter = parseInt(animeEpCounter.children('li').last().text().split('-')[1])
    resContent.number_of_episodes = epCounter

    resContent.episodes = []
    for (let i = 1; i <= epCounter; i++){
        resContent.episodes.push(`${req.params.anime_id}-episode-${i}`)
    }

    res.send(resContent)
}

//com/scrape-query/episode/:episode_id
const episode = async function (req, res){
    resContent = {
        anime: req.params.episode_id,
    }
    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.episode}${req.params.episode_id}`)
    const $ = cheerio.load(data)

    resContent.title = $('.anime_video_body').children('h1').text()
    resContent.media_url = $('iframe').attr('src').toString()
    
    res.send(resContent)
}

//com/scrape-query/search/:query
const search = async function (req, res){
    resContent = {
        query: req.params.query,
        matches: 0,
        results:[]
    }

    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.search}${req.params.query}`)
    const $ = cheerio.load(data)

    const items = $('.items>li')
    items.each(function (idx, el) {
        let anime = {}
        anime.id = $(el).children().children().attr('href').replace('/category/', '')
        anime.thumbnail = $(el).children().children().children().attr('src')
        anime.title = $(el).children('.name').children().text()
        resContent.results.push(anime)
    })
    resContent.matches = resContent.results.length

    res.send(resContent)
}

const login = async function (req, res){
    resContent = {
        username: req.body.username,
        tp_key: null
    }

    if (utils.chToken(req.body.token, req.body.username)){

    }else{

    }
}

const createUser = async function (req, res){
    resContent = {
        username: req.body.username,
        tp_key: null
    }

    utils.inputCl()
}

const getLogData = async function (req, res){
    res.json(JSON.parse(fs.readFileSync('public/data/reqlog.json')))
}

module.exports = {
    popular,
    anime,
    episode,
    search,
    login,
    getLogData
}