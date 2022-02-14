const { ENDPOINTS } = require("./constants");
const controller = require('./controller')
const app = require('../app.js')
const { verifyToken } = require("./authentication");
const {sequelize} = require("../config/sequelize.js");
require('dotenv').config();
const port = process.env.PORT

app.post(ENDPOINTS.SIGNUP, controller.signUp)
app.post(ENDPOINTS.LOGIN, controller.login)
app.get(ENDPOINTS.ME, verifyToken, controller.getCurrentUser)
app.put(ENDPOINTS.UPDATE_PASSWORD, verifyToken, controller.updatePassword)
app.get(ENDPOINTS.USER, verifyToken, controller.getUserByID)
app.post(ENDPOINTS.USER_LIKE, verifyToken, controller.likeUser)
app.delete(ENDPOINTS.USER_UNLIKE, verifyToken, controller.dislikeUser)
app.get(ENDPOINTS.MOST_LIKED, verifyToken, controller.mostLiked)

app.listen(port, async () => {
    console.log('Server is up and running on port: ', port);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.')
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.")
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
})