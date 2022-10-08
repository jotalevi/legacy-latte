const express = require('express')
const api = require('./api')
const page = require('./page')
const utils = require('../utils')

const router = express.Router()

router.use(utils.chToken)

router.use(`${process.env.API_PATH}`, api)
router.use(`${process.env.PAGE_PATH}`, page)

module.exports = router