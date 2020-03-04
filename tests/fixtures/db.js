const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'FakeMail Agent 1',
    email: 'gevorg.tymir1@aallaa.org',
    password: 'passlongword',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'FakeMail Agent 2',
    email: 'gevorg.tymir2@aallaa.org',
    password: 'passlongword',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 1',
    completed: true,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 2',
    completed: false,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 3',
    completed: false,
    owner: userTwoId
}

const taskFour = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 4',
    completed: false,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    await new Task(taskFour).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}