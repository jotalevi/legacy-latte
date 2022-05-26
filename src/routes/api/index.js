const express = require('express')
const router = express.Router({ mergeParams: true })
const apiController = require('../../controllers/api')

router.route('/popular/:page_no')
    .get(apiController.popular)

router.route('/popular')
    .get(apiController.popular)

router.route('/anime/:anime_id')
    .get(apiController.anime)

router.route('/episode/:episode_id')
    .get(apiController.episode)

router.route('/search/:query')
    .get(apiController.search)

router.route('/auth')
    .post(apiController.auth)

router.route('/register')
    .post(apiController.register)

router.route('/logs')
    .get(apiController.getLogData)

module.exports = router