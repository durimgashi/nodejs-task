const request = require('supertest')
const app = require('../app')
const controller = require('../controller')
const {sequelize} = require('../config/sequelize')
const User = require('../models/User')
const Like = require('../models/Like')

let token

beforeAll(async () => {
    await sequelize .query('SET FOREIGN_KEY_CHECKS = 0', {})
    await Like.truncate({ cascade: true })
    await User.truncate({ cascade: true })
});


// /signup - tests

test('Should signup a new user', async () => {
    await request(app).post('/signup').send({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "johndoe@test.com",
        password: "Password123++"
    }).expect((res) => {
        expect(res.body.response_flag).toBe('OK')
    }).expect(200)

    await request(app).post('/signup').send({
        firstName: "Jane",
        lastName: "Doe",
        username: "janedoe",
        email: "janedoe@test.com",
        password: "Password123++"
    })
})

test('Should try to signup user with duplicate username and email', async () => {
    const duplicateRequset = await request(app).post('/signup').send({
        firstName: "Jane",
        lastName: "Doe",
        username: "janedoe",
        email: "janedoe@test.com",
        password: "Password123++"
    })

    expect(duplicateRequset.status).toBe(409)
    expect(duplicateRequset.body.response_flag).toBe('NOK')
    expect(duplicateRequset.body.response_message).toBe('This username is taken')
})

test('Should try to signup user with missing fields', async () => {
    const duplicateRequset = await request(app).post('/signup').send({ firstName: "Jane", lastName: "Doe" })

    expect(duplicateRequset.status).toBe(400)
    expect(duplicateRequset.body.response_flag).toBe('NOK')
    expect(duplicateRequset.body.response_message).toBe('All fields are required!')
})

// /login - tests

test('Should login a user', async () => {
    const loginRequest = await request(app).post('/login').send({ username: "johndoe", password: "Password123++" })

    expect(loginRequest.status).toBe(200)
    expect(loginRequest.body.response_flag).toBe('OK')
    token = loginRequest.body.data.jwt_token
})

test('Should try to login a user with an invalid username', async () => {
    const loginRequest = await request(app).post('/login').send({username: "jamesdoe", password: "Password123++"})

    expect(loginRequest.status).toBe(404)
    expect(loginRequest.body.response_flag).toBe('NOK')
    expect(loginRequest.body.response_message).toBe('Username does not exist')
})

test('Should try to login a user with an incorrect password', async () => {
    const loginRequest = await request(app).post('/login').send({username: "johndoe", password: "Password456++"})

    expect(loginRequest.status).toBe(401)
    expect(loginRequest.body.response_flag).toBe('NOK')
    expect(loginRequest.body.response_message).toBe('The password is incorrect')
})

// /me - tests

test('Should get the current user', async () => {
    await request(app).get('/me').set('Authorization', 'Bearer ' + token)
        .expect((res) => { expect(res.body.data.username).toBe('johndoe') }).expect(200)
})

test('Should get the current user without providing an invalid JWT token', async () => {
    const invalidRequest = await request(app).get('/me').set('Authorization', 'Bearer INVALID_JWT_TOKEN')

    expect(invalidRequest.status).toBe(401)
    expect(invalidRequest.body.response_flag).toBe('NOK')
    expect(invalidRequest.body.response_message).toBe('The token provided is invalid')
})

test('Should get the current user without providing a JWT token', async () => {
    const invalidRequest = await request(app).get('/me')

    expect(invalidRequest.status).toBe(403)
    expect(invalidRequest.body.response_flag).toBe('NOK')
    expect(invalidRequest.body.response_message).toBe('Not authorized')
})

// /me/update-password - tests

test('Should update password', async () => {
    const updateRequest = await request(app)
        .put('/me/update-password')
        .set('Authorization', 'Bearer ' + token)
        .send({
            "oldPassword": "Password123++",
            "newPassword": "Password456++",
            "newPasswordRepeat": "Password456++"
        })

    expect(updateRequest.status).toBe(200)
    expect(updateRequest.body.response_flag).toBe('OK')
    expect(updateRequest.body.response_message).toBe('Password updated succesfully')
})

