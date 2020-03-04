const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user') //import model
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
const auth = require('../middleware/auth') /* Add middleware to handle authorization */

const multer = require('multer')
var storage = multer.memoryStorage()    //store buffer in MemoryStorage

/* Uploaded avatar store in "/avatar" */
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload: JPEG, PNG, JPG!'))
        }

        cb(undefined, true)
    },
    storage: storage
})



router.get('/users/me', auth, async (req, res) => { //search USER
    res.send(req.user) //req.user returned from auth() 'auth.js'
})

/* Serve up User Profile Avatar */
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})

router.post('/users', async (req, res) => { //create new USER
    const user = new User(req.body)

    try {
        /* Generate token for new user */
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)

        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => { //Login section: utilize json web token

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        /* Generate web token */
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token //only keep another token, not this session token
        })

        await req.user.save()
        res.send('You\'re logged out!')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [] //empty tokens array

        await req.user.save()
        res.send('You\'re logged out!')
    } catch (e) {
        res.status(500).send(e)
    }
})

/* Upload Avatar */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // console.log(req.file.buffer)
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send('Uploaded!')
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

/* Delete Avatar */
router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined//Buffer.from('')       //create blank buffer
        req.user.save()
        res.send('Deleted')
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => { //Update USER

    /*start check update fields if it allowed*/
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ //return if update fields are not allowed
            error: 'Invalid updates!'
        })
    }
    /* end check update fields */

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidator: true
        // })

        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save() // run this way because it has the save() method, which will call pre('save') middleware (hash password)

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send('Error occurred!')
    }
})

router.delete('/users/me', auth, async (req, res) => { //Delete USER
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router