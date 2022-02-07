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
}

const login = async (req, res, next) => {
    let {username, password} = req.body
    const user = await User.findOne({where: {username: username ?? null}})

    if(!user) return res.send(NOK("Username does not exist"))
    if (!await bcrypt.compare(password, user.password)) return res.send(NOK('The password is incorrect'))

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
}

const getCurrentUser = async (req, res, next) => {
    res.send(req.user)
}

const updatePassword = async (req, res, next) => {
    const userData = res.user
    const {oldPassword, newPassword, newPasswordRepeat} = req.body
    const userResult = await User.findOne({ where: { id: userData.user_id } })

    if(!oldPassword || !newPassword || !newPasswordRepeat)
        return res.send(NOK('All fields are required!'))
    if (!await bcrypt.compare(oldPassword, userResult.password))
        return res.send(NOK('The old password is not correct!'))
    if(newPassword !== newPasswordRepeat)
        return res.send(NOK('The new password do not match!'))

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    let updateResult = await User.update({password: newPasswordHash}, {  where: { id: userData.user_id  } })

    if(updateResult) return res.send(OK('Password updated succesfully'))
}

const getUserByID = async (req, res, next) => {
    const userID = req.params.id

    const user = await sequelize.query('SELECT ' +
                                                '"OK" AS response_flag, ' +
                                                'u.username AS username, ' +
                                                'IFNULL(COUNT(l.user_id), 0) AS likes ' +
                                            'FROM users u ' +
                                                'LEFT JOIN likes l ON l.user_id = u.id ' +
                                            'WHERE l.user_id = ' + userID, {})

    if(user) return res.send(OK('Success', user[0]))
    res.send(NOK('User does not exist!'))
}

const likeUser = async (req, res, next) => {
    const liker_id = res.user.user_id
    const user_id = req.params.id
    const userCheck = await User.findOne({ where: { id: user_id }})

    if(!userCheck) return res.send(NOK('User does not exist!'))
    const likeCheck = await Like.findOne({
        where: {
            user_id: user_id,
            liker_id: liker_id
        }
    })

    if (likeCheck) return res.send(NOK('You have already liked this user!'))
    const likeCreate = await Like.create({
        user_id: user_id,
        liker_id: liker_id
    })

    res.send(OK('You have successfully liked the user!', likeCreate))
}

const dislikeUser = async (req, res, next) => {
    const liker_id = res.user.user_id
    const user_id = req.params.id

    const userCheck = await User.findOne({
        where: {
            id: user_id
        }
    })

    if(!userCheck) return res.send(NOK('User does not exist!'))

    const likeCheck = await Like.findOne({
        where: {
            user_id: user_id,
            liker_id: liker_id
        }
    })

    if (!likeCheck)
        return res.send(NOK('You have not liked this user!'))

    const likeCreate = await Like.destroy({
        where: {
            user_id: user_id,
            liker_id: liker_id
        },
        truncate: false
    })

    res.send(OK('You have successfully unliked the user!'))
}

const mostLiked = async (req, res, next) => {
    const query = "SELECT " +
                        "u.username, " +
                        "COUNT(l.user_id) AS likes " +
                  "FROM users u " +
                        "LEFT JOIN likes l ON l.user_id = u.id " +
                  "GROUP BY u.username " +
                  "ORDER BY likes DESC"
    const result = await sequelize.query(query, {
        plain: false,
        raw: true
    })

    res.send(OK('Success', result[0]))
}

const NOK = (message) => {
    return {
        response_flag: 'NOK',
        response_message: message
    }
}

const OK = (message, data = null) => {
    if(data)
        return {
            response_flag: 'OK',
            response_message: message,
            data: data
        }
    return {
        response_flag: 'OK',
        response_message: message
    }
}

module.exports = {
    signUp,
    login,
    getCurrentUser,
    updatePassword,
    getUserByID,
    likeUser,
    dislikeUser,
    mostLiked
}