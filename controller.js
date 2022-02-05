const {sequelize} = require('./config/sequelize.js')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const signUp = async (data) => {
    let {firstName, lastName, username, email, password} = data
    password = await bcrypt.hash(password, 10)

    let result = await sequelize.query('CALL signup(:p_firstName, :p_lastName, :p_username, :p_email, :p_password)', {
        replacements: {
            p_firstName: firstName ?? null,
            p_lastName: lastName ?? null,
            p_username: username ?? null,
            p_email: email ?? null,
            p_password: password ?? null
        }
    })

    return result[0]
}

const login = async (data) => {
    let {username, password} = data

    if (!password)
        return {
            response_flag: 'NOK',
            response_message: 'Password is required!'
        }

    let loginResult = await sequelize.query('CALL login(:p_username)', {
        replacements: {
            p_username: username ?? null
        }
    })

    loginResult = loginResult[0]

    if (loginResult.response_flag === 'NOK')
        return {
            response_flag: loginResult.response_flag,
            response_message: loginResult.response_message
        }

    if (!await bcrypt.compare(password, loginResult.password))
        return {
            response_flag: 'NOK',
            response_message: 'The password provided is incorrect!'
        }

    let jwt_token = jwt.sign(
        {
            user_id: loginResult.id,
            firstName: loginResult.firstName,
            lastName: loginResult.lastName,
            username: loginResult.username,
            email: loginResult.email,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '2h'
        }
    )

    return {
        response_flag: 'OK',
        response_message: 'Login successful!',
        jwt_token: jwt_token
    }
}

module.exports = {
    signUp,
    login
}