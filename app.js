const { ENDPOINTS } = require('./Utils/constants.js')
const express = require('express')
const app = express()
const port = 3000

app.post(ENDPOINTS.SIGNUP, (req, res) => {

})

app.get(ENDPOINTS.LOGIN, (req, res) => {

})

app.get(ENDPOINTS.USER, (req, res) => {

})



app.listen(port, () => {
    console.log('Server is up and running on port: ', 3000);    
})