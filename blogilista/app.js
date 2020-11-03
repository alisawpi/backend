const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controller/blogs')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('../puhelinluettelo/utils/logger')
app.use(cors())
app.use(express.json())

logger.info(`Connecting to ${config.MONGODB_URI_BLOG}`)

mongoose.connect(config.MONGODB_URI_BLOG, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use('/api/blogs', blogRouter)

module.exports = app