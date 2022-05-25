const express = require('express')
const api = require('./api')
const page = require('./page')
const utils = require('../utils')
const config = require('../config')

const router = express.Router()

router.use(utils.reqlog)
router.use(utils.chToken)

router.use(`${config.api_path}`, api)
router.use(`${config.page_path}`, page)

module.exports = router