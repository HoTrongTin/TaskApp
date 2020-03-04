const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

afterEach(()=>{
    console.log('After Each')
})

test('Signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'FakeMail Agent 2',
        email: 'gevorg.tymir@aallaa.org',
        password: 'passlongword'
    }).expect(201)

    //Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert that correct data
    expect(response.body).toMatchObject({
        user: {
            name: 'FakeMail Agent 2',
            email: 'gevorg.tymir@aallaa.org',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('passlongword')
})

test('Login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //Assert that token is saved into database
    const user = await User.findById(userOne._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'gevorg.tymir1@aallaa.org',
        password: 'wrongpassword'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should upload user avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/pic1.jpg')
        .expect(200)

    //Assert buffer exist in database
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'New name'})
        .expect(200)

    //Assert updated value
    expect(response.body.name).toBe('New name')
})

test('Shoud not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'New location'})
        .expect(400)
})

test('Should not delete account - unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete user successful', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert null response from signup with deleted account
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})