const { ENDPOINTS } = require("./constants");
const controller = require('../controller')
const app = require('../app.js')
const { verifyToken } = require("./authentication");

app.post(ENDPOINTS.SIGNUP, controller.signUp)
app.post(ENDPOINTS.LOGIN, controller.login)
app.get(ENDPOINTS.ME, verifyToken, controller.getCurrentUser)
app.post(ENDPOINTS.UPDATE_PASSWORD, verifyToken, controller.updatePassword)
app.get(ENDPOINTS.USER, verifyToken, controller.getUserByID)
app.post(ENDPOINTS.USER_LIKE, verifyToken, controller.likeUser)
app.post(ENDPOINTS.USER_UNLIKE, verifyToken, controller.dislikeUser)
app.get(ENDPOINTS.MOST_LIKED, verifyToken, controller.mostLiked)