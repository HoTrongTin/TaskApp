const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')
const {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "Task 2",
            "completed": "false"
        })
        .expect(201)

    //Assert inserted task
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should get all task of a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert returned task
    const tasks = Task.find({owner: userOneId})
    expect(response.body.length).toBe(2)
})

test('Shoud not delete userOne\'s task by userTwo', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)


    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
    //Assert failed status code
    // const 
})

