require('dotenv').config();
const http = require('http')
const cors = require('cors')
const express = require('express')
var bodyParser = require('body-parser')

const app = express()
app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.use(cors())
const routes = require('./routes')
app.use(routes)
app.use(express.static('public'))

const httpServer = http.createServer(app)
httpServer.listen(process.env.PORT)

module.exports = { app }