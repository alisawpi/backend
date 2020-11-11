const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',{ author:1, title:1, url:1 })
  response.json(users.map(u => u.toJSON()))
})

userRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', { author:1, title:1, url:1 })
  response.json(user)
})

userRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.password || body.password.length < 3 ){
    response.status(401).json({ error: 'password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


module.exports = userRouter