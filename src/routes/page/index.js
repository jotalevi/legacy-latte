const express = require('express')
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

module.exports = router