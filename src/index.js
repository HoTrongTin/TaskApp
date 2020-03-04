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


const port = process.env.PORT //process.env.PORT: Heroku port value


app.listen(port, () => {
    console.log('Server is up on port ' + port + '....')
})

// const bcrypt = require('bcryptjs')

// const hashFunction = async () => {
//     const password = 'unhashed string'

//     /* Hashing function */
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log(hashedPassword)

//     /* Compare function */
//     const isMatch = await bcrypt.compare('unhashed string', hashedPassword)
//     console.log(isMatch)            //return: True
// }

// hashFunction()

// const jwt = require('jsonwebtoken')

// const token = jwt.sign({_id: 'trongtinho'}, 'secretstring', {expiresIn: '3 days'})
// console.log('token', token)
// const data = jwt.verify(token, 'secretstring')
// console.log(data)

