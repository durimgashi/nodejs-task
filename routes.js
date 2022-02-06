const {ENDPOINTS} = require("./utils/constants");
const controller = require('./controller')
const app = require('./app.js')
const {verifyToken} = require("./utils/authentication");

app.post(ENDPOINTS.SIGNUP, async (req, res) => {
    res.send(await controller.signUp(req.body))
})

app.post(ENDPOINTS.LOGIN, async (req, res) => {
    res.send(await controller.login(req.body))
})

app.get(ENDPOINTS.ME, verifyToken, async (req, res) => {
    res.send(res.user)
})
app.post(ENDPOINTS.UPDATE_PASSWORD, verifyToken, controller.updatePassword)
app.get(ENDPOINTS.USER, verifyToken, controller.getUserByID)