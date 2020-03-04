const app = require('./app')

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

