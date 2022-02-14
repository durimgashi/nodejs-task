const { ENDPOINTS } = require('./utils/constants.js')
const {sequelize, User} = require('./config/sequelize.js')
const express = require('express')
const app = module.exports = express()
//const port = 3000
require('dotenv').config();

app.use(express.json())

require('./utils/routes')

module.exports = app
