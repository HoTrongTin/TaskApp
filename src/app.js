const express = require('express')
require('./db/mongoose') //run connect to database
// const User = require('./models/user') //import model
// const Task = require('./models/task') //import model

const app = express()
app.use(express.json()) //json request (POST request) ==> js object


const userRouter = require('./routers/user')
app.use(userRouter) //passing the router to app.use

const taskRouter = require('./routers/task')
app.use(taskRouter) //passing the router to app.use

module.exports = app
