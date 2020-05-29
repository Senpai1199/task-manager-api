const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const Task = require("../../src/models/task")

const userOneID = new mongoose.Types.ObjectId()
const userTwoID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: "Test User One",
    email: "testuser1@example.com",
    password: "56what!!",
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoID,
    name: "Test User Two",
    email: "testuser2@example.com",
    password: "testing321",
    tokens: [{
        token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test Task 1",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test Task 2",
    completed: true,
    owner: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test Task 3",
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany() //Wiping db before testcase
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneID,
    userOne,
    userTwo,
    userTwoID,
    taskOne,
    taskThree,
    taskTwo,
    setupDatabase
}