const {ENDPOINTS} = require("./utils/constants");
const controller = require('./controller')
const app = require('./app.js')

app.post(ENDPOINTS.SIGNUP, async (req, res) => {
    res.send(await controller.signUp(req.body))
})

app.post(ENDPOINTS.LOGIN, async (req, res) => {
    res.send(await controller.login(req.body))
})

app.get(ENDPOINTS.USER, (req, res) => {

})