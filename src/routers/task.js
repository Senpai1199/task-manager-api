const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth")
const Task = require('../models/task')

// Get all tasks /tasks   /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1 
    }
    try {
        // const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get task by ID
router.get('/tasks/:id', auth, async (req, res) => { 
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id: _id,
            owner: req.user._id
        })
        if(!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Create new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, // ES6 spread method 
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Update task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const canUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!canUpdate) {
        return res.status(400).send("Cant update that parameter in task")
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
       
        if (!task) {
            return res.status(400).send("Error in updating task.")
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (err) {
        return res.send(400).send("Couldn't update task.")
    }

})

// Delete task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send("Task not found.")
        }
        return res.send(task)
    } catch(err) {
        res.status(500).send()
    }
})

module.exports = router
