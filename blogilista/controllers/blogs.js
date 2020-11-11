/* eslint-disable no-undef */
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const blogToDelete = await Blog.findById(id).populate('user', { username: 1 })
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  console.log(blogToDelete)
  console.log
  if (!blogToDelete || blogToDelete.user.username !== decodedToken.username){
    return response.status(401).json({ error: 'No such blog for this user' })
  }
  // eslint-disable-next-line no-unused-vars
  const deleted = await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const newBlogInfo = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlogInfo, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogRouter
