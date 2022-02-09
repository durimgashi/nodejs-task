const request = require('supertest')
const app = require('../app')
const controller = require('../controller')
const {User, Like, sequelize} = require('../config/sequelize')

let token

beforeAll(async () => {
    await sequelize .query('SET FOREIGN_KEY_CHECKS = 0', {})
    await Like.truncate({ cascade: true })
    await User.truncate({ cascade: true })
});

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

test('Should login a user', async () => {
    const loginRequest = await request(app).post('/login').send({ username: "johndoe", password: "Password123++" })

    expect(loginRequest.status).toBe(200)
    expect(loginRequest.body.response_flag).toBe('OK')

    token = loginRequest.body.data.jwt_token
})

test('Should get the current user', async () => {
    await request(app)
        .get('/me')
        .set('Authorization', 'Bearer ' + token)
        .expect((res) => {
            expect(res.body.username).toBe('johndoe')
        }).expect(200)
})

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

test('Should get user with ID : 2 ', async () =>{
    const userResponse =  await request(app).get('/user/2').set('Authorization', 'Bearer ' + token)

    expect(userResponse.body.response_flag).toBe('OK')
    expect(userResponse.body.response_message).toBe('Success')
    expect(userResponse.body.data[0].username).toBe('janedoe')
})

test('Should like user with ID : 2', async () =>{
    const likeUser = await request(app)
        .post('/user/2/like')
        .set('Authorization', 'Bearer ' + token)

    expect(likeUser.status).toBe(200)
    expect(likeUser.body.response_flag).toBe('OK')
    expect(likeUser.body.response_message).toBe('You have successfully liked the user!')
})

test('Should unlike user with ID : 2', async () =>{
    const unlikeUser = await request(app)
        .delete('/user/2/unlike')
        .set('Authorization', 'Bearer ' + token)

    expect(unlikeUser.status).toBe(200)
    expect(unlikeUser.body.response_flag).toBe('OK')
    expect(unlikeUser.body.response_message).toBe('You have successfully unliked the user!')
})

test('Should get users and likes', async () =>{
    const mostLiked = await request(app)
        .get('/most-liked')
        .set('Authorization', 'Bearer ' + token)

    expect(mostLiked.status).toBe(200)
    expect(mostLiked.body.response_flag).toBe('OK')
    expect(mostLiked.body.response_message).toBe('Success')
})