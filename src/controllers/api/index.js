const fs = require('fs');
const axios = require('axios')
const cheerio = require('cheerio')
const utils = require('../../utils');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//com/api/popular/:page_no
const popular = async function (req, res) {
    resContent = {
        page: isNaN(parseInt(req.params.page_no)) ? 1 : parseInt(req.params.page_no),
        og_title: 'Watch anime for free on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
        results: [],
        user: req.user
    }

    const { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_POPULAR}${req.params.page_no}`)
    const $ = cheerio.load(data)

    const items = $('.items>li')
    items.each(function (idx, el) {
        let anime = {}
        anime.id = $(el).children().children().attr('href').replace('/category/', '')
        anime.thumbnail = $(el).children().children().children().attr('src')
        anime.title = $(el).children('.name').children().text()
        resContent.results.push(anime)
    })

    if (req.originalUrl.split('/')[1] != 'api')
        res.render('popular', resContent)
    else
        res.send(resContent)
}

//com/api/anime/:anime_id
const anime = async function (req, res) {
    resContent = {
        anime: req.params.anime_id,
        og_title: '',
        og_image: '',
        user: req.user,
        info: '',
        seen: []
    }

    if (req.user != null) {
        let seenData = await utils.models.SeenBy.find({
            _user_id: req.user.id,
            anime_id: resContent.anime,
        })

        if (seenData != null) {
            seenData.forEach(item => {
                resContent.seen.push(item.episd_id)
            })
        }
    }

    //https://www3.gogoanime.cm/category/naruto-shippuuden-dub
    const { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_ANIME}${req.params.anime_id}`)
    const $ = cheerio.load(data)

    const animeInfo = $('.anime_info_body_bg')
    resContent.title = animeInfo.children('h1').text()
    resContent.thumbnail = animeInfo.children('img').attr('src')

    let aInfoTag = animeInfo.children('.type')
    resContent.type = aInfoTag[0].children[2].attribs.title
    resContent.info = aInfoTag[1].children[1].data

    const animeEpCounter = $('#episode_page')
    epCounter = parseInt(animeEpCounter.children('li').last().text().split('-')[1])
    resContent.number_of_episodes = epCounter

    resContent.episodes = []
    for (let i = 1; i <= epCounter; i++) {
        resContent.episodes.push(`${req.params.anime_id}-episode-${i}`)
    }

    if (req.originalUrl.split('/')[1] != 'api')
        res.render('anime', resContent)
    else
        res.send(resContent)
}

//com/api/episode/:episode_id
const episode = async function (req, res) {
    resContent = {
        episode: req.params.episode_id,
        og_image: 'https://unlatte.cl/image/preview.png',
        og_title: '',
        user: req.user
    }

    const { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_EPISODE}${req.params.episode_id}`)
    const $ = cheerio.load(data)

    resContent.title = $('.anime_video_body').children('h1').text()
    resContent.media_url = $('iframe').attr('src').toString()

    let pvfContent = '_'
    try {
        let previousEpFullRefList = $('.anime_video_body_episodes_l').children('a')['0'].attribs.href.split('/')
        pvfContent = previousEpFullRefList[previousEpFullRefList.length - 1]
    } catch (e) {
        console.log(e)
    } finally {
        resContent.previousEp = pvfContent
    }

    let nxtContent = '_'
    try {
        let nextEpFullRefList = $('.anime_video_body_episodes_r').children('a')['0'].attribs.href.split('/')
        nxtContent = nextEpFullRefList[nextEpFullRefList.length - 1]
    } catch (e) {
        console.log(e)
    } finally {
        resContent.nextEp = nxtContent
    }

    let anmContent = '_'
    try {
        let animeFullRefList = $('.anime-info').children('a')['0'].attribs.href.split('/')
        anmContent = animeFullRefList[animeFullRefList.length - 1]
    } catch (e) {
        console.log(e)
    } finally {
        resContent.anime = anmContent
    }

    if (req.user != null) {
        let seenData = await utils.models.SeenBy.findOne({
            _user_id: req.user.id,
            anime_id: resContent.anime,
            episd_id: resContent.episode
        })

        if (seenData == undefined) {
            new utils.models.SeenBy({
                _user_id: req.user.id,
                anime_id: resContent.anime,
                episd_id: resContent.episode
            }).save()
        }
    }

    if (req.originalUrl.split('/')[1] != 'api')
        res.render('episode', resContent)
    else
        res.send(resContent)
}

//com/api/search/:query
const search = async function (req, res) {
    resContent = {
        query: req.params.query,
        og_title: 'Results for \' ' + req.params.query + '\' on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
        matches: 0,
        results: [],
        user: req.user
    }

    const { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_SEARCH}${req.params.query}`)
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

    let resFilterHandle = []
    resContent.results.forEach(animeInResult => {
        let unique = true
        resFilterHandle.forEach(animeInFiltered => {
            if (animeInFiltered.id === animeInResult.id) {
                unique = false
            }
        })
        if (unique)
            resFilterHandle.push(animeInResult)
    });
    resContent.results = resFilterHandle

    if (req.originalUrl.split('/')[1] != 'api')
        res.render('search', resContent)
    else
        res.send(resContent)
}

//:/api/auth
const auth = async function (req, res) {
    let user = await utils.models.User.findOne({ token: req.body.token.toString() })

    if (user === null)
        res.sendStatus(403)
    else
        if (req.body.as_api != undefined) {
            res.send(jwt.sign(JSON.stringify(user), process.env.JWT_SECRET))
        } else {
            res.render('setTokenAndRedir', { jwt: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET) })
        }

}

const register = async function (req, res) {
    let newUser = new utils.models.User(
        {
            username: req.body.username,
            token: utils.cyrb53(req.body.username + req.body.password).toString(),
            mail: req.body.mail,
        }
    )

    if (req.body.as_api != undefined) {
        newUser.save().then(res.send(jwt.sign(JSON.stringify(newUser), process.env.JWT_SECRET)))

    } else {
        newUser.save().then(res.render('setTokenAndRedir', { jwt: jwt.sign(JSON.stringify(newUser), process.env.JWT_SECRET) }))
    }
}

//:/api/logs
const getLogData = async function (req, res) {
    res.json(JSON.parse(fs.readFileSync('public/data/reqlog.json')))
}

module.exports = {
    popular,
    anime,
    episode,
    search,
    getLogData,
    auth,
    register
}