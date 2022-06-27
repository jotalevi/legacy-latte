const express = require('express')
const { PageLoadStrategy } = require('selenium-webdriver/lib/capabilities')
const router = express.Router({ mergeParams: true })
const pageController = require('../../controllers/page')

router.route('/')
    .get(pageController.popular)

router.route('/popular/:page_no')
    .get(pageController.popular)

router.route('/anime/:anime_id')
    .get(pageController.anime)

router.route('/episode/:episode_id')
    .get(pageController.episode)

router.route('/search/:query')
    .get(pageController.search)

router.route('/register')
    .get(pageController.register)

router.route('/login')
    .get(pageController.login)

router.route('/profile')
    .get(pageController.profile)

router.route('/share/:episode_id')
    .get(pageController.share)

router.route('/trx')
    .get(pageController.trxInput)

router.route('/trx/:token')
    .get(pageController.trxRedir)

module.exports = router