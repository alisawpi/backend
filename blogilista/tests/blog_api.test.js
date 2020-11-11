const mongoose = require('mongoose')
const supertest = require('supertest')
// eslint-disable-next-line no-unused-vars
const { response } = require('../app')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

let testToken = ''
beforeAll( async () => {
  const loginTestUser = await api.post('/api/login').send({ username: 'testUser', password: 'testpwd' })
  testToken = loginTestUser.body.token
  console.log(loginTestUser.body)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('The key is id and not _id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  expect(response.body[0].id).toBeDefined()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the blogs contain a specific blog title', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('React patterns')
})

test('Should be able to create a new blog', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'someone',
    url: 'someURL',
    likes: 0,
  }
  await api.post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd)
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('New blog')
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'someone',
    url: 'someURL',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without likes is set to have default zero likes', async () => {
  const newBlog = {
    title: 'no likes on this post',
    author: 'someone',
    url: 'someURL',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(newBlog)
    .expect(201)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[2].likes).toBe(0)
})
test('blog without url is not added', async () => {
  const newBlog = {
    author: 'someone',
    title: 'nourl on this post',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})
test('blog without a token is not added', async () => {
  const newBlog = {
    author: 'someone',
    title: 'nourl on this post',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})