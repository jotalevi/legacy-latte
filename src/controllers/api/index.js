const fs = require('fs');
const axios = require('axios')
const cheerio = require('cheerio')
const utils = require('../../utils');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//com/api/popular/:page_no
const popular = async (req, res) => {
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

    renderOrJson(req, res, resContent, 'popular')
}

//com/api/anime/:anime_id
const anime = async (req, res) => {
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

    renderOrJson(req, res, resContent, 'anime')
}

//com/api/episode/:episode_id
const episode = async (req, res) => {
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

    renderOrJson(req, res, resContent, 'episode')
}

//com/api/search/:query
const search = async (req, res) => {
    resContent = {
        query: req.params.query,
        og_title: 'Results for \' ' + req.params.query + '\' on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
        matches: 0,
        user: req.user
    }

    const { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_SEARCH}${req.params.query}`)
    const $ = cheerio.load(data)

    const items = $('.items>li')
    rslist = []
    items.each(function (idx, el) {
        let anime = {}
        anime.id = $(el).children().children().attr('href').replace('/category/', '')
        anime.thumbnail = $(el).children().children().children().attr('src')
        anime.title = $(el).children('.name').children().text()
        rslist.push(anime)
    })
    resContent.results = rslist
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

    renderOrJson(req, res, resContent, 'search')
}

//:/api/auth
const auth = async (req, res) => {
    let user = await utils.models.User.findOne({ token: req.body.token.toString() })

    if (user === null)
        res.sendStatus(403)
    else
        if (req.body.as_api != undefined) {
            res.send(jwt.sign(JSON.stringify(user), process.env.JWT_SECRET))
        } else {
            let token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
            res.render('redirHandle', {destination: '/', cookies: [{name:'token', path: '/', value: token}]})
        }
}

const register = async (req, res) => {
    let newUser = new utils.models.User(
        {
            username: req.body.username,
            token: req.body.token,
            mail: req.body.mail,
        }
    )

    if (req.body.as_api != undefined) {
        newUser.save().then(res.send(jwt.sign(JSON.stringify(newUser), process.env.JWT_SECRET)))
    } else {
        await newUser.save()
        let token = jwt.sign(JSON.stringify(newUser), process.env.JWT_SECRET)
        res.render('redirHandle', {destination: '/', cookies: [{name:'token', path: '/', value: token}]})
    }
}

const getAnDataAsync = async (user, element) => {
    let animeData = {
        id: element.anime_id,
        seen: [],
        title: '',
        thumbnail: '',
        number_of_episodes: 0
    }

    if (user != null) {
        let seenData = await utils.models.SeenBy.find({
            _user_id: user.id,
            anime_id: element.anime_id,
        })
        slist = []
        if (seenData != null) {
            seenData.forEach(item => {
                slist.push(item.episd_id)
            })
        }
        animeData.seen = slist
    }

    let { data } = await axios.get(`${process.env.SCRAPE_URL}${process.env.PATH_ANIME}${element.anime_id}`)
    let $ = cheerio.load(data)

    let animeInfo = $('.anime_info_body_bg')
    animeData.title = animeInfo.children('h1').text()
    animeData.thumbnail = animeInfo.children('img').attr('src')

    let animeEpCounter = $('#episode_page')
    epCounter = parseInt(animeEpCounter.children('li').last().text().split('-')[1])
    animeData.number_of_episodes = epCounter

    return animeData
}

//:/profile
const profile = async (req, res) => {
    if (req.user != null) {
        let seenData = await utils.models.SeenBy.find({_user_id: req.user.id}, null, {sort: {date: -1}})
        seenData = seenData.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.anime_id === value.anime_id
            ))
        ).reverse()

        let promiseList = []
        seenData.forEach((element) => {
            promiseList.push(getAnDataAsync(req.user, element))
        })
        let animSeen = await Promise.all(promiseList)

        resContent = {
            user: req.user,
            seen_list: animSeen,
        }
        
        renderOrJson(req, res, resContent, 'profile')
    } else {
        await login(req, res)
    }
}

//:/share/:episode_id
const share = async (req, res) => {
    let session = new utils.models.TrxSession({
        _user_id: (req.user == null ? '_' : req.user.id), 
        episd_id: req.params.episode_id,
        tx_token: utils.quickTk(6),
    })
    await session.save()
    
    resContent = {
        og_title: 'Watch anime for free on UnLatte',
        og_image: 'https://unlatte.cl/image/preview.png',
        user: req.user,
        tx_session: session,
    }

    renderOrJson(req, res, resContent, 'share')
}

//:/trx
const trxInput = async (req, res) => {
    renderOrJson(req, res, {}, 'trx')
}

//:/trx/:token
const trxRedir = async (req, res) => {
    let trxSession = (await utils.models.TrxSession.find({tx_token: req.params.token}))[0]
    let user = await utils.models.User.findById(trxSession._user_id)
    let token = await jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
    res.render('redirHandle', {destination: '/episode/' + trxSession.episd_id, cookies: [{name:'token', path: '/', value: token}]})
}

const renderOrJson = async (req, res, resContent, page) => {
    if (req.originalUrl.split('/')[1] != 'api') {
        res.render(page, resContent)
    } else {
        delete resContent?.user?.token
        delete resContent?.og_title
        delete resContent?.og_image
        res.json(resContent)
    }
}

module.exports = {
    popular,
    anime,
    episode,
    search,
    auth,
    register,
    profile,
    share,
    trxInput,
    trxRedir,
}