test('Should try to update password with missing fields', async () => {
    const updateRequest = await request(app)
        .put('/me/update-password')
        .set('Authorization', 'Bearer ' + token)
        .send({
            "oldPassword": "Password123++",
        })

    expect(updateRequest.status).toBe(400)
    expect(updateRequest.body.response_flag).toBe('NOK')
    expect(updateRequest.body.response_message).toBe('All fields are required!')
})

test('Should try to update password with incorrect old password', async () => {
    const updateRequest = await request(app)
        .put('/me/update-password')
        .set('Authorization', 'Bearer ' + token)
        .send({
            "oldPassword": "Password123456++",
            "newPassword": "Password456++",
            "newPasswordRepeat": "Password456++"
        })

    expect(updateRequest.status).toBe(401)
    expect(updateRequest.body.response_flag).toBe('NOK')
    expect(updateRequest.body.response_message).toBe('The old password is not correct!')
})

// /user/{id} - tests

test('Should get user with ID : 2 ', async () =>{
    const userResponse =  await request(app).get('/user/2').set('Authorization', 'Bearer ' + token)

    expect(userResponse.body.response_flag).toBe('OK')
    expect(userResponse.body.response_message).toBe('Success')
    expect(userResponse.body.data.username).toBe('janedoe')
})

test('Should try to get unexisting user with ID : 3 ', async () =>{
    const userResponse =  await request(app).get('/user/3').set('Authorization', 'Bearer ' + token)

    expect(userResponse.status).toBe(404)
    expect(userResponse.body.response_flag).toBe('NOK')
    expect(userResponse.body.response_message).toBe('User does not exist!')
})

// /user/{id}/like - tests

test('Should like user with ID : 2', async () =>{
    const likeUser = await request(app).post('/user/2/like').set('Authorization', 'Bearer ' + token)

    expect(likeUser.status).toBe(200)
    expect(likeUser.body.response_flag).toBe('OK')
    expect(likeUser.body.response_message).toBe('You have successfully liked the user!')
})

test('Should try to like user that does not exist', async () =>{
    const likeUser = await request(app).post('/user/3/like').set('Authorization', 'Bearer ' + token)

    expect(likeUser.status).toBe(404)
    expect(likeUser.body.response_flag).toBe('NOK')
    expect(likeUser.body.response_message).toBe('User does not exist!')
})

test('Should try to like user with ID : 2 again', async () =>{
    const likeUser = await request(app)
        .post('/user/2/like')
        .set('Authorization', 'Bearer ' + token)

    expect(likeUser.status).toBe(409)
    expect(likeUser.body.response_flag).toBe('NOK')
    expect(likeUser.body.response_message).toBe('You have already liked this user!')
})

// /user/{id}/unlike

test('Should unlike user with ID : 2', async () =>{
    const unlikeUser = await request(app)
        .delete('/user/2/unlike')
        .set('Authorization', 'Bearer ' + token)

    expect(unlikeUser.status).toBe(200)
    expect(unlikeUser.body.response_flag).toBe('OK')
    expect(unlikeUser.body.response_message).toBe('You have successfully unliked the user!')
})

test('Should unlike a user that does not exist', async () =>{
    const unlikeUser = await request(app).delete('/user/3/unlike').set('Authorization', 'Bearer ' + token)

    expect(unlikeUser.status).toBe(404)
    expect(unlikeUser.body.response_flag).toBe('NOK')
    expect(unlikeUser.body.response_message).toBe('User does not exist!')
})

test('Should unlike user with ID : 2 that has not been liked before', async () =>{
    const unlikeUser = await request(app).delete('/user/2/unlike').set('Authorization', 'Bearer ' + token)

    expect(unlikeUser.status).toBe(409)
    expect(unlikeUser.body.response_flag).toBe('NOK')
    expect(unlikeUser.body.response_message).toBe('You have not liked this user!')
})

test('Should get users and likes', async () =>{
    const mostLiked = await request(app)
        .get('/most-liked')
        .set('Authorization', 'Bearer ' + token)

    expect(mostLiked.status).toBe(200)
    expect(mostLiked.body.response_flag).toBe('OK')
    expect(mostLiked.body.response_message).toBe('Success')
})