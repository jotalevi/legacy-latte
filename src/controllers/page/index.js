const config = require('../../config')
const axios = require('axios')
const cheerio = require('cheerio')
const utils = require('../../utils')

//com/scrape-query/popular/:page_no
const popular = async function (req, res){

    resContent = {
        page: isNaN(parseInt(req.params.page_no)) ? 1 : parseInt(req.params.page_no),
        og_title: 'Watch anime for free on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
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

    res.render('popular', resContent)
}

//com/scrape-query/anime/:anime_id
const anime = async function (req, res){
    resContent = {
        anime: req.params.anime_id,
        og_title: '',
        og_image: '',
    }
    //https://www3.gogoanime.cm/category/naruto-shippuuden-dub
    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.anime}${req.params.anime_id}`)
    const $ = cheerio.load(data)

    const animeInfo = $('.anime_info_body_bg')
    
    resContent.title = animeInfo.children('h1').text()
    resContent.og_title = 'Whatch ' + resContent.title + ' on UnLatte'

    resContent.thumbnail = animeInfo.children('img').attr('src')
    resContent.og_image = resContent.thumbnail

    let aInfoTag = animeInfo.children('.type')
    resContent.type = aInfoTag[0].children[2].attribs.title
    resContent.info = aInfoTag[1].children[1].data
    
    const animeEpCounter = $('#episode_page')
    epCounter = parseInt(animeEpCounter.children('li').last().text().split('-')[1])
    resContent.number_of_episodes = epCounter

    resContent.episodes = []
    for (let i = 1; i <= epCounter; i++){
        resContent.episodes.push(`${req.params.anime_id}-episode-${i}`)
    }

    res.render('anime', resContent)
}

//com/scrape-query/episode/:episode_id
const episode = async function (req, res){
    resContent = {
        episode: req.params.episode_id,
        og_image: 'https://unlatte.cl/image/preview.png',
        og_title: ''
    }
    const { data } = await axios.get(`${config.scrape_url}${config.rule_path.episode}${req.params.episode_id}`)
    const $ = cheerio.load(data)

    resContent.title = $('.anime_video_body').children('h1').text()
    resContent.og_title = resContent.title
    resContent.media_url = $('iframe').attr('src').toString()
    
    let pvfContent = '_'
    try{
        let previousEpFullRefList = $('.anime_video_body_episodes_l').children('a')['0'].attribs.href.split('/')
        pvfContent = previousEpFullRefList[previousEpFullRefList.length - 1]
    }catch (e){
        console.log(e)
    }finally{
        resContent.previousEp = pvfContent
    }

    let nxtContent = '_'
    try{
        let nextEpFullRefList = $('.anime_video_body_episodes_r').children('a')['0'].attribs.href.split('/')
        nxtContent = nextEpFullRefList[nextEpFullRefList.length - 1]
    }catch (e){
        console.log(e)
    }finally{
        resContent.nextEp = nxtContent
    }

    let anmContent = '_'
    try{
        let animeFullRefList = $('.anime-info').children('a')['0'].attribs.href.split('/')
        anmContent = animeFullRefList[animeFullRefList.length - 1]
    }catch (e){
        console.log(e)
    }finally{
        resContent.anime = anmContent
    }

    res.render('episode', resContent)
}

//com/scrape-query/search/:query
const search = async function (req, res){
    resContent = {
        query: req.params.query,
        og_title: 'Results for \' ' + req.params.query + '\' on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
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

    res.render('search', resContent)
}

module.exports = {
    popular,
    anime,
    episode,
    search,
}