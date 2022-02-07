const {sequelize, User, Like} = require('./config/sequelize.js')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const {use} = require("express/lib/router");

const signUp = async (req, res, next) => {
    try {
        let {firstName, lastName, username, email, password} = req.body
        password = await bcrypt.hash(password, 10)

        const create = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        })

        res.send(OK('Signup success!', create))
    } catch (e) {
        res.send(NOK(e.errors[0].message))
    }
    // return res
    // let result = await sequelize.query('CALL signup(:p_firstName, :p_lastName, :p_username, :p_email, :p_password)', {
    //     replacements: {
    //         p_firstName: firstName ?? null,
    //         p_lastName: lastName ?? null,
    //         p_username: username ?? null,
    //         p_email: email ?? null,
    //         p_password: password ?? null
    //     }
    // })
    //
    // return result[0]
}

const login = async (req, res, next) => {
    let {username, password} = req.body
    const user = await User.findOne({where: {username: username ?? null}})

    if(!user) res.send(NOK("Username does not exist"))
    if (!await bcrypt.compare(password, user.password)) res.send(NOK('The password is incorrect'))

    let jwt_token = jwt.sign(
        {
            user_id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '2h'
        }
    )

    let response = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        jwt_token: jwt_token
    }

    res.send(OK('Login successful', response))

    // if (!password)
    //     return {
    //         response_flag: 'NOK',
    //         response_message: 'Password is required!'
    //     }
    //
    // let loginResult = await sequelize.query('CALL login(:p_username)', {
    //     replacements: {
    //         p_username: username ?? null
    //     }
    // })
    //
    // loginResult = loginResult[0]
    //
    // if (loginResult.response_flag === 'NOK')
    //     return {
    //         response_flag: loginResult.response_flag,
    //         response_message: loginResult.response_message
    //     }
    //
    // if (!await bcrypt.compare(password, loginResult.password))
    //     return {
    //         response_flag: 'NOK',
    //         response_message: 'The password provided is incorrect!'
    //     }
    //
    // let jwt_token = jwt.sign(
    //     {
    //         user_id: loginResult.id,
    //         firstName: loginResult.firstName,
    //         lastName: loginResult.lastName,
    //         username: loginResult.username,
    //         email: loginResult.email,
    //     },
    //     process.env.JWT_KEY,
    //     {
    //         expiresIn: '2h'
    //     }
    // )
    //
    // return {
    //     response_flag: 'OK',
    //     response_message: 'Login successful!',
    //     jwt_token: jwt_token
    // }
}

const updatePassword = async (req, res, next) => {
    const userData = res.user
    const {oldPassword, newPassword, newPasswordRepeat} = req.body

    let userResult = await sequelize.query('CALL getUser(:p_user_id)', {
        replacements: {
            p_user_id: userData.user_id
        }
    })
    userResult = userResult[0]

    if(userResult.response_flag === 'NOK')
        res.send(NOK(userResult.response_message))
    if(!oldPassword || !newPassword || !newPasswordRepeat)
        res.send(NOK('All fields are required!'))
    if (!await bcrypt.compare(oldPassword, userResult.password))
        res.send(NOK('The old password is not correct!'))
    if(newPassword !== newPasswordRepeat)
        res.send(NOK('The new password do not match!'))

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    let updateResult = await sequelize.query('CALL updatePassword(:p_user_id, :p_new_password)', {
        replacements: {
            p_user_id: userData.user_id,
            p_new_password: newPasswordHash
        }
    })

    if(updateResult.response_flag === 'NOK')
        res.send(NOK(userResult.response_message))

    res.send(updateResult[0])
}

const getUserByID = async (req, res, next) => {
    // const userID = res.user.user_id
    const userID = req.params.id

    const result = await sequelize.query('CALL getUserByID(:p_id)', {
        replacements: {
            p_id: userID
        }
    })

    res.send(result[0])
}

const likeUser = async (req, res, next) => {
    const liker_id = res.user.user_id
    const user_id = req.params.id

    const result = await sequelize.query('CALL likeUser(:p_user_id, :p_liker_id)', {
        replacements: {
            p_user_id: user_id,
            p_liker_id: liker_id
        }
    })

    res.send(result[0])
}

const dislikeUser = async (req, res, next) => {
    const liker_id = res.user.user_id
    const user_id = req.params.id

    const result = await sequelize.query('CALL dislikeUser(:p_user_id, :p_liker_id)', {
        replacements: {
            p_user_id: user_id,
            p_liker_id: liker_id
        }
    })

    res.send(result[0])
}

const mostLiked = async (req, res, next) => {
    const query = "SELECT u.username, COUNT(l.user_id) AS likes FROM users u LEFT JOIN likes l ON l.user_id = u.id GROUP BY u.username ORDER BY likes DESC"
    const result = await sequelize.query(query, {
        plain: false,
        raw: true
    })

    console.log(result[0])
}

const NOK = (message) => {
    return {
        response_flag: 'NOK',
        response_message: message
    }
}

const OK = (message, data = null) => {
    return {
        response_flag: 'OK',
        response_message: message,
        data: data
    }
}

module.exports = {
    signUp,
    login,
    updatePassword,
    getUserByID,
    likeUser,
    dislikeUser,
    mostLiked
}