const { ENDPOINTS } = require('./utils/constants.js')
const {sequelize, User} = require('./config/sequelize.js')
const express = require('express')
const app = module.exports = express()
require('dotenv').config();
const port = 3000

app.use(express.json())
// app.use(app.router);
require('./routes')

app.listen(port, async () => {
    console.log('Server is up and running on port: ', 3000);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.')

        await sequelize.sync();
        console.log("All models were synchronized successfully.")
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
})

console.log(process.env.JWT_KEY)

module.exports = {
    app
}
