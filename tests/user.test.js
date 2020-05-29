const app = require('../src/app')
const request = require("supertest")
const User = require("../src/models/user")

const { userOne, userOneID, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test("Should create new user", async () => {
    const response = await request(app).post('/users').send({
        name: "Divyansh Agarwal",
        email: "testing@example.com",
        password: "MyPass777!"
    }).expect(200)

    // Assert that db was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Divyansh Agarwal",
            email: "testing@example.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("MyPass777!")
})

test("Should login existing user", async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Assert token saved as 2nd in the tokens list
    const user = await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test("Should not login non existent user", async () => {
    await request(app).post('/users/login').send({
        name: userOne.name,
        password: "Wrong password"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app).get('/users/me')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile for unauthenticated user", async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test("Should delete account for user", async () => {
    await request(app).delete('/users/me')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert if user is actually deleted from db
    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})

test("Should not delete account for unauthenticated user", async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app).post('/users/me/avatar')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneID)
    // expect({}).toBe({}) // fails because toBe uses === 
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
    await request(app).patch('/users/me')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Updated Name",
            email: "updatedemail@testing.com"
        })
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user.name).toBe("Updated Name") // toEqual would also work
    expect(user.email).toBe("updatedemail@testing.com")
})

test("Should not update invalid user fields", async () => {
    await request(app).patch('/users/me')
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Raipur",
        })
        .expect(400)
})



