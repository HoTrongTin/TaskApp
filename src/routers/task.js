const express = require('express')
const router = new express.Router()
const Task = require('../models/task') //import model
const auth = require('../middleware/auth')

/* /tasks?completed=true&limit=5&skip=10&sortBy=createdAt:desc */
router.get('/tasks', auth, async (req, res) => { //search TASKS

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = (req.query.completed === 'true')  //because req.query.completed is string, we want to store match.completed as Boolean
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // res.send(tasks)
        res.send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => { //search TASK by ID in database
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id}) //only creator can query the task they created
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.post('/tasks', auth, async (req, res) => { //create new TASK
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,        //spread data in req.body
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/tasks/:id', auth, async (req, res) => { //Update TASK by ID

    /*start check update fields if it allowed*/
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ //return if update fields are not allowed
            error: 'Invalid updates!'
        })
    }
    /* end check update fields */

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})      //only creator can update their tasks
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {task[update] = req.body[update]})
        await task.save()         // run this way because it has the save() method, which will call pre('save') middleware

        res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})



router.delete('/tasks/:id', auth, async(req, res) => {           //Delete TASK by ID
    try{

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router