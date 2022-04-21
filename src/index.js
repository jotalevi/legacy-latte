//Require any needed dependencie
const http = require('http');
const cors = require('cors');
const config = require('./config');
const express = require('express');
var bodyParser = require('body-parser');

//Define some consts
const PORT = config.port;

//Define service routes
const app = express();
app.set('view engine', 'pug')
app.use(cors());
app.use(bodyParser.json());
const routes = require('./routes');
app.use(routes);
app.use(express.static('public'))

//Start http server
const httpServer = http.createServer(app);
httpServer.listen(PORT);

//Export the module just in case
module.exports = { app